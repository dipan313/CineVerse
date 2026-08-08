import React, { useState } from 'react';
import { Movie } from '../types/movie';
import { ArrowLeft, Play, ExternalLink, Check, Plus, Star } from 'lucide-react';

interface MovieDetailsModalProps {
  movie: Movie | null;
  onClose: () => void;
  onWatchTrailer: (youtubeId: string) => void;
  onToggleWatchlist: (m: Movie) => void;
  onToggleWatched: (m: Movie) => void;
  onRate?: (m: Movie, rating: number) => void;
}

export const MovieDetailsModal: React.FC<MovieDetailsModalProps> = ({
  movie,
  onClose,
  onWatchTrailer,
  onToggleWatchlist,
  onToggleWatched,
  onRate
}) => {
  const [activeSubtab, setActiveSubtab] = useState<'where-to-watch' | 'details'>('where-to-watch');

  if (!movie) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#07080d]/95 backdrop-blur-2xl p-4 sm:p-8 animate-in fade-in duration-200">
      <div className="max-w-5xl mx-auto space-y-8 pb-16">
        
        {/* Back Button */}
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-xl bg-slate-900/90 border border-white/10 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-2 transition-colors active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Hero Backdrop Banner */}
        <div className="relative rounded-3xl overflow-hidden h-[340px] sm:h-[420px] shadow-2xl border border-white/10">
          <img
            src={movie.backdrop}
            alt={movie.title}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07080d] via-[#07080d]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07080d] via-transparent to-transparent" />

          {/* Banner Details Overlay */}
          <div className="absolute bottom-6 left-6 sm:left-10 flex gap-6 items-end">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-28 sm:w-36 rounded-2xl shadow-2xl border border-white/20 hidden sm:block shrink-0"
            />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-red-600 text-white">
                  {movie.type === 'series' ? 'SERIES' : 'FILM'}
                </span>
                {movie.isWatched && (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-600 text-white flex items-center gap-1 shadow-lg">
                    <Check className="w-3 h-3" />
                    <span>WATCHED</span>
                  </span>
                )}
              </div>

              <h1 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight leading-none drop-shadow-md">
                {movie.title}
              </h1>

              {movie.originalTitle && movie.originalTitle !== movie.title && (
                <p className="text-sm sm:text-base text-red-300 font-semibold italic">
                  {movie.originalTitle}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 pt-1 font-semibold">
                <span className="font-mono">{movie.year}</span>
                <span>•</span>
                <span className="px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[10px]">
                  {movie.pgRating || 'PG-13'}
                </span>
                <span>•</span>
                <span>{movie.duration}</span>
                <span>•</span>
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{movie.userRating || 20}/20</span>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                
                {/* Mark Watched Toggle Button */}
                <button
                  onClick={() => onToggleWatched(movie)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
                    movie.isWatched
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/40 ring-2 ring-emerald-400/50'
                      : 'bg-slate-900 border border-white/10 text-slate-300 hover:text-emerald-400'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>{movie.isWatched ? 'Watched' : 'Mark as Watched'}</span>
                </button>

                {/* Watchlist Toggle Button */}
                <button
                  onClick={() => onToggleWatchlist(movie)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
                    movie.isWatchlist
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                      : 'bg-slate-900 border border-white/10 text-slate-300 hover:text-white'
                  }`}
                >
                  {movie.isWatchlist ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>{movie.isWatchlist ? 'In Watchlist' : 'Add to Watchlist'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar (Watch Trailer / View on IMDb) */}
        <div className="flex flex-wrap items-center gap-3">
          {movie.trailerYoutubeId && (
            <button
              onClick={() => onWatchTrailer(movie.trailerYoutubeId!)}
              className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs shadow-xl shadow-red-600/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Watch Trailer</span>
            </button>
          )}

          <a
            href={`https://www.imdb.com/title/${movie.imdbId}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-white font-bold text-xs flex items-center gap-2 transition-all active:scale-95"
          >
            <span>View on IMDb</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* Interactive 1-20 Rating Widget */}
          {onRate && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 border border-white/10 text-xs">
              <span className="font-bold text-slate-400">Your Score:</span>
              <select
                value={movie.userRating || 20}
                onChange={(e) => onRate(movie, parseInt(e.target.value))}
                className="bg-transparent text-amber-400 font-extrabold focus:outline-none cursor-pointer"
              >
                {Array.from({ length: 20 }, (_, i) => 20 - i).map(num => (
                  <option key={num} value={num} className="bg-slate-900 text-white">
                    {num}/20 ★
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Subtabs Bar */}
        <div className="border-b border-white/10 flex gap-6 text-sm font-bold">
          <button
            onClick={() => setActiveSubtab('where-to-watch')}
            className={`pb-3 transition-colors border-b-2 ${
              activeSubtab === 'where-to-watch'
                ? 'border-red-600 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Where to Watch
          </button>
          <button
            onClick={() => setActiveSubtab('details')}
            className={`pb-3 transition-colors border-b-2 ${
              activeSubtab === 'details'
                ? 'border-red-600 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Details
          </button>
        </div>

        {/* Subtab 1: Where to Watch */}
        {activeSubtab === 'where-to-watch' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(movie.streamingProviders || []).map((provider, idx) => (
              <a
                key={idx}
                href={provider.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl bg-[#10121a] border border-white/5 hover:border-red-500/40 flex items-center justify-between transition-all group"
              >
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/30 uppercase">
                    {provider.type}
                  </span>
                  <div className="font-heading font-extrabold text-base text-white mt-2 group-hover:text-red-400 transition-colors">
                    {provider.name}
                  </div>
                  {provider.price && (
                    <div className="text-xs text-slate-400 font-mono mt-0.5">{provider.price}</div>
                  )}
                </div>
                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
              </a>
            ))}
          </div>
        )}

        {/* Subtab 2: Details */}
        {activeSubtab === 'details' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#10121a] p-6 rounded-3xl border border-white/5">
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase">Director</h4>
                <p className="text-sm font-semibold text-white mt-0.5">{movie.director || 'Acclaimed Director'}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase">Starring</h4>
                <p className="text-sm text-slate-300 mt-0.5">{(movie.stars || []).join(', ')}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase">Box Office</h4>
                <p className="text-sm font-semibold text-emerald-400 mt-0.5">{movie.boxOffice || 'N/A'}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase">Genres</h4>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {(movie.genres || []).map((g, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-white/10 text-xs text-slate-300 font-medium">
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase">Storyline</h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-1">{movie.storyline}</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
