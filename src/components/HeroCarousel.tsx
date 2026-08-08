import React, { useState, useEffect } from 'react';
import { Movie } from '../types/movie';
import { Star, ChevronRight, Play, Plus, Check, Award, Sparkles } from 'lucide-react';

interface HeroCarouselProps {
  movies: Movie[];
  onSelectMovie: (m: Movie) => void;
  onToggleWatchlist?: (m: Movie) => void;
  onWatchTrailer?: (youtubeId: string) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  movies,
  onSelectMovie,
  onToggleWatchlist,
  onWatchTrailer
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);

  const heroMovies = movies.slice(0, 6);
  const activeMovie = heroMovies[currentIdx] || heroMovies[0];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx(prev => (prev + 1) % heroMovies.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [heroMovies.length]);

  if (!activeMovie) return null;

  return (
    <div className="relative w-full h-[460px] sm:h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group bg-slate-950">
      
      {/* High-Res Movie Backdrop Image with dynamic transition */}
      <img
        key={activeMovie.id}
        src={activeMovie.backdrop}
        alt={activeMovie.title}
        className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105 animate-in fade-in duration-700"
      />

      {/* Cinematic Vignette & Radial Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/75 to-transparent" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-black/40 to-transparent" />

      {/* Hero Meta Content */}
      <div className="absolute bottom-10 left-8 sm:left-12 max-w-2xl space-y-3 z-10">
        
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-black uppercase tracking-widest text-red-400 bg-red-600/20 px-3 py-1 rounded-full border border-red-500/30 flex items-center gap-1.5 shadow-lg">
            <Sparkles className="w-3 h-3 text-red-400" />
            <span>FEATURED MASTERPIECE</span>
          </span>

          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-900/90 text-slate-200 border border-white/10 flex items-center gap-1.5">
            <span>{activeMovie.flag || '🌐'}</span>
            <span>{activeMovie.language}</span>
          </span>

          {activeMovie.director && (
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-black/50 text-slate-300 border border-white/5 hidden sm:inline-flex items-center gap-1">
              <Award className="w-3 h-3 text-amber-400" />
              <span>Dir: {activeMovie.director}</span>
            </span>
          )}
        </div>

        {/* Title & Native Script */}
        <div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-none drop-shadow-2xl">
            {activeMovie.title}
          </h1>

          {activeMovie.originalTitle && activeMovie.originalTitle !== activeMovie.title && (
            <p className="text-sm sm:text-base text-red-300 font-semibold italic mt-1.5 tracking-wide">
              {activeMovie.originalTitle}
            </p>
          )}
        </div>

        {/* Ratings & Meta Row */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-300">
          <span className="font-mono">{activeMovie.year}</span>
          <span>•</span>
          <div className="flex items-center gap-1 text-amber-400 font-bold">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{activeMovie.userRating || 20}/20</span>
          </div>
          <span>•</span>
          <span className="text-slate-400">IMDb {activeMovie.imdbRating}</span>
          <span>•</span>
          <span className="px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[10px] text-slate-300">
            {activeMovie.pgRating || 'PG-13'}
          </span>
          <span>•</span>
          <span>{activeMovie.genres.join(', ')}</span>
        </div>

        {/* Storyline */}
        <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed max-w-xl">
          {activeMovie.storyline}
        </p>

        {/* Interactive Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          
          <button
            onClick={() => onSelectMovie(activeMovie)}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs shadow-xl shadow-red-600/30 transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
          >
            <span>View Details</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          {activeMovie.trailerYoutubeId && onWatchTrailer && (
            <button
              onClick={() => onWatchTrailer(activeMovie.trailerYoutubeId!)}
              className="px-5 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white border border-white/10 font-bold text-xs shadow-lg transition-all flex items-center gap-2 hover:scale-105"
            >
              <Play className="w-3.5 h-3.5 text-red-500 fill-current" />
              <span>Watch Trailer</span>
            </button>
          )}

          {onToggleWatchlist && (
            <button
              onClick={() => onToggleWatchlist(activeMovie)}
              className={`p-3 rounded-2xl border transition-all ${
                activeMovie.isWatchlist
                  ? 'bg-red-600/20 border-red-500 text-red-400'
                  : 'bg-slate-900/90 hover:bg-slate-800 border-white/10 text-slate-300'
              }`}
              title={activeMovie.isWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
            >
              {activeMovie.isWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>
          )}

        </div>
      </div>

      {/* Carousel Dot Indicators */}
      <div className="absolute bottom-6 right-8 sm:right-12 flex items-center gap-2 z-10">
        {heroMovies.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIdx(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentIdx === idx ? 'w-8 bg-red-600 shadow-md shadow-red-600/50' : 'w-2 bg-white/30 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

    </div>
  );
};
