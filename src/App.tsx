import React, { useState, useEffect } from 'react';
import { Movie, RmovieTab, UserProfile } from './types/movie';
import { cinemaDb, DatabaseState } from './db/cinemaDatabase';
import { authService } from './db/supabaseClient';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { UniverseTimelineView } from './components/UniverseTimelineView';
import { FranchisesView } from './components/FranchisesView';
import { CommunitiesView } from './components/CommunitiesView';
import { CineSpaceSocialView } from './components/CineSpaceSocialView';
import { WatchlistView } from './components/WatchlistView';
import { WatchedView } from './components/WatchedView';
import { LeaderboardView } from './components/LeaderboardView';
import { MovieDetailsModal } from './components/MovieDetailsModal';
import { TrailerModal } from './components/TrailerModal';
import { ShareMovieModal } from './components/ShareMovieModal';
import { CinePediaModal } from './components/CinePediaModal';
import { AddMovieAutoImportModal } from './components/AddMovieAutoImportModal';
import { AvatarSelectorModal } from './components/AvatarSelectorModal';
import { LandingPage } from './components/LandingPage';
import { CinematicLoader } from './components/CinematicLoader';
import { Check } from 'lucide-react';

export const App: React.FC = () => {
  const [isCinematicLoading, setIsCinematicLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => authService.getCurrentUser());
  const [activeTab, setActiveTab] = useState<RmovieTab>('home');
  const [dbState, setDbState] = useState<DatabaseState>(() => ({
    movies: cinemaDb.getMovies(),
    franchises: cinemaDb.getFranchises(),
    watchHistory: cinemaDb.getWatchHistory(),
    lastWatchedMovieId: cinemaDb.getLastWatchedMovie()?.id || null,
    userPreferences: { theme: 'dark', region: 'US', preferredLanguages: ['All'] },
    friends: cinemaDb.getFriends(),
    friendRequests: [],
    sharedRecommendations: [],
    communities: cinemaDb.getCommunities(),
    cinespacePosts: cinemaDb.getCineSpacePosts(),
    cinepediaHistory: cinemaDb.getCinePediaHistory(),
    directMessages: {},
    syncMetadata: cinemaDb.getFriends() as any,
    version: 22
  }));

  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [activeTrailerId, setActiveTrailerId] = useState<string | null>(null);
  const [shareMovieTarget, setShareMovieTarget] = useState<Movie | null>(null);
  const [isAutoImportOpen, setIsAutoImportOpen] = useState(false);
  const [isCinePediaOpen, setIsCinePediaOpen] = useState(false);
  const [isAvatarSelectorOpen, setIsAvatarSelectorOpen] = useState(false);
  const [syncToastMessage, setSyncToastMessage] = useState<string | null>(null);

  // Subscribe to Auth changes
  useEffect(() => {
    const unsubscribeAuth = authService.subscribe((user) => {
      setCurrentUser(user);
    });
    return unsubscribeAuth;
  }, []);

  // Subscribe to Database changes
  useEffect(() => {
    const unsubscribeDb = cinemaDb.subscribe((newState) => {
      setDbState({ ...newState });
      if (selectedMovie) {
        const updated = newState.movies.find(m => m.id === selectedMovie.id);
        if (updated) {
          setSelectedMovie(updated);
        }
      }
    });
    return unsubscribeDb;
  }, [selectedMovie]);

  // Initial Cinematic Studio Preloader
  if (isCinematicLoading) {
    return <CinematicLoader onComplete={() => setIsCinematicLoading(false)} />;
  }

  // If user is not logged in, render the high-impact Landing Page
  if (!currentUser) {
    return <LandingPage onAuthenticated={() => setCurrentUser(authService.getCurrentUser())} />;
  }

  const movies = dbState.movies;
  const franchises = dbState.franchises;
  const lastWatchedMovie = cinemaDb.getLastWatchedMovie();

  // Watchlist & Watched counts
  const watchlistCount = movies.filter(m => m.isWatchlist).length;
  const watchedCount = movies.filter(m => m.isWatched).length;

  const handleToggleWatchlist = (movie: Movie) => {
    const updated = cinemaDb.toggleWatchlist(movie.id);
    if (updated && selectedMovie && selectedMovie.id === movie.id) {
      setSelectedMovie(updated);
    }
  };

  const handleToggleWatched = (movie: Movie) => {
    const updated = cinemaDb.toggleWatched(movie.id);
    if (updated && selectedMovie && selectedMovie.id === movie.id) {
      setSelectedMovie(updated);
    }
  };

  const handleRate = (movie: Movie, rating: number) => {
    cinemaDb.rateMovie(movie.id, rating);
  };

  const handleDelete = (movie: Movie) => {
    cinemaDb.toggleWatchlist(movie.id);
  };

  const handleAddMovie = (newMovie: Movie) => {
    cinemaDb.addMovie(newMovie);
  };

  const handleSyncNotification = () => {
    setSyncToastMessage("7-Day Web Sync Complete: Movie ratings, posters & box office updated.");
    setTimeout(() => setSyncToastMessage(null), 4000);
  };

  // Search Filter
  const displayedMovies = searchQuery.trim()
    ? movies.filter(
        m =>
          m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (m.originalTitle && m.originalTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
          m.imdbId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (m.director && m.director.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (m.language && m.language.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (m.genres && m.genres.some(g => g.toLowerCase().includes(searchQuery.toLowerCase())))
      )
    : movies;

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${
      isDarkMode ? 'bg-[#0a0a0f] text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>
      
      {/* Top Fixed Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        watchlistCount={watchlistCount}
        watchedCount={watchedCount}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        currentUser={currentUser}
        onSignOut={() => authService.signOut()}
        onOpenAutoImport={() => setIsAutoImportOpen(true)}
        onOpenCinePedia={() => setIsCinePediaOpen(true)}
        onSyncStarted={handleSyncNotification}
        onSelectMovie={(m) => setSelectedMovie(m)}
        onOpenAvatarSelector={() => setIsAvatarSelectorOpen(true)}
      />

      {/* Sync Toast Notification */}
      {syncToastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 shadow-2xl backdrop-blur-md flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Check className="w-4 h-4" />
          </div>
          <p className="text-xs font-semibold">{syncToastMessage}</p>
        </div>
      )}

      {/* Main Content Area */}
      <main className={`max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 ${
        activeTab === 'communities' ? 'pt-20 sm:pt-22' : 'pt-24 sm:pt-28'
      }`}>
        
        {activeTab === 'home' && (
          <HomeView
            movies={displayedMovies}
            watchlistCount={watchlistCount}
            watchedCount={watchedCount}
            lastWatchedMovie={lastWatchedMovie}
            searchQuery={searchQuery}
            onClearSearch={() => setSearchQuery('')}
            onSelectMovie={(m) => setSelectedMovie(m)}
            onToggleWatchlist={handleToggleWatchlist}
            onToggleWatched={handleToggleWatched}
            onRate={handleRate}
            onShareMovie={(m) => setShareMovieTarget(m)}
          />
        )}

        {activeTab === 'timeline' && (
          <UniverseTimelineView
            movies={movies}
            onSelectMovie={(m) => setSelectedMovie(m)}
            onToggleWatchlist={handleToggleWatchlist}
            onToggleWatched={handleToggleWatched}
            onRate={handleRate}
            onShareMovie={(m) => setShareMovieTarget(m)}
          />
        )}

        {activeTab === 'watched' && (
          <WatchedView
            movies={movies}
            onSelectMovie={(m) => setSelectedMovie(m)}
            onToggleWatchlist={handleToggleWatchlist}
            onToggleWatched={handleToggleWatched}
            onRate={handleRate}
          />
        )}

        {activeTab === 'watchlist' && (
          <WatchlistView
            movies={movies.filter(m => m.isWatchlist)}
            onSelectMovie={(m) => setSelectedMovie(m)}
            onToggleWatchlist={handleToggleWatchlist}
            onToggleWatched={handleToggleWatched}
            onRate={handleRate}
            onDelete={handleDelete}
          />
        )}

        {activeTab === 'cinespace' && (
          <CineSpaceSocialView
            currentUser={currentUser}
            allMovies={movies}
            onSelectMovie={(m) => setSelectedMovie(m)}
          />
        )}

        {activeTab === 'communities' && (
          <CommunitiesView
            currentUser={currentUser}
            allMovies={movies}
            onSelectMovie={(m) => setSelectedMovie(m)}
          />
        )}

        {activeTab === 'franchises' && (
          <FranchisesView
            franchises={franchises}
            movies={movies}
            onSelectMovie={(m) => setSelectedMovie(m)}
            onToggleWatchlist={handleToggleWatchlist}
            onToggleWatched={handleToggleWatched}
          />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardView
            movies={movies}
            onSelectMovie={(m) => setSelectedMovie(m)}
          />
        )}

      </main>

      {/* Movie Details Modal */}
      {selectedMovie && (
        <MovieDetailsModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onToggleWatchlist={handleToggleWatchlist}
          onToggleWatched={handleToggleWatched}
          onRate={handleRate}
          onWatchTrailer={(trailerId) => setActiveTrailerId(trailerId)}
          onShareMovie={(m) => setShareMovieTarget(m)}
        />
      )}

      {/* Video Trailer Modal */}
      {activeTrailerId && (
        <TrailerModal
          youtubeId={activeTrailerId}
          onClose={() => setActiveTrailerId(null)}
        />
      )}

      {/* Share Movie with Friends Modal */}
      {shareMovieTarget && (
        <ShareMovieModal
          movie={shareMovieTarget}
          isOpen={!!shareMovieTarget}
          onClose={() => setShareMovieTarget(null)}
          senderName={currentUser.displayName}
          senderAvatar={currentUser.avatarUrl}
        />
      )}

      {/* CinePedia AI Fact-Checker Modal */}
      <CinePediaModal
        isOpen={isCinePediaOpen}
        onClose={() => setIsCinePediaOpen(false)}
      />

      {/* Auto-Import / Scraper Modal */}
      <AddMovieAutoImportModal
        isOpen={isAutoImportOpen}
        onClose={() => setIsAutoImportOpen(false)}
        onAddMovie={handleAddMovie}
      />

      {/* Character Profile Avatar Selector Modal */}
      <AvatarSelectorModal
        isOpen={isAvatarSelectorOpen}
        onClose={() => setIsAvatarSelectorOpen(false)}
        currentUser={currentUser}
        onAvatarUpdated={() => setCurrentUser(authService.getCurrentUser())}
      />

    </div>
  );
};
