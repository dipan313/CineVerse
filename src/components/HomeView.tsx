import React, { useState, useMemo } from 'react';
import { Movie } from '../types/movie';
import { HeroCarousel } from './HeroCarousel';
import { MovieCard } from './MovieCard';
import { RecommendationsSection } from './RecommendationsSection';
import { Eye, Film, Star, Globe2, Languages, Shuffle } from 'lucide-react';

interface HomeViewProps {
  movies: Movie[];
  watchlistCount: number;
  watchedCount: number;
  lastWatchedMovie?: Movie;
  onSelectMovie: (m: Movie) => void;
  onToggleWatchlist: (m: Movie) => void;
  onToggleWatched: (m: Movie) => void;
  onRate: (m: Movie, rating: number) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  movies,
  watchlistCount,
  watchedCount,
  lastWatchedMovie,
  onSelectMovie,
  onToggleWatchlist,
  onToggleWatched,
  onRate
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [region, setRegion] = useState('US');
  const [timeframe, setTimeframe] = useState<'all' | 'last-year' | '5-years'>('all');
  const [shuffleSeed, setShuffleSeed] = useState(0);

  // Pure spoken language categories
  const languagesList = [
    { id: 'all', label: 'All Languages', flag: '🌐' },
    { id: 'Bengali', label: 'Bengali (বাংলা)', flag: '🇮🇳' },
    { id: 'Hindi', label: 'Hindi (हिन्दी)', flag: '🇮🇳' },
    { id: 'Korean', label: 'Korean', flag: '🇰🇷' },
    { id: 'Japanese', label: 'Japanese', flag: '🇯🇵' },
    { id: 'Telugu', label: 'Telugu/Tamil', flag: '🇮🇳' },
    { id: 'Spanish', label: 'Spanish', flag: '🇪🇸' },
    { id: 'English', label: 'English', flag: '🇺🇸' },
  ];

  // Randomly shuffled and filtered movies
  const filteredMovies = useMemo(() => {
    if (selectedLanguage === 'all') {
      // Deterministic random mix
      const shuffled = [...movies];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = (i * 7 + shuffleSeed + 3) % (i + 1);
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    }

    return movies.filter(m => {
      if (!m.language) return false;
      const l1 = m.language.toLowerCase();
      const l2 = selectedLanguage.toLowerCase();
      return (
        l1.includes(l2) ||
        l2.includes(l1) ||
        (l2 === 'bengali' && l1.includes('bengali')) ||
        (l2 === 'hindi' && l1.includes('hindi')) ||
        (l2 === 'telugu' && (l1.includes('tamil') || l1.includes('telugu'))) ||
        (l2 === 'english' && (l1.includes('english') || l1.includes('marvel')))
      );
    });
  }, [movies, selectedLanguage, shuffleSeed]);

  // Compute average rating
  const ratedMovies = movies.filter(m => m.userRating);
  const avgRating = ratedMovies.length
    ? (ratedMovies.reduce((acc, curr) => acc + (curr.userRating || 0), 0) / ratedMovies.length).toFixed(1)
    : '19.2';

  return (
    <div className="space-y-10 pb-16">
      
      {/* 1. Hero Carousel */}
      <HeroCarousel
        movies={movies}
        onSelectMovie={onSelectMovie}
        onToggleWatchlist={onToggleWatchlist}
      />

      {/* 2. Intelligent Movie Recommender (Based on Last Watched Genre) */}
      <RecommendationsSection
        lastWatchedMovie={lastWatchedMovie}
        allMovies={movies}
        onSelectMovie={onSelectMovie}
        onToggleWatchlist={onToggleWatchlist}
        onToggleWatched={onToggleWatched}
        onRate={onRate}
      />

      {/* 3. Personal Statistics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#10121a] border border-white/5 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">To Watch</span>
            <div className="font-heading font-extrabold text-3xl text-white mt-1">{watchlistCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-500/15 text-red-400 flex items-center justify-center font-bold">
            <Film className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#10121a] border border-white/5 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Watched</span>
            <div className="font-heading font-extrabold text-3xl text-white mt-1">{watchedCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold">
            <Eye className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#10121a] border border-white/5 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Avg Rating</span>
            <div className="font-heading font-extrabold text-3xl text-amber-400 mt-1">{avgRating} <span className="text-xs text-slate-500">/20</span></div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold">
            <Star className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 4. Global Language Filter Reel */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Languages className="w-4 h-4 text-red-500" />
            <span>Explore Cinema by Global Language ({movies.length} titles):</span>
          </div>

          <div className="flex items-center gap-3">
            {selectedLanguage === 'all' && (
              <button
                onClick={() => setShuffleSeed(prev => prev + 1)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-white/10 text-xs font-bold text-slate-300 hover:text-white hover:border-red-500/40 transition-all"
                title="Shuffle movies randomly"
              >
                <Shuffle className="w-3.5 h-3.5 text-red-500" />
                <span>Shuffle Mix</span>
              </button>
            )}
            <span className="text-xs font-bold text-amber-400">
              {filteredMovies.length} titles in this view
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {languagesList.map((lang) => {
            const isSelected = selectedLanguage.toLowerCase() === lang.id.toLowerCase();
            return (
              <button
                key={lang.id}
                onClick={() => setSelectedLanguage(lang.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30 scale-105 ring-2 ring-red-400/40'
                    : 'bg-slate-900 border border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="font-heading font-extrabold text-2xl text-white">
            {selectedLanguage === 'all' ? 'Worldwide Cinema Library' : `${selectedLanguage} Masterpieces`}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Showing {filteredMovies.length} titles with authentic poster rendering & official metadata
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Region Dropdown */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-300">
            <Globe2 className="w-3.5 h-3.5 text-red-500" />
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="bg-transparent text-xs font-semibold text-white focus:outline-none"
            >
              <option value="IN">Free in India</option>
              <option value="US">Free in United States</option>
              <option value="UK">Free in United Kingdom</option>
              <option value="CA">Free in Canada</option>
            </select>
          </div>

          {/* Timeframe Filter Pills */}
          <div className="flex p-1 rounded-xl bg-slate-900 border border-white/10 text-xs">
            <button
              onClick={() => setTimeframe('all')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                timeframe === 'all' ? 'bg-red-600 text-white' : 'text-slate-400'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setTimeframe('5-years')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                timeframe === '5-years' ? 'bg-red-600 text-white' : 'text-slate-400'
              }`}
            >
              5 Years
            </button>
          </div>
        </div>
      </div>

      {/* 6. Movie Grid */}
      {filteredMovies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {filteredMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onSelect={onSelectMovie}
              onToggleWatchlist={onToggleWatchlist}
              onToggleWatched={onToggleWatched}
              onRate={onRate}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-3 bg-[#10121a]/50 rounded-3xl border border-white/5">
          <Film className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="font-heading font-bold text-lg text-white">No Movies Found in This Category</h3>
          <p className="text-xs text-slate-400">Try selecting another language from the top bar.</p>
        </div>
      )}

    </div>
  );
};
