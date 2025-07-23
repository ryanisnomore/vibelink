declare module 'vibelink' {
  import { Client, Guild, VoiceChannel, TextChannel, User } from 'discord.js';
  import { VoiceConnectionStatus, AudioPlayerStatus } from '@discordjs/voice';

  export interface NodeOptions {
    host: string;
    port: number;
    password: string;
    identifier: string;
    secure?: boolean;
    reconnectTimeout?: number;
    reconnectTries?: number;
    version?: number;
    region?: string;
  }

  export interface PlayerOptions {
    voiceChannelId: string;
    textChannelId?: string;
    volume?: number;
    node?: Node;
    region?: string;
    autoplay?: boolean;
  }

  export interface TrackInfo {
    identifier: string;
    isSeekable: boolean;
    author: string;
    length: number;
    isStream: boolean;
    position: number;
    title: string;
    uri: string;
    sourceName: string;
    artworkUrl?: string;
    isrc?: string;
    probeInfo?: string;
  }

  export interface Track {
    encoded: string;
    info: TrackInfo;
    pluginInfo: Record<string, any>;
    userData: Record<string, any>;
  }

  export interface Queue {
    tracks: Track[];
    current: Track | null;
    previous: Track | null;
    history: Track[];
  }

  export interface Filters {
    equalizer?: any[];
    karaoke?: any;
    timescale?: any;
    tremolo?: any;
    vibrato?: any;
    rotation?: any;
    distortion?: any;
    channelMix?: any;
    lowPass?: any;
  }

  export class VibeLink {
    constructor(client: Client, options?: Record<string, any>);
    public readonly version: string;
    public nodes: NodeManager;
    public players: PlayerManager;
    public search: SearchManager;
    public createNode(options: NodeOptions): Node;
    public removeNode(identifier: string): boolean;
    public getIdealNode(region?: string): Node | null;
    public createPlayer(guildId: string, options: PlayerOptions): Player;
    public getPlayer(guildId: string): Player | undefined;
    public destroyPlayer(guildId: string): boolean;
  }

  export class Node {
    constructor(options: NodeOptions);
    public connect(): void;
    public disconnect(): void;
    public makeRequest(endpoint: string, method?: string, body?: any): Promise<any>;
  }

  export class Player {
    constructor(guildId: string, voiceChannelId: string, textChannelId: string, node: Node, options?: PlayerOptions);
    public guildId: string;
    public voiceChannelId: string;
    public textChannelId: string | null;
    public node: Node;
    public volume: number;
    public paused: boolean;
    public playing: boolean;
    public position: number;
    public loop: 'none' | 'track' | 'queue';
    public queue: Queue;
    public filters: Filters;
    public autoplay: boolean;
    public connect(): Promise<void>;
    public disconnect(): Promise<void>;
    public play(track: Track | string, options?: { startTime?: number; noReplace?: boolean }): Promise<void>;
    public stop(): Promise<void>;
    public pause(state?: boolean): Promise<void>;
    public resume(): Promise<void>;
    public seek(position: number): Promise<void>;
    public setVolume(volume: number): Promise<void>;
    public setLoop(mode: 'none' | 'track' | 'queue'): Promise<void>;
    public skip(): Promise<void>;
    public destroy(): Promise<void>;
    public setVCStatus(status: string): Promise<void>;
    public removeVCStatus(): Promise<void>;
  }

  export class NodeManager {
    constructor(vibelink: VibeLink);
    public create(options: NodeOptions): Node;
    public remove(identifier: string): boolean;
    public get(identifier: string): Node | undefined;
    public getIdeal(region?: string): Node | null;
  }

  export class PlayerManager {
    constructor(vibelink: VibeLink);
    public create(guildId: string, options: PlayerOptions): Player;
    public get(guildId: string): Player | undefined;
    public destroy(guildId: string): boolean;
  }

  export class SearchManager {
    constructor(vibelink: VibeLink);
    public search(query: string, requester?: User, options?: { node?: Node; region?: string; source?: string }): Promise<{ tracks: Track[]; playlist: any }>;
    public searchYouTube(query: string, requester?: User): Promise<{ tracks: Track[]; playlist: any }>;
    public searchSpotify(query: string, requester?: User): Promise<{ tracks: Track[]; playlist: any }>;
    public searchSoundCloud(query: string, requester?: User): Promise<{ tracks: Track[]; playlist: any }>;
    public searchAppleMusic(query: string, requester?: User): Promise<{ tracks: Track[]; playlist: any }>;
    public searchDeezer(query: string, requester?: User): Promise<{ tracks: Track[]; playlist: any }>;
    public searchJioSaavn(query: string, requester?: User): Promise<{ tracks: Track[]; playlist: any }>;
    public searchTidal(query: string, requester?: User): Promise<{ tracks: Track[]; playlist: any }>;
    public searchQobuz(query: string, requester?: User): Promise<{ tracks: Track[]; playlist: any }>;
    public searchBandcamp(query: string, requester?: User): Promise<{ tracks: Track[]; playlist: any }>;
  }

  export default VibeLink;
}