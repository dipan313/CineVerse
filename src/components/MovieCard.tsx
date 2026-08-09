import React from 'react';
import { Movie } from '../types/movie';
import { Info, Check, Bookmark, Plus, Star, Share2 } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
  onSelect: (m: Movie) => void;
  onToggleWatchlist: (m: Movie) => void;
  onToggleWatched: (m: Movie) => void;
  onRate: (m: Movie, rating: number) => void;
  onShare?: (m: Movie) => void;
  onDelete?: (m: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onSelect,
  onToggleWatchlist,
  onToggleWatched,
  onRate,
  onShare,
  onDelete
}) => {
  return (
    <div className="group relative rounded-2xl bg-[#10121a] border border-white/5 overflow-hidden flex flex-col justify-between hover:border-red-500/40 transition-all duration-300 shadow-xl hover:-translate-y-1">
      
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

        {/* Top Badges (Industry & Film Type) */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-red-600/90 text-white shadow-md">
            {movie.industry === 'mcu-dc' ? 'HERO SAGA' : movie.industry.toUpperCase()}
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
          <div className="absolute top-10 left-3 z-10">
            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-emerald-600 text-white shadow-lg flex items-center gap-1">
              <Check className="w-3 h-3" />
              <span>WATCHED</span>
            </span>
          </div>
        )}

        {/* Top Right Action Tools */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(movie);
            }}
            className="w-7 h-7 rounded-full bg-black/70 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-transform"
            title="View Full Details"
          >
            <Info className="w-3.5 h-3.5" />
          </button>

          {onShare && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShare(movie);
              }}
              className="w-7 h-7 rounded-full bg-black/70 hover:bg-cyan-600 text-white flex items-center justify-center shadow-lg transition-transform"
              title="Share with Friend"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Backdrop Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#10121a] via-transparent to-transparent opacity-90" />

        {/* Bottom Poster Info Overlay */}
        <div className="absolute bottom-3 left-3 right-3 z-10">
          <div className="flex items-center justify-between text-xs text-slate-300 font-semibold mb-1">
            <span className="font-mono">{movie.year}</span>
            <span className="px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[10px] text-amber-400 font-bold">
              ⭐ {movie.imdbRating}
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

      {/* Card Action Footer */}
      <div className="p-3 bg-[#0d0f17] border-t border-white/5 flex items-center justify-between gap-2">
        <button
          onClick={() => onToggleWatchlist(movie)}
          className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            movie.isWatchlist
              ? 'bg-amber-500 text-black shadow-md'
              : 'bg-white/5 hover:bg-white/10 text-slate-300'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>{movie.isWatchlist ? 'In List' : 'Watchlist'}</span>
        </button>

        <button
          onClick={() => onToggleWatched(movie)}
          className={`p-1.5 rounded-xl border transition-all ${
            movie.isWatched
              ? 'bg-emerald-600/20 border-emerald-500/50 text-emerald-400'
              : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
          }`}
          title={movie.isWatched ? 'Marked as Watched' : 'Mark as Watched'}
        >
          <Check className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
