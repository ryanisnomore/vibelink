const WebSocket = require('ws');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

class Node {
  constructor(options) {
    this.host = options.host;
    this.port = options.port;
    this.password = options.password;
    this.identifier = options.identifier;
    this.secure = options.secure;
    this.reconnectTimeout = options.reconnectTimeout || 5000;
    this.reconnectTries = options.reconnectTries || 3;
    this.version = options.version || 4;
    this.region = options.region || 'us';
    this.reconnectAttempted = 0;
    this.connected = false;
    this.stats = this.getDefaultStats();
    this.info = {};
    this.ws = null;
  }

  connect() {
    const headers = {
      Authorization: this.password,
      'User-Id': Math.floor(Math.random() * 10000),
      'Client-Name': 'VibeLink'
    };

    const wsVersion = this.version === 4 ? 'v4' : 'v3';
    this.ws = new WebSocket(
      `ws${this.secure ? 's' : ''}://${this.host}:${this.port}/${wsVersion}/websocket`,
      { headers }
    );

    this.ws.on('open', () => {
      this.reconnectAttempted = 0;
      this.connected = true;
      this.fetchInfo();
    });

    this.ws.on('message', (message) => {
      const payload = JSON.parse(message.toString());
      if (payload.op === 'stats') this.stats = this.normalizeStats(payload);
    });

    this.ws.on('error', (error) => {
      this.connected = false;
    });

    this.ws.on('close', () => {
      this.connected = false;
      this.scheduleReconnect();
    });
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.connected = false;
    }
  }

  scheduleReconnect() {
    setTimeout(() => {
      if (this.reconnectAttempted < this.reconnectTries || this.reconnectTries === 0) {
        this.connect();
        this.reconnectAttempted++;
      }
    }, this.reconnectTimeout);
  }

  normalizeStats(payload) {
    return this.version === 3 ? {
      players: payload.players,
      playingPlayers: payload.playingPlayers,
      uptime: payload.uptime,
      memory: {
        free: payload.memory_free,
        used: payload.memory_used,
        allocated: payload.memory_allocated,
        reservable: payload.memory_reservable
      },
      cpu: {
        cores: payload.cpu_cores,
        systemLoad: payload.cpu_systemLoad,
        lavalinkLoad: payload.cpu_lavalinkLoad
      },
      frameStats: payload.frameStats || {}
    } : payload;
  }

  getDefaultStats() {
    return {
      players: 0,
      playingPlayers: 0,
      uptime: 0,
      memory: { free: 0, used: 0, allocated: 0, reservable: 0 },
      cpu: { cores: 0, systemLoad: 0, lavalinkLoad: 0 },
      frameStats: { sent: 0, nulled: 0, deficit: 0 }
    };
  }

  async fetchInfo() {
    const baseUrl = `http${this.secure ? 's' : ''}://${this.host}:${this.port}`;
    const endpoints = this.version === 3 ? ['/info', '/version'] : ['/v4/info'];
    
    for (const endpoint of endpoints) {
      try {
        const res = await fetch(`${baseUrl}${endpoint}`, {
          headers: { Authorization: this.password },
          timeout: 2000
        });
        if (res.ok) {
          this.info = await res.json();
          return;
        }
      } catch {
        continue;
      }
    }
    this.info = {};
  }

  async makeRequest(endpoint, method = 'GET', body) {
    const url = `http${this.secure ? 's' : ''}://${this.host}:${this.port}${endpoint}`;
    const options = {
      method,
      headers: { Authorization: this.password },
      timeout: 10000
    };
    if (body) options.body = JSON.stringify(body);
    
    try {
      const res = await fetch(url, options);
      return await res.json();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Node;