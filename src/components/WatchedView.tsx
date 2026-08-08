import React, { useState } from 'react';
import { Movie } from '../types/movie';
import { MovieCard } from './MovieCard';
import { Eye, Search, SlidersHorizontal } from 'lucide-react';

interface WatchedViewProps {
  movies: Movie[];
  onSelectMovie: (m: Movie) => void;
  onToggleWatchlist: (m: Movie) => void;
  onToggleWatched: (m: Movie) => void;
  onRate: (m: Movie, rating: number) => void;
}

export const WatchedView: React.FC<WatchedViewProps> = ({
  movies,
  onSelectMovie,
  onToggleWatchlist,
  onToggleWatched,
  onRate
}) => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'date' | 'year'>('rating');

  const watchedMovies = movies.filter(m => m.isWatched);

  let filtered = watchedMovies.filter(m => {
    if (search.trim() && !m.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  filtered.sort((a, b) => {
    if (sortBy === 'rating') return (b.userRating || 0) - (a.userRating || 0);
    if (sortBy === 'year') return b.year - a.year;
    return (b.dateAdded || '').localeCompare(a.dateAdded || '');
  });

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white">Watched Archive</h1>
          <p className="text-xs text-slate-400 mt-1">Verified films and personal score history out of 20</p>
        </div>
      </div>

      {/* Search & Sort Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search watched titles..."
            className="w-full bg-[#10121a] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
          />
        </div>

        <div className="flex items-center gap-2 self-end">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#10121a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="rating">Score (Highest First) ↓</option>
            <option value="year">Release Year ↓</option>
            <option value="date">Date Watched ↓</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {filtered.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onSelect={onSelectMovie}
              onToggleWatchlist={onToggleWatchlist}
              onToggleWatched={onToggleWatched}
              onRate={onRate}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-3 bg-[#10121a]/50 rounded-3xl border border-white/5">
          <Eye className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="font-heading font-bold text-lg text-white">No Watched Movies Yet</h3>
          <p className="text-xs text-slate-400">Mark movies as watched to track your personal ratings.</p>
        </div>
      )}

    </div>
  );
};
