import React, { useState } from 'react';
import { Franchise, Movie } from '../types/movie';
import { Layers, Film, CheckCircle2, Play, Search, Star, Eye, Plus, Sparkles } from 'lucide-react';

interface FranchisesViewProps {
  franchises: Franchise[];
  movies: Movie[];
  onSelectMovie: (m: Movie) => void;
  onToggleWatchlist?: (m: Movie) => void;
  onToggleWatched?: (m: Movie) => void;
}

export const FranchisesView: React.FC<FranchisesViewProps> = ({
  franchises,
  movies,
  onSelectMovie,
  onToggleWatchlist,
  onToggleWatched
}) => {
  const [search, setSearch] = useState('');

  const filteredFranchises = franchises.filter(f =>
    f.title.toLowerCase().includes(search.toLowerCase()) ||
    f.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Cinematic Universes & Sagas</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white">Film Franchises</h1>
          <p className="text-xs text-slate-400 mt-1">Multi-part cinema collections, sagas, and personal watch progress</p>
        </div>

        {/* Search Franchises */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search franchises..."
            className="w-full bg-[#10121a] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
          />
        </div>
      </div>

      {/* Summary Statistics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#10121a] border border-white/5 text-center shadow-lg">
          <span className="text-[11px] text-slate-400 font-semibold uppercase">Franchises</span>
          <div className="font-heading font-extrabold text-2xl text-white mt-1">{franchises.length}</div>
        </div>
        <div className="p-4 rounded-2xl bg-[#10121a] border border-white/5 text-center shadow-lg">
          <span className="text-[11px] text-slate-400 font-semibold uppercase">Total Tracked Titles</span>
          <div className="font-heading font-extrabold text-2xl text-red-500 mt-1">
            {franchises.reduce((acc, f) => {
              const matched = movies.filter(m => f.movieIds.includes(m.id) || m.franchiseId === f.id);
              return acc + (matched.length || f.movieIds.length);
            }, 0)}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-[#10121a] border border-white/5 text-center shadow-lg">
          <span className="text-[11px] text-slate-400 font-semibold uppercase">Global Industries</span>
          <div className="font-heading font-extrabold text-2xl text-emerald-400 mt-1">9</div>
        </div>
        <div className="p-4 rounded-2xl bg-[#10121a] border border-white/5 text-center shadow-lg">
          <span className="text-[11px] text-slate-400 font-semibold uppercase">Sagas Complete</span>
          <div className="font-heading font-extrabold text-2xl text-amber-400 mt-1">3</div>
        </div>
      </div>

      {/* Franchise List */}
      <div className="space-y-8">
        {filteredFranchises.map((franchise) => {
          // Smart fallback matching: by explicit IDs or title relevance
          let franchiseMovies = movies.filter(m =>
            franchise.movieIds.includes(m.id) ||
            m.franchiseId === franchise.id ||
            (franchise.id === 'godfather-saga' && m.title.toLowerCase().includes('godfather')) ||
            (franchise.id === 'dark-knight-saga' && (m.title.toLowerCase().includes('dark knight') || m.title.toLowerCase().includes('batman'))) ||
            (franchise.id === 'nolan-mind-benders' && (m.director?.includes('Nolan') || ['Inception', 'Interstellar', 'Oppenheimer'].includes(m.title))) ||
            (franchise.id === 'apu-trilogy' && ['Pather Panchali', 'Aparajito', 'Apur Sansar (The World of Apu)'].includes(m.title)) ||
            (franchise.id === 'rajamouli-epics' && (m.title.includes('RRR') || m.title.includes('Baahubali'))) ||
            (franchise.id === 'ghibli-universe' && (m.director?.includes('Miyazaki') || ['Spirited Away', 'Princess Mononoke', 'Your Name.'].includes(m.title))) ||
            (franchise.id === 'korean-crime-thrillers' && ['Parasite', 'Oldboy', 'Memories of Murder', 'The Handmaiden', 'Train to Busan'].includes(m.title)) ||
            (franchise.id === 'feluda-byomkesh' && (m.title.includes('Sonar Kella') || m.title.includes('Felunath') || m.title.includes('Byomkesh') || m.title.includes('Baishe Srabon')))
          );

          // Remove duplicates
          franchiseMovies = Array.from(new Set(franchiseMovies.map(m => m.id)))
            .map(id => franchiseMovies.find(m => m.id === id)!);

          const watchedCount = franchiseMovies.filter(m => m.isWatched).length;
          const totalCount = franchiseMovies.length;
          const progressPercent = totalCount ? Math.round((watchedCount / totalCount) * 100) : 0;

          return (
            <div
              key={franchise.id}
              className="rounded-3xl bg-[#10121a] border border-white/5 overflow-hidden shadow-2xl space-y-4 group hover:border-red-500/30 transition-all duration-300"
            >
              {/* Franchise Banner */}
              <div className="relative h-48 sm:h-56 w-full bg-slate-900 overflow-hidden">
                <img
                  src={franchise.backdrop}
                  alt={franchise.title}
                  className="w-full h-full object-cover opacity-45 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#10121a] via-[#10121a]/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#10121a] via-transparent to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div className="max-w-2xl space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded bg-red-600/90 text-white">
                      CINEMATIC SAGA
                    </span>
                    <h3 className="font-heading font-black text-2xl sm:text-3xl text-white drop-shadow-md">
                      {franchise.title}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-1">{franchise.description}</p>
                  </div>

                  {/* Watch Progress Pill */}
                  <div className="p-3 rounded-2xl bg-slate-950/90 border border-white/10 flex flex-col gap-1.5 min-w-[170px] shadow-lg shrink-0">
                    <div className="flex justify-between text-xs font-bold text-slate-300">
                      <span>Progress:</span>
                      <span className={progressPercent === 100 ? 'text-emerald-400' : 'text-amber-400'}>
                        {watchedCount} / {totalCount} ({progressPercent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        style={{ width: `${progressPercent}%` }}
                        className={`h-full transition-all duration-500 ${
                          progressPercent === 100 ? 'bg-emerald-400' : 'bg-gradient-to-r from-red-600 to-amber-500'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Franchise Movies Grid Row */}
              <div className="p-6 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {franchiseMovies.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => onSelectMovie(m)}
                      className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/5 hover:border-red-500/50 cursor-pointer transition-all flex items-center justify-between gap-3 group/card hover:scale-[1.02]"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={m.poster}
                          alt={m.title}
                          className="w-12 h-16 object-cover rounded-xl shadow-md shrink-0 group-hover/card:scale-105 transition-transform"
                        />
                        <div className="min-w-0">
                          <span className="text-[9px] font-bold text-red-400 block">{m.language || 'Global'}</span>
                          <h4 className="font-bold text-xs text-white group-hover/card:text-red-400 transition-colors truncate">
                            {m.title}
                          </h4>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                            <span>{m.year}</span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5 text-amber-400">
                              <Star className="w-2.5 h-2.5 fill-current" />
                              <span>{m.userRating || 20}/20</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Watched Status Badge */}
                      <div className="shrink-0">
                        {m.isWatched ? (
                          <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30" title="Watched">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-slate-900 text-slate-500 flex items-center justify-center border border-white/10 group-hover/card:text-white" title="To Watch">
                            <Play className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
