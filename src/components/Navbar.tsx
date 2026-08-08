import React from 'react';
import { RmovieTab } from '../types/movie';
import { Search, Sun, Moon, Zap, Film } from 'lucide-react';

interface NavbarProps {
  activeTab: RmovieTab;
  setActiveTab: (tab: RmovieTab) => void;
  watchlistCount: number;
  watchedCount: number;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  onOpenAuth: () => void;
  onOpenAutoImport: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  watchlistCount,
  watchedCount,
  searchQuery,
  setSearchQuery,
  isDarkMode,
  setIsDarkMode,
  onOpenAuth,
  onOpenAutoImport
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 space-y-3">
        
        {/* Top Navbar Row */}
        <div className="flex items-center justify-between">
          
          {/* Glowing Cineverse Logo */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-black text-2xl tracking-tighter text-white">
                CINE<span className="text-red-500">VERSE</span>
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30 uppercase tracking-widest hidden sm:inline">
                Automated
              </span>
            </div>
          </div>

          {/* Central Pill Navigation Tabs */}
          <nav className="flex items-center gap-1.5 p-1 rounded-full bg-slate-900/80 border border-white/10 shadow-inner">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === 'home'
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => setActiveTab('watchlist')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === 'watchlist'
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Watchlist ({watchlistCount})
            </button>

            <button
              onClick={() => setActiveTab('watched')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === 'watched'
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Watched ({watchedCount})
            </button>

            <button
              onClick={() => setActiveTab('franchises')}
              className={`hidden sm:block px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === 'franchises'
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Franchises
            </button>

            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`hidden sm:block px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === 'leaderboard'
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Leaderboard
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            
            {/* Auto Ingest / Auto Fetch Action */}
            <button
              onClick={onOpenAutoImport}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-gradient-to-r from-red-950 to-slate-900 border border-red-500/40 text-xs font-bold text-amber-300 hover:text-white hover:border-red-500 transition-all shadow-md shadow-red-950/40"
              title="Autonomous Cinema Ingestion"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-current" />
              <span>⚡ Auto-Sync</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 rounded-full bg-slate-900 border border-white/10 text-slate-300 hover:text-white transition-colors"
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
            </button>

            {/* Sign Up / User Portal */}
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md shadow-red-600/30 transition-all hover:scale-105"
            >
              Sign up
            </button>
          </div>

        </div>

        {/* Global Instant Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search worldwide cinema by title, native name, or IMDb ID (e.g. Parasite, RRR, tt0111161, 3 Idiots)..."
            className="w-full bg-[#12121c]/90 border border-white/10 focus:border-red-500/80 rounded-2xl pl-11 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors shadow-inner"
          />
        </div>

      </div>
    </header>
  );
};
