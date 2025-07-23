const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

class Rest {
  constructor(node) {
    this.node = node;
  }

  async decodeTrack(encodedTrack) {
    try {
      const response = await fetch(`http${this.node.secure ? 's' : ''}://${this.node.host}:${this.node.port}/v4/decodetrack`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.node.password
        },
        body: JSON.stringify({ encodedTrack })
      });
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async decodeTracks(encodedTracks) {
    try {
      const response = await fetch(`http${this.node.secure ? 's' : ''}://${this.node.host}:${this.node.port}/v4/decodetracks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.node.password
        },
        body: JSON.stringify({ encodedTracks })
      });
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getLavalinkInfo() {
    try {
      const response = await fetch(`http${this.node.secure ? 's' : ''}://${this.node.host}:${this.node.port}/v4/info`, {
        headers: { Authorization: this.node.password }
      });
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getLavalinkStats() {
    try {
      const response = await fetch(`http${this.node.secure ? 's' : ''}://${this.node.host}:${this.node.port}/v4/stats`, {
        headers: { Authorization: this.node.password }
      });
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getLavalinkVersion() {
    try {
      const response = await fetch(`http${this.node.secure ? 's' : ''}://${this.node.host}:${this.node.port}/version`, {
        headers: { Authorization: this.node.password }
      });
      return await response.text();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Rest;