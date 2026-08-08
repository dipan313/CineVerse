import React from 'react';
import { Movie } from '../types/movie';
import { recommenderEngine, RecommendedMovie } from '../services/recommenderEngine';
import { Sparkles, Compass, Star, Plus, Check, Play, Film, ArrowRight } from 'lucide-react';

interface RecommendationsSectionProps {
  lastWatchedMovie: Movie | undefined;
  allMovies: Movie[];
  onSelectMovie: (m: Movie) => void;
  onToggleWatchlist: (m: Movie) => void;
  onToggleWatched: (m: Movie) => void;
  onRate: (m: Movie, rating: number) => void;
}

export const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({
  lastWatchedMovie,
  allMovies,
  onSelectMovie,
  onToggleWatchlist,
  onToggleWatched,
  onRate
}) => {
  // If no last watched movie is in history, fallback to a top landmark film
  const seedMovie = lastWatchedMovie || allMovies[0];
  if (!seedMovie) return null;

  const recommendations: RecommendedMovie[] = recommenderEngine.getRecommendations(seedMovie, allMovies, 6);

  if (recommendations.length === 0) return null;

  return (
    <section className="space-y-6 pt-4">
      
      {/* Dynamic Recommendation Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-red-950/40 via-purple-950/20 to-slate-900 border border-red-500/20 shadow-2xl relative overflow-hidden">
        
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-amber-400 fill-current animate-pulse" />
              <span>Smart Cinematic Recommender</span>
            </div>

            <h2 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
              Recommended For You
            </h2>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-slate-300">
                Because your last watched film was:
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-red-600/30 text-red-300 font-bold text-xs border border-red-500/30 flex items-center gap-1">
                <Film className="w-3 h-3" />
                <span>{seedMovie.title}</span>
              </span>
              <span className="text-xs text-slate-400">
                in <strong className="text-amber-400">{seedMovie.genres.join(', ')}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-4 py-2 rounded-2xl bg-black/50 border border-white/10 text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-red-400" />
              <span>{recommendations.length} Tailored Matches</span>
            </div>
          </div>
        </div>

      </div>

      {/* Recommended Movies Reel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {recommendations.map(({ movie, matchScore, reasons, primaryMatchingGenre }) => (
          <div
            key={`rec-${movie.id}`}
            className="group relative rounded-2xl bg-[#10121a] border border-white/5 overflow-hidden flex flex-col justify-between hover:border-red-500/50 transition-all duration-300 shadow-xl hover:-translate-y-1"
          >
            {/* Poster Card Container */}
            <div
              onClick={() => onSelectMovie(movie)}
              className="relative w-full h-[250px] overflow-hidden cursor-pointer bg-slate-900"
            >
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Match Percentage Badge */}
              <div className="absolute top-2 left-2 z-10">
                <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white font-extrabold text-[10px] shadow-lg flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 fill-current" />
                  <span>{matchScore}% Match</span>
                </span>
              </div>

              {/* Language / Flag Badge */}
              <div className="absolute top-2 right-2 z-10">
                <span className="px-1.5 py-0.5 rounded bg-black/70 border border-white/10 text-[9px] text-slate-300 font-bold">
                  {movie.flag || '🌐'}
                </span>
              </div>

              {/* Bottom Gradient & Info */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#10121a] via-transparent to-transparent opacity-85" />
              <div className="absolute bottom-2 left-2 right-2 z-10">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block truncate">
                  {primaryMatchingGenre}
                </span>
                <h4 className="font-heading font-extrabold text-xs text-white line-clamp-1 group-hover:text-red-400 transition-colors">
                  {movie.title}
                </h4>
              </div>
            </div>

            {/* Recommendation Reason & Actions Footer */}
            <div className="p-3 space-y-2 bg-[#10121a]">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                <span className="font-mono">{movie.year}</span>
                <div className="flex items-center gap-1 font-bold text-amber-400">
                  <Star className="w-3 h-3 fill-current" />
                  <span>{movie.userRating || 20}/20</span>
                </div>
              </div>

              {reasons[0] && (
                <p className="text-[10px] text-slate-400 line-clamp-1 italic bg-slate-900/90 px-2 py-1 rounded-lg border border-white/5">
                  ✓ {reasons[0]}
                </p>
              )}

              {/* Quick Action Button */}
              <div className="flex items-center gap-1.5 pt-1">
                <button
                  onClick={() => onToggleWatchlist(movie)}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${
                    movie.isWatchlist
                      ? 'bg-red-600/20 text-red-400 border border-red-500/30'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/5'
                  }`}
                >
                  {movie.isWatchlist ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                  <span>Watchlist</span>
                </button>

                <button
                  onClick={() => onSelectMovie(movie)}
                  className="p-1.5 rounded-xl bg-red-600/90 hover:bg-red-500 text-white font-bold transition-transform hover:scale-105"
                  title="View Details"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </section>
  );
};
