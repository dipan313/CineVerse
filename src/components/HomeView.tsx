import React, { useState, useMemo } from 'react';
import { Movie, IndustryCategory } from '../types/movie';
import { HeroCarousel } from './HeroCarousel';
import { MovieCard } from './MovieCard';
import { RecommendationsSection } from './RecommendationsSection';
import { Eye, Film, Star, Globe2, Sparkles, Zap, Flame, Shield, Compass } from 'lucide-react';

interface HomeViewProps {
  movies: Movie[];
  watchlistCount: number;
  watchedCount: number;
  lastWatchedMovie?: Movie;
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
    if (selectedIndustry === 'all') return movies;
    return movies.filter(m => m.industry === selectedIndustry);
  }, [movies, selectedIndustry]);

  // Compute stats
  const ratedMovies = movies.filter(m => m.userRating);
  const avgRating = ratedMovies.length
    ? (ratedMovies.reduce((acc, curr) => acc + (curr.userRating || 0), 0) / ratedMovies.length).toFixed(1)
    : '19.4';

  return (
    <div className="space-y-10 pb-16">
      
      {/* 1. Hero Carousel */}
      <HeroCarousel
        movies={movies}
        onSelectMovie={onSelectMovie}
        onToggleWatchlist={onToggleWatchlist}
      />

      {/* 2. Intelligent Movie Recommender */}
      <RecommendationsSection
        lastWatchedMovie={lastWatchedMovie}
        allMovies={movies}
        onSelectMovie={onSelectMovie}
        onToggleWatchlist={onToggleWatchlist}
        onToggleWatched={onToggleWatched}
        onRate={onRate}
      />

      {/* 3. Personal Statistics Bar */}
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

      {/* 4. Multi-Industry Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-heading font-extrabold text-2xl text-white tracking-tight flex items-center gap-2">
              <Compass className="w-6 h-6 text-red-500" />
              <span>Global Cinema Catalog</span>
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

        {/* 5. Movie Cards Grid */}
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
      </div>

    </div>
  );
};
