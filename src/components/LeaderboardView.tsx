import React from 'react';
import { Movie } from '../types/movie';
import { Trophy, Medal, Star } from 'lucide-react';

interface LeaderboardViewProps {
  movies: Movie[];
  onSelectMovie: (m: Movie) => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ movies, onSelectMovie }) => {
  const rankedMovies = [...movies]
    .filter(m => m.userRating)
    .sort((a, b) => (b.userRating || 0) - (a.userRating || 0));

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      
      {/* Header */}
      <div className="border-b border-white/10 pb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Trophy className="w-4 h-4" />
            <span>Official Ranked Scoreboard</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white">
            Leaderboard (1–20 Scale)
          </h1>
        </div>
      </div>

      {/* Ranked Table / List */}
      <div className="space-y-3">
        {rankedMovies.map((movie, idx) => {
          const rank = idx + 1;
          return (
            <div
              key={movie.id}
              onClick={() => onSelectMovie(movie)}
              className="p-4 rounded-2xl bg-[#10121a] border border-white/5 hover:border-red-500/40 cursor-pointer transition-all flex items-center justify-between gap-4 group hover:scale-[1.01]"
            >
              <div className="flex items-center gap-4">
                {/* Rank Badge */}
                <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center font-heading font-black text-sm text-white">
                  {rank === 1 ? (
                    <Medal className="w-5 h-5 text-amber-400" />
                  ) : rank === 2 ? (
                    <Medal className="w-5 h-5 text-slate-300" />
                  ) : rank === 3 ? (
                    <Medal className="w-5 h-5 text-amber-600" />
                  ) : (
                    `#${rank}`
                  )}
                </div>

                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-12 h-16 object-cover rounded-lg"
                />

                <div>
                  <h3 className="font-bold text-sm text-white group-hover:text-red-400 transition-colors">
                    {movie.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span>{movie.year}</span>
                    <span>•</span>
                    <span className="uppercase text-[9px] font-bold text-red-500">{movie.type}</span>
                  </div>
                </div>
              </div>

              {/* Custom Score Badge */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-heading font-black text-sm">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{movie.userRating}/20</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
