import React, { useState, useRef, useEffect } from 'react';
import { Community, ChatMessage, VoiceMessage, UserProfile, Movie } from '../types/movie';
import { cinemaDb } from '../db/cinemaDatabase';
import { 
  Users, 
  Tv, 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Upload, 
  Film, 
  Send, 
  Sparkles, 
  MessageSquare, 
  Volume2, 
  Check, 
  Plus, 
  Radio, 
  ExternalLink,
  Flame,
  Globe
} from 'lucide-react';

interface CommunitiesViewProps {
  currentUser: UserProfile;
  allMovies: Movie[];
  onSelectMovie: (m: Movie) => void;
}

export const CommunitiesView: React.FC<CommunitiesViewProps> = ({
  currentUser,
  allMovies,
  onSelectMovie
}) => {
  const communities = cinemaDb.getCommunities();
  const [selectedCommunityId, setSelectedCommunityId] = useState<string>(communities[0]?.id || '');
  const [chatInput, setChatInput] = useState('');
  
  // Voice Recording States
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);

  // Community Movie Room States
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [roomSourceType, setRoomSourceType] = useState<'youtube' | 'local_file'>('youtube');
  const [customYoutubeUrl, setCustomYoutubeUrl] = useState('');
  const [localVideoUrl, setLocalVideoUrl] = useState<string | null>(null);
  const [localFileName, setLocalFileName] = useState<string>('');

  const activeCommunity = communities.find(c => c.id === selectedCommunityId) || communities[0];

  // Recording Timer
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

  // Escape key listener to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isRoomModalOpen) {
        setIsRoomModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRoomModalOpen]);

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
        // Fallback for non-supported browsers: simulated voice note
        setIsRecording(true);
      }
    } catch {
      // Permission denied / fallback
      setIsRecording(true);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    } else {
      // Simulated voice note dispatch
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

  const handleLocalVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLocalVideoUrl(url);
      setLocalFileName(file.name);
      setRoomSourceType('local_file');
    }
  };

  const handleToggleJoin = (commId: string) => {
    cinemaDb.toggleJoinCommunity(commId);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#140b24] via-[#0f1224] to-[#0a1529] border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-bold">
              <Users className="w-3.5 h-3.5" />
              <span>CineVerse Community Guilds</span>
            </div>
            <h2 className="font-heading font-black text-3xl text-white tracking-tight">
              Film Communities & Group Movie Rooms
            </h2>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              Join Marvel, DC, Tollywood, Bengal, and Hollywood auteur communities. Connect with fellow cinephiles, exchange voice notes, and watch movies together via YouTube or your own local downloaded video files!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRoomModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-extrabold text-xs shadow-xl shadow-red-600/30 transition-transform hover:scale-105 flex items-center gap-2"
            >
              <Tv className="w-4 h-4" />
              <span>Enter Community Movie Room</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Communities Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Community Selector Cards (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="font-heading font-extrabold text-sm text-white px-1">
            Explore Communities ({communities.length})
          </h3>

          <div className="space-y-3">
            {communities.map(comm => (
              <div
                key={comm.id}
                onClick={() => setSelectedCommunityId(comm.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                  selectedCommunityId === comm.id
                    ? 'bg-[#15192e] border-red-500 shadow-lg shadow-red-600/10'
                    : 'bg-[#0f121d] border-white/5 hover:border-white/15'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img src={comm.avatar} alt={comm.name} className="w-12 h-12 rounded-2xl object-cover border border-white/10 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-red-600/80 text-white inline-block mb-1">
                      {comm.category.toUpperCase()}
                    </span>
                    <h4 className="font-bold text-xs text-white truncate">{comm.name}</h4>
                    <p className="text-[10px] text-slate-400 font-medium truncate">{comm.tagline}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[11px] text-slate-400">
                  <span>👥 {comm.memberCount.toLocaleString()} Members</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleJoin(comm.id);
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      comm.isJoined
                        ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-white/10 hover:bg-red-600 text-white'
                    }`}
                  >
                    {comm.isJoined ? 'Joined' : 'Join'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Community Hub, Chat & Voice Notes (8 cols) */}
        <div className="lg:col-span-8">
          {activeCommunity && (
            <div className="rounded-3xl bg-[#0f121d] border border-white/10 flex flex-col justify-between h-[650px] shadow-2xl overflow-hidden">
              
              {/* Community Banner & Top Info */}
              <div className="relative h-28 w-full overflow-hidden bg-slate-900 border-b border-white/10">
                <img
                  src={activeCommunity.bannerImage}
                  alt={activeCommunity.name}
                  className="w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f121d] via-transparent to-black/60" />

                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={activeCommunity.avatar} alt={activeCommunity.name} className="w-10 h-10 rounded-2xl object-cover border border-white/20 shadow-lg" />
                    <div>
                      <h3 className="font-heading font-black text-base text-white truncate max-w-sm">{activeCommunity.name}</h3>
                      <p className="text-[10px] text-slate-300 font-medium">{activeCommunity.tagline}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsRoomModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
                  >
                    <Tv className="w-3.5 h-3.5" />
                    <span>Watch Room</span>
                  </button>
                </div>
              </div>

              {/* Chat Feed */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3.5">
                {activeCommunity.messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-2">
                    <MessageSquare className="w-8 h-8 opacity-40 text-red-500" />
                    <p className="text-xs">No community messages yet. Start the discussion or record a voice note!</p>
                  </div>
                ) : (
                  activeCommunity.messages.map(msg => {
                    const isMe = msg.senderId === currentUser.id;
                    return (
                      <div key={msg.id} className={`flex gap-3 ${isMe ? 'justify-end' : 'justify-start'}`}>
                        {!isMe && (
                          <img src={msg.senderAvatar} alt={msg.senderName} className="w-8 h-8 rounded-full bg-slate-800 shrink-0 self-end" />
                        )}

                        <div className={`max-w-[80%] space-y-1 ${isMe ? 'items-end' : 'items-start'}`}>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                            <span className="font-bold text-slate-300">{msg.senderName}</span>
                            <span>•</span>
                            <span>{msg.timestamp}</span>
                          </div>

                          <div className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                            isMe
                              ? 'bg-red-600 text-white rounded-br-none shadow-md'
                              : 'bg-[#161a2b] text-slate-200 border border-white/10 rounded-bl-none'
                          }`}>
                            {msg.voiceMessage ? (
                              <div className="flex items-center gap-3 py-1">
                                <div className="p-2 rounded-xl bg-white/10 text-amber-300">
                                  <Volume2 className="w-4 h-4" />
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1">
                                    <span className="w-1 h-3 bg-amber-400 rounded-full animate-pulse" />
                                    <span className="w-1 h-5 bg-amber-400 rounded-full animate-pulse" />
                                    <span className="w-1 h-2 bg-amber-400 rounded-full animate-pulse" />
                                    <span className="w-1 h-6 bg-amber-400 rounded-full animate-pulse" />
                                    <span className="w-1 h-4 bg-amber-400 rounded-full animate-pulse" />
                                  </div>
                                  <span className="text-[10px] font-mono text-amber-300">
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
                  })
                )}
              </div>

              {/* Chat Input & Voice Message Recorder Bar */}
              <div className="p-3 bg-[#121524] border-t border-white/10">
                {isRecording ? (
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-red-950/60 border border-red-500/40 animate-pulse">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                      <span className="text-xs font-bold text-red-300">Recording Voice Note... ({recordingSeconds}s)</span>
                    </div>
                    <button
                      onClick={handleStopRecording}
                      className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow"
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
                      placeholder={`Message in ${activeCommunity.name}...`}
                      className="flex-1 bg-[#181c2e] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500"
                    />

                    <button
                      type="button"
                      onClick={handleStartRecording}
                      className="p-2.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 transition-colors"
                      title="Record Voice Note"
                    >
                      <Mic className="w-4 h-4" />
                    </button>

                    <button
                      type="submit"
                      disabled={!chatInput.trim()}
                      className="px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                )}
              </div>

            </div>
          )}
        </div>

      </div>

      {/* Community Movie Room Modal (YouTube Stream OR Local Video Upload) */}
      {isRoomModalOpen && activeCommunity && (
        <div 
          onClick={() => setIsRoomModalOpen(false)}
          className="fixed inset-0 z-50 overflow-y-auto bg-black/95 backdrop-blur-2xl p-3 sm:p-6 md:p-8 flex flex-col items-center justify-start sm:justify-center animate-in fade-in duration-200"
        >
          {/* Main Modal Card (stop propagation so clicking inside does not close) */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-5xl rounded-3xl bg-[#0c0f1a] border border-red-500/30 shadow-2xl p-4 sm:p-6 space-y-4 my-auto relative"
          >
            
            {/* Top Navigation & Header Bar */}
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsRoomModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition-transform hover:scale-105 flex items-center gap-1.5"
                >
                  <span>← Back to Community</span>
                </button>
                
                <div className="hidden sm:block">
                  <h3 className="font-heading font-black text-base text-white truncate max-w-md">
                    {activeCommunity.name} • Watch Room
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    YouTube Stream or Local Video File
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Source Switcher: YouTube or Local File */}
                <div className="flex p-1 rounded-xl bg-black/60 border border-white/10">
                  <button
                    type="button"
                    onClick={() => setRoomSourceType('youtube')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      roomSourceType === 'youtube' ? 'bg-red-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    YouTube
                  </button>
                  <button
                    type="button"
                    onClick={() => setRoomSourceType('local_file')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                      roomSourceType === 'local_file' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Upload className="w-3 h-3" />
                    <span>Local Video</span>
                  </button>
                </div>

                <button
                  onClick={() => setIsRoomModalOpen(false)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-red-600/20 text-slate-300 hover:text-red-400 border border-white/10 transition-colors"
                  title="Close Watch Room (Esc)"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Video Player Container */}
            <div className="aspect-video max-h-[62vh] w-full rounded-2xl bg-black border border-white/10 overflow-hidden shadow-2xl relative flex items-center justify-center">
              {roomSourceType === 'youtube' ? (
                <iframe
                  src={`https://www.youtube.com/embed/${activeCommunity.movieRoom.youtubeId || 'TcMBFSGVi1c'}?autoplay=1&mute=0&controls=1`}
                  title="Community Movie Stream"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              ) : (
                localVideoUrl ? (
                  <video
                    src={localVideoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-3">
                    <Film className="w-12 h-12 text-cyan-400 opacity-60" />
                    <h4 className="font-bold text-sm text-white">Select a Local Downloaded Video</h4>
                    <p className="text-xs text-slate-400 max-w-sm">
                      Choose an MP4, WebM, or MKV video file from your computer to watch in the community room.
                    </p>
                    <label className="px-5 py-2.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs cursor-pointer shadow-lg transition-transform hover:scale-105">
                      <span>Browse Video File</span>
                      <input type="file" accept="video/*" onChange={handleLocalVideoUpload} className="hidden" />
                    </label>
                  </div>
                )
              )}
            </div>

            {/* Bottom Controls Info */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 pt-2 border-t border-white/10">
              <span className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>Live Room Active ({activeCommunity.memberCount.toLocaleString()} Members)</span>
              </span>

              {roomSourceType === 'local_file' && localFileName && (
                <span className="font-mono text-cyan-300 text-xs truncate max-w-xs">File: {localFileName}</span>
              )}

              <button
                onClick={() => setIsRoomModalOpen(false)}
                className="px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs transition-colors"
              >
                Close Watch Room
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

