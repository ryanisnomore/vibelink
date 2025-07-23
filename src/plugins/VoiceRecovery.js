class VoiceRecovery {
  constructor(player) {
    this.player = player;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  async recover() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) return false;
    
    try {
      await this.player.connect();
      if (this.player.queue.current) {
        await this.player.play(this.player.queue.current, { noReplace: true });
      }
      this.reconnectAttempts = 0;
      return true;
    } catch {
      this.reconnectAttempts++;
      setTimeout(() => this.recover(), 5000);
      return false;
    }
  }
}

module.exports = VoiceRecovery;