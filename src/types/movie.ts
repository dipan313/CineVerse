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

export interface VoiceMessage {
  id: string;
  audioBlobUrl: string;
  durationSeconds: number;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  movieAttachment?: Movie;
  voiceMessage?: VoiceMessage;
  themeReaction?: string;
}

export type CineRoomTheme = 
  | 'stark'
  | 'gotham'
  | 'tollywood-gold'
  | 'bengal-art'
  | 'quantum'
  | 'bollywood-retro';

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

export interface CommunityMovieRoom {
  isOpen: boolean;
  sourceType: 'youtube' | 'local_file';
  activeMovie?: Movie;
  youtubeId?: string;
  localVideoUrl?: string;
  localVideoFileName?: string;
  isPlaying: boolean;
  currentPlayheadSeconds: number;
}

export interface Community {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: IndustryCategory | 'general';
  bannerImage: string;
  avatar: string;
  memberCount: number;
  isJoined?: boolean;
  members: Friend[];
  messages: ChatMessage[];
  movieRoom: CommunityMovieRoom;
  createdAt: string;
}

export interface CineSpacePost {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    friendCode: string;
    role: 'Verified Filmmaker' | 'Film Critic' | 'Pro Cinephile' | 'Director' | 'Community Member';
    badgeColor?: string;
  };
  content: string;
  taggedMovie?: Movie;
  mediaUrl?: string;
  reactions: {
    fire: number;
    heart: number;
    crown: number;
    popcorn: number;
    mindblown: number;
  };
  userReactions: string[];
  commentsCount: number;
  createdAt: string;
}

export interface CineVerseCommunityRating {
  movieId: string;
  movieTitle: string;
  poster: string;
  year: number;
  industry: IndustryCategory;
  cineverseScore: number;
  totalUserVotes: number;
  positiveReactionPercentage: number;
  topAudienceVerdict: string;
}

export interface CinePediaMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  badge?: 'VERIFIED TRUE' | 'BUSTED MYTH' | 'CANON CONFIRMED' | 'BEHIND THE SCENES' | 'BOX OFFICE FACT';
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
  | 'watched' 
  | 'watchlist' 
  | 'cinespace' 
  | 'communities' 
  | 'franchises' 
  | 'leaderboard';
