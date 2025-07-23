const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

class Lyrics {
  constructor(player) {
    this.player = player;
  }

  async getLyrics() {
    if (!this.player.queue.current) return null;
    
    try {
      const query = `${this.player.queue.current.title} ${this.player.queue.current.author}`.replace(/ *\([^)]*\) */g, '');
      const response = await fetch(`https://some-lyrics-api.com/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (data.lyrics) {
        return {
          lyrics: data.lyrics,
          source: data.source,
          url: data.url
        };
      }
      
      return null;
    } catch {
      return null;
    }
  }

  async getTimestampedLyrics() {
    try {
      const response = await this.player.node.makeRequest(
        `/lyrics/${this.player.queue.current.identifier}`,
        'GET'
      );
      return response;
    } catch {
      return null;
    }
  }
}

module.exports = Lyrics;