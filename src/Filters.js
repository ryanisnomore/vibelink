class Filters {
  constructor(player) {
    this.player = player;
    this.active = {};
  }

  async setFilters(filters) {
    this.active = filters;
    await this.player.node.makeRequest(`/v4/sessions/${this.player.node.sessionId}/players/${this.player.guildId}`, 'PATCH', {
      filters: this.active
    });
  }

  async clearFilters() {
    this.active = {};
    await this.setFilters({});
  }

  async setEqualizer(bands) {
    this.active.equalizer = bands;
    await this.setFilters(this.active);
  }

  async setKaraoke(options) {
    this.active.karaoke = options || { level: 1, monoLevel: 1, filterBand: 220, filterWidth: 100 };
    await this.setFilters(this.active);
  }

  async setTimescale(options) {
    this.active.timescale = options || { speed: 1, pitch: 1, rate: 1 };
    await this.setFilters(this.active);
  }

  async setTremolo(options) {
    this.active.tremolo = options || { frequency: 2, depth: 0.5 };
    await this.setFilters(this.active);
  }

  async setVibrato(options) {
    this.active.vibrato = options || { frequency: 2, depth: 0.5 };
    await this.setFilters(this.active);
  }

  async setRotation(options) {
    this.active.rotation = options || { rotationHz: 0.2 };
    await this.setFilters(this.active);
  }

  async setDistortion(options) {
    this.active.distortion = options || {
      sinOffset: 0, sinScale: 1, cosOffset: 0, cosScale: 1, tanOffset: 0, tanScale: 1, offset: 0, scale: 1
    };
    await this.setFilters(this.active);
  }

  async setChannelMix(options) {
    this.active.channelMix = options || {
      leftToLeft: 1, leftToRight: 0, rightToLeft: 0, rightToRight: 1
    };
    await this.setFilters(this.active);
  }

  async setLowPass(options) {
    this.active.lowPass = options || { smoothing: 20 };
    await this.setFilters(this.active);
  }

  async setNightcore(enable) {
    if (enable) {
      this.active.timescale = { speed: 1.2, pitch: 1.2, rate: 1 };
    } else {
      delete this.active.timescale;
    }
    await this.setFilters(this.active);
  }

  async set8D(enable) {
    if (enable) {
      this.active.rotation = { rotationHz: 0.2 };
    } else {
      delete this.active.rotation;
    }
    await this.setFilters(this.active);
  }

  async setBassBoost(level = 10) {
    const bands = Array(15).fill(0).map((_, i) => ({
      band: i,
      gain: i === 0 ? level / 10 : 0
    }));
    await this.setEqualizer(bands);
  }

  async setVaporwave(enable) {
    if (enable) {
      this.active.timescale = { speed: 0.8, pitch: 0.8, rate: 1 };
    } else {
      delete this.active.timescale;
    }
    await this.setFilters(this.active);
  }
}

module.exports = Filters;