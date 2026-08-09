import React, { useState, useMemo } from 'react';
import { RmovieTab, UserProfile, Movie } from '../types/movie';
import { 
  Film, 
  Search, 
  Bookmark, 
  Layers, 
  Trophy, 
  Users, 
  Tv, 
  Zap, 
  RefreshCw, 
  LogOut, 
  Copy, 
  Check, 
  Bot,
  Sparkles,
  Eye,
  X
} from 'lucide-react';
import { weeklySyncEngine } from '../services/weeklySyncEngine';
import { cinemaDb } from '../db/cinemaDatabase';

interface NavbarProps {
  activeTab: RmovieTab;
  setActiveTab: (tab: RmovieTab) => void;
  watchlistCount: number;
  watchedCount: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  currentUser: UserProfile;
  onSignOut: () => void;
  onOpenAutoImport: () => void;
  onOpenCinePedia: () => void;
  onSyncStarted: () => void;
  onSelectMovie?: (m: Movie) => void;
  onOpenAvatarSelector?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  watchlistCount,
  watchedCount,
  searchQuery,
  setSearchQuery,
  currentUser,
  onSignOut,
  onOpenCinePedia,
  onSyncStarted,
  onSelectMovie,
  onOpenAvatarSelector
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const allMovies = useMemo(() => cinemaDb.getMovies(), []);

  // Instant Live Search Matches for Dropdown
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return allMovies.filter(m => 
      m.title.toLowerCase().includes(q) ||
      (m.originalTitle && m.originalTitle.toLowerCase().includes(q)) ||
      (m.director && m.director.toLowerCase().includes(q)) ||
      m.genres.some(g => g.toLowerCase().includes(q)) ||
      (m.industry && m.industry.toLowerCase().includes(q))
    ).slice(0, 5);
  }, [allMovies, searchQuery]);

  const handleManualSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    onSyncStarted();

    try {
      const res = await weeklySyncEngine.performSync(allMovies);
      cinemaDb.setMovies(res.updatedMovies);
    } catch (e) {
      console.error("Sync error", e);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentUser.friendCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (val.trim() && activeTab !== 'home') {
      setActiveTab('home');
    }
  };

  const handleSelectSearchResult = (movie: Movie) => {
    if (onSelectMovie) {
      onSelectMovie(movie);
    } else {
      setActiveTab('home');
    }
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-red-600 via-red-500 to-amber-500 flex items-center justify-center shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-heading font-black text-lg sm:text-xl tracking-tight text-white flex items-center gap-1">
                CINE<span className="text-red-500">VERSE</span>
              </div>
              <p className="text-[8px] sm:text-[9px] font-mono tracking-widest text-slate-400">GLOBAL CINEMA</p>
            </div>
          </div>

          {/* Search Bar (Functional with Auto Tab Switch & Live Suggestions) */}
          <div className="flex-1 max-w-xs sm:max-w-sm relative">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchOpen(true)}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search movies, Marvel, DC, Bollywood, Bengali..."
                className="w-full bg-[#141724] border border-white/10 focus:border-red-500 rounded-2xl pl-10 pr-8 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none transition-all shadow-inner"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Instant Live Search Results Dropdown */}
            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#0e111d] border border-red-500/30 rounded-2xl shadow-2xl p-2 space-y-1.5 z-50 animate-in fade-in">
                <div className="text-[9px] font-mono font-bold text-slate-500 uppercase px-2 pt-1">
                  Instant Movie Matches
                </div>
                {searchResults.map(movie => (
                  <div
                    key={movie.id}
                    onClick={() => handleSelectSearchResult(movie)}
                    className="p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer flex items-center gap-2.5"
                  >
                    <img src={movie.poster} alt={movie.title} className="w-7 h-10 object-cover rounded-lg bg-slate-800" />
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-xs text-white truncate">{movie.title}</div>
                      <div className="text-[10px] text-slate-400">{movie.year} • {movie.industry?.toUpperCase()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'home'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Catalog
            </button>

            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'timeline'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>MCU & DC</span>
            </button>

            <button
              onClick={() => setActiveTab('watched')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'watched'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span>Watched</span>
              {watchedCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-emerald-500 text-white font-black text-[9px] flex items-center justify-center">
                  {watchedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('watchlist')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'watchlist'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-400" />
              <span>Watchlist</span>
              {watchlistCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-500 text-black font-black text-[9px] flex items-center justify-center">
                  {watchlistCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('cinespace')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'cinespace'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>CineSpace</span>
            </button>

            <button
              onClick={() => setActiveTab('communities')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'communities'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>Communities</span>
            </button>

          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2">
            
            {/* CinePedia AI Fact Checker Button */}
            <button
              onClick={onOpenCinePedia}
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-cyan-600/20 to-blue-600/20 hover:from-cyan-600/30 hover:to-blue-600/30 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-950/30 transition-all hover:scale-105"
              title="Open CinePedia AI Fact-Checker"
            >
              <Bot className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">CinePedia AI</span>
            </button>

            {/* 7-Day Sync Trigger */}
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all text-xs flex items-center gap-1.5"
              title="7-Day Automated Web Sync"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isSyncing ? 'animate-spin' : ''}`} />
            </button>

            {/* User Profile Pill & Character Avatar Selector Trigger */}
            <div 
              onClick={onOpenAvatarSelector}
              className="flex items-center gap-2 p-1.5 pl-2 rounded-2xl bg-[#141724] border border-white/10 hover:border-red-500/50 hover:bg-white/5 cursor-pointer transition-all group"
              title="Click to customize character avatar profile picture"
            >
              <div className="relative">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.displayName}
                  className="w-7 h-7 rounded-xl object-cover bg-slate-800 ring-1 ring-red-500/40 group-hover:ring-red-500 transition-all"
                />
                <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#141724]" />
              </div>
              <div className="hidden sm:block text-left pr-1">
                <div className="font-bold text-[11px] text-white truncate max-w-[85px] group-hover:text-red-400 transition-colors">
                  {currentUser.displayName}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyCode();
                  }}
                  className="font-mono text-[9px] text-amber-400 flex items-center gap-1 hover:underline"
                  title="Click to copy friend code"
                >
                  <span>{currentUser.friendCode}</span>
                  {copiedCode ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5 opacity-60" />}
                </button>
              </div>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={onSignOut}
              className="p-2 rounded-xl bg-white/5 hover:bg-red-600/20 text-slate-400 hover:text-red-400 border border-white/10 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>

        </div>
      </div>
    </nav>
  );
};
