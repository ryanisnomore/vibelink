class SponsorBlock {
  constructor(player) {
    this.player = player;
    this.segments = [];
  }

  async fetchSegments() {
    if (!this.player.queue.current || this.player.queue.current.sourceName !== 'youtube') {
      this.segments = [];
      return;
    }

    try {
      const response = await fetch(
        `https://sponsor.ajay.app/api/skipSegments?videoID=${this.player.queue.current.identifier}`
      );
      this.segments = await response.json();
    } catch {
      this.segments = [];
    }
  }

  getCurrentSegment(position) {
    if (!this.segments.length) return null;
    return this.segments.find(segment => 
      position >= segment.segment[0] * 1000 && position <= segment.segment[1] * 1000
    );
  }

  async skipSegment() {
    const currentPosition = this.player.position;
    const currentSegment = this.getCurrentSegment(currentPosition);
    
    if (currentSegment) {
      await this.player.seek(currentSegment.segment[1] * 1000);
      return true;
    }
    
    return false;
  }
}

module.exports = SponsorBlock;