import { 
  Movie, 
  Franchise, 
  Friend, 
  FriendRequest, 
  SharedMovieRecommendation, 
  CineRoom, 
  CineRoomTheme, 
  ChatMessage,
  SyncMetadata
} from '../types/movie';
import { allMultilingualCatalog } from '../data/allMovies';
import { initialFranchises } from '../data/moviesData';
import { weeklySyncEngine } from '../services/weeklySyncEngine';

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
  friends: Friend[];
  friendRequests: FriendRequest[];
  sharedRecommendations: SharedMovieRecommendation[];
  rooms: CineRoom[];
  directMessages: Record<string, ChatMessage[]>; // keyed by friendId
  syncMetadata: SyncMetadata;
  version: number;
}

const DB_STORAGE_KEY = 'cineverse_db_v21';

// Seed default mock friends for instant social vibrancy
const initialDefaultFriends: Friend[] = [
  {
    id: 'fr_tony_stark',
    username: 'IronManOfficial',
    displayName: 'Tony Stark',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=TonyStark',
    friendCode: '#STK-3000',
    status: 'online',
    currentlyWatching: {
      movieTitle: 'Avengers: Endgame',
      movieId: 'mcu-avengers-endgame'
    },
    totalWatchedCount: 42,
    mutualFriendsCount: 8
  },
  {
    id: 'fr_bruce_wayne',
    username: 'DarkKnight_Gotham',
    displayName: 'Bruce Wayne',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=BruceWayne',
    friendCode: '#GTH-1939',
    status: 'watching',
    currentlyWatching: {
      movieTitle: 'The Batman',
      movieId: 'dc-the-batman-2022'
    },
    totalWatchedCount: 38,
    mutualFriendsCount: 5
  },
  {
    id: 'fr_satyajit_cinephile',
    username: 'RayFilmSociety',
    displayName: 'Apu Ray',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=ApuRay',
    friendCode: '#RAY-1955',
    status: 'online',
    currentlyWatching: {
      movieTitle: 'Sonar Kella (The Golden Fortress)',
      movieId: 'bengali-sonar-kella'
    },
    totalWatchedCount: 56,
    mutualFriendsCount: 12
  },
  {
    id: 'fr_tollywood_rajamouli',
    username: 'RRR_FireWater',
    displayName: 'Alluri Rama',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=AlluriRama',
    friendCode: '#RRR-2022',
    status: 'offline',
    totalWatchedCount: 29,
    mutualFriendsCount: 4
  }
];

