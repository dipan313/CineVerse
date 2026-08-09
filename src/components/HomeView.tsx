import React, { useState, useMemo } from 'react';
import { Movie, IndustryCategory } from '../types/movie';
import { HeroCarousel } from './HeroCarousel';
import { MovieCard } from './MovieCard';
import { RecommendationsSection } from './RecommendationsSection';
import { Eye, Film, Star, Globe2, Sparkles, Zap, Flame, Shield, Compass, Search, X } from 'lucide-react';

interface HomeViewProps {
  movies: Movie[];
  watchlistCount: number;
  watchedCount: number;
  lastWatchedMovie?: Movie;
  searchQuery?: string;
  onClearSearch?: () => void;
  onSelectMovie: (m: Movie) => void;
  onToggleWatchlist: (m: Movie) => void;
  onToggleWatched: (m: Movie) => void;
  onRate: (m: Movie, rating: number) => void;
  onShareMovie: (m: Movie) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  movies,
  watchlistCount,
  watchedCount,
  lastWatchedMovie,
  searchQuery = '',
  onClearSearch,
  onSelectMovie,
  onToggleWatchlist,
  onToggleWatched,
  onRate,
  onShareMovie
}) => {
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryCategory>('all');

  const industryPills: Array<{ id: IndustryCategory; label: string; icon: string }> = [
    { id: 'all', label: 'All Cinema', icon: '🌐' },
    { id: 'mcu-dc', label: 'Marvel & DC Sagas', icon: '🦸‍♂️' },
    { id: 'hollywood', label: 'Hollywood Icons', icon: '🎬' },
    { id: 'bollywood', label: 'Bollywood (Hindi)', icon: '🇮🇳' },
    { id: 'tollywood', label: 'Tollywood / South', icon: '🔥' },
    { id: 'bengali', label: 'Bengali (বাংলা)', icon: '🌿' },
    { id: 'international', label: 'International', icon: '🌍' },
  ];

  const filteredMovies = useMemo(() => {
    if (searchQuery.trim()) {
      // If user typed a search query, show all matching search results regardless of category
      if (selectedIndustry === 'all') return movies;
      return movies.filter(m => m.industry === selectedIndustry);
    }
    if (selectedIndustry === 'all') return movies;
    return movies.filter(m => m.industry === selectedIndustry);
  }, [movies, selectedIndustry, searchQuery]);

  // Compute stats
  const ratedMovies = movies.filter(m => m.userRating);
  const avgRating = ratedMovies.length
    ? (ratedMovies.reduce((acc, curr) => acc + (curr.userRating || 0), 0) / ratedMovies.length).toFixed(1)
    : '19.4';

  return (
    <div className="space-y-10 pb-16">
      
      {/* 1. Hero Carousel (hidden during active search to give maximum space to search results) */}
      {!searchQuery.trim() && (
        <HeroCarousel
          movies={movies}
          onSelectMovie={onSelectMovie}
          onToggleWatchlist={onToggleWatchlist}
        />
      )}

      {/* 2. Intelligent Movie Recommender (hidden during active search) */}
      {!searchQuery.trim() && (
        <RecommendationsSection
          lastWatchedMovie={lastWatchedMovie}
          allMovies={movies}
          onSelectMovie={onSelectMovie}
          onToggleWatchlist={onToggleWatchlist}
          onToggleWatched={onToggleWatched}
          onRate={onRate}
        />
      )}

      {/* 3. Personal Statistics Bar (hidden during active search) */}
      {!searchQuery.trim() && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-red-600/10 to-transparent border border-red-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-red-600/20 text-red-500">
                <Film className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Watched Titles</div>
                <div className="text-xl font-heading font-extrabold text-white">{watchedCount}</div>
              </div>
            </div>
            <div className="text-[10px] text-red-400/80 font-mono font-bold">4K REGISTRY</div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">In Watchlist</div>
                <div className="text-xl font-heading font-extrabold text-white">{watchlistCount}</div>
              </div>
            </div>
            <div className="text-[10px] text-amber-400/80 font-mono font-bold">QUEUED</div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-transparent border border-cyan-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Average Score</div>
                <div className="text-xl font-heading font-extrabold text-white">{avgRating}/20</div>
              </div>
            </div>
            <div className="text-[10px] text-cyan-400/80 font-mono font-bold">MASTER SCALE</div>
          </div>
        </div>
      )}

      {/* 4. Active Search Result Notification Banner */}
      {searchQuery.trim() && (
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-600/30 text-red-400">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-black text-sm text-white">
                Search Results for "{searchQuery}"
              </h3>
              <p className="text-xs text-slate-400">
                Showing {filteredMovies.length} matching {filteredMovies.length === 1 ? 'title' : 'titles'} across global cinema
              </p>
            </div>
          </div>

          {onClearSearch && (
            <button
              onClick={onClearSearch}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Search</span>
            </button>
          )}
        </div>
      )}

      {/* 5. Multi-Industry Filter Bar & Catalog */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-heading font-extrabold text-2xl text-white tracking-tight flex items-center gap-2">
              <Compass className="w-6 h-6 text-red-500" />
              <span>{searchQuery.trim() ? 'Matched Titles' : 'Global Cinema Catalog'}</span>
            </h2>
            <p className="text-xs text-slate-400">
              Hollywood • Marvel & DC • Bollywood • Tollywood • Bengali • International
            </p>
          </div>

          {/* Industry Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
            {industryPills.map(ind => (
              <button
                key={ind.id}
                onClick={() => setSelectedIndustry(ind.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
                  selectedIndustry === ind.id
                    ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-600/30'
                    : 'bg-[#121626] text-slate-300 border-white/10 hover:border-white/20'
                }`}
              >
                <span>{ind.icon}</span>
                <span>{ind.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 6. Movie Cards Grid */}
        {filteredMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredMovies.map(movie => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onSelect={onSelectMovie}
                onToggleWatchlist={onToggleWatchlist}
                onToggleWatched={onToggleWatched}
                onRate={onRate}
                onShare={onShareMovie}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center space-y-3 bg-[#10121a]/50 rounded-3xl border border-white/5">
            <Search className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="font-heading font-bold text-lg text-white">No Movies Found Matching "{searchQuery}"</h3>
            <p className="text-xs text-slate-400">Try searching for Marvel, DC, Nolan, Satyajit Ray, RRR, or clear your search.</p>
            {onClearSearch && (
              <button
                onClick={onClearSearch}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md inline-block mt-2"
              >
                Show All Movies
              </button>
            )}
          </div>
        )}
      </div>

    </div>
  );
};
