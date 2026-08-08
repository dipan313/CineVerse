import React from 'react';
import { Movie } from '../types/movie';
import { Info, Check, Plus, Trash2, Star, Eye } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
  onSelect: (m: Movie) => void;
  onToggleWatchlist: (m: Movie) => void;
  onToggleWatched: (m: Movie) => void;
  onRate: (m: Movie, rating: number) => void;
  onDelete?: (m: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onSelect,
  onToggleWatchlist,
  onToggleWatched,
  onRate,
  onDelete
}) => {
  return (
    <div className="group relative rounded-2xl bg-[#10121a] border border-white/5 overflow-hidden flex flex-col justify-between hover:border-red-500/40 transition-all duration-300 shadow-lg hover:-translate-y-1">
      
      {/* Poster Image Container */}
      <div 
        onClick={() => onSelect(movie)}
        className="relative w-full h-[320px] overflow-hidden cursor-pointer bg-slate-900"
      >
        <img
          src={movie.poster}
          alt={movie.title}
          onError={(e) => {
            if (movie.backdrop && e.currentTarget.src !== movie.backdrop) {
              e.currentTarget.src = movie.backdrop;
            }
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Badges (Language & Film/Series) */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-red-600/90 text-white shadow-md">
            {movie.type === 'series' ? 'SERIES' : 'FILM'}
          </span>

          {movie.language && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900/90 text-slate-200 border border-white/10 shadow-md flex items-center gap-1">
              <span>{movie.flag || '🌐'}</span>
              <span>{movie.language}</span>
            </span>
          )}
        </div>

        {/* Watched Status Top Left Indicator */}
        {movie.isWatched && (
          <div className="absolute top-3 left-32 z-10">
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-600 text-white shadow-lg flex items-center gap-1">
              <Check className="w-3 h-3" />
              <span>WATCHED</span>
            </span>
          </div>
        )}

        {/* Info Button Top Right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(movie);
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform z-10"
          title="View Full Details"
        >
          <Info className="w-4 h-4" />
        </button>

        {/* Backdrop Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#10121a] via-transparent to-transparent opacity-85" />

        {/* Bottom Poster Info Overlay */}
        <div className="absolute bottom-3 left-3 right-3 z-10">
          <div className="flex items-center justify-between text-xs text-slate-300 font-semibold mb-1">
            <span className="font-mono">{movie.year}</span>
            <span className="px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[10px] text-slate-400">
              {movie.pgRating || 'PG-13'}
            </span>
          </div>

          <h3 className="font-heading font-extrabold text-sm text-white line-clamp-1 group-hover:text-red-400 transition-colors">
            {movie.title}
          </h3>

          {movie.originalTitle && movie.originalTitle !== movie.title && (
            <p className="text-[11px] text-red-300/90 font-medium line-clamp-1 italic">
              {movie.originalTitle}
            </p>
          )}
        </div>
      </div>

      {/* Card Footer & Action Buttons */}
      <div className="p-4 space-y-3 bg-[#10121a]">
        
        {/* Ratings & Score Row */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 font-bold text-amber-400">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{movie.userRating || 20}/20</span>
          </div>

          <div className="text-[11px] text-slate-400">
            IMDb <span className="font-bold text-slate-200">{movie.imdbRating}</span>
          </div>
        </div>

        {/* Quick Actions (Watchlist / Watched / Delete) */}
        <div className="flex items-center gap-2 pt-1 border-t border-white/5">
          
          {/* Watchlist Toggle */}
          <button
            onClick={() => onToggleWatchlist(movie)}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
              movie.isWatchlist
                ? 'bg-red-600/20 text-red-400 border border-red-500/30'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/5 hover:text-white'
            }`}
            title={movie.isWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
          >
            {movie.isWatchlist ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            <span>Watchlist</span>
          </button>

          {/* Mark as Watched Toggle Button */}
          <button
            onClick={() => onToggleWatched(movie)}
            className={`py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all active:scale-95 ${
              movie.isWatched
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-400/40'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-emerald-400 border border-white/5'
            }`}
            title={movie.isWatched ? 'Marked as Watched' : 'Click to Mark as Watched'}
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span className="hidden sm:inline">{movie.isWatched ? 'Watched' : 'Watch'}</span>
          </button>

          {/* Delete Action */}
          {onDelete && (
            <button
              onClick={() => onDelete(movie)}
              className="py-1.5 px-2.5 rounded-xl bg-slate-900 hover:bg-red-600/20 text-slate-400 hover:text-red-400 border border-white/5 transition-colors active:scale-95"
              title="Remove"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
