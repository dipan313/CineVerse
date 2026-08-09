export type IndustryCategory = 
  | 'all'
  | 'hollywood'
  | 'mcu-dc'
  | 'bollywood'
  | 'tollywood'
  | 'bengali'
  | 'international';

export interface Movie {
  id: string;
  imdbId: string;
  title: string;
  originalTitle?: string;
  year: number;
  type: 'movie' | 'series' | 'animated';
  industry?: IndustryCategory;
  language?: string;
  languageCode?: string;
  flag?: string;
  rating: number; // 1-20 scale
  imdbRating: number;
  metascore?: number;
  pgRating?: string;
  duration?: string;
  genres: string[];
  storyline: string;
  poster: string;
  backdrop: string;
  director?: string;
  writer?: string;
  stars?: string[];
  boxOffice?: string;
  trailerYoutubeId?: string;
  franchiseId?: string;
  phaseOrUniverse?: string;
  releaseOrderIndex?: number;
  chronologicalOrderIndex?: number;
  isWatchlist?: boolean;
  isWatched?: boolean;
  userRating?: number; // 1-20
  dateAdded?: string;
  lastVerifiedAt?: string;
  streamingProviders?: {
    name: string;
    type: 'Stream' | 'Rent' | 'Buy';
    price?: string;
    url?: string;
    logo?: string;
  }[];
}

export interface Franchise {
  id: string;
  title: string;
  industry?: IndustryCategory;
  description: string;
  backdrop: string;
  movieIds: string[];
  universeTag?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  friendCode: string;
  favoriteIndustry: IndustryCategory;
  bio?: string;
  isGuest?: boolean;
  createdAt: string;
}

export interface Friend {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  friendCode: string;
  status: 'online' | 'watching' | 'offline';
  currentlyWatching?: {
    movieTitle: string;
    movieId: string;
  };
  totalWatchedCount: number;
  mutualFriendsCount?: number;
}

export interface FriendRequest {
  id: string;
  fromUser: Friend;
  toUserId: string;
  sentAt: string;
  status: 'pending' | 'accepted' | 'declined';
}

export interface SharedMovieRecommendation {
  id: string;
  sender: Friend;
  receiverId: string;
  movie: Movie;
  personalNote: string;
  sentAt: string;
  read: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  movieAttachment?: Movie;
  themeReaction?: string;
}

export type CineRoomTheme = 
  | 'stark'          // Stark Arc Reactor (Crimson & Gold glow)
  | 'gotham'         // Gotham Dark Knight Noir (Obsidian & Amber)
  | 'tollywood-gold' // Royal Tollywood (Regal Gold & Ruby)
  | 'bengal-art'     // Bengal Heritage (Artistic Sepia & Amber)
  | 'quantum'        // Quantum Realm Multiverse (Cosmic Purple & Neon Cyan)
  | 'bollywood-retro';// Bollywood Retro (Neon Marigold & Marquee)

export interface CineRoom {
  id: string;
  title: string;
  code: string;
  createdBy: Friend;
  theme: CineRoomTheme;
  activeMovie?: Movie;
  activeTrailerYoutubeId?: string;
  isPlaying: boolean;
  currentPlayheadSeconds: number;
  participants: Friend[];
  messages: ChatMessage[];
  createdAt: string;
}

export interface SyncMetadata {
  lastSyncTimestamp: string;
  nextSyncTimestamp: string;
  totalSyncedCount: number;
  syncIntervalDays: number;
  lastStatus: 'success' | 'syncing' | 'failed';
  latestLog?: string;
}

export type RmovieTab = 
  | 'home' 
  | 'timeline'
  | 'franchises' 
  | 'social' 
  | 'rooms' 
  | 'watchlist' 
  | 'watched' 
  | 'leaderboard';
