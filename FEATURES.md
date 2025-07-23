# VibeLink Features

## Core Features

### Multi-Platform Support
- YouTube, YouTube Music
- Spotify, Apple Music, Deezer
- JioSaavn, Tidal, Qobuz, Bandcamp
- SoundCloud, Yandex Music, VK Music
- Direct audio streams and local files

### Enhanced Load Balancing
- Dynamic node selection based on CPU/RAM usage
- Region-based routing for lower latency
- Automatic failover when nodes go down
- Weighted node distribution

### Built-in Audio Filters
- Bass boost (0-20dB)
- Nightcore, vaporwave, 8D audio
- Karaoke, tremolo, vibrato effects
- Timescale (speed/pitch adjustment)
- Channel mixing and low-pass filters

### Advanced Queue System
- Multiple loop modes (track, queue, none)
- Queue shuffling with custom algorithms
- Priority queuing (VIP skip)
- Queue history with undo functionality
- Seek ghosting for smooth transitions

### Additional Features
- Voice state recovery after crashes
- Session management (save/restore state)
- Built-in lyrics fetching
- WebSocket compression
- Voice channel status customization
- SponsorBlock integration (skip sponsors)
- Chapter information for tracks

## Player Events

VibeLink provides comprehensive player events:

- `playerStart` - When a track starts playing
- `playerEnd` - When a track finishes
- `playerPause` - When player is paused
- `playerResume` - When player resumes
- `playerSkip` - When a track is skipped
- `playerEmpty` - When queue becomes empty
- `playerError` - When an error occurs
- `playerStuck` - When track gets stuck
- `playerDestroy` - When player is destroyed
- `playerUpdate` - When player state updates
- `playerMoved` - When player moves channels
- `playerClosed` - When connection closes
- `playerException` - When exception occurs
- `playerResolveError` - When track fails to resolve

## Search Methods

Easy searching across all platforms:

```javascript
// Platform-specific search
await vibelink.search.searchYouTube(query);
await vibelink.search.searchSpotify(query);
await vibelink.search.searchAppleMusic(query);

// Automatic source detection
await vibelink.search.search("amsearch:Blinding Lights");
await vibelink.search.search("dzsearch:Daft Punk");
await vibelink.search.search("https://open.spotify.com/track/...");