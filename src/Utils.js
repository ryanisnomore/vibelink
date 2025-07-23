class Utils {
  static isURL(str) {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  }

  static parsePlatform(query) {
    if (this.isURL(query)) {
      const url = new URL(query);
      if (url.hostname.includes('youtube.com') || url.hostname.includes('youtu.be')) return 'youtube';
      if (url.hostname.includes('spotify.com')) return 'spotify';
      if (url.hostname.includes('deezer.com')) return 'deezer';
      if (url.hostname.includes('apple.com')) return 'apple';
      if (url.hostname.includes('tidal.com')) return 'tidal';
      if (url.hostname.includes('jiosaavn.com')) return 'jiosaavn';
      if (url.hostname.includes('qobuz.com')) return 'qobuz';
      if (url.hostname.includes('bandcamp.com')) return 'bandcamp';
      if (url.hostname.includes('soundcloud.com')) return 'soundcloud';
    }
    
    if (query.startsWith('ytsearch:')) return 'youtube';
    if (query.startsWith('scsearch:')) return 'soundcloud';
    if (query.startsWith('amsearch:')) return 'apple';
    if (query.startsWith('dzsearch:')) return 'deezer';
    if (query.startsWith('spsearch:')) return 'spotify';
    if (query.startsWith('jssearch:')) return 'jiosaavn';
    if (query.startsWith('tdsearch:')) return 'tidal';
    if (query.startsWith('qbsearch:')) return 'qobuz';
    if (query.startsWith('bcsearch:')) return 'bandcamp';
    
    return null;
  }

  static formatPlatform(platform) {
    const platforms = {
      youtube: 'YouTube',
      soundcloud: 'SoundCloud',
      spotify: 'Spotify',
      apple: 'Apple Music',
      deezer: 'Deezer',
      jiosaavn: 'JioSaavn',
      tidal: 'Tidal',
      qobuz: 'Qobuz',
      bandcamp: 'Bandcamp'
    };
    return platforms[platform] || platform;
  }

  static getSourceManager(platform) {
    const sources = {
      youtube: 'yt',
      soundcloud: 'sc',
      spotify: 'sp',
      apple: 'am',
      deezer: 'dz',
      jiosaavn: 'js',
      tidal: 'td',
      qobuz: 'qb',
      bandcamp: 'bc'
    };
    return sources[platform] || platform;
  }
}

module.exports = Utils;