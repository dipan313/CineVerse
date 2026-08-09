import React, { useState } from 'react';
import { RmovieTab, UserProfile } from '../types/movie';
import { 
  Film, 
  Search, 
  Bookmark, 
  CheckCircle, 
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
  Eye
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
  onSyncStarted
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleManualSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    onSyncStarted();

    try {
      const allMovies = cinemaDb.getMovies();
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

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 via-red-500 to-amber-500 flex items-center justify-center shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-heading font-black text-xl tracking-tight text-white flex items-center gap-1">
                CINE<span className="text-red-500">VERSE</span>
              </div>
              <p className="text-[9px] font-mono tracking-widest text-slate-400">GLOBAL CINEMA & SOCIAL</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xs relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Hollywood, Marvel, DC, Bollywood, Bengali..."
              className="w-full bg-[#141724] border border-white/10 rounded-2xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500 transition-colors"
            />
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
          <div className="flex items-center gap-2.5">
            
            {/* CinePedia AI Fact Checker Button */}
            <button
              onClick={onOpenCinePedia}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-600/20 to-blue-600/20 hover:from-cyan-600/30 hover:to-blue-600/30 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-950/30 transition-all hover:scale-105"
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

            {/* User Profile Pill & Friend Code */}
            <div className="flex items-center gap-2 p-1.5 pl-2 rounded-2xl bg-[#141724] border border-white/10">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.displayName}
                className="w-7 h-7 rounded-xl bg-slate-800"
              />
              <div className="hidden sm:block text-left pr-1">
                <div className="font-bold text-[11px] text-white truncate max-w-[85px]">
                  {currentUser.displayName}
                </div>
                <button
                  onClick={handleCopyCode}
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
