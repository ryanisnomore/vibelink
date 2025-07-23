const { AudioPlayerStatus, entersState, VoiceConnectionStatus } = require('@discordjs/voice');
const { Track } = require('./Track');
const { Queue } = require('./Queue');
const { Filters } = require('./Filters');

class Player {
  constructor(guildId, voiceChannelId, textChannelId, node, options = {}) {
    this.guildId = guildId;
    this.voiceChannelId = voiceChannelId;
    this.textChannelId = textChannelId;
    this.node = node;
    this.volume = options.volume || 100;
    this.paused = false;
    this.playing = false;
    this.position = 0;
    this.loop = 'none';
    this.queue = new Queue();
    this.filters = new Filters(this);
    this.autoplay = options.autoplay || false;
    this.connection = null;
    this.audioPlayer = null;
    this.lastPositionUpdate = 0;
    this.vcStatus = null;
  }

  async connect() {
    const { joinVoiceChannel, createAudioPlayer } = require('@discordjs/voice');
    
    this.connection = joinVoiceChannel({
      channelId: this.voiceChannelId,
      guildId: this.guildId,
      adapterCreator: this.node.client.voice.adapters.get(this.guildId)
    });

    this.audioPlayer = createAudioPlayer();
    this.connection.subscribe(this.audioPlayer);

    this.connection.on(VoiceConnectionStatus.Disconnected, async () => {
      try {
        await Promise.race([
          entersState(this.connection, VoiceConnectionStatus.Signalling, 5_000),
          entersState(this.connection, VoiceConnectionStatus.Connecting, 5_000),
        ]);
      } catch {
        this.connection.destroy();
      }
    });

    this.audioPlayer.on(AudioPlayerStatus.Idle, () => {
      if (this.queue.current) this.queue.previous = this.queue.current;
      this._handleTrackEnd();
    });

    this.audioPlayer.on('error', error => {
      this.node.client.emit('playerError', this, error);
    });
  }

  async disconnect() {
    if (this.connection) {
      this.connection.destroy();
      this.connection = null;
    }
    if (this.audioPlayer) {
      this.audioPlayer.stop();
      this.audioPlayer = null;
    }
  }

  async play(track, options = {}) {
    if (!this.connection) await this.connect();
    
    const resolvedTrack = track instanceof Track ? track : new Track(track);
    if (!options.noReplace) this.queue.current = resolvedTrack;

    const playOptions = {
      track: resolvedTrack.encoded,
      volume: this.volume,
      position: options.startTime || 0,
      paused: this.paused,
      filters: this.filters.active
    };

    await this.node.makeRequest(`/v4/sessions/${this.node.sessionId}/players/${this.guildId}`, 'PATCH', {
      ...playOptions,
      voice: {
        token: this.connection.joinConfig.token,
        endpoint: this.connection.joinConfig.endpoint,
        sessionId: this.connection.joinConfig.sessionId
      }
    });

    this.playing = true;
    this.node.client.emit('playerStart', this, resolvedTrack);
  }

  async stop() {
    await this.node.makeRequest(`/v4/sessions/${this.node.sessionId}/players/${this.guildId}`, 'PATCH', {
      track: { encoded: null }
    });
    this.playing = false;
    this.queue.current = null;
  }

  async pause(state = true) {
    this.paused = state;
    await this.node.makeRequest(`/v4/sessions/${this.node.sessionId}/players/${this.guildId}`, 'PATCH', {
      paused: state
    });
    this.node.client.emit('playerPause', this, this.queue.current);
  }

  async resume() {
    await this.pause(false);
    this.node.client.emit('playerResume', this, this.queue.current);
  }

  async seek(position) {
    await this.node.makeRequest(`/v4/sessions/${this.node.sessionId}/players/${this.guildId}`, 'PATCH', {
      position
    });
    this.position = position;
  }

  async setVolume(volume) {
    this.volume = volume;
    await this.node.makeRequest(`/v4/sessions/${this.node.sessionId}/players/${this.guildId}`, 'PATCH', {
      volume
    });
  }

  async setLoop(mode) {
    if (!['none', 'track', 'queue'].includes(mode)) throw new Error('Invalid loop mode');
    this.loop = mode;
  }

  async skip() {
    const current = this.queue.current;
    this.queue.previous = current;
    this.queue.current = null;
    this.node.client.emit('playerSkip', this, current);
    this._handleTrackEnd();
  }

  async destroy() {
    await this.stop();
    await this.disconnect();
    await this.node.makeRequest(`/v4/sessions/${this.node.sessionId}/players/${this.guildId}`, 'DELETE');
    this.node.client.emit('playerDestroy', this);
  }

  async setVCStatus(status) {
    try {
      const channel = this.node.client.channels.cache.get(this.voiceChannelId);
      if (!channel || !channel.permissionsFor(this.node.client.user)?.has('ManageChannels')) return;
      
      await this.node.client.rest.put(`/channels/${this.voiceChannelId}/voice-status`, {
        body: { status }
      });
      this.vcStatus = status;
    } catch (error) {
      if (!error.message.includes('Missing Permissions')) {
        this.node.client.emit('playerError', this, error);
      }
    }
  }

  async removeVCStatus() {
    try {
      const channel = this.node.client.channels.cache.get(this.voiceChannelId);
      if (!channel || !channel.permissionsFor(this.node.client.user)?.has('ManageChannels')) return;
      
      await this.node.client.rest.put(`/channels/${this.voiceChannelId}/voice-status`, {
        body: { status: '' }
      });
      this.vcStatus = null;
    } catch (error) {
      if (!error.message.includes('Missing Permissions')) {
        this.node.client.emit('playerError', this, error);
      }
    }
  }

  _handleTrackEnd() {
    if (this.loop === 'track' && this.queue.previous) {
      this.play(this.queue.previous);
      return;
    }

    if (this.loop === 'queue' && this.queue.previous) {
      this.queue.add(this.queue.previous);
    }

    const nextTrack = this.queue.next();
    if (nextTrack) {
      this.play(nextTrack);
    } else if (this.autoplay) {
      this._handleAutoplay();
    } else {
      this.node.client.emit('playerEmpty', this);
    }
  }

  async _handleAutoplay() {
    if (!this.queue.current) return;
    
    try {
      const similarTracks = await this.node.search(
        `sprec:${this.queue.current.identifier}`,
        this.node.client.user.id
      );
      
      if (similarTracks.tracks.length > 0) {
        const nextTrack = similarTracks.tracks[0];
        this.play(nextTrack);
        this.queue.add(nextTrack);
      } else {
        this.node.client.emit('playerEmpty', this);
      }
    } catch (error) {
      this.node.client.emit('playerError', this, error);
    }
  }
}

module.exports = Player;