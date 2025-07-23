const Player = require('../Player');

class PlayerManager {
  constructor(vibelink) {
    this.vibelink = vibelink;
    this.players = new Map();
  }

  create(guildId, options = {}) {
    if (this.players.has(guildId)) {
      return this.players.get(guildId);
    }

    const node = options.node || this.vibelink.nodes.getIdeal(options.region);
    if (!node) throw new Error('No available nodes');

    const player = new Player(
      guildId,
      options.voiceChannelId,
      options.textChannelId,
      node,
      options
    );

    this.players.set(guildId, player);
    return player;
  }

  get(guildId) {
    return this.players.get(guildId);
  }

  destroy(guildId) {
    const player = this.players.get(guildId);
    if (!player) return false;

    player.destroy();
    this.players.delete(guildId);
    return true;
  }
}

module.exports = PlayerManager;