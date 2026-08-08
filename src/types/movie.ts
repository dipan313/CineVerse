export interface Movie {
  id: string;
  imdbId: string;
  title: string;
  originalTitle?: string;
  year: number;
  type: 'movie' | 'series' | 'animated';
  language?: string; // e.g. 'English', 'Hindi', 'Japanese', 'Korean', 'Spanish', 'French', 'Bengali', 'German', 'Italian'
  languageCode?: string; // e.g. 'en', 'hi', 'ja', 'ko', 'es', 'fr', 'bn', 'de', 'it'
  flag?: string; // e.g. '🇺🇸', '🇮🇳', '🇯🇵', '🇰🇷', '🇪🇸', '🇫🇷', '🇩🇪', '🇮🇹'
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
  isWatchlist?: boolean;
  isWatched?: boolean;
  userRating?: number; // 1-20
  dateAdded?: string;
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
  description: string;
  backdrop: string;
  movieIds: string[];
}

export type RmovieTab = 'home' | 'watchlist' | 'watched' | 'franchises' | 'leaderboard';
