import React, { useState } from 'react';
import { Friend, Movie, ChatMessage, UserProfile } from '../types/movie';
import { cinemaDb } from '../db/cinemaDatabase';
import { 
  Users, 
  UserPlus, 
  Copy, 
  Check, 
  MessageSquare, 
  Send, 
  Film, 
  Play, 
  Plus, 
  Eye, 
  Sparkles, 
  Tv, 
  Flame, 
  Heart,
  Share2
} from 'lucide-react';

interface FriendsViewProps {
  currentUser: UserProfile;
  onSelectMovie: (m: Movie) => void;
  onToggleWatchlist: (m: Movie) => void;
  onToggleWatched: (m: Movie) => void;
}

export const FriendsView: React.FC<FriendsViewProps> = ({
  currentUser,
  onSelectMovie,
  onToggleWatchlist,
  onToggleWatched
}) => {
  const [friendCodeInput, setFriendCodeInput] = useState('');
  const [codeAddMessage, setCodeAddMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeFriendChat, setActiveFriendChat] = useState<Friend | null>(() => {
    const friends = cinemaDb.getFriends();
    return friends[0] || null;
  });
  const [chatInput, setChatInput] = useState('');

  const friends = cinemaDb.getFriends();
  const sharedRecs = cinemaDb.getFriends(); // shared recommendations from friends

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentUser.friendCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendCodeInput.trim()) return;

    const res = cinemaDb.addFriendByCode(friendCodeInput);
    setCodeAddMessage({ text: res.message, isError: !res.success });
    if (res.success && res.friend) {
      setActiveFriendChat(res.friend);
      setFriendCodeInput('');
    }
    setTimeout(() => setCodeAddMessage(null), 4000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeFriendChat) return;

    const newMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      senderId: currentUser.id,
      senderName: currentUser.displayName,
      senderAvatar: currentUser.avatarUrl,
      content: chatInput.trim(),
      timestamp: 'Just now'
    };

    cinemaDb.sendDirectMessage(activeFriendChat.id, newMsg);
    setChatInput('');
  };

  const currentMessages = activeFriendChat ? cinemaDb.getDirectMessages(activeFriendChat.id) : [];

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Banner: Friend Code & Add Friend */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#121626] via-[#10131f] to-[#121626] border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Left: Your Friend Code */}
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-red-600/20 text-red-400 border border-red-500/30">
                <Users className="w-4 h-4" />
              </span>
              <h2 className="font-heading font-extrabold text-lg text-white">Your Cinema Friend Profile</h2>
            </div>

            <p className="text-xs text-slate-400">
              Share your personal friend code with other cinephiles to connect, recommend movies, and chat in real-time.
            </p>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2.5 rounded-2xl bg-black/60 border border-white/15 font-mono font-bold text-sm text-amber-400 tracking-wider flex items-center gap-2 shadow-inner">
                <span>{currentUser.friendCode}</span>
              </div>
              <button
                onClick={handleCopyCode}
                className="px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/25 transition-all flex items-center gap-2"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCode ? 'Code Copied!' : 'Copy Code'}</span>
              </button>
            </div>
          </div>

          {/* Right: Add Friend by Code */}
          <div className="md:col-span-6 md:border-l md:border-white/10 md:pl-6 space-y-3">
            <h3 className="font-bold text-xs text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-red-500" />
              <span>Connect with a Friend</span>
            </h3>

            <form onSubmit={handleAddFriend} className="flex gap-2">
              <input
                type="text"
                value={friendCodeInput}
                onChange={(e) => setFriendCodeInput(e.target.value)}
                placeholder="Enter friend code e.g. #STK-3000"
                className="flex-1 bg-[#141724] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500 uppercase font-mono"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-white/15 text-xs font-bold text-white transition-all shrink-0 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </form>

            {codeAddMessage && (
              <p className={`text-xs font-semibold ${codeAddMessage.isError ? 'text-red-400' : 'text-emerald-400'}`}>
                {codeAddMessage.text}
              </p>
            )}
          </div>

        </div>
      </div>

      {/* Main Friends Grid: Friends List & Live Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Friends List & Live Activity (4 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-heading font-extrabold text-sm text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-red-500" />
              <span>Your Friends ({friends.length})</span>
            </h3>
            <span className="text-[11px] text-slate-400">
              {friends.filter(f => f.status === 'online').length} online now
            </span>
          </div>

          <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
            {friends.map(fr => (
              <div
                key={fr.id}
                onClick={() => setActiveFriendChat(fr)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  activeFriendChat?.id === fr.id
                    ? 'bg-red-600/10 border-red-500/50 shadow-lg shadow-red-600/10'
                    : 'bg-[#10131f] border-white/5 hover:border-white/15'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <img src={fr.avatarUrl} alt={fr.displayName} className="w-10 h-10 rounded-2xl bg-slate-800" />
                    <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#10131f] ${
                      fr.status === 'online' ? 'bg-emerald-500' : (fr.status === 'watching' ? 'bg-amber-400' : 'bg-slate-600')
                    }`} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs text-white truncate">{fr.displayName}</h4>
                      <span className="text-[9px] font-mono text-slate-400">{fr.friendCode}</span>
                    </div>
                    {fr.currentlyWatching ? (
                      <p className="text-[11px] text-amber-400/90 truncate flex items-center gap-1 mt-0.5">
                        <Film className="w-3 h-3 shrink-0" />
                        <span>Watching {fr.currentlyWatching.movieTitle}</span>
                      </p>
                    ) : (
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {fr.totalWatchedCount} films watched
                      </p>
                    )}
                  </div>
                </div>

                <div className="shrink-0 p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white">
                  <MessageSquare className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Direct 1-on-1 Chat Box (7 cols) */}
        <div className="lg:col-span-7">
          {activeFriendChat ? (
            <div className="h-[580px] rounded-3xl bg-[#0f121d] border border-white/10 flex flex-col justify-between shadow-2xl overflow-hidden">
              
              {/* Chat Top Bar */}
              <div className="p-4 border-b border-white/10 bg-[#121626]/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={activeFriendChat.avatarUrl} alt={activeFriendChat.displayName} className="w-9 h-9 rounded-2xl bg-slate-800" />
                  <div>
                    <h4 className="font-heading font-extrabold text-sm text-white">{activeFriendChat.displayName}</h4>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span className={`w-2 h-2 rounded-full ${
                        activeFriendChat.status === 'online' ? 'bg-emerald-500' : 'bg-amber-400'
                      }`} />
                      <span>{activeFriendChat.status === 'online' ? 'Online' : 'Watching a Film'}</span>
                      <span>•</span>
                      <span className="font-mono">{activeFriendChat.friendCode}</span>
                    </div>
                  </div>
                </div>

                {activeFriendChat.currentlyWatching && (
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-400">
                    <Tv className="w-3 h-3" />
                    <span className="truncate max-w-[140px]">{activeFriendChat.currentlyWatching.movieTitle}</span>
                  </div>
                )}
              </div>

              {/* Chat Messages Log */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
                {currentMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-2">
                    <MessageSquare className="w-8 h-8 opacity-40 text-red-500" />
                    <p className="text-xs">No messages yet with {activeFriendChat.displayName}.</p>
                    <p className="text-[11px] text-slate-600">Recommend a movie or start the conversation!</p>
                  </div>
                ) : (
                  currentMessages.map(msg => {
                    const isMe = msg.senderId === currentUser.id || msg.senderId === 'me';
                    return (
                      <div key={msg.id} className={`flex gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                        {!isMe && (
                          <img src={msg.senderAvatar} alt={msg.senderName} className="w-7 h-7 rounded-full bg-slate-800 shrink-0 self-end" />
                        )}
                        
                        <div className={`max-w-[75%] space-y-1.5 ${isMe ? 'items-end' : 'items-start'}`}>
                          <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                            isMe 
                              ? 'bg-red-600 text-white rounded-br-none shadow-md' 
                              : 'bg-[#181c2e] text-slate-200 border border-white/10 rounded-bl-none'
                          }`}>
                            <p>{msg.content}</p>

                            {/* Attached Movie Card Preview */}
                            {msg.movieAttachment && (
                              <div className="mt-2.5 p-2 rounded-xl bg-black/40 border border-white/10 flex items-center gap-2.5">
                                <img
                                  src={msg.movieAttachment.poster}
                                  alt={msg.movieAttachment.title}
                                  className="w-10 h-14 object-cover rounded-lg border border-white/10 shrink-0"
                                />
                                <div className="min-w-0 flex-1">
                                  <div className="font-bold text-[11px] text-white truncate">
                                    {msg.movieAttachment.title}
                                  </div>
                                  <div className="text-[10px] text-slate-300">
                                    {msg.movieAttachment.year} • ⭐ {msg.movieAttachment.imdbRating}
                                  </div>
                                  <button
                                    onClick={() => onSelectMovie(msg.movieAttachment!)}
                                    className="mt-1 px-2 py-0.5 rounded bg-red-600/90 text-white text-[9px] font-bold hover:bg-red-500 transition-colors"
                                  >
                                    View Movie
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>

                          <span className="text-[9px] text-slate-500 px-1">{msg.timestamp}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 bg-[#121626]/90 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={`Message ${activeFriendChat.displayName}...`}
                  className="flex-1 bg-[#181c2e] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition-all flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

            </div>
          ) : (
            <div className="h-[580px] rounded-3xl bg-[#0f121d] border border-white/10 flex items-center justify-center text-center p-8 text-slate-500">
              <p className="text-xs">Select a friend to begin chatting and sharing movies.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
