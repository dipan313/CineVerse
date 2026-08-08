import React, { useState, useEffect } from 'react';
import { Movie, RmovieTab } from './types/movie';
import { cinemaDb, DatabaseState } from './db/cinemaDatabase';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { WatchlistView } from './components/WatchlistView';
import { WatchedView } from './components/WatchedView';
import { FranchisesView } from './components/FranchisesView';
import { LeaderboardView } from './components/LeaderboardView';
import { MovieDetailsModal } from './components/MovieDetailsModal';
import { TrailerModal } from './components/TrailerModal';
import { AuthModal } from './components/AuthModal';
import { AddMovieAutoImportModal } from './components/AddMovieAutoImportModal';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<RmovieTab>('home');
  const [dbState, setDbState] = useState<DatabaseState>(() => ({
    movies: cinemaDb.getMovies(),
    franchises: cinemaDb.getFranchises(),
    watchHistory: cinemaDb.getWatchHistory(),
    lastWatchedMovieId: cinemaDb.getLastWatchedMovie()?.id || null,
    userPreferences: { theme: 'dark', region: 'US', preferredLanguages: ['All'] },
    version: 20
  }));

  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [activeTrailerId, setActiveTrailerId] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAutoImportOpen, setIsAutoImportOpen] = useState(false);

  // Subscribe to structured database updates
  useEffect(() => {
    const unsubscribe = cinemaDb.subscribe((newState) => {
      setDbState({ ...newState });
      // Keep selected movie in modal in sync with database updates
      if (selectedMovie) {
        const updated = newState.movies.find(m => m.id === selectedMovie.id);
        if (updated) {
          setSelectedMovie(updated);
        }
      }
    });
    return unsubscribe;
  }, [selectedMovie]);

  const movies = dbState.movies;
  const franchises = dbState.franchises;
  const lastWatchedMovie = cinemaDb.getLastWatchedMovie();

  // Watchlist & Watched counts
  const watchlistCount = movies.filter(m => m.isWatchlist).length;
  const watchedCount = movies.filter(m => m.isWatched).length;

  // Toggle watchlist
  const handleToggleWatchlist = (movie: Movie) => {
    const updated = cinemaDb.toggleWatchlist(movie.id);
    if (updated && selectedMovie && selectedMovie.id === movie.id) {
      setSelectedMovie(updated);
    }
  };

  // Toggle watched
  const handleToggleWatched = (movie: Movie) => {
    const updated = cinemaDb.toggleWatched(movie.id);
    if (updated && selectedMovie && selectedMovie.id === movie.id) {
      setSelectedMovie(updated);
    }
  };

  // Custom 1-20 rating
  const handleRate = (movie: Movie, rating: number) => {
    cinemaDb.rateMovie(movie.id, rating);
  };

  // Delete from list
  const handleDelete = (movie: Movie) => {
    cinemaDb.toggleWatchlist(movie.id);
  };

  // Add newly uploaded movie from IMDb or Scraper
  const handleAddMovie = (newMovie: Movie) => {
    cinemaDb.addMovie(newMovie);
  };

  // Filtered by global search query across English, Marvel, Bengali, native titles, director, language
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
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        watchlistCount={watchlistCount}
        watchedCount={watchedCount}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAutoImport={() => setIsAutoImportOpen(true)}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        {activeTab === 'home' && (
          <HomeView
            movies={displayedMovies}
            watchlistCount={watchlistCount}
            watchedCount={watchedCount}
            lastWatchedMovie={lastWatchedMovie}
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

        {activeTab === 'watched' && (
          <WatchedView
            movies={movies.filter(m => m.isWatched)}
            onSelectMovie={(m) => setSelectedMovie(m)}
            onToggleWatchlist={handleToggleWatchlist}
            onToggleWatched={handleToggleWatched}
            onRate={handleRate}
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
        />
      )}

      {/* Video Trailer Modal */}
      {activeTrailerId && (
        <TrailerModal
          youtubeId={activeTrailerId}
          onClose={() => setActiveTrailerId(null)}
        />
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onGuestAccess={() => {
          setIsAuthOpen(false);
        }}
      />

      {/* Auto-Import & Scraper Modal */}
      <AddMovieAutoImportModal
        isOpen={isAutoImportOpen}
        onClose={() => setIsAutoImportOpen(false)}
        onAddMovie={handleAddMovie}
      />

    </div>
  );
};