const initialDefaultRooms: CineRoom[] = [
  {
    id: 'room_mcu_premiere',
    title: '⚡ Avengers Multiverse Watch Party',
    code: 'ROOM-3000',
    createdBy: initialDefaultFriends[0],
    theme: 'stark',
    activeMovie: allMultilingualCatalog.find(m => m.id === 'mcu-avengers-endgame') || allMultilingualCatalog[0],
    activeTrailerYoutubeId: 'TcMBFSGVi1c',
    isPlaying: true,
    currentPlayheadSeconds: 45,
    participants: [initialDefaultFriends[0], initialDefaultFriends[1], initialDefaultFriends[2]],
    messages: [
      {
        id: 'msg_1',
        senderId: initialDefaultFriends[0].id,
        senderName: initialDefaultFriends[0].displayName,
        senderAvatar: initialDefaultFriends[0].avatarUrl,
        content: 'Welcome to the Stark Multiverse Watch Room! Portals opening now.',
        timestamp: '10:30 PM'
      },
      {
        id: 'msg_2',
        senderId: initialDefaultFriends[1].id,
        senderName: initialDefaultFriends[1].displayName,
        senderAvatar: initialDefaultFriends[1].avatarUrl,
        content: 'Gotham is tuned in. That portals scene never gets old.',
        timestamp: '10:31 PM'
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'room_gotham_noir',
    title: '🦇 Gotham City Midnight Club',
    code: 'ROOM-1939',
    createdBy: initialDefaultFriends[1],
    theme: 'gotham',
    activeMovie: allMultilingualCatalog.find(m => m.id === 'dc-the-dark-knight') || allMultilingualCatalog[1],
    activeTrailerYoutubeId: 'EXeTwQWrcwY',
    isPlaying: false,
    currentPlayheadSeconds: 0,
    participants: [initialDefaultFriends[1], initialDefaultFriends[2]],
    messages: [
      {
        id: 'msg_g1',
        senderId: initialDefaultFriends[1].id,
        senderName: initialDefaultFriends[1].displayName,
        senderAvatar: initialDefaultFriends[1].avatarUrl,
        content: 'Tonight we analyze Christopher Nolan & Matt Reeves cinematography.',
        timestamp: '11:15 PM'
      }
    ],
    createdAt: new Date().toISOString()
  }
];

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
          // Merge newly cataloged entries seamlessly
          const existingIds = new Set(parsed.movies.map(m => m.id));
          const missing = allMultilingualCatalog.filter(m => !existingIds.has(m.id));
          
          return {
            ...parsed,
            movies: [...parsed.movies, ...missing],
            franchises: initialFranchises,
            friends: parsed.friends?.length ? parsed.friends : initialDefaultFriends,
            rooms: parsed.rooms?.length ? parsed.rooms : initialDefaultRooms,
            sharedRecommendations: parsed.sharedRecommendations || [],
            directMessages: parsed.directMessages || {},
            syncMetadata: parsed.syncMetadata || weeklySyncEngine.getSyncMetadata()
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
      lastWatchedMovieId: 'mcu-avengers-endgame',
      userPreferences: {
        theme: 'dark',
        region: 'US',
        preferredLanguages: ['All']
      },
      friends: initialDefaultFriends,
      friendRequests: [],
      sharedRecommendations: [],
      rooms: initialDefaultRooms,
      directMessages: {
        'fr_tony_stark': [
          {
            id: 'dm_1',
            senderId: 'fr_tony_stark',
            senderName: 'Tony Stark',
            senderAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=TonyStark',
            content: 'Hey! Have you seen the new Avengers: Doomsday concept trailer yet?',
            timestamp: 'Just now'
          }
        ]
      },
      syncMetadata: weeklySyncEngine.getSyncMetadata(),
      version: 21
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

  public setMovies(movies: Movie[]): void {
    this.persist({
      ...this.state,
      movies
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
  // SOCIAL: FRIENDS & RECOMMENDATIONS
  // ==========================================
  public getFriends(): Friend[] {
    return this.state.friends;
  }

  public addFriendByCode(code: string): { success: boolean; message: string; friend?: Friend } {
    const clean = code.trim().toUpperCase();
    if (!clean) return { success: false, message: 'Please enter a valid friend code' };

    const existing = this.state.friends.find(f => f.friendCode.toUpperCase() === clean);
    if (existing) {
      return { success: false, message: `${existing.displayName} is already in your friends list!` };
    }

    // Create a new friend
    const nameMatch = clean.replace(/[^A-Z]/g, '').slice(0, 5) || 'CINEMA';
    const newFriend: Friend = {
      id: 'fr_' + Date.now(),
      username: `${nameMatch}_Fan`,
      displayName: `${nameMatch.charAt(0) + nameMatch.slice(1).toLowerCase()} Cinephile`,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${clean}`,
      friendCode: clean,
      status: 'online',
      currentlyWatching: {
        movieTitle: 'Interstellar',
        movieId: 'hollywood-interstellar'
      },
      totalWatchedCount: Math.floor(15 + Math.random() * 40),
      mutualFriendsCount: Math.floor(1 + Math.random() * 6)
    };

    const nextFriends = [newFriend, ...this.state.friends];
    this.persist({
      ...this.state,
      friends: nextFriends
    });

    return { success: true, message: `Connected with ${newFriend.displayName}!`, friend: newFriend };
  }

  public shareMovieWithFriend(movieId: string, friendId: string, note: string, senderName: string, senderAvatar: string): boolean {
    const movie = this.getMovieById(movieId);
    const friend = this.state.friends.find(f => f.id === friendId);
    if (!movie || !friend) return false;

    const recommendation: SharedMovieRecommendation = {
      id: 'rec_' + Date.now(),
      sender: {
        id: 'me',
        username: senderName,
        displayName: senderName,
        avatarUrl: senderAvatar,
        friendCode: '#ME-0001',
        status: 'online',
        totalWatchedCount: this.state.movies.filter(m => m.isWatched).length
      },
      receiverId: friendId,
      movie,
      personalNote: note,
      sentAt: new Date().toISOString(),
      read: false
    };

    // Also add to direct message chat
    const chatMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      senderId: 'me',
      senderName: senderName,
      senderAvatar: senderAvatar,
      content: note ? `🍿 Recommended "${movie.title}": ${note}` : `🍿 Check out "${movie.title}"!`,
      movieAttachment: movie,
      timestamp: 'Just now'
    };

    const currentDms = this.state.directMessages[friendId] || [];
    const nextDms = {
      ...this.state.directMessages,
      [friendId]: [...currentDms, chatMsg]
    };

    this.persist({
      ...this.state,
      sharedRecommendations: [recommendation, ...this.state.sharedRecommendations],
      directMessages: nextDms
    });

    return true;
  }

  public getDirectMessages(friendId: string): ChatMessage[] {
    return this.state.directMessages[friendId] || [];
  }

  public sendDirectMessage(friendId: string, msg: ChatMessage): void {
    const current = this.state.directMessages[friendId] || [];
    this.persist({
      ...this.state,
      directMessages: {
        ...this.state.directMessages,
        [friendId]: [...current, msg]
      }
    });
  }

  // ==========================================
  // CINEROOM: WATCH PARTIES & THEMES
  // ==========================================
  public getRooms(): CineRoom[] {
    return this.state.rooms;
  }

  public getRoomById(roomId: string): CineRoom | undefined {
    return this.state.rooms.find(r => r.id === roomId);
  }

  public createRoom(title: string, theme: CineRoomTheme, initialMovieId: string, creator: Friend): CineRoom {
    const movie = this.getMovieById(initialMovieId) || this.state.movies[0];
    const roomCode = 'ROOM-' + Math.floor(1000 + Math.random() * 9000);

    const newRoom: CineRoom = {
      id: 'room_' + Date.now(),
      title: title || `${movie.title} Watchroom`,
      code: roomCode,
      createdBy: creator,
      theme,
      activeMovie: movie,
      activeTrailerYoutubeId: movie.trailerYoutubeId,
      isPlaying: true,
      currentPlayheadSeconds: 0,
      participants: [creator],
      messages: [
        {
          id: 'msg_welcome',
          senderId: creator.id,
          senderName: creator.displayName,
          senderAvatar: creator.avatarUrl,
          content: `🎬 Created watchroom: "${title}". Playing "${movie.title}"!`,
          timestamp: 'Just now'
        }
      ],
      createdAt: new Date().toISOString()
    };

    const nextRooms = [newRoom, ...this.state.rooms];
    this.persist({
      ...this.state,
      rooms: nextRooms
    });

    return newRoom;
  }

  public updateRoomTheme(roomId: string, theme: CineRoomTheme): void {
    const nextRooms = this.state.rooms.map(r => r.id === roomId ? { ...r, theme } : r);
    this.persist({
      ...this.state,
      rooms: nextRooms
    });
  }

  public sendRoomMessage(roomId: string, message: ChatMessage): void {
    const nextRooms = this.state.rooms.map(r => {
      if (r.id === roomId) {
        return {
          ...r,
          messages: [...r.messages, message]
        };
      }
      return r;
    });

    this.persist({
      ...this.state,
      rooms: nextRooms
    });
  }

  public setRoomActiveMovie(roomId: string, movie: Movie): void {
    const nextRooms = this.state.rooms.map(r => {
      if (r.id === roomId) {
        return {
          ...r,
          activeMovie: movie,
          activeTrailerYoutubeId: movie.trailerYoutubeId
        };
      }
      return r;
    });

    this.persist({
      ...this.state,
      rooms: nextRooms
    });
  }

  // ==========================================
  // SYNC METADATA & LAST WATCHED
  // ==========================================
  public updateSyncMetadata(metadata: SyncMetadata): void {
    this.persist({
      ...this.state,
      syncMetadata: metadata
    });
  }

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
}

export const cinemaDb = new CinemaDatabase();
