class Track {
  constructor(data) {
    this.encoded = data.encoded;
    this.identifier = data.info.identifier;
    this.isSeekable = data.info.isSeekable;
    this.isStream = data.info.isStream;
    this.author = data.info.author;
    this.length = data.info.length;
    this.duration = data.info.length;
    this.isrc = data.info.isrc;
    this.position = data.info.position;
    this.title = data.info.title;
    this.sourceName = data.info.sourceName;
    this.uri = data.info.uri;
    this.artworkUrl = data.info.artworkUrl;
    this.probeInfo = data.info.probeInfo;
    this.pluginInfo = data.pluginInfo || {};
    this.userData = data.userData || {};
  }

  get thumbnail() {
    if (this.artworkUrl) return this.artworkUrl;
    if (this.sourceName === 'youtube') return `https://img.youtube.com/vi/${this.identifier}/hqdefault.jpg`;
    return null;
  }

  get query() {
    if (this.sourceName === 'youtube') return `https://youtube.com/watch?v=${this.identifier}`;
    if (this.sourceName === 'spotify') return `https://open.spotify.com/track/${this.identifier}`;
    return this.uri || this.title;
  }

  get formattedDuration() {
    return Track.formatDuration(this.duration);
  }

  static formatDuration(duration) {
    if (isNaN(duration) || duration === 0) return 'LIVE';
    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    
    return hours > 0 
      ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      : `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

module.exports = Track;