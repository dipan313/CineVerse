import React, { useState, useEffect } from 'react';
import { Movie } from '../types/movie';
import { 
  X, 
  Play, 
  Bookmark, 
  Check, 
  Star, 
  Tv, 
  Share2, 
  ExternalLink, 
  Clock, 
  Calendar, 
  Shield, 
  DollarSign, 
  Sparkles,
  Zap,
  ArrowLeft,
  ChevronLeft
} from 'lucide-react';

interface MovieDetailsModalProps {
  movie: Movie;
  onClose: () => void;
  onToggleWatchlist: (m: Movie) => void;
  onToggleWatched: (m: Movie) => void;
  onRate: (m: Movie, rating: number) => void;
  onWatchTrailer: (trailerId: string) => void;
  onShareMovie?: (m: Movie) => void;
}

export const MovieDetailsModal: React.FC<MovieDetailsModalProps> = ({
  movie,
  onClose,
  onToggleWatchlist,
  onToggleWatched,
  onRate,
  onWatchTrailer,
  onShareMovie
}) => {
  const [selectedScore, setSelectedScore] = useState<number>(movie.userRating || 19);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-2xl p-2 sm:p-4 md:p-6 flex flex-col items-center justify-start sm:justify-center animate-in fade-in duration-200 select-none"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl max-h-[92vh] rounded-2xl sm:rounded-3xl bg-[#0e111a] border border-white/15 shadow-2xl overflow-hidden flex flex-col my-auto relative"
      >
        
        {/* Sticky Top Navigation & Back Header (ALWAYS VISIBLE & ACCESSIBLE) */}
        <div className="sticky top-0 z-40 bg-[#0e111a]/95 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between shrink-0 shadow-md">
          
          {/* Back Button */}
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-red-600/30 text-white border border-white/15 hover:border-red-500/40 transition-all flex items-center gap-2 group font-bold text-xs shadow"
            title="Return to previous page (Esc)"
          >
            <ArrowLeft className="w-4 h-4 text-red-400 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Movies</span>
          </button>

          {/* Center Compact Title */}
          <div className="hidden sm:block text-center min-w-0 max-w-md px-2">
            <h4 className="font-heading font-black text-xs text-white truncate">
              {movie.title}
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">
              {movie.year} • {movie.industry?.toUpperCase()}
            </span>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-white/5 hover:bg-red-600 text-slate-300 hover:text-white border border-white/10 transition-all flex items-center gap-1.5 text-xs font-bold"
            title="Close modal (Esc)"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Close</span>
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto flex-1">
          
          {/* Hero Backdrop Banner */}
          <div className="relative h-48 sm:h-72 w-full overflow-hidden bg-slate-900 shrink-0">
            <img
              src={movie.backdrop || movie.poster}
              alt={movie.title}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = movie.poster;
              }}
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e111a] via-[#0e111a]/50 to-black/40" />

            {/* Floating Action Controls on Backdrop */}
            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 flex flex-wrap items-end justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {movie.trailerYoutubeId && (
                  <button
                    onClick={() => onWatchTrailer(movie.trailerYoutubeId!)}
                    className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs shadow-xl shadow-red-600/40 flex items-center gap-2 transition-transform hover:scale-105"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Watch Official Trailer</span>
                  </button>
                )}

                {onShareMovie && (
                  <button
                    onClick={() => onShareMovie(movie)}
                    className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-white/10 hover:bg-cyan-600 text-white font-bold text-xs border border-white/15 backdrop-blur-md flex items-center gap-2 transition-all"
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="hidden xs:inline">Share with Friends</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleWatchlist(movie)}
                  className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    movie.isWatchlist
                      ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                  <span>{movie.isWatchlist ? 'In Watchlist' : 'Add to Watchlist'}</span>
                </button>

                <button
                  onClick={() => onToggleWatched(movie)}
                  className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    movie.isWatched
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>{movie.isWatched ? 'Watched' : 'Mark Watched'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Modal Body Info */}
          <div className="p-4 sm:p-8 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
              
              {/* Left Poster */}
              <div className="md:col-span-4 hidden md:block">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://image.tmdb.org/t/p/w500/bOGkgRGdhrBYJSLpXaxhXVstNsV.jpg';
                  }}
                  className="w-full rounded-2xl shadow-2xl border border-white/10 object-cover"
                />
              </div>

              {/* Right Details */}
              <div className="md:col-span-8 space-y-5">
                
                {/* Header Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-lg bg-red-600 text-white">
                    {movie.industry.toUpperCase()}
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300">
                    {movie.year}
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300">
                    {movie.duration || '2h 15m'}
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400">
                    ⭐ {movie.imdbRating} IMDB
                  </span>
                  {movie.phaseOrUniverse && (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-300">
                      {movie.phaseOrUniverse}
                    </span>
                  )}
                </div>

                {/* Title & Tagline */}
                <div>
                  <h2 className="font-heading font-black text-2xl sm:text-3xl text-white">
                    {movie.title}
                  </h2>
                  {movie.originalTitle && movie.originalTitle !== movie.title && (
                    <p className="text-sm text-red-400 font-medium italic mt-0.5">
                      {movie.originalTitle}
                    </p>
                  )}
                </div>

                {/* Storyline */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {movie.storyline}
                </p>

                {/* Director & Cast */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Director</span>
                    <span className="text-white font-semibold">{movie.director || 'Visionary Filmmaker'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Box Office</span>
                    <span className="text-amber-400 font-bold">{movie.boxOffice || '$500M+'}</span>
                  </div>
                  {movie.stars && (
                    <div className="col-span-2">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Starring Cast</span>
                      <span className="text-slate-300">{movie.stars.join(', ')}</span>
                    </div>
                  )}
                </div>

                {/* 1-20 Rating Scale Selector */}
                <div className="space-y-2 p-4 rounded-2xl bg-gradient-to-r from-red-600/10 to-amber-500/10 border border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span>Rate Film (1–20 Epic Scale):</span>
                    </span>
                    <span className="font-mono font-black text-base text-amber-400">
                      {selectedScore}/20
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={selectedScore}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setSelectedScore(val);
                        onRate(movie, val);
                      }}
                      className="w-full accent-red-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Streaming Providers */}
                {movie.streamingProviders && movie.streamingProviders.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Available to Stream / Watch:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {movie.streamingProviders.map((prov, i) => (
                        <a
                          key={i}
                          href={prov.url || '#'}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white flex items-center gap-2 transition-colors"
                        >
                          <Tv className="w-3.5 h-3.5 text-red-400" />
                          <span>{prov.name} ({prov.type})</span>
                          <ExternalLink className="w-3 h-3 text-slate-500" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

              </div>

            </div>

          </div>

          {/* Bottom Footer Back Button */}
          <div className="p-4 sm:p-6 border-t border-white/10 bg-[#0b0d16] flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 font-bold text-xs transition-all flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4 text-slate-400" />
              <span>Back to Catalog</span>
            </button>

            <span className="text-[10px] font-mono text-slate-500">
              CineVerse Theatrical Registry
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
