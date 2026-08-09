import React, { useState } from 'react';
import { CineRoom, CineRoomTheme, Movie, ChatMessage, UserProfile } from '../types/movie';
import { cinemaDb } from '../db/cinemaDatabase';
import { 
  Tv, 
  Play, 
  Pause, 
  Users, 
  Sparkles, 
  Send, 
  Flame, 
  Heart, 
  Zap, 
  Crown, 
  Film, 
  Plus, 
  Copy, 
  Check, 
  Volume2,
  Maximize2
} from 'lucide-react';

interface CineRoomViewProps {
  currentUser: UserProfile;
  allMovies: Movie[];
  onSelectMovie: (m: Movie) => void;
}

const themeStyles: Record<CineRoomTheme, {
  name: string;
  badge: string;
  bgGradient: string;
  borderGlow: string;
  accentText: string;
  btnStyle: string;
}> = {
  'stark': {
    name: 'Stark Arc Reactor (MCU)',
    badge: 'Crimson & Gold HUD',
    bgGradient: 'from-[#1a0505] via-[#0d070e] to-[#12080a]',
    borderGlow: 'border-red-500/40 shadow-red-600/20',
    accentText: 'text-red-400',
    btnStyle: 'bg-red-600 hover:bg-red-500 text-white'
  },
  'gotham': {
    name: 'Gotham Dark Knight Noir (DC)',
    badge: 'Obsidian & Bat-Signal Amber',
    bgGradient: 'from-[#08080c] via-[#0c0d12] to-[#0a0b10]',
    borderGlow: 'border-amber-500/40 shadow-amber-600/20',
    accentText: 'text-amber-400',
    btnStyle: 'bg-amber-600 hover:bg-amber-500 text-black font-extrabold'
  },
  'tollywood-gold': {
    name: 'Royal Tollywood Gold (RRR / Baahubali)',
    badge: 'Regal Gold & Ruby Spectacle',
    bgGradient: 'from-[#1c1202] via-[#0f0b04] to-[#170e03]',
    borderGlow: 'border-yellow-500/50 shadow-yellow-600/20',
    accentText: 'text-yellow-400',
    btnStyle: 'bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black font-black'
  },
  'bengal-art': {
    name: 'Bengal Artiste Heritage (Ray Classics)',
    badge: 'Vintage Sepia & Literary Amber',
    bgGradient: 'from-[#170e0a] via-[#0f0907] to-[#140b08]',
    borderGlow: 'border-orange-500/40 shadow-orange-600/20',
    accentText: 'text-orange-400',
    btnStyle: 'bg-orange-600 hover:bg-orange-500 text-white'
  },
  'quantum': {
    name: 'Quantum Realm Multiverse',
    badge: 'Cosmic Purple & Neon Cyan',
    bgGradient: 'from-[#120524] via-[#070b1a] to-[#0c051d]',
    borderGlow: 'border-cyan-400/40 shadow-cyan-500/20',
    accentText: 'text-cyan-400',
    btnStyle: 'bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white'
  },
  'bollywood-retro': {
    name: 'Bollywood Retro Marquee',
    badge: 'Neon Marigold & Golden Glow',
    bgGradient: 'from-[#1f0515] via-[#10030c] to-[#1a0412]',
    borderGlow: 'border-pink-500/40 shadow-pink-600/20',
    accentText: 'text-pink-400',
    btnStyle: 'bg-pink-600 hover:bg-pink-500 text-white'
  }
};

