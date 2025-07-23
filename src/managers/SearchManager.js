const { Track } = require('../Track');
const Utils = require('../Utils');

class SearchManager {
  constructor(vibelink) {
    this.vibelink = vibelink;
  }

  async search(query, requester, options = {}) {
    const node = options.node || this.vibelink.nodes.getIdeal(options.region);
    if (!node) throw new Error('No available nodes');

    const platform = Utils.parsePlatform(query);
    const source = Utils.getSourceManager(platform);
    const searchQuery = options.source ? `${options.source}search:${query}` : query;

    try {
      const response = await node.makeRequest(
        `/v4/loadtracks?identifier=${encodeURIComponent(searchQuery)}`,
        'GET'
      );

      if (!response.tracks) return { tracks: [], playlist: null };

      const tracks = response.tracks.map(track => {
        const newTrack = new Track(track);
        if (requester) newTrack.userData.requester = requester;
        return newTrack;
      });

      return {
        tracks,
        playlist: response.playlistInfo || null
      };
    } catch (error) {
      throw error;
    }
  }

  async searchYouTube(query, requester) {
    return this.search(`ytsearch:${query}`, requester);
  }

  async searchSpotify(query, requester) {
    return this.search(`spsearch:${query}`, requester);
  }

  async searchSoundCloud(query, requester) {
    return this.search(`scsearch:${query}`, requester);
  }

  async searchAppleMusic(query, requester) {
    return this.search(`amsearch:${query}`, requester);
  }

  async searchDeezer(query, requester) {
    return this.search(`dzsearch:${query}`, requester);
  }

  async searchJioSaavn(query, requester) {
    return this.search(`jssearch:${query}`, requester);
  }

  async searchTidal(query, requester) {
    return this.search(`tdsearch:${query}`, requester);
  }

  async searchQobuz(query, requester) {
    return this.search(`qbsearch:${query}`, requester);
  }

  async searchBandcamp(query, requester) {
    return this.search(`bcsearch:${query}`, requester);
  }
}

module.exports = SearchManager;