import React, { useState } from 'react';
import { Movie } from '../types/movie';
import { autoCinemaEngine } from '../services/autoCinemaEngine';
import { X, Search, Sparkles, Plus, CheckCircle2, Zap, Film, Star } from 'lucide-react';

interface AddMovieAutoImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMovie: (m: Movie) => void;
}

export const AddMovieAutoImportModal: React.FC<AddMovieAutoImportModalProps> = ({
  isOpen,
  onClose,
  onAddMovie
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);
  const [imported, setImported] = useState(false);

  const quickAutomations = [
    { title: 'Sonar Kella (সোনার কেল্লা)', id: 'tt0072190', lang: 'Bengali' },
    { title: 'Hirak Rajar Deshe (হীরক রাজার দেশে)', id: 'tt0080876', lang: 'Bengali' },
    { title: 'Chotushkone (চতুষ্কোণ)', id: 'tt3838520', lang: 'Bengali' },
    { title: 'Chander Pahar (চাঁদের পাহাড়)', id: 'tt3089196', lang: 'Bengali' },
    { title: 'Ballabhpurer Roopkotha (বল্লভপুর)', id: 'tt22497676', lang: 'Bengali' },
    { title: 'Lagaan (लगान)', id: 'tt0169102', lang: 'Hindi' },
    { title: 'Swades (स्वदेस)', id: 'tt0367110', lang: 'Hindi' },
    { title: 'The Handmaiden (아가씨)', id: 'tt4016934', lang: 'Korean' }
  ];

  if (!isOpen) return null;

  const handleSearch = async (customQuery?: string) => {
    const q = customQuery || query;
    if (!q.trim()) return;
    setLoading(true);
    setStatusMessage(null);
    setFoundMovie(null);
    setImported(false);

    try {
      const result = await autoCinemaEngine.autoFetchMovie(q);
      if (result.success && result.movie) {
        setFoundMovie(result.movie);
        setStatusMessage(result.message);
      } else {
        setStatusMessage(result.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImport = (movieToImport: Movie) => {
    onAddMovie(movieToImport);
    setImported(true);
    setTimeout(() => {
      onClose();
      setFoundMovie(null);
      setImported(false);
      setQuery('');
      setStatusMessage(null);
    }, 1200);
  };

  const handleAutoSyncAll = async () => {
    setLoading(true);
    setStatusMessage("⚡ Auto-syncing library with full catalog...");
    try {
      const batch = await autoCinemaEngine.autoSyncPresetVault();
      batch.forEach(m => onAddMovie(m));
      setStatusMessage(`✨ Successfully auto-ingested ${batch.length} verified masterpieces!`);
      setTimeout(() => {
        onClose();
        setStatusMessage(null);
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-3xl bg-[#0e111a] border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div>
          <div className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase tracking-wider mb-1">
            <Zap className="w-4 h-4 text-amber-400 fill-current" />
            <span>Autonomous Cinema Ingestion Engine</span>
          </div>
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-white">
            Automate & Ingest Any Film
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            No need to add details manually. Enter any title or IMDb ID, or click 1-Click Auto-Sync to fetch metadata, native calligraphy, and artwork automatically.
          </p>
        </div>

        {/* 1-Click Auto Sync Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/40 via-purple-950/30 to-slate-900 border border-red-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">1-Click Auto-Ingestion</h4>
              <p className="text-xs text-slate-400">Bulk import verified Bengali & global cinematic collections.</p>
            </div>
          </div>

          <button
            onClick={handleAutoSyncAll}
            disabled={loading}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:scale-105 text-white font-extrabold text-xs shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Auto-Sync Vault</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300">Auto-Fetch By Title or IMDb ID:</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="e.g. Sonar Kella, tt0072190, Oppenheimer, Interstellar, Jawan..."
                className="w-full bg-[#141724] border border-white/10 focus:border-red-500/80 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
            <button
              onClick={() => handleSearch()}
              disabled={loading || !query.trim()}
              className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-extrabold text-xs shadow-lg shadow-red-600/30 transition-all flex items-center gap-1.5"
            >
              {loading ? (
                <span>Fetching...</span>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Auto-Fetch</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            {statusMessage}
          </div>
        )}

        {/* Preview of Found Movie */}
        {foundMovie && (
          <div className="p-4 rounded-2xl bg-[#141724] border border-red-500/30 flex gap-4 items-center">
            <img
              src={foundMovie.poster}
              alt={foundMovie.title}
              className="w-20 h-28 object-cover rounded-xl border border-white/10 shadow-lg"
            />
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-600 text-white uppercase">
                  {foundMovie.language}
                </span>
                <span className="text-xs text-slate-400 font-mono">{foundMovie.year}</span>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{foundMovie.imdbRating}/10</span>
                </div>
              </div>

              <h4 className="font-heading font-black text-base text-white">
                {foundMovie.title}
              </h4>
              {foundMovie.originalTitle && foundMovie.originalTitle !== foundMovie.title && (
                <p className="text-xs text-red-300 font-medium italic">{foundMovie.originalTitle}</p>
              )}
              <p className="text-xs text-slate-400 line-clamp-2">
                {foundMovie.storyline}
              </p>
            </div>

            <button
              onClick={() => handleImport(foundMovie)}
              disabled={imported}
              className={`px-5 py-3 rounded-2xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                imported
                  ? 'bg-emerald-600 text-white'
                  : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30'
              }`}
            >
              {imported ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add to Cineverse</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Quick 1-Click Presets */}
        <div className="space-y-3 pt-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Quick Auto-Fetch Presets:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {quickAutomations.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setQuery(item.title);
                  handleSearch(item.title);
                }}
                className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/5 hover:border-red-500/40 text-left transition-all group"
              >
                <div className="text-[10px] text-red-400 font-bold">{item.lang}</div>
                <div className="text-xs font-bold text-slate-200 line-clamp-1 group-hover:text-white">
                  {item.title}
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
