import React, { useState } from 'react';
import { Movie } from '../types/movie';
import { MovieCard } from './MovieCard';
import { Zap, Shield, Flame, Calendar, Clock, Film, Trophy, Layers } from 'lucide-react';

interface UniverseTimelineViewProps {
  movies: Movie[];
  onSelectMovie: (m: Movie) => void;
  onToggleWatchlist: (m: Movie) => void;
  onToggleWatched: (m: Movie) => void;
  onRate: (m: Movie, rating: number) => void;
  onShareMovie: (m: Movie) => void;
}

export const UniverseTimelineView: React.FC<UniverseTimelineViewProps> = ({
  movies,
  onSelectMovie,
  onToggleWatchlist,
  onToggleWatched,
  onRate,
  onShareMovie
}) => {
  const [universeFilter, setUniverseFilter] = useState<'all' | 'mcu' | 'dc'>('all');
  const [orderMode, setOrderMode] = useState<'release' | 'chronological'>('release');

  const superheroMovies = movies.filter(m => m.industry === 'mcu-dc');

  const filteredMovies = superheroMovies.filter(m => {
    if (universeFilter === 'mcu') return m.languageCode === 'marvel' || m.franchiseId?.includes('marvel');
    if (universeFilter === 'dc') return m.languageCode === 'dc' || m.franchiseId?.includes('dark-knight') || m.franchiseId?.includes('dc');
    return true;
  });

  const sortedMovies = [...filteredMovies].sort((a, b) => {
    if (orderMode === 'chronological') {
      return (a.chronologicalOrderIndex || a.year) - (b.chronologicalOrderIndex || b.year);
    }
    return (a.releaseOrderIndex || a.year) - (b.releaseOrderIndex || b.year);
  });

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#17081f] via-[#100c24] to-[#0a0f26] border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-bold">
              <Zap className="w-3.5 h-3.5" />
              <span>MCU Phases 1–6 & DC Universe Timelines</span>
            </div>
            <h2 className="font-heading font-black text-3xl text-white tracking-tight">
              Superhero Chronology & Saga Registry
            </h2>
            <p className="text-xs text-slate-400 max-w-xl">
              Explore the complete Marvel Cinematic Universe and DC saga timeline in either official theatrical release order or in-universe chronological story order.
            </p>
          </div>

          {/* Controls: Filter & Order Mode */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            
            {/* Universe Filter */}
            <div className="flex p-1 rounded-2xl bg-black/60 border border-white/10">
              <button
                onClick={() => setUniverseFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  universeFilter === 'all' ? 'bg-red-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                All Sagas
              </button>
              <button
                onClick={() => setUniverseFilter('mcu')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  universeFilter === 'mcu' ? 'bg-red-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Marvel MCU
              </button>
              <button
                onClick={() => setUniverseFilter('dc')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  universeFilter === 'dc' ? 'bg-amber-500 text-black shadow font-extrabold' : 'text-slate-400 hover:text-white'
                }`}
              >
                DC Universe
              </button>
            </div>

            {/* Order Toggle */}
            <div className="flex p-1 rounded-2xl bg-black/60 border border-white/10">
              <button
                onClick={() => setOrderMode('release')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  orderMode === 'release' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Release Order</span>
              </button>
              <button
                onClick={() => setOrderMode('chronological')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  orderMode === 'chronological' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Story Timeline</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Movies Grid with Timeline Sequence Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {sortedMovies.map((movie, index) => (
          <div key={movie.id} className="relative group">
            
            {/* Timeline Order Badge */}
            <div className="absolute -top-2.5 -left-2.5 z-20 w-8 h-8 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 text-white font-black text-xs flex items-center justify-center shadow-xl shadow-red-600/30 border border-white/20">
              #{index + 1}
            </div>

            <MovieCard
              movie={movie}
              onSelect={onSelectMovie}
              onToggleWatchlist={onToggleWatchlist}
              onToggleWatched={onToggleWatched}
              onRate={onRate}
            />

            {/* Phase / Universe Tag below card */}
            {movie.phaseOrUniverse && (
              <div className="mt-1.5 px-2 py-1 rounded-xl bg-white/[0.04] border border-white/5 text-[10px] font-semibold text-slate-300 truncate text-center">
                {movie.phaseOrUniverse}
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};
