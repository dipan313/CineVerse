import React, { useState } from 'react';
import { Movie } from '../types/movie';
import { MovieCard } from './MovieCard';
import { Search, SlidersHorizontal, Film } from 'lucide-react';

interface WatchlistViewProps {
  movies: Movie[];
  onSelectMovie: (m: Movie) => void;
  onToggleWatchlist: (m: Movie) => void;
  onToggleWatched: (m: Movie) => void;
  onRate: (m: Movie, rating: number) => void;
  onDelete: (m: Movie) => void;
}

export const WatchlistView: React.FC<WatchlistViewProps> = ({
  movies,
  onSelectMovie,
  onToggleWatchlist,
  onToggleWatched,
  onRate,
  onDelete
}) => {
  const [filterType, setFilterType] = useState<'all' | 'movie' | 'series' | 'animated'>('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'rating' | 'year' | 'title'>('date');

  const watchlistMovies = movies.filter(m => m.isWatchlist);

  let filtered = watchlistMovies.filter(m => {
    if (filterType !== 'all' && m.type !== filterType) return false;
    if (search.trim() && !m.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  filtered.sort((a, b) => {
    if (sortBy === 'rating') return (b.userRating || b.rating) - (a.userRating || a.rating);
    if (sortBy === 'year') return b.year - a.year;
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return (b.dateAdded || '').localeCompare(a.dateAdded || '');
  });

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white">Watchlist</h1>
          <p className="text-xs text-slate-400 mt-1">Titles saved for future screening sessions</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          <div className="flex p-1 rounded-2xl bg-slate-900 border border-white/10 text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                filterType === 'all' ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({watchlistMovies.length})
            </button>
            <button
              onClick={() => setFilterType('movie')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                filterType === 'movie' ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Movies
            </button>
            <button
              onClick={() => setFilterType('series')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                filterType === 'series' ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Shows
            </button>
            <button
              onClick={() => setFilterType('animated')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                filterType === 'animated' ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Animated
            </button>
          </div>
        </div>
      </div>

      {/* Search & Sort Controls Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search titles..."
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
            <option value="date">Date Added ↓</option>
            <option value="rating">Rating (High to Low)</option>
            <option value="year">Release Year ↓</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Grid Display */}
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
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-3 bg-[#10121a]/50 rounded-3xl border border-white/5">
          <Film className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="font-heading font-bold text-lg text-white">Your Watchlist is Empty</h3>
          <p className="text-xs text-slate-400">Add movies from Home or Search to build your watch queue.</p>
        </div>
      )}

    </div>
  );
};
