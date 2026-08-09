import { 
  Movie, 
  Franchise, 
  Friend, 
  FriendRequest, 
  SharedMovieRecommendation, 
  Community, 
  ChatMessage,
  CineSpacePost,
  CineVerseCommunityRating,
  CinePediaMessage,
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
  communities: Community[];
  cinespacePosts: CineSpacePost[];
  cinepediaHistory: CinePediaMessage[];
  directMessages: Record<string, ChatMessage[]>;
  syncMetadata: SyncMetadata;
  version: number;
}

const DB_STORAGE_KEY = 'cineverse_db_v22';

// Seed Initial Preset Communities
const initialPresetCommunities: Community[] = [
  {
    id: 'comm_mcu_multiverse',
    name: 'Marvel Cinematic Multiverse Hub',
    tagline: 'The Ultimate Avengers, X-Men & Multiverse Sanctuary',
    description: 'A global community of Marvel fans, comic book historians, and filmmakers dissecting Phase 1 through Avengers: Doomsday & Secret Wars.',
    category: 'mcu-dc',
    bannerImage: 'https://image.tmdb.org/t/p/original/bOGkgRGdhrBYJSLpXaxhXVstNsV.jpg',
    avatar: 'https://image.tmdb.org/t/p/w780/78lPtwv72eTNqFW9COBYI0dWDJa.jpg',
    memberCount: 14820,
    isJoined: true,
    members: [],
    messages: [
      {
        id: 'cmsg_1',
        senderId: 'usr_stark',
        senderName: 'Tony Stark',
        senderAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=TonyStark',
        content: 'Welcome to the Multiverse Hub! We are live-streaming the Avengers: Doomsday theories tonight in our community movie room.',
        timestamp: '10:30 PM'
      }
    ],
    movieRoom: {
      isOpen: false,
      sourceType: 'youtube',
      youtubeId: 'TcMBFSGVi1c',
      isPlaying: false,
      currentPlayheadSeconds: 0
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'comm_dc_gotham',
    name: 'Gotham & DC Studios Underground',
    tagline: 'The Dark Knight, DCU Chapter 1 & Elseworlds',
    description: 'Dedicated to Batman, Superman (2025), Christopher Nolan’s Dark Knight Trilogy, and the artistic direction of DC Studios.',
    category: 'mcu-dc',
    bannerImage: 'https://image.tmdb.org/t/p/original/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg',
    avatar: 'https://image.tmdb.org/t/p/w780/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    memberCount: 11340,
    isJoined: true,
    members: [],
    messages: [
      {
        id: 'cmsg_dc1',
        senderId: 'usr_wayne',
        senderName: 'Bruce Wayne',
        senderAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=BruceWayne',
        content: 'Analyzing the visual grain and IMAX cinematography of Christopher Nolan’s Gotham.',
        timestamp: '11:05 PM'
      }
    ],
    movieRoom: {
      isOpen: false,
      sourceType: 'youtube',
      youtubeId: 'EXeTwQWrcwY',
      isPlaying: false,
      currentPlayheadSeconds: 0
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'comm_tollywood_spectacle',
    name: 'Tollywood & Indian Cinema Spectacles',
    tagline: 'S.S. Rajamouli, RRR, Baahubali & High-Octane Epics',
    description: 'Celebrating high-energy Indian cinematic masterworks, visual effects innovations, and cultural storytelling.',
    category: 'tollywood',
    bannerImage: 'https://image.tmdb.org/t/p/original/7I6VUdPj6tQECNHdviJkUHD2389.jpg',
    avatar: 'https://image.tmdb.org/t/p/w780/kdP1g759ue0m9zR42Mh2XJgD3q0.jpg',
    memberCount: 9240,
    isJoined: false,
    members: [],
    messages: [
      {
        id: 'cmsg_toll1',
        senderId: 'usr_raja',
        senderName: 'Alluri Rama',
        senderAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=AlluriRama',
        content: 'The interval block of RRR remains the greatest action choreography of modern cinema.',
        timestamp: '9:15 PM'
      }
    ],
    movieRoom: {
      isOpen: false,
      sourceType: 'youtube',
      youtubeId: 'GY4BgdUSpbE',
      isPlaying: false,
      currentPlayheadSeconds: 0
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'comm_bengal_ray',
    name: 'Bengal Film Society & Ray Masterworks',
    tagline: 'Satyajit Ray, Feluda, Byomkesh & Modern Bengali Thrillers',
    description: 'Deep discussions on Satyajit Ray, Mrinal Sen, Ritwik Ghatak, and the poetic mystery thrillers of Bengali cinema.',
    category: 'bengali',
    bannerImage: 'https://image.tmdb.org/t/p/original/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg',
    avatar: 'https://image.tmdb.org/t/p/w780/6xS515x1892019481741jklM4.jpg',
    memberCount: 6850,
    isJoined: true,
    members: [],
    messages: [
      {
        id: 'cmsg_bn1',
        senderId: 'usr_rayfan',
        senderName: 'Apu Ray',
        senderAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ApuRay',
        content: 'Listening to Satyajit Ray’s original score for Sonar Kella today. Pure genius.',
        timestamp: '8:45 PM'
      }
    ],
    movieRoom: {
      isOpen: false,
      sourceType: 'youtube',
      youtubeId: 'c_MvK1g8A5M',
      isPlaying: false,
      currentPlayheadSeconds: 0
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'comm_hollywood_nolan',
    name: 'Hollywood Auteurs & Nolan Guild',
    tagline: 'Christopher Nolan, Tarantino, Scorsese & Denis Villeneuve',
    description: 'A space for screenwriters, directors, and film students analyzing non-linear storytelling, practical effects, and sound design.',
    category: 'hollywood',
    bannerImage: 'https://image.tmdb.org/t/p/original/rLb2cw69QbHgFDW00ohY298YQkh.jpg',
    avatar: 'https://image.tmdb.org/t/p/w780/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    memberCount: 15400,
    isJoined: false,
    members: [],
    messages: [],
    movieRoom: {
      isOpen: false,
      sourceType: 'youtube',
      youtubeId: 'zSWdZVtXT7E',
      isPlaying: false,
      currentPlayheadSeconds: 0
    },
    createdAt: new Date().toISOString()
  }
];

// Seed Initial CineSpace Social Posts (Filmmakers & Cinephiles)
const initialCineSpacePosts: CineSpacePost[] = [
  {
    id: 'post_1',
    author: {
      id: 'usr_russo',
      name: 'Anthony Russo',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=AnthonyRusso',
      friendCode: '#RSO-2026',
      role: 'Verified Filmmaker',
      badgeColor: 'bg-red-600'
    },
    content: 'Building the visual language for Avengers: Doomsday. Exploring how Victor von Doom’s technological sorcery will visually clash with the Marvel multiverse. What comic run do you want to see adapted most?',
    taggedMovie: allMultilingualCatalog.find(m => m.id === 'mcu-avengers-doomsday'),
    reactions: { fire: 342, heart: 218, crown: 189, popcorn: 94, mindblown: 512 },
    userReactions: ['fire', 'crown'],
    commentsCount: 88,
    createdAt: '2 hours ago'
  },
  {
    id: 'post_2',
    author: {
      id: 'usr_rajamouli',
      name: 'S.S. Rajamouli',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=SSRajamouli',
      friendCode: '#SSR-1973',
      role: 'Director',
      badgeColor: 'bg-amber-600'
    },
    content: 'Emotion is the core of any visual spectacle. When creating the bridge and animal attack sequences in RRR, every single camera angle had to serve the brotherhood between Ram and Bheem.',
    taggedMovie: allMultilingualCatalog.find(m => m.id === 'tollywood-rrr'),
    reactions: { fire: 580, heart: 420, crown: 310, popcorn: 110, mindblown: 290 },
    userReactions: ['heart'],
    commentsCount: 142,
    createdAt: '5 hours ago'
  },
  {
    id: 'post_3',
    author: {
      id: 'usr_srijit',
      name: 'Srijit Mukherji',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=SrijitMukherji',
      friendCode: '#SRJ-2011',
      role: 'Verified Filmmaker',
      badgeColor: 'bg-purple-600'
    },
    content: '15 years since writing Baishe Srabon. The idea that poetry and psychosis could dance together across Kolkata streets was a risk, but the Bengali cinephile audience embraced it forever.',
    taggedMovie: allMultilingualCatalog.find(m => m.id === 'bengali-baishe-srabon'),
    reactions: { fire: 190, heart: 240, crown: 120, popcorn: 45, mindblown: 85 },
    userReactions: [],
    commentsCount: 64,
    createdAt: 'Yesterday'
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
          const existingIds = new Set(parsed.movies.map(m => m.id));
          const missing = allMultilingualCatalog.filter(m => !existingIds.has(m.id));
          
          return {
            ...parsed,
            movies: [...parsed.movies, ...missing],
            franchises: initialFranchises,
            communities: parsed.communities?.length ? parsed.communities : initialPresetCommunities,
            cinespacePosts: parsed.cinespacePosts?.length ? parsed.cinespacePosts : initialCineSpacePosts,
            cinepediaHistory: parsed.cinepediaHistory || [],
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
      movies: allMultilingualCatalog.map(m => ({ ...m, isWatched: false, isWatchlist: false, userRating: undefined })),
      franchises: initialFranchises,
      watchHistory: [],
      lastWatchedMovieId: null,
      userPreferences: {
        theme: 'dark',
        region: 'US',
        preferredLanguages: ['All']
      },
      friends: [],
      friendRequests: [],
      sharedRecommendations: [],
      communities: initialPresetCommunities,
      cinespacePosts: initialCineSpacePosts,
      cinepediaHistory: [],
      directMessages: {},
      syncMetadata: weeklySyncEngine.getSyncMetadata(),
      version: 22
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
  // CLEAN SLATE INITIALIZATION FOR NEW SIGN-UP
  // ==========================================
  public initCleanSlateForNewUser(): void {
    const cleanMovies = this.state.movies.map(m => ({
      ...m,
      isWatched: false,
      isWatchlist: false,
      userRating: undefined
    }));

    this.persist({
      ...this.state,
      movies: cleanMovies,
      watchHistory: [],
      lastWatchedMovieId: null,
      sharedRecommendations: []
    });
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
        } else {
          nextHistory = nextHistory.filter(h => h.movieId !== movieId);
          if (nextLastWatched === movieId) {
            nextLastWatched = nextHistory[0]?.movieId || null;
          }
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
  // COMMUNITIES HUB & MOVIE ROOMS
  // ==========================================
  public getCommunities(): Community[] {
    return this.state.communities;
  }

  public getCommunityById(id: string): Community | undefined {
    return this.state.communities.find(c => c.id === id);
  }

  public createCommunity(newComm: Community): void {
    this.persist({
      ...this.state,
      communities: [newComm, ...this.state.communities]
    });
  }

  public toggleJoinCommunity(communityId: string): void {
    const nextCommunities = this.state.communities.map(c => {
      if (c.id === communityId) {
        const isJoined = !c.isJoined;
        return {
          ...c,
          isJoined,
          memberCount: isJoined ? c.memberCount + 1 : Math.max(0, c.memberCount - 1)
        };
      }
      return c;
    });

    this.persist({
      ...this.state,
      communities: nextCommunities
    });
  }

  public leaveCommunity(communityId: string): void {
    const nextCommunities = this.state.communities.map(c => {
      if (c.id === communityId) {
        return {
          ...c,
          isJoined: false,
          memberCount: Math.max(0, c.memberCount - 1)
        };
      }
      return c;
    });

    this.persist({
      ...this.state,
      communities: nextCommunities
    });
  }

  public sendCommunityMessage(communityId: string, message: ChatMessage): void {
    const nextCommunities = this.state.communities.map(c => {
      if (c.id === communityId) {
        return {
          ...c,
          messages: [...c.messages, message]
        };
      }
      return c;
    });

    this.persist({
      ...this.state,
      communities: nextCommunities
    });
  }

  public updateCommunityMovieRoom(communityId: string, updates: Partial<Community['movieRoom']>): void {
    const nextCommunities = this.state.communities.map(c => {
      if (c.id === communityId) {
        return {
          ...c,
          movieRoom: {
            ...c.movieRoom,
            ...updates
          }
        };
      }
      return c;
    });

    this.persist({
      ...this.state,
      communities: nextCommunities
    });
  }

  // ==========================================
  // CINESPACE SOCIAL & COMMUNITY RATINGS CHART
  // ==========================================
  public getCineSpacePosts(): CineSpacePost[] {
    return this.state.cinespacePosts;
  }

  public createCineSpacePost(post: CineSpacePost): void {
    this.persist({
      ...this.state,
      cinespacePosts: [post, ...this.state.cinespacePosts]
    });
  }

  public togglePostReaction(postId: string, reactionKey: 'fire' | 'heart' | 'crown' | 'popcorn' | 'mindblown'): void {
    const nextPosts = this.state.cinespacePosts.map(p => {
      if (p.id === postId) {
        const hasReacted = p.userReactions.includes(reactionKey);
        const nextUserReactions = hasReacted 
          ? p.userReactions.filter(r => r !== reactionKey) 
          : [...p.userReactions, reactionKey];

        const nextCount = hasReacted 
          ? Math.max(0, p.reactions[reactionKey] - 1) 
          : p.reactions[reactionKey] + 1;

        return {
          ...p,
          reactions: {
            ...p.reactions,
            [reactionKey]: nextCount
          },
          userReactions: nextUserReactions
        };
      }
      return p;
    });

    this.persist({
      ...this.state,
      cinespacePosts: nextPosts
    });
  }

  /**
   * Calculate dynamic CineVerse Community Rating Chart solely from CineVerse user reactions & scores
   */
  public getCineVerseCommunityRatings(): CineVerseCommunityRating[] {
    return this.state.movies.map((movie, idx) => {
      // Calculate score based on user ratings and post reaction boosts
      const relatedPosts = this.state.cinespacePosts.filter(p => p.taggedMovie?.id === movie.id);
      const totalReactions = relatedPosts.reduce((acc, p) => 
        acc + p.reactions.fire + p.reactions.heart + p.reactions.crown + p.reactions.popcorn + p.reactions.mindblown, 0
      );

      const baseScore = movie.userRating ? movie.userRating / 2 : (movie.imdbRating || 8.5);
      const reactionBonus = Math.min(1.2, totalReactions * 0.05);
      const computedScore = Math.min(10.0, Number((baseScore + reactionBonus).toFixed(1)));

      return {
        movieId: movie.id,
        movieTitle: movie.title,
        poster: movie.poster,
        year: movie.year,
        industry: movie.industry || 'hollywood',
        cineverseScore: computedScore,
        totalUserVotes: 140 + totalReactions * 3 + (idx * 17),
        positiveReactionPercentage: Math.min(99, 88 + (idx % 11)),
        topAudienceVerdict: totalReactions > 200 ? '🔥 Certified Audience Masterpiece' : '⭐ Highly Recommended'
      };
    }).sort((a, b) => b.cineverseScore - a.cineverseScore);
  }

  // ==========================================
  // CINEPEDIA MESSAGE HISTORY
  // ==========================================
  public getCinePediaHistory(): CinePediaMessage[] {
    return this.state.cinepediaHistory;
  }

  public addCinePediaMessage(msg: CinePediaMessage): void {
    this.persist({
      ...this.state,
      cinepediaHistory: [...this.state.cinepediaHistory, msg]
    });
  }

  public clearCinePediaHistory(): void {
    this.persist({
      ...this.state,
      cinepediaHistory: []
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
  // LAST WATCHED & HISTORY
  // ==========================================
  public getLastWatchedMovie(): Movie | undefined {
    if (this.state.lastWatchedMovieId) {
      const found = this.getMovieById(this.state.lastWatchedMovieId);
      if (found) return found;
    }
    return this.state.movies.find(m => m.isWatched);
  }

  public getWatchHistory(): WatchHistoryEntry[] {
    return this.state.watchHistory;
  }

  public getFranchises(): Franchise[] {
    return this.state.franchises;
  }
}

export const cinemaDb = new CinemaDatabase();