export const CineRoomView: React.FC<CineRoomViewProps> = ({
  currentUser,
  allMovies,
  onSelectMovie
}) => {
  const rooms = cinemaDb.getRooms();
  const [activeRoomId, setActiveRoomId] = useState<string>(rooms[0]?.id || '');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newRoomTitle, setNewRoomTitle] = useState('');
  const [newRoomTheme, setNewRoomTheme] = useState<CineRoomTheme>('stark');
  const [newRoomMovieId, setNewRoomMovieId] = useState<string>(allMovies[0]?.id || '');
  const [roomChatInput, setRoomChatInput] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  const activeRoom = rooms.find(r => r.id === activeRoomId) || rooms[0];
  const theme = themeStyles[activeRoom?.theme || 'stark'];

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomTitle.trim()) return;

    const created = cinemaDb.createRoom(
      newRoomTitle.trim(),
      newRoomTheme,
      newRoomMovieId,
      {
        id: currentUser.id,
        username: currentUser.username,
        displayName: currentUser.displayName,
        avatarUrl: currentUser.avatarUrl,
        friendCode: currentUser.friendCode,
        status: 'online',
        totalWatchedCount: 10
      }
    );

    setActiveRoomId(created.id);
    setIsCreateOpen(false);
    setNewRoomTitle('');
  };

  const handleSendRoomMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomChatInput.trim() || !activeRoom) return;

    const newMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      senderId: currentUser.id,
      senderName: currentUser.displayName,
      senderAvatar: currentUser.avatarUrl,
      content: roomChatInput.trim(),
      timestamp: 'Just now'
    };

    cinemaDb.sendRoomMessage(activeRoom.id, newMsg);
    setRoomChatInput('');
  };

  const handleSendReaction = (emoji: string) => {
    if (!activeRoom) return;
    const newMsg: ChatMessage = {
      id: 'react_' + Date.now(),
      senderId: currentUser.id,
      senderName: currentUser.displayName,
      senderAvatar: currentUser.avatarUrl,
      content: `${emoji} reacted with ${emoji}`,
      timestamp: 'Just now'
    };
    cinemaDb.sendRoomMessage(activeRoom.id, newMsg);
  };

  const handleCopyCode = () => {
    if (!activeRoom) return;
    navigator.clipboard.writeText(activeRoom.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleThemeChange = (newTheme: CineRoomTheme) => {
    if (!activeRoom) return;
    cinemaDb.updateRoomTheme(activeRoom.id, newTheme);
  };

  const handleMovieChange = (movieId: string) => {
    const movie = allMovies.find(m => m.id === movieId);
    if (movie && activeRoom) {
      cinemaDb.setRoomActiveMovie(activeRoom.id, movie);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Header & Room Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400">
              <Tv className="w-5 h-5" />
            </span>
            <h2 className="font-heading font-extrabold text-2xl text-white">
              CineRooms: Watch Parties & Themed Lounges
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Synchronized cinema streams with live room chat, custom superhero & regional themes.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Room Pill Picker */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 flex-1 sm:flex-initial">
            {rooms.map(r => (
              <button
                key={r.id}
                onClick={() => setActiveRoomId(r.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                  activeRoom?.id === r.id
                    ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-600/20'
                    : 'bg-[#121626] text-slate-400 border-white/10 hover:border-white/20'
                }`}
              >
                {r.title}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-bold text-xs shadow-lg shadow-red-600/20 transition-all shrink-0 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create Room</span>
          </button>
        </div>
      </div>

      {/* Main Themed Room Container */}
      {activeRoom && (
        <div className={`rounded-3xl bg-gradient-to-b ${theme.bgGradient} border ${theme.borderGlow} shadow-2xl p-6 transition-colors duration-500 space-y-6 relative overflow-hidden`}>
          
          {/* Top Bar: Room Title, Room Code, Theme Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h3 className="font-heading font-black text-xl text-white">{activeRoom.title}</h3>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 ${theme.accentText}`}>
                  {theme.badge}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Created by {activeRoom.createdBy.displayName} • {activeRoom.participants.length} Cinephiles in Room
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Room Code Share */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/40 border border-white/15">
                <span className="text-[10px] uppercase font-bold text-slate-400">Invite Code:</span>
                <span className="font-mono font-bold text-xs text-amber-400">{activeRoom.code}</span>
                <button
                  onClick={handleCopyCode}
                  className="p-1 text-slate-400 hover:text-white transition-colors"
                  title="Copy Room Code"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Theme Dropdown / Selector */}
              <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 rounded-xl p-1">
                {(Object.keys(themeStyles) as CineRoomTheme[]).map(tKey => (
                  <button
                    key={tKey}
                    onClick={() => handleThemeChange(tKey)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                      activeRoom.theme === tKey
                        ? 'bg-white/20 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title={themeStyles[tKey].name}
                  >
                    {tKey.split('-')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Core Player & Room Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Video Player & Movie Switcher (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Synchronized Player Box */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl">
                {activeRoom.activeTrailerYoutubeId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${activeRoom.activeTrailerYoutubeId}?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1`}
                    title="CineRoom Synchronized Stream"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                    <Film className="w-10 h-10 opacity-40 text-red-500" />
                    <p className="text-xs">No stream attached. Select a film below!</p>
                  </div>
                )}
              </div>

              {/* Movie Details & Switcher Bar */}
              {activeRoom.activeMovie && (
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={activeRoom.activeMovie.poster}
                      alt={activeRoom.activeMovie.title}
                      className="w-12 h-16 object-cover rounded-xl border border-white/10 shadow-md shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-red-600 text-white inline-block mb-1">
                        NOW PLAYING
                      </span>
                      <h4 className="font-bold text-sm text-white truncate">{activeRoom.activeMovie.title}</h4>
                      <p className="text-xs text-slate-400">{activeRoom.activeMovie.year} • ⭐ {activeRoom.activeMovie.imdbRating} IMDB • {activeRoom.activeMovie.industry.toUpperCase()}</p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {/* Quick switch to another film */}
                    <select
                      value={activeRoom.activeMovie.id}
                      onChange={(e) => handleMovieChange(e.target.value)}
                      className="bg-[#181c2e] border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-red-500"
                    >
                      {allMovies.map(m => (
                        <option key={m.id} value={m.id}>
                          {m.title} ({m.year})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

            </div>

            {/* Right: Live Themed Room Chat & Reactions (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between h-[450px] rounded-2xl bg-black/50 border border-white/10 overflow-hidden shadow-inner">
              
              {/* Room Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {activeRoom.messages.map(msg => {
                  const isMe = msg.senderId === currentUser.id;
                  return (
                    <div key={msg.id} className={`flex gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                      {!isMe && (
                        <img src={msg.senderAvatar} alt={msg.senderName} className="w-6 h-6 rounded-full bg-slate-800 shrink-0 self-end" />
                      )}
                      
                      <div className={`max-w-[80%] space-y-1 ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                          <span className="font-bold text-slate-300">{msg.senderName}</span>
                          <span>•</span>
                          <span>{msg.timestamp}</span>
                        </div>

                        <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                          isMe
                            ? `${theme.btnStyle} rounded-br-none shadow-md`
                            : 'bg-[#1c2033] text-slate-200 border border-white/10 rounded-bl-none'
                        }`}>
                          <p>{msg.content}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reaction Buttons Row */}
              <div className="p-2 border-t border-white/10 bg-black/40 flex items-center justify-between gap-1">
                <span className="text-[10px] font-bold text-slate-400 px-2 uppercase">Reactions:</span>
                <div className="flex gap-1.5">
                  {['❤️', '🔥', '👑', '⚡', '🍿', '🦇'].map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => handleSendReaction(emoji)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 hover:scale-125 transition-all text-sm"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendRoomMessage} className="p-3 border-t border-white/10 bg-black/60 flex gap-2">
                <input
                  type="text"
                  value={roomChatInput}
                  onChange={(e) => setRoomChatInput(e.target.value)}
                  placeholder="Chat with watch party..."
                  className="flex-1 bg-[#181c2e] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500"
                />
                <button
                  type="submit"
                  disabled={!roomChatInput.trim()}
                  className={`px-3.5 py-2 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1 ${theme.btnStyle} disabled:opacity-40`}
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

            </div>

          </div>

        </div>
      )}

      {/* Create Room Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-[#0f121d] border border-white/10 p-6 shadow-2xl space-y-5">
            <h3 className="font-heading font-extrabold text-lg text-white">Create New CineRoom Watch Party</h3>

            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1.5">Room Title</label>
                <input
                  type="text"
                  required
                  value={newRoomTitle}
                  onChange={(e) => setNewRoomTitle(e.target.value)}
                  placeholder="e.g. Marvel Multiverse Night, RRR Watch Party"
                  className="w-full bg-[#141724] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1.5">Cinematic Visual Theme</label>
                <select
                  value={newRoomTheme}
                  onChange={(e) => setNewRoomTheme(e.target.value as CineRoomTheme)}
                  className="w-full bg-[#141724] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500"
                >
                  {(Object.keys(themeStyles) as CineRoomTheme[]).map(tKey => (
                    <option key={tKey} value={tKey}>
                      {themeStyles[tKey].name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1.5">Starting Film / Stream</label>
                <select
                  value={newRoomMovieId}
                  onChange={(e) => setNewRoomMovieId(e.target.value)}
                  className="w-full bg-[#141724] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500"
                >
                  {allMovies.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.title} ({m.year}) - {m.industry.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/30"
                >
                  Launch Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
