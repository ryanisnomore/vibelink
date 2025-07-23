const { Track } = require('./Track');

class Queue {
  constructor() {
    this.tracks = [];
    this.current = null;
    this.previous = null;
    this.history = [];
  }

  add(track, index) {
    const resolvedTrack = track instanceof Track ? track : new Track(track);
    if (index !== undefined) {
      this.tracks.splice(index, 0, resolvedTrack);
    } else {
      this.tracks.push(resolvedTrack);
    }
    return resolvedTrack;
  }

  addFirst(track) {
    return this.add(track, 0);
  }

  remove(index, amount = 1) {
    return this.tracks.splice(index, amount);
  }

  clear() {
    this.tracks = [];
  }

  shuffle() {
    for (let i = this.tracks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.tracks[i], this.tracks[j]] = [this.tracks[j], this.tracks[i]];
    }
  }

  next() {
    if (this.tracks.length === 0) return null;
    const track = this.tracks.shift();
    this.history.unshift(track);
    return track;
  }

  get size() {
    return this.tracks.length;
  }

  get totalSize() {
    return this.size + (this.current ? 1 : 0);
  }

  get duration() {
    return this.tracks.reduce((acc, track) => acc + track.duration, this.current?.duration || 0);
  }

  get estimatedDuration() {
    return this.tracks.reduce((acc, track) => acc + (track.duration || 0), this.current?.duration || 0);
  }
}

module.exports = Queue;