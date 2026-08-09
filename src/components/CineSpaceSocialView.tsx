import React, { useState } from 'react';
import { CineSpacePost, Movie, UserProfile } from '../types/movie';
import { cinemaDb } from '../db/cinemaDatabase';
import { 
  Sparkles, 
  Send, 
  Film, 
  Flame, 
  Heart, 
  Crown, 
  MessageSquare, 
  Share2, 
  TrendingUp, 
  Trophy, 
  Plus, 
  CheckCircle,
  Tag
} from 'lucide-react';

interface CineSpaceSocialViewProps {
  currentUser: UserProfile;
  allMovies: Movie[];
  onSelectMovie: (m: Movie) => void;
}

export const CineSpaceSocialView: React.FC<CineSpaceSocialViewProps> = ({
  currentUser,
  allMovies,
  onSelectMovie
}) => {
  const posts = cinemaDb.getCineSpacePosts();
  const communityRatings = cinemaDb.getCineVerseCommunityRatings();

  const [isPosting, setIsPosting] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [selectedMovieId, setSelectedMovieId] = useState<string>('');
  const [userRole, setUserRole] = useState<CineSpacePost['author']['role']>('Pro Cinephile');

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    const taggedMovie = allMovies.find(m => m.id === selectedMovieId);

    const newPost: CineSpacePost = {
      id: 'post_' + Date.now(),
      author: {
        id: currentUser.id,
        name: currentUser.displayName,
        avatar: currentUser.avatarUrl,
        friendCode: currentUser.friendCode,
        role: userRole,
        badgeColor: userRole === 'Verified Filmmaker' || userRole === 'Director' ? 'bg-red-600' : 'bg-blue-600'
      },
      content: postContent.trim(),
      taggedMovie,
      reactions: { fire: 1, heart: 1, crown: 0, popcorn: 0, mindblown: 0 },
      userReactions: ['fire'],
      commentsCount: 0,
      createdAt: 'Just now'
    };

    cinemaDb.createCineSpacePost(newPost);
    setPostContent('');
    setSelectedMovieId('');
    setIsPosting(false);
  };

  const handleReaction = (postId: string, reactionKey: 'fire' | 'heart' | 'crown' | 'popcorn' | 'mindblown') => {
    cinemaDb.togglePostReaction(postId, reactionKey);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#17091f] via-[#120e24] to-[#09152b] border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CineSpace • Filmmakers & Audience Lounge</span>
            </div>
            <h2 className="font-heading font-black text-3xl text-white tracking-tight">
              Filmmaker Insights, Thoughts & User Rating Chart
            </h2>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              Where directors, writers, critics, and cinephiles connect directly with movie lovers. Share reviews, behind-the-scenes thoughts, and shape the live CineVerse audience ratings!
            </p>
          </div>

          <button
            onClick={() => setIsPosting(true)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-extrabold text-xs shadow-xl shadow-red-600/30 transition-transform hover:scale-105 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Thought / Review</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Social Feed + Community Ratings Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: CineSpace Feed (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* New Post Creation Drawer */}
          {isPosting && (
            <div className="p-6 rounded-3xl bg-[#0f121d] border border-red-500/40 shadow-2xl animate-in slide-in-from-top-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-heading font-extrabold text-base text-white">Publish to CineSpace</h4>
                <button onClick={() => setIsPosting(false)} className="text-slate-400 hover:text-white text-xs">
                  Cancel
                </button>
              </div>

              <form onSubmit={handleCreatePost} className="space-y-3">
                <div className="flex gap-2">
                  <select
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value as any)}
                    className="bg-[#181c2e] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="Pro Cinephile">Pro Cinephile</option>
                    <option value="Verified Filmmaker">Verified Filmmaker</option>
                    <option value="Director">Director / Screenwriter</option>
                    <option value="Film Critic">Film Critic</option>
                  </select>

                  <select
                    value={selectedMovieId}
                    onChange={(e) => setSelectedMovieId(e.target.value)}
                    className="flex-1 bg-[#181c2e] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="">Tag a Movie (Optional)</option>
                    {allMovies.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.title} ({m.year})
                      </option>
                    ))}
                  </select>
                </div>

                <textarea
                  rows={3}
                  required
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Share your filmmaking thoughts, critical analysis, or audience review..."
                  className="w-full bg-[#141724] border border-white/10 rounded-2xl p-4 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500 resize-none"
                />

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition-all flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish Post</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Social Posts Feed */}
          <div className="space-y-4">
            {posts.map(post => (
              <div
                key={post.id}
                className="p-6 rounded-3xl bg-[#0f121d] border border-white/10 hover:border-white/20 transition-all shadow-xl space-y-4"
              >
                {/* Author Bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-10 h-10 rounded-2xl bg-slate-800 border border-white/10"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-white">{post.author.name}</h4>
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded text-white ${post.author.badgeColor || 'bg-blue-600'}`}>
                          {post.author.role}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span className="font-mono">{post.author.friendCode}</span>
                        <span>•</span>
                        <span>{post.createdAt}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </p>

                {/* Tagged Movie Card Attachment */}
                {post.taggedMovie && (
                  <div
                    onClick={() => onSelectMovie(post.taggedMovie!)}
                    className="p-3 rounded-2xl bg-black/40 border border-white/10 hover:border-red-500/40 transition-all cursor-pointer flex items-center gap-3"
                  >
                    <img
                      src={post.taggedMovie.poster}
                      alt={post.taggedMovie.title}
                      className="w-12 h-16 object-cover rounded-xl border border-white/10 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-red-600 text-white inline-block mb-1">
                        {post.taggedMovie.industry.toUpperCase()}
                      </span>
                      <h5 className="font-bold text-xs text-white truncate">{post.taggedMovie.title}</h5>
                      <p className="text-[11px] text-slate-400">{post.taggedMovie.year} • ⭐ {post.taggedMovie.imdbRating} IMDB</p>
                    </div>
                  </div>
                )}

                {/* Reactions Footer */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReaction(post.id, 'fire')}
                      className={`px-2.5 py-1 rounded-xl border transition-all flex items-center gap-1.5 ${
                        post.userReactions.includes('fire')
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-400 font-bold'
                          : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-300'
                      }`}
                    >
                      <span>🔥</span>
                      <span>{post.reactions.fire}</span>
                    </button>

                    <button
                      onClick={() => handleReaction(post.id, 'heart')}
                      className={`px-2.5 py-1 rounded-xl border transition-all flex items-center gap-1.5 ${
                        post.userReactions.includes('heart')
                          ? 'bg-red-500/20 border-red-500/40 text-red-400 font-bold'
                          : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-300'
                      }`}
                    >
                      <span>❤️</span>
                      <span>{post.reactions.heart}</span>
                    </button>

                    <button
                      onClick={() => handleReaction(post.id, 'crown')}
                      className={`px-2.5 py-1 rounded-xl border transition-all flex items-center gap-1.5 ${
                        post.userReactions.includes('crown')
                          ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400 font-bold'
                          : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-300'
                      }`}
                    >
                      <span>👑</span>
                      <span>{post.reactions.crown}</span>
                    </button>

                    <button
                      onClick={() => handleReaction(post.id, 'mindblown')}
                      className={`px-2.5 py-1 rounded-xl border transition-all flex items-center gap-1.5 ${
                        post.userReactions.includes('mindblown')
                          ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400 font-bold'
                          : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-300'
                      }`}
                    >
                      <span>⚡</span>
                      <span>{post.reactions.mindblown}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{post.commentsCount} Comments</span>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>

        {/* Right Column: CineVerse Community Ratings Chart (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-red-600/20 via-amber-500/10 to-transparent border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="font-heading font-black text-sm text-white">CineVerse Reaction Score</h3>
                <p className="text-[10px] text-slate-400">Ranked purely by CineVerse audience reviews</p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold text-amber-400 px-2 py-0.5 rounded bg-black/60">
              LIVE INDEX
            </span>
          </div>

          <div className="space-y-3">
            {communityRatings.slice(0, 8).map((rating, idx) => (
              <div
                key={rating.movieId}
                onClick={() => {
                  const m = allMovies.find(item => item.id === rating.movieId);
                  if (m) onSelectMovie(m);
                }}
                className="p-3.5 rounded-2xl bg-[#0f121d] border border-white/5 hover:border-red-500/30 transition-all cursor-pointer flex items-center gap-3.5 shadow-lg group"
              >
                {/* Rank Badge */}
                <div className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center shrink-0 ${
                  idx === 0
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30'
                    : (idx === 1 ? 'bg-slate-300 text-black' : (idx === 2 ? 'bg-amber-700 text-white' : 'bg-white/5 text-slate-400'))
                }`}>
                  #{idx + 1}
                </div>

                <img
                  src={rating.poster}
                  alt={rating.movieTitle}
                  className="w-10 h-14 object-cover rounded-xl border border-white/10 shrink-0 group-hover:scale-105 transition-transform"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-xs text-white truncate group-hover:text-red-400 transition-colors">
                      {rating.movieTitle}
                    </h5>
                    <span className="font-mono font-black text-xs text-amber-400">
                      {rating.cineverseScore}/10
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {rating.year} • {rating.industry.toUpperCase()} • {rating.positiveReactionPercentage}% Positivity
                  </p>

                  <div className="text-[9px] text-emerald-400 font-semibold mt-1">
                    {rating.topAudienceVerdict} ({rating.totalUserVotes} Votes)
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};
