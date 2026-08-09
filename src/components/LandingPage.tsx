import React, { useState } from 'react';
import { 
  Film, 
  Sparkles, 
  ShieldCheck, 
  Users, 
  Tv, 
  RefreshCw, 
  Play, 
  ArrowRight, 
  Star, 
  Flame, 
  Zap, 
  Globe, 
  Lock 
} from 'lucide-react';
import { authService } from '../db/supabaseClient';

interface LandingPageProps {
  onAuthenticated: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onAuthenticated }) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (authMode === 'signup') {
        if (!displayName.trim()) {
          setError('Please provide a display name');
          setLoading(false);
          return;
        }
        const res = await authService.signUp(email, password, displayName);
        if (res.error) {
          setError(res.error);
          setLoading(false);
          return;
        }
      } else {
        const res = await authService.signIn(email, password);
        if (res.error) {
          setError(res.error);
          setLoading(false);
          return;
        }
      }
      onAuthenticated();
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestExplore = () => {
    authService.enterAsGuest();
    onAuthenticated();
  };

  const featuredHighlights = [
    {
      title: 'MCU & DC Universe Timelines',
      desc: 'Complete Phase 1–6 chronology, Avengers: Doomsday, and DC Elseworlds with official theatrical 4K posters.',
      icon: <Zap className="w-6 h-6 text-amber-400" />,
      badge: 'Multiverse Engine'
    },
    {
      title: 'Global Multi-Industry Catalog',
      desc: 'Curated masterworks across Hollywood, Bollywood, Tollywood (RRR, Baahubali), and Bengali cinema (Ray classics & modern thrillers).',
      icon: <Globe className="w-6 h-6 text-red-500" />,
      badge: 'Hollywood to Bengal'
    },
    {
      title: 'CineRoom Watch Parties',
      desc: 'Create private watchrooms with friends, synchronized trailer streams, and dynamic Marvel, Gotham, and Tollywood themes.',
      icon: <Tv className="w-6 h-6 text-cyan-400" />,
      badge: 'Live Sync'
    },
    {
      title: 'Automated 7-Day Web Sync',
      desc: 'Autonomous background scraping from Wikipedia & TMDB keeps ratings, streaming availability, and posters fresh every 7 days.',
      icon: <RefreshCw className="w-6 h-6 text-emerald-400" />,
      badge: 'Auto Scraper'
    }
  ];

  return (
    <div className="min-h-screen bg-[#07080d] text-slate-100 selection:bg-red-600 selection:text-white relative overflow-hidden font-sans">
      
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-red-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-20 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-700 via-red-600 to-amber-500 flex items-center justify-center shadow-lg shadow-red-600/30">
            <Film className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-heading font-black text-2xl tracking-tight text-white flex items-center gap-1">
              CINE<span className="text-red-500">VERSE</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-red-950/80 border border-red-500/30 text-red-400 ml-1">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-wider font-mono">GLOBAL CINEMA & WATCH ROOMS</p>
          </div>
        </div>

        <button
          onClick={handleGuestExplore}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center gap-2"
        >
          <span>Explore as Guest</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* Hero Section */}
      <main className="relative z-20 max-w-7xl mx-auto px-6 pt-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Hero Typography & Highlights */}
          <div className="lg:col-span-7 space-y-8">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-red-500/10 to-amber-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Hollywood • Marvel & DC • Bollywood • Tollywood • Bengali</span>
            </div>

            <div className="space-y-4">
              <h1 className="font-heading font-extrabold text-4xl sm:text-6xl tracking-tight text-white leading-[1.1]">
                The Ultimate <br />
                <span className="bg-gradient-to-r from-red-500 via-amber-400 to-red-400 bg-clip-text text-transparent">
                  Superhero & Global
                </span> <br />
                Cinema Experience.
              </h1>
              <p className="text-slate-400 text-sm sm:text-base max-w-xl leading-relaxed">
                Connect with friends, share recommendations with one click, enter immersive themed CineRooms, and experience the MCU, DC, Hollywood, Bollywood, Tollywood, and Bengali film registries with verified theatrical posters and weekly automated updates.
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {featuredHighlights.map((item, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-white/5 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-0.5 rounded bg-black/40">
                      {item.badge}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-white group-hover:text-red-400 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Live Stats Row */}
            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/10 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-slate-300 font-semibold">Supabase Powered</span>
              </div>
              <div>⚡ 7-Day Scraper Enabled</div>
              <div>🍿 Private Watch Rooms</div>
              <div>🛡️ Data Authenticity Verified</div>
            </div>

          </div>

          {/* Right Column: High-Impact Auth Gateway Form */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl bg-[#0f121d]/90 border border-white/10 p-8 shadow-2xl backdrop-blur-xl space-y-6">
              
              {/* Top Form Header */}
              <div className="text-center space-y-2">
                <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 text-white shadow-lg shadow-red-600/30">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-extrabold text-2xl text-white">
                  {authMode === 'signin' ? 'Welcome Back to CineVerse' : 'Create Your Cinema Profile'}
                </h3>
                <p className="text-xs text-slate-400">
                  {authMode === 'signin' 
                    ? 'Log in to access your watchlists, friends, and CineRooms' 
                    : 'Get your unique #CINE friend code and start watch parties'}
                </p>
              </div>

              {/* Form Tab Toggle */}
              <div className="flex p-1 rounded-xl bg-black/40 border border-white/5">
                <button
                  type="button"
                  onClick={() => { setAuthMode('signin'); setError(null); }}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    authMode === 'signin' 
                      ? 'bg-red-600 text-white shadow-md' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('signup'); setError(null); }}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    authMode === 'signup' 
                      ? 'bg-red-600 text-white shadow-md' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  New Account
                </button>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Authentication Form */}
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                
                {authMode === 'signup' && (
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1.5">
                      Display Name / Cinephile Alias
                    </label>
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. Tony Stark, Bruce Wayne"
                      className="w-full bg-[#161a29] border border-white/10 rounded-xl px-3.5 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@cinema.com"
                    className="w-full bg-[#161a29] border border-white/10 rounded-xl px-3.5 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#161a29] border border-white/10 rounded-xl px-3.5 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>

                <div className="pt-2 space-y-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-xs shadow-xl shadow-red-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
                  >
                    {loading ? 'Authenticating...' : (authMode === 'signin' ? 'Sign In to CineVerse' : 'Create Account & Generate Friend Code')}
                  </button>

                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-white/10" />
                    <span className="flex-shrink mx-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Or</span>
                    <div className="flex-grow border-t border-white/10" />
                  </div>

                  <button
                    type="button"
                    onClick={handleGuestExplore}
                    className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    <span>Instant Guest Access (Explore All)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </form>

              {/* Security Footnote */}
              <div className="text-center text-[10px] text-slate-500 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Protected by Supabase Encryption & Offline Registry Cache</span>
              </div>

            </div>
          </div>

        </div>
      </main>

    </div>
  );
};
