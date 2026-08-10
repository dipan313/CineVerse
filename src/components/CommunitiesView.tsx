import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Community, ChatMessage, VoiceMessage, UserProfile, Movie, IndustryCategory } from '../types/movie';
import { cinemaDb } from '../db/cinemaDatabase';
import { 
  Users, 
  Tv, 
  Mic, 
  Volume2, 
  Play, 
  Upload, 
  Film, 
  Send, 
  Sparkles, 
  MessageSquare, 
  Radio, 
  Plus, 
  LogOut, 
  Compass, 
  Hash, 
  Search, 
  Check, 
  X,
  ChevronLeft,
  Menu
} from 'lucide-react';

interface CommunitiesViewProps {
  currentUser: UserProfile;
  allMovies: Movie[];
  onSelectMovie: (m: Movie) => void;
}

type ChannelTab = 'chat' | 'voice' | 'theater' | 'members';

export const CommunitiesView: React.FC<CommunitiesViewProps> = ({
  currentUser,
  allMovies,
  onSelectMovie
}) => {
  const communities = cinemaDb.getCommunities();
  const joinedCommunities = useMemo(() => communities.filter(c => c.isJoined), [communities]);

  // Mode: 'explore' (search & discover communities) or 'community' (view active community channels)
  const [viewMode, setViewMode] = useState<'explore' | 'community'>(() => 
    joinedCommunities.length > 0 ? 'community' : 'explore'
  );
  
  const [selectedCommunityId, setSelectedCommunityId] = useState<string>(() => 
    joinedCommunities[0]?.id || ''
  );
  
  const [activeChannel, setActiveChannel] = useState<ChannelTab>('chat');
  const [chatInput, setChatInput] = useState('');
  
  // Mobile responsive view toggle (sidebar vs channel workspace)
  const [mobilePane, setMobilePane] = useState<'sidebar' | 'workspace'>('workspace');

  // Community Search & Filter in Explore Mode
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Create Community Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newCommName, setNewCommName] = useState('');
  const [newCommTagline, setNewCommTagline] = useState('');
  const [newCommDesc, setNewCommDesc] = useState('');
  const [newCommCategory, setNewCommCategory] = useState<IndustryCategory | 'general'>('general');
  const [newCommAvatar, setNewCommAvatar] = useState('');
  const [newCommBanner, setNewCommBanner] = useState('');

  // Voice Recording States
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);

  // Theater / Movie Room Player State (NO AUTO PLAY)
  const [roomSourceType, setRoomSourceType] = useState<'none' | 'youtube' | 'local_file'>('none');
  const [activeYoutubeId, setActiveYoutubeId] = useState<string>('');
  const [youtubeInputUrl, setYoutubeInputUrl] = useState('');
  const [localVideoUrl, setLocalVideoUrl] = useState<string | null>(null);
  const [localFileName, setLocalFileName] = useState<string>('');
  const [selectedCatalogMovieId, setSelectedCatalogMovieId] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeCommunity = useMemo(() => {
    return joinedCommunities.find(c => c.id === selectedCommunityId) || joinedCommunities[0] || communities.find(c => c.id === selectedCommunityId) || communities[0];
  }, [joinedCommunities, communities, selectedCommunityId]);

  // Keep chat scrolled to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeCommunity?.messages, activeChannel]);

  // If all communities are left, auto-switch to explore mode
  useEffect(() => {
    if (joinedCommunities.length === 0 && viewMode === 'community') {
      setViewMode('explore');
    }
  }, [joinedCommunities.length, viewMode]);

  // Voice recording timer
  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      setRecordingSeconds(0);
    }
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, [isRecording]);

  const handleStartRecording = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const audioUrl = URL.createObjectURL(audioBlob);
          sendVoiceMessage(audioUrl, recordingSeconds || 4);
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
      } else {
        setIsRecording(true);
      }
    } catch {
      setIsRecording(true);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    } else {
      sendVoiceMessage('simulated_audio', recordingSeconds || 5);
    }
    setIsRecording(false);
  };

  const sendVoiceMessage = (audioUrl: string, duration: number) => {
    if (!activeCommunity) return;

    const voice: VoiceMessage = {
      id: 'voice_' + Date.now(),
      audioBlobUrl: audioUrl,
      durationSeconds: duration,
      senderId: currentUser.id,
      senderName: currentUser.displayName,
      senderAvatar: currentUser.avatarUrl,
      timestamp: 'Just now'
    };

    const newMsg: ChatMessage = {
      id: 'msg_v_' + Date.now(),
      senderId: currentUser.id,
      senderName: currentUser.displayName,
      senderAvatar: currentUser.avatarUrl,
      content: `🎙️ Voice Note (${duration}s)`,
      voiceMessage: voice,
      timestamp: 'Just now'
    };

    cinemaDb.sendCommunityMessage(activeCommunity.id, newMsg);
  };

  const handleSendTextMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeCommunity) return;

    const newMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      senderId: currentUser.id,
      senderName: currentUser.displayName,
      senderAvatar: currentUser.avatarUrl,
      content: chatInput.trim(),
      timestamp: 'Just now'
    };

    cinemaDb.sendCommunityMessage(activeCommunity.id, newMsg);
    setChatInput('');
  };

  const handleCreateCommunitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommName.trim()) return;

    const newCommunity: Community = {
      id: 'comm_' + Date.now(),
      name: newCommName.trim(),
      tagline: newCommTagline.trim() || 'A vibrant cinema guild for true cinephiles',
      description: newCommDesc.trim() || 'Welcome to our film community. Watch movies, share reviews, and exchange voice notes.',
      category: newCommCategory,
      avatar: newCommAvatar.trim() || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(newCommName)}`,
      bannerImage: newCommBanner.trim() || 'https://image.tmdb.org/t/p/original/bOGkgRGdhrBYJSLpXaxhXVstNsV.jpg',
      memberCount: 1,
      isJoined: true,
      members: [
        {
          id: currentUser.id,
          username: currentUser.username,
          displayName: currentUser.displayName,
          avatarUrl: currentUser.avatarUrl,
          friendCode: currentUser.friendCode,
          status: 'online',
          totalWatchedCount: 0
        }
      ],
      messages: [
        {
          id: 'cmsg_' + Date.now(),
          senderId: currentUser.id,
          senderName: currentUser.displayName,
          senderAvatar: currentUser.avatarUrl,
          content: `🎉 Created community "${newCommName.trim()}"! Welcome everyone!`,
          timestamp: 'Just now'
        }
      ],
      movieRoom: {
        isOpen: false,
        sourceType: 'youtube',
        isPlaying: false,
        currentPlayheadSeconds: 0
      },
      createdAt: new Date().toISOString()
    };

    cinemaDb.createCommunity(newCommunity);
    setSelectedCommunityId(newCommunity.id);
    setViewMode('community');
    setActiveChannel('chat');
    setMobilePane('workspace');
    setIsCreateModalOpen(false);
    setNewCommName('');
    setNewCommTagline('');
    setNewCommDesc('');
  };

  const handleJoinCommunity = (commId: string) => {
    cinemaDb.toggleJoinCommunity(commId);
    setSelectedCommunityId(commId);
    setViewMode('community');
    setActiveChannel('chat');
    setMobilePane('workspace');
  };

  const handleLeaveCommunity = (commId: string) => {
    cinemaDb.leaveCommunity(commId);
    const remaining = joinedCommunities.filter(c => c.id !== commId);
    if (remaining.length > 0) {
      setSelectedCommunityId(remaining[0].id);
    } else {
      setViewMode('explore');
    }
  };

  const handleLocalVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLocalVideoUrl(url);
      setLocalFileName(file.name);
      setRoomSourceType('local_file');
    }
  };

  const handlePlayCatalogMovie = (movieId: string) => {
    const m = allMovies.find(item => item.id === movieId);
    if (m && m.trailerYoutubeId) {
      setActiveYoutubeId(m.trailerYoutubeId);
      setRoomSourceType('youtube');
    }
  };

  const handlePlayCustomYoutube = (e: React.FormEvent) => {
    e.preventDefault();
    if (!youtubeInputUrl.trim()) return;

    let id = youtubeInputUrl.trim();
    if (id.includes('v=')) {
      id = id.split('v=')[1]?.split('&')[0] || id;
    } else if (id.includes('youtu.be/')) {
      id = id.split('youtu.be/')[1]?.split('?')[0] || id;
    }

    setActiveYoutubeId(id);
    setRoomSourceType('youtube');
    setYoutubeInputUrl('');
  };

  // Filtered communities in Explore Mode
  const filteredCommunities = useMemo(() => {
    return communities.filter(c => {
      if (selectedCategoryFilter !== 'all' && c.category !== selectedCategoryFilter) return false;
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        return c.name.toLowerCase().includes(q) || c.tagline.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
      }
      return true;
    });
  }, [communities, searchFilter, selectedCategoryFilter]);

  return (
    <div className="w-full">
      
      {/* 3-Column Cinema Server Layout with Clear Bounds & Clean Padding */}
      <div className="h-[calc(100vh-8rem)] min-h-[520px] max-h-[780px] rounded-2xl sm:rounded-3xl bg-[#090b14] border border-white/15 shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Column 1: Server Icons Sidebar (ONLY JOINED GUILDS) */}
        <div className={`w-full md:w-16 bg-[#06080f] border-r border-white/10 p-2 sm:p-2.5 flex md:flex-col items-center justify-between md:justify-start gap-2 overflow-x-auto md:overflow-y-auto shrink-0 select-none ${
          mobilePane === 'workspace' && viewMode === 'community' ? 'hidden md:flex' : 'flex'
        }`}>
          
          {/* Discover Guilds Button */}
          <button
            onClick={() => { setViewMode('explore'); setMobilePane('workspace'); }}
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl transition-all flex items-center justify-center shrink-0 ${
              viewMode === 'explore'
                ? 'bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/40 ring-2 ring-cyan-400'
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
            title="Discover & Search Communities"
          >
            <Compass className="w-5 h-5" />
          </button>

          <div className="hidden md:block w-6 h-[1px] bg-white/10 my-0.5" />

          {/* Joined Guild Icons */}
          <div className="flex md:flex-col items-center gap-2">
            {joinedCommunities.map(comm => {
              const isSelected = viewMode === 'community' && selectedCommunityId === comm.id;
              return (
                <button
                  key={comm.id}
                  onClick={() => { 
                    setSelectedCommunityId(comm.id); 
                    setViewMode('community');
                    setActiveChannel('chat'); 
                    setMobilePane('workspace');
                  }}
                  className={`w-10 h-10 sm:w-11 sm:h-11 transition-all relative group flex items-center justify-center shrink-0 ${
                    isSelected
                      ? 'rounded-xl sm:rounded-2xl ring-2 ring-red-500 shadow-lg shadow-red-600/30'
                      : 'rounded-xl sm:rounded-2xl opacity-75 hover:opacity-100 hover:scale-105'
                  }`}
                  title={comm.name}
                >
                  <img
                    src={comm.avatar}
                    alt={comm.name}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(comm.name)}`;
                    }}
                    className="w-full h-full rounded-xl sm:rounded-2xl object-cover bg-slate-800"
                  />
                  {isSelected && (
                    <span className="hidden md:block absolute -left-2.5 w-1 h-5 bg-red-500 rounded-r-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Add / Create Guild Button */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-white/5 hover:bg-red-600/20 border border-white/10 hover:border-red-500/50 text-slate-300 hover:text-red-400 flex items-center justify-center transition-all shrink-0 md:mt-auto shadow"
            title="Create Your Own Guild"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* VIEW MODE 1: DISCOVER & SEARCH ALL COMMUNITIES */}
        {viewMode === 'explore' ? (
          <div className="flex-1 bg-[#0c0e1b] flex flex-col justify-between p-4 sm:p-6 overflow-y-auto space-y-4">
            
            {/* Explore Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3 sm:pb-4">
              <div className="space-y-0.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-600/20 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold">
                  <Compass className="w-3 h-3" />
                  <span>Discover Film Communities</span>
                </div>
                <h2 className="font-heading font-black text-lg sm:text-2xl text-white">
                  Find & Join Cinema Guilds
                </h2>
                <p className="text-[10px] sm:text-xs text-slate-400">
                  Search by franchise, director, or industry, or create your own custom guild!
                </p>
              </div>

              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-extrabold text-xs shadow-lg shadow-red-600/30 transition-transform hover:scale-105 flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Guild</span>
              </button>
            </div>

            {/* Search & Category Filter */}
            <div className="space-y-2">
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Search communities by name, Marvel, Nolan, Tollywood, Bengali..."
                  className="w-full bg-[#14172a] border border-white/10 rounded-xl pl-10 pr-4 py-2 sm:py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {[
                  { id: 'all', label: 'All Guilds' },
                  { id: 'mcu-dc', label: '🦸‍♂️ Marvel & DC' },
                  { id: 'hollywood', label: '🎬 Hollywood' },
                  { id: 'bollywood', label: '🇮🇳 Bollywood' },
                  { id: 'tollywood', label: '🔥 Tollywood' },
                  { id: 'bengali', label: '🌿 Bengali' },
                  { id: 'general', label: '🍿 General' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategoryFilter(cat.id)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold transition-all shrink-0 border ${
                      selectedCategoryFilter === cat.id
                        ? 'bg-cyan-600 text-white border-cyan-500 shadow'
                        : 'bg-[#121524] text-slate-300 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Communities Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 flex-1">
              {filteredCommunities.map(comm => (
                <div
                  key={comm.id}
                  className="rounded-2xl bg-[#121526] border border-white/10 hover:border-cyan-500/40 transition-all overflow-hidden flex flex-col justify-between shadow-lg group"
                >
                  {/* Banner */}
                  <div className="h-16 sm:h-20 w-full relative overflow-hidden bg-slate-900">
                    <img
                      src={comm.bannerImage}
                      alt={comm.name}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://image.tmdb.org/t/p/original/bOGkgRGdhrBYJSLpXaxhXVstNsV.jpg';
                      }}
                      className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121526] via-transparent to-black/60" />
                    
                    <span className="absolute top-2 right-2 text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/60 text-cyan-300 border border-cyan-500/30">
                      {comm.category.toUpperCase()}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                    <div className="flex items-start gap-2">
                      <img
                        src={comm.avatar}
                        alt={comm.name}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(comm.name)}`;
                        }}
                        className="w-9 h-9 rounded-xl object-cover border border-white/15 shadow -mt-5 relative z-10 bg-slate-800 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-xs text-white truncate">{comm.name}</h4>
                        <p className="text-[9px] text-slate-400 font-medium truncate">{comm.tagline}</p>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">
                      {comm.description}
                    </p>

                    <div className="flex items-center justify-between pt-1.5 border-t border-white/5 text-xs">
                      <span className="text-slate-400 text-[10px]">👥 {comm.memberCount.toLocaleString()}</span>
                      
                      <div className="flex gap-2">
                        {comm.isJoined ? (
                          <button
                            onClick={() => {
                              setSelectedCommunityId(comm.id);
                              setViewMode('community');
                              setActiveChannel('chat');
                              setMobilePane('workspace');
                            }}
                            className="px-3 py-1 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow transition-all"
                          >
                            <span>Open</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleJoinCommunity(comm.id)}
                            className="px-3 py-1 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow transition-all flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Join</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
        ) : (
          /* VIEW MODE 2: ACTIVE COMMUNITY CHANNELS & WORKSPACE */
          <>
            {/* Column 2: Channels List & Community Info Card */}
            <div className={`w-full md:w-56 bg-[#0d0f1c] border-r border-white/10 flex flex-col justify-between shrink-0 ${
              mobilePane === 'workspace' ? 'hidden md:flex' : 'flex'
            }`}>
              
              {/* Community Header Card */}
              <div className="p-3.5 border-b border-white/10 space-y-1 bg-[#101324]/80">
                <div className="flex items-center justify-between gap-1.5">
                  <h3 className="font-heading font-black text-xs sm:text-sm text-white truncate max-w-[130px]">
                    {activeCommunity?.name}
                  </h3>
                  <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-red-600 text-white uppercase shrink-0">
                    {activeCommunity?.category}
                  </span>
                </div>
                <p className="text-[9px] text-slate-400 truncate">
                  {activeCommunity?.tagline}
                </p>
              </div>

              {/* Channels List */}
              <div className="flex-1 p-2 space-y-1 overflow-y-auto">
                <span className="text-[8px] font-black uppercase tracking-wider text-slate-500 px-2 block mb-1">
                  Channels & Rooms
                </span>

                <button
                  onClick={() => { setActiveChannel('chat'); setMobilePane('workspace'); }}
                  className={`w-full p-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    activeChannel === 'chat'
                      ? 'bg-red-600 text-white shadow'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Hash className="w-3.5 h-3.5 opacity-70" />
                  <span>general-chat</span>
                </button>

                <button
                  onClick={() => { setActiveChannel('voice'); setMobilePane('workspace'); }}
                  className={`w-full p-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    activeChannel === 'voice'
                      ? 'bg-red-600 text-white shadow'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5 text-amber-400" />
                  <span>voice-notes</span>
                </button>

                <button
                  onClick={() => { setActiveChannel('theater'); setMobilePane('workspace'); }}
                  className={`w-full p-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    activeChannel === 'theater'
                      ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white shadow'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Tv className="w-3.5 h-3.5 text-cyan-400" />
                  <span>theater-room</span>
                </button>

                <button
                  onClick={() => { setActiveChannel('members'); setMobilePane('workspace'); }}
                  className={`w-full p-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    activeChannel === 'members'
                      ? 'bg-red-600 text-white shadow'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 opacity-70" />
                  <span>members ({activeCommunity?.memberCount.toLocaleString()})</span>
                </button>
              </div>

              {/* Leave Guild Button */}
              <div className="p-2.5 border-t border-white/10 bg-[#0a0c16]">
                <button
                  onClick={() => handleLeaveCommunity(activeCommunity.id)}
                  className="w-full py-1.5 rounded-xl bg-white/5 hover:bg-red-600/20 text-slate-400 hover:text-red-400 border border-white/10 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Leave Community</span>
                </button>
              </div>

            </div>

            {/* Column 3: Active Workspace (Chat, Voice, Theater, Members) */}
            <div className={`flex-1 bg-[#101222] flex flex-col justify-between min-w-0 h-full overflow-hidden ${
              mobilePane === 'sidebar' ? 'hidden md:flex' : 'flex'
            }`}>
              
              {/* Workspace Header Bar */}
              <div className="p-3 sm:p-3.5 border-b border-white/10 bg-[#121526] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  {/* Mobile Back Button */}
                  <button
                    onClick={() => setMobilePane('sidebar')}
                    className="md:hidden p-1.5 rounded-lg bg-white/5 text-slate-300 hover:text-white"
                    title="Back to Channels"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="font-mono text-slate-400 text-xs">#</span>
                  <h4 className="font-heading font-black text-xs sm:text-sm text-white truncate">
                    {activeChannel === 'chat' && 'general-chat'}
                    {activeChannel === 'voice' && 'voice-notes-lounge'}
                    {activeChannel === 'theater' && 'theater-movie-room'}
                    {activeChannel === 'members' && 'members-directory'}
                  </h4>
                </div>

                <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-slate-400">
                  <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                  <span>{activeCommunity?.memberCount.toLocaleString()} Cinephiles</span>
                </div>
              </div>

              {/* CHANNEL CONTENT 1: GENERAL CHAT */}
              {activeChannel === 'chat' && (
                <>
                  {/* Chat Stream */}
                  <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3">
                    {activeCommunity?.messages.map(msg => {
                      const isMe = msg.senderId === currentUser.id;
                      return (
                        <div key={msg.id} className={`flex gap-2 sm:gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                          {!isMe && (
                            <img src={msg.senderAvatar} alt={msg.senderName} className="w-7 h-7 rounded-full bg-slate-800 shrink-0 self-end" />
                          )}

                          <div className={`max-w-[85%] space-y-0.5 ${isMe ? 'items-end' : 'items-start'}`}>
                            <div className="flex items-center gap-1 text-[9px] text-slate-400">
                              <span className="font-bold text-slate-300">{msg.senderName}</span>
                              <span>•</span>
                              <span>{msg.timestamp}</span>
                            </div>

                            <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                              isMe
                                ? 'bg-red-600 text-white rounded-br-none shadow-md'
                                : 'bg-[#181c30] text-slate-200 border border-white/10 rounded-bl-none'
                            }`}>
                              {msg.voiceMessage ? (
                                <div className="flex items-center gap-2 py-0.5">
                                  <div className="p-1.5 rounded-lg bg-white/10 text-amber-300">
                                    <Volume2 className="w-3.5 h-3.5" />
                                  </div>
                                  <div>
                                    <span className="text-[10px] font-mono text-amber-300 block">
                                      Voice Note ({msg.voiceMessage.durationSeconds}s)
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <p>{msg.content}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Pinned Chat Input */}
                  <div className="p-2.5 sm:p-3 bg-[#121526] border-t border-white/10 shrink-0">
                    {isRecording ? (
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-red-950/60 border border-red-500/40 animate-pulse">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                          <span className="text-[11px] sm:text-xs font-bold text-red-300">Recording... ({recordingSeconds}s)</span>
                        </div>
                        <button
                          onClick={handleStopRecording}
                          className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow"
                        >
                          Send Note
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleSendTextMessage} className="flex gap-2">
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          placeholder={`Message #${activeCommunity?.name}...`}
                          className="flex-1 bg-[#181c30] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500"
                        />

                        <button
                          type="button"
                          onClick={handleStartRecording}
                          className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 transition-colors"
                          title="Record Voice Note"
                        >
                          <Mic className="w-4 h-4" />
                        </button>

                        <button
                          type="submit"
                          disabled={!chatInput.trim()}
                          className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white font-bold text-xs shadow transition-all flex items-center gap-1"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    )}
                  </div>
                </>
              )}

              {/* CHANNEL CONTENT 2: VOICE NOTES LOUNGE */}
              {activeChannel === 'voice' && (
                <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-xl">
                    <Mic className="w-8 h-8 animate-pulse" />
                  </div>

                  <div className="space-y-1 max-w-sm">
                    <h4 className="font-heading font-black text-base text-white">
                      Voice Discussion Lounge
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Record audio commentary, scene breakdowns, and voice notes with the entire community.
                    </p>
                  </div>

                  {isRecording ? (
                    <div className="space-y-3">
                      <div className="text-red-400 font-mono text-base font-black animate-pulse">
                        RECORDING: {recordingSeconds}s
                      </div>
                      <button
                        onClick={handleStopRecording}
                        className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs shadow-lg"
                      >
                        Finish & Send Voice Note
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleStartRecording}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-500 hover:to-red-500 text-white font-black text-xs shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
                    >
                      <Mic className="w-4 h-4" />
                      <span>Start Audio Recording</span>
                    </button>
                  )}
                </div>
              )}

              {/* CHANNEL CONTENT 3: THEATER / MOVIE ROOM */}
              {activeChannel === 'theater' && (
                <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3 flex flex-col justify-between">
                  
                  {/* Screen */}
                  <div className="aspect-video max-h-[46vh] w-full rounded-2xl bg-black border border-white/10 overflow-hidden shadow-2xl relative flex items-center justify-center">
                    {roomSourceType === 'youtube' && activeYoutubeId ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${activeYoutubeId}?autoplay=1&mute=0&controls=1`}
                        title="Community Movie Stream"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    ) : roomSourceType === 'local_file' && localVideoUrl ? (
                      <video
                        src={localVideoUrl}
                        controls
                        autoPlay
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-center p-6 space-y-2 max-w-sm">
                        <div className="w-12 h-12 rounded-2xl bg-red-600/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto shadow">
                          <Tv className="w-6 h-6" />
                        </div>
                        <h4 className="font-heading font-black text-sm text-white">
                          Theater Screen Ready (No Stream Playing)
                        </h4>
                        <p className="text-[10px] text-slate-400">
                          Select a film trailer below, paste a YouTube link, or upload your downloaded video file.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="p-3 rounded-xl bg-[#0c0f1e] border border-white/10 space-y-2">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div className="flex-1 w-full flex gap-2">
                        <select
                          value={selectedCatalogMovieId}
                          onChange={(e) => {
                            setSelectedCatalogMovieId(e.target.value);
                            handlePlayCatalogMovie(e.target.value);
                          }}
                          className="bg-[#181c30] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-red-500 flex-1"
                        >
                          <option value="">🎬 Select Movie Trailer from Catalog...</option>
                          {allMovies.map(m => (
                            <option key={m.id} value={m.id}>
                              {m.title} ({m.year})
                            </option>
                          ))}
                        </select>
                      </div>

                      <label className="px-3 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 font-bold text-xs cursor-pointer transition-all flex items-center gap-1 shrink-0">
                        <Upload className="w-3 h-3" />
                        <span>{localFileName ? localFileName.slice(0, 12) + '...' : 'Upload Video'}</span>
                        <input type="file" accept="video/*" onChange={handleLocalVideoUpload} className="hidden" />
                      </label>

                      {roomSourceType !== 'none' && (
                        <button
                          onClick={() => { setRoomSourceType('none'); setActiveYoutubeId(''); setLocalVideoUrl(null); }}
                          className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-red-600/20 text-slate-400 hover:text-red-400 text-xs font-bold border border-white/10 transition-colors"
                        >
                          Stop
                        </button>
                      )}
                    </div>

                    <form onSubmit={handlePlayCustomYoutube} className="flex gap-2">
                      <input
                        type="text"
                        value={youtubeInputUrl}
                        onChange={(e) => setYoutubeInputUrl(e.target.value)}
                        placeholder="Or paste any YouTube URL..."
                        className="flex-1 bg-[#181c30] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500"
                      />
                      <button
                        type="submit"
                        disabled={!youtubeInputUrl.trim()}
                        className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white font-bold text-xs shadow transition-all flex items-center gap-1"
                      >
                        <Play className="w-3 h-3" />
                        <span>Play</span>
                      </button>
                    </form>
                  </div>

                </div>
              )}

              {/* CHANNEL CONTENT 4: MEMBERS LIST */}
              {activeChannel === 'members' && (
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  <h4 className="font-heading font-black text-xs text-white">
                    Community Members ({activeCommunity?.memberCount.toLocaleString()})
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="p-3 rounded-xl bg-[#15182c] border border-white/10 flex items-center gap-2.5">
                      <img src={currentUser.avatarUrl} alt={currentUser.displayName} className="w-8 h-8 rounded-lg bg-slate-800" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-white">{currentUser.displayName}</span>
                          <span className="text-[8px] font-bold px-1 py-0.5 rounded bg-emerald-600 text-white">You</span>
                        </div>
                        <span className="text-[9px] font-mono text-amber-400">{currentUser.friendCode}</span>
                      </div>
                    </div>

                    {activeCommunity?.members.map(mem => (
                      <div key={mem.id} className="p-3 rounded-xl bg-[#15182c] border border-white/5 flex items-center gap-2.5">
                        <img src={mem.avatarUrl} alt={mem.displayName} className="w-8 h-8 rounded-lg bg-slate-800" />
                        <div className="min-w-0 flex-1">
                          <h5 className="font-bold text-xs text-white truncate">{mem.displayName}</h5>
                          <span className="text-[9px] font-mono text-slate-400">{mem.friendCode}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </>
        )}

      </div>

      {/* CREATE COMMUNITY MODAL */}
      {isCreateModalOpen && (
        <div 
          onClick={() => setIsCreateModalOpen(false)}
          className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-2xl p-3 sm:p-6 flex flex-col items-center justify-center animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl bg-[#0e111d] border border-red-500/40 shadow-2xl p-4 sm:p-6 space-y-3 my-auto relative"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-red-600 text-white">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="font-heading font-black text-sm sm:text-base text-white">Create New Film Guild</h3>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCommunitySubmit} className="space-y-2.5">
              <div>
                <label className="text-[10px] sm:text-[11px] font-bold text-slate-300 block mb-1">Guild Name</label>
                <input
                  type="text"
                  required
                  value={newCommName}
                  onChange={(e) => setNewCommName(e.target.value)}
                  placeholder="e.g. Marvel Multiverse Club, Nolan Society"
                  className="w-full bg-[#161a29] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-[10px] sm:text-[11px] font-bold text-slate-300 block mb-1">Cinema Category</label>
                <select
                  value={newCommCategory}
                  onChange={(e) => setNewCommCategory(e.target.value as any)}
                  className="w-full bg-[#161a29] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                >
                  <option value="general">General Film Lovers</option>
                  <option value="mcu-dc">Marvel & DC Sagas</option>
                  <option value="hollywood">Hollywood Auteurs</option>
                  <option value="bollywood">Bollywood (Hindi)</option>
                  <option value="tollywood">Tollywood / South Indian</option>
                  <option value="bengali">Bengali Cinema (বাংলা)</option>
                  <option value="international">International / Anime</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] sm:text-[11px] font-bold text-slate-300 block mb-1">Short Tagline</label>
                <input
                  type="text"
                  value={newCommTagline}
                  onChange={(e) => setNewCommTagline(e.target.value)}
                  placeholder="e.g. Discussing Phase 1-6 lore and breakdowns"
                  className="w-full bg-[#161a29] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-[10px] sm:text-[11px] font-bold text-slate-300 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newCommDesc}
                  onChange={(e) => setNewCommDesc(e.target.value)}
                  placeholder="Describe your community's purpose..."
                  className="w-full bg-[#161a29] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/30"
                >
                  Create Guild
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
