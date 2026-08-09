import React, { useState } from 'react';
import { Movie, Friend } from '../types/movie';
import { cinemaDb } from '../db/cinemaDatabase';
import { X, Send, Share2, Check, Sparkles, UserCheck } from 'lucide-react';

interface ShareMovieModalProps {
  movie: Movie;
  isOpen: boolean;
  onClose: () => void;
  senderName: string;
  senderAvatar: string;
}

export const ShareMovieModal: React.FC<ShareMovieModalProps> = ({
  movie,
  isOpen,
  onClose,
  senderName,
  senderAvatar
}) => {
  const [selectedFriendId, setSelectedFriendId] = useState<string>('');
  const [note, setNote] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const friends = cinemaDb.getFriends();

  const handleShare = () => {
    if (!selectedFriendId) return;

    cinemaDb.shareMovieWithFriend(
      movie.id,
      selectedFriendId,
      note,
      senderName,
      senderAvatar
    );

    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      onClose();
    }, 1500);
  };

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}?movie=${movie.id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-[#0f121d] border border-white/10 p-6 shadow-2xl space-y-5 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-600/20 border border-red-500/30 text-red-400">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-base text-white">Share Movie with Friends</h3>
              <p className="text-[11px] text-slate-400">Recommend to friends & send directly to their inbox</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Movie Preview Card */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/5">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-12 h-16 object-cover rounded-xl shadow-md border border-white/10 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-red-600/80 text-white inline-block mb-1">
              {movie.industry.toUpperCase()}
            </span>
            <h4 className="font-bold text-xs text-white truncate">{movie.title}</h4>
            <p className="text-[11px] text-slate-400">{movie.year} • ⭐ {movie.imdbRating} IMDB</p>
          </div>
        </div>

        {sentSuccess ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-white">Movie Recommendation Sent!</h4>
            <p className="text-xs text-emerald-400">Delivered directly to your friend's chat inbox.</p>
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* Friend Selector */}
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1.5">
                Select Friend
              </label>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {friends.length === 0 ? (
                  <p className="text-xs text-slate-500 p-2">No friends added yet. Add friends using their #CINE code!</p>
                ) : (
                  friends.map(fr => (
                    <button
                      key={fr.id}
                      type="button"
                      onClick={() => setSelectedFriendId(fr.id)}
                      className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                        selectedFriendId === fr.id
                          ? 'bg-red-600/20 border-red-500 text-white'
                          : 'bg-[#141724] border-white/5 text-slate-300 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <img src={fr.avatarUrl} alt={fr.displayName} className="w-7 h-7 rounded-full bg-slate-800" />
                        <div>
                          <div className="font-bold text-xs text-white">{fr.displayName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{fr.friendCode}</div>
                        </div>
                      </div>
                      {selectedFriendId === fr.id && <UserCheck className="w-4 h-4 text-red-400" />}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Custom Recommendation Note */}
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1.5">
                Personal Note / Why they should watch
              </label>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. You have to check out this battle sequence! Best movie ever."
                className="w-full bg-[#141724] border border-white/10 rounded-xl p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500 resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 transition-all flex items-center justify-center gap-2"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
              </button>

              <button
                type="button"
                disabled={!selectedFriendId}
                onClick={handleShare}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send to Friend</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
