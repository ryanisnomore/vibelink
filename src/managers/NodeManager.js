const Node = require('../Node');

class NodeManager {
  constructor(vibelink) {
    this.vibelink = vibelink;
    this.nodes = new Map();
    this.regions = new Map();
  }

  create(options) {
    if (this.nodes.has(options.identifier)) {
      return this.nodes.get(options.identifier);
    }

    const node = new Node({
      ...options,
      client: this.vibelink.client
    });

    node.connect();
    this.nodes.set(options.identifier, node);
    if (options.region) {
      if (!this.regions.has(options.region)) {
        this.regions.set(options.region, []);
      }
      this.regions.get(options.region).push(node);
    }

    return node;
  }

  remove(identifier) {
    const node = this.nodes.get(identifier);
    if (!node) return false;

    node.disconnect();
    this.nodes.delete(identifier);
    return true;
  }

  get(identifier) {
    return this.nodes.get(identifier);
  }

  getIdeal(region) {
    if (region && this.regions.has(region)) {
      const regionalNodes = this.regions.get(region)
        .filter(node => node.connected)
        .sort((a, b) => a.stats.cpu.lavalinkLoad - b.stats.cpu.lavalinkLoad);
      
      if (regionalNodes.length > 0) return regionalNodes[0];
    }

    const allNodes = Array.from(this.nodes.values())
      .filter(node => node.connected)
      .sort((a, b) => a.stats.cpu.lavalinkLoad - b.stats.cpu.lavalinkLoad);
    
    return allNodes[0] || null;
  }
}

module.exports = NodeManager;