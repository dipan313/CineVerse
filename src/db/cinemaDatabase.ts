import { Movie, Franchise } from '../types/movie';
import { allMultilingualCatalog } from '../data/allMovies';
import { initialFranchises } from '../data/moviesData';

export interface WatchHistoryEntry {
  movieId: string;
  watchedAt: string;
  userRating?: number;
}

export interface UserPreferences {
  theme: 'dark' | 'light';
  region: string;
  preferredLanguages: string[];
}

export interface DatabaseState {
  movies: Movie[];
  franchises: Franchise[];
  watchHistory: WatchHistoryEntry[];
  lastWatchedMovieId: string | null;
  userPreferences: UserPreferences;
  version: number;
}

const DB_STORAGE_KEY = 'cineverse_db_v20';

class CinemaDatabase {
  private state: DatabaseState;
  private listeners: Array<(state: DatabaseState) => void> = [];

  constructor() {
    this.state = this.loadInitialState();
  }

  private loadInitialState(): DatabaseState {
    try {
      const saved = localStorage.getItem(DB_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as DatabaseState;
        if (parsed && Array.isArray(parsed.movies) && parsed.movies.length > 0) {
          // Merge with any newly cataloged entries
          const existingIds = new Set(parsed.movies.map(m => m.id));
          const missing = allMultilingualCatalog.filter(m => !existingIds.has(m.id));
          return {
            ...parsed,
            movies: [...parsed.movies, ...missing],
            franchises: parsed.franchises && parsed.franchises.length > 0 ? parsed.franchises : initialFranchises
          };
        }
      }
    } catch (e) {
      console.error("DB load error, initializing defaults", e);
    }

    // Default Fresh Seed
    const defaultState: DatabaseState = {
      movies: allMultilingualCatalog,
      franchises: initialFranchises,
      watchHistory: allMultilingualCatalog.filter(m => m.isWatched).map(m => ({
        movieId: m.id,
        watchedAt: m.dateAdded || new Date().toISOString(),
        userRating: m.userRating
      })),
      lastWatchedMovieId: allMultilingualCatalog.find(m => m.isWatched)?.id || 'mcu-avengers-endgame',
      userPreferences: {
        theme: 'dark',
        region: 'US',
        preferredLanguages: ['All']
      },
      version: 20
    };

    this.persist(defaultState);
    return defaultState;
  }

  private persist(state: DatabaseState): void {
    try {
      localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(state));
      this.state = state;
      this.notify();
    } catch (e) {
      console.error("DB persist error", e);
    }
  }

  public subscribe(listener: (state: DatabaseState) => void): () => void {
    this.listeners.push(listener);
    listener(this.state);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(): void {
    this.listeners.forEach(l => l(this.state));
  }

  // ==========================================
  // MOVIES CRUD & QUERIES
  // ==========================================
  public getMovies(): Movie[] {
    return this.state.movies;
  }

  public getMovieById(id: string): Movie | undefined {
    return this.state.movies.find(m => m.id === id);
  }

  public addMovie(movie: Movie): boolean {
    const exists = this.state.movies.find(m => m.id === movie.id || m.imdbId === movie.imdbId);
    if (exists) return false;

    const nextMovies = [movie, ...this.state.movies];
    this.persist({
      ...this.state,
      movies: nextMovies
    });
    return true;
  }

  public updateMovie(id: string, updates: Partial<Movie>): void {
    const nextMovies = this.state.movies.map(m => (m.id === id ? { ...m, ...updates } : m));
    this.persist({
      ...this.state,
      movies: nextMovies
    });
  }

  public deleteMovie(id: string): void {
    const nextMovies = this.state.movies.filter(m => m.id !== id);
    this.persist({
      ...this.state,
      movies: nextMovies
    });
  }

  // ==========================================
  // WATCHLIST & WATCHED TOGGLES
  // ==========================================
  public toggleWatchlist(movieId: string): Movie | undefined {
    let targetMovie: Movie | undefined;
    const nextMovies = this.state.movies.map(m => {
      if (m.id === movieId) {
        targetMovie = { ...m, isWatchlist: !m.isWatchlist };
        return targetMovie;
      }
      return m;
    });

    this.persist({
      ...this.state,
      movies: nextMovies
    });
    return targetMovie;
  }

  public toggleWatched(movieId: string): Movie | undefined {
    let targetMovie: Movie | undefined;
    let nextLastWatched = this.state.lastWatchedMovieId;
    let nextHistory = [...this.state.watchHistory];

    const nextMovies = this.state.movies.map(m => {
      if (m.id === movieId) {
        const isNowWatched = !m.isWatched;
        targetMovie = { ...m, isWatched: isNowWatched };
        if (isNowWatched) {
          nextLastWatched = movieId;
          nextHistory = [
            { movieId, watchedAt: new Date().toISOString(), userRating: m.userRating },
            ...nextHistory.filter(h => h.movieId !== movieId)
          ];
        }
        return targetMovie;
      }
      return m;
    });

    this.persist({
      ...this.state,
      movies: nextMovies,
      lastWatchedMovieId: nextLastWatched,
      watchHistory: nextHistory
    });
    return targetMovie;
  }

  public rateMovie(movieId: string, rating: number): void {
    let nextLastWatched = this.state.lastWatchedMovieId;
    let nextHistory = [...this.state.watchHistory];

    const nextMovies = this.state.movies.map(m => {
      if (m.id === movieId) {
        nextLastWatched = movieId;
        nextHistory = [
          { movieId, watchedAt: new Date().toISOString(), userRating: rating },
          ...nextHistory.filter(h => h.movieId !== movieId)
        ];
        return { ...m, userRating: rating, isWatched: true };
      }
      return m;
    });

    this.persist({
      ...this.state,
      movies: nextMovies,
      lastWatchedMovieId: nextLastWatched,
      watchHistory: nextHistory
    });
  }

  // ==========================================
  // LAST WATCHED & HISTORY
  // ==========================================
  public getLastWatchedMovie(): Movie | undefined {
    if (this.state.lastWatchedMovieId) {
      const found = this.getMovieById(this.state.lastWatchedMovieId);
      if (found) return found;
    }
    return this.state.movies.find(m => m.isWatched) || this.state.movies[0];
  }

  public setLastWatchedMovie(movieId: string): void {
    this.persist({
      ...this.state,
      lastWatchedMovieId: movieId
    });
  }

  public getWatchHistory(): WatchHistoryEntry[] {
    return this.state.watchHistory;
  }

  public getFranchises(): Franchise[] {
    return this.state.franchises;
  }

  public resetToDefaults(): void {
    localStorage.removeItem(DB_STORAGE_KEY);
    this.state = this.loadInitialState();
    this.notify();
  }
}

export const cinemaDb = new CinemaDatabase();
