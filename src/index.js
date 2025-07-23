const { NodeManager } = require('./managers/NodeManager');
const { PlayerManager } = require('./managers/PlayerManager');
const { SearchManager } = require('./managers/SearchManager');
const { version } = require('../package.json');

class VibeLink {
  constructor(client, options = {}) {
    this.client = client;
    this.version = version;
    this.nodes = new NodeManager(this);
    this.players = new PlayerManager(this);
    this.search = new SearchManager(this);
    this.options = options;
  }

  get version() {
    return this.version;
  }

  createNode(options) {
    return this.nodes.create(options);
  }

  removeNode(identifier) {
    return this.nodes.remove(identifier);
  }

  getIdealNode(region) {
    return this.nodes.getIdeal(region);
  }

  createPlayer(guildId, options = {}) {
    return this.players.create(guildId, options);
  }

  getPlayer(guildId) {
    return this.players.get(guildId);
  }

  destroyPlayer(guildId) {
    return this.players.destroy(guildId);
  }
}

module.exports = VibeLink;