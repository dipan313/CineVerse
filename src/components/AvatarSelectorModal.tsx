import React, { useState } from 'react';
import { UserProfile } from '../types/movie';
import { authService } from '../db/supabaseClient';
import { 
  User, 
  Sparkles, 
  Check, 
  X, 
  Zap, 
  Shield, 
  Flame, 
  Film, 
  Compass, 
  Link as LinkIcon 
} from 'lucide-react';

interface AvatarSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onAvatarUpdated: (newAvatarUrl: string) => void;
}

interface CharacterAvatar {
  id: string;
  name: string;
  universe: string;
  category: 'mcu' | 'dc' | 'hollywood' | 'tollywood' | 'bengali' | 'bollywood';
  avatarUrl: string;
  badgeColor: string;
}

export const AvatarSelectorModal: React.FC<AvatarSelectorModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAvatarUpdated
}) => {
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState(currentUser.avatarUrl);
  const [activeCategory, setActiveCategory] = useState<'all' | 'mcu' | 'dc' | 'hollywood' | 'tollywood' | 'bengali' | 'bollywood'>('all');
  const [customUrl, setCustomUrl] = useState('');

  if (!isOpen) return null;

  const characterAvatars: CharacterAvatar[] = [
    // Marvel (MCU)
    {
      id: 'av_ironman',
      name: 'Iron Man (Tony Stark)',
      universe: 'Marvel Cinematic Universe',
      category: 'mcu',
      avatarUrl: 'https://image.tmdb.org/t/p/w500/78lPtwv72eTNqFW9COBYI0dWDJa.jpg',
      badgeColor: 'bg-red-600'
    },
    {
      id: 'av_doomsday',
      name: 'Doctor Doom (Victor von Doom)',
      universe: 'Avengers: Doomsday',
      category: 'mcu',
      avatarUrl: 'https://image.tmdb.org/t/p/w500/bOGkgRGdhrBYJSLpXaxhXVstNsV.jpg',
      badgeColor: 'bg-emerald-700'
    },
    {
      id: 'av_spiderman',
      name: 'Spider-Man (Peter Parker)',
      universe: 'MCU / No Way Home',
      category: 'mcu',
      avatarUrl: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
      badgeColor: 'bg-blue-600'
    },
    {
      id: 'av_deadpool',
      name: 'Deadpool (Wade Wilson)',
      universe: 'Deadpool & Wolverine',
      category: 'mcu',
      avatarUrl: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
      badgeColor: 'bg-red-700'
    },
    {
      id: 'av_cap',
      name: 'Captain America (Steve Rogers)',
      universe: 'Marvel Cinematic Universe',
      category: 'mcu',
      avatarUrl: 'https://image.tmdb.org/t/p/w500/vSNxAJTlD0r02V9sPYpqjqDbeY6.jpg',
      badgeColor: 'bg-blue-700'
    },
    {
      id: 'av_loki',
      name: 'Loki (God of Stories)',
      universe: 'Marvel Cinematic Universe',
      category: 'mcu',
      avatarUrl: 'https://image.tmdb.org/t/p/w500/voHUmlvjysvFlXucIo9HRkdAo92.jpg',
      badgeColor: 'bg-emerald-600'
    },

    // DC Universe
    {
      id: 'av_batman',
      name: 'The Batman (Bruce Wayne)',
      universe: 'The Dark Knight Trilogy',
      category: 'dc',
      avatarUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
      badgeColor: 'bg-slate-700'
    },
    {
      id: 'av_joker',
      name: 'The Joker (Heath Ledger)',
      universe: 'The Dark Knight',
      category: 'dc',
      avatarUrl: 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg',
      badgeColor: 'bg-purple-700'
    },
    {
      id: 'av_superman',
      name: 'Superman (Kal-El)',
      universe: 'DC Universe (2025)',
      category: 'dc',
      avatarUrl: 'https://image.tmdb.org/t/p/w500/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg',
      badgeColor: 'bg-blue-600'
    },
    {
      id: 'av_thebatman',
      name: 'The Batman (Robert Pattinson)',
      universe: 'DC Elseworlds',
      category: 'dc',
      avatarUrl: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg',
      badgeColor: 'bg-neutral-800'
    },

    // Hollywood Icons
    {
      id: 'av_oppenheimer',
      name: 'J. Robert Oppenheimer',
      universe: 'Oppenheimer (Christopher Nolan)',
      category: 'hollywood',
      avatarUrl: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
      badgeColor: 'bg-amber-700'
    },
    {
      id: 'av_cooper',
      name: 'Joseph Cooper',
      universe: 'Interstellar (Christopher Nolan)',
      category: 'hollywood',
      avatarUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
      badgeColor: 'bg-cyan-700'
    },
    {
      id: 'av_cobb',
      name: 'Dom Cobb',
      universe: 'Inception (Christopher Nolan)',
      category: 'hollywood',
      avatarUrl: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
      badgeColor: 'bg-indigo-700'
    },
    {
      id: 'av_corleone',
      name: 'Don Vito Corleone',
      universe: 'The Godfather (Francis Ford Coppola)',
      category: 'hollywood',
      avatarUrl: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
      badgeColor: 'bg-stone-800'
    },

    // Tollywood / South Indian Legends
    {
      id: 'av_alluri',
      name: 'Alluri Sitarama Raju (Ram Charan)',
      universe: 'RRR (S.S. Rajamouli)',
      category: 'tollywood',
      avatarUrl: 'https://image.tmdb.org/t/p/w500/7I6VUdPj6tQECNHdviJkUHD2389.jpg',
      badgeColor: 'bg-amber-600'
    },
    {
      id: 'av_bheem',
      name: 'Komaram Bheem (Jr. NTR)',
      universe: 'RRR (S.S. Rajamouli)',
      category: 'tollywood',
      avatarUrl: 'https://image.tmdb.org/t/p/w500/wE0q2ncd7L0397wzh059D275w3Z.jpg',
      badgeColor: 'bg-red-600'
    },
    {
      id: 'av_baahubali',
      name: 'Amarendra Baahubali (Prabhas)',
      universe: 'Baahubali: The Conclusion',
      category: 'tollywood',
      avatarUrl: 'https://image.tmdb.org/t/p/w500/2LSuveexg2B1Y6kOqC06o60kZpT.jpg',
      badgeColor: 'bg-yellow-600'
    },
    {
      id: 'av_rocky',
      name: 'Rocky Bhai (Yash)',
      universe: 'K.G.F: Chapter 2',
      category: 'tollywood',
      avatarUrl: 'https://image.tmdb.org/t/p/w500/khsgzIcq9nB1Y5Zt22A21uU9gO1.jpg',
      badgeColor: 'bg-orange-700'
    },

    // Bengali Cinema Legends
    {
      id: 'av_feluda',
      name: 'Prodosh C. Mitter (Feluda)',
      universe: 'Sonar Kella (Satyajit Ray)',
      category: 'bengali',
      avatarUrl: 'https://image.tmdb.org/t/p/w500/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg',
      badgeColor: 'bg-amber-700'
    },
    {
      id: 'av_apu',
      name: 'Apu (Apur Sansar)',
      universe: 'The Apu Trilogy (Satyajit Ray)',
      category: 'bengali',
      avatarUrl: 'https://image.tmdb.org/t/p/w500/b13a8l3fA24W9wQ18Q3u1tS720E.jpg',
      badgeColor: 'bg-stone-700'
    },
    {
      id: 'av_prabodh',
      name: 'Prabodh Roy (Prosenjit Chatterjee)',
      universe: '22 Shey Srabon (Srijit Mukherji)',
      category: 'bengali',
      avatarUrl: 'https://image.tmdb.org/t/p/w500/6xS515x1892019481741jklM4.jpg',
      badgeColor: 'bg-purple-800'
    },

    // Bollywood Cult Heroes
    {
      id: 'av_rancho',
      name: 'Rancho (Aamir Khan)',
      universe: '3 Idiots (Rajkumar Hirani)',
      category: 'bollywood',
      avatarUrl: 'https://image.tmdb.org/t/p/w500/66A9MqXOyVFCssoloscw79z8swq.jpg',
      badgeColor: 'bg-yellow-600'
    },
    {
      id: 'av_vinayak',
      name: 'Vinayak Rao (Sohum Shah)',
      universe: 'Tumbbad (Rahi Anil Barve)',
      category: 'bollywood',
      avatarUrl: 'https://image.tmdb.org/t/p/w500/b9b3rQ9WbK148G01aN3yXJ2L4t9.jpg',
      badgeColor: 'bg-red-800'
    },
    {
      id: 'av_phogat',
      name: 'Mahavir Singh Phogat',
      universe: 'Dangal (Nitesh Tiwari)',
      category: 'bollywood',
      avatarUrl: 'https://image.tmdb.org/t/p/w500/eXP15wP0b4N219uX9tU8yH7zR1.jpg',
      badgeColor: 'bg-amber-800'
    }
  ];

  const filteredAvatars = characterAvatars.filter(
    av => activeCategory === 'all' || av.category === activeCategory
  );

  const handleSaveAvatar = () => {
    const finalUrl = customUrl.trim() || selectedAvatarUrl;
    authService.updateUserAvatar(finalUrl);
    onAvatarUpdated(finalUrl);
    onClose();
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-2xl p-3 sm:p-6 flex flex-col items-center justify-center animate-in fade-in duration-200"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl max-h-[88vh] rounded-3xl bg-[#0c0f1d] border border-red-500/30 shadow-2xl p-4 sm:p-6 flex flex-col justify-between overflow-hidden my-auto relative space-y-4"
      >
        
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 text-white shadow-lg shadow-red-600/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-black text-base sm:text-lg text-white">
                Choose Character Avatar
              </h3>
              <p className="text-[11px] text-slate-400">
                Pick your superhero or iconic film legend profile picture
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Live Preview & Custom URL bar */}
        <div className="p-3.5 rounded-2xl bg-[#141829] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3.5 w-full sm:w-auto">
            <img
              src={customUrl.trim() || selectedAvatarUrl}
              alt="Selected Preview"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(currentUser.displayName)}`;
              }}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-red-500 shadow-xl bg-slate-800 shrink-0"
            />
            <div>
              <div className="font-heading font-black text-sm text-white">
                {currentUser.displayName}
              </div>
              <div className="text-[10px] font-mono text-amber-400">
                {currentUser.friendCode} • Active Character Avatar
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-72">
            <div className="relative flex-1">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="url"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="Or paste custom image URL..."
                className="w-full bg-[#0d101a] border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>
        </div>

        {/* Industry Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 shrink-0">
          {[
            { id: 'all', label: 'All Characters' },
            { id: 'mcu', label: '🦸‍♂️ Marvel (MCU)' },
            { id: 'dc', label: '🦇 DC Universe' },
            { id: 'hollywood', label: '🎬 Hollywood Icons' },
            { id: 'tollywood', label: '🔥 Tollywood / South' },
            { id: 'bengali', label: '🌿 Bengali Cinema' },
            { id: 'bollywood', label: '🇮🇳 Bollywood' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                activeCategory === cat.id
                  ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-600/30'
                  : 'bg-[#121524] text-slate-300 border-white/10 hover:border-white/20'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Character Avatars Grid (Scrollable) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 overflow-y-auto max-h-[42vh] p-1">
          {filteredAvatars.map(char => {
            const isSelected = selectedAvatarUrl === char.avatarUrl && !customUrl.trim();
            return (
              <div
                key={char.id}
                onClick={() => { setSelectedAvatarUrl(char.avatarUrl); setCustomUrl(''); }}
                className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-2.5 group relative ${
                  isSelected
                    ? 'bg-[#181d33] border-red-500 ring-2 ring-red-500 shadow-lg shadow-red-600/20'
                    : 'bg-[#121524] border-white/5 hover:border-white/20'
                }`}
              >
                <img
                  src={char.avatarUrl}
                  alt={char.name}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(char.name)}`;
                  }}
                  className="w-11 h-11 rounded-xl object-cover bg-slate-800 shrink-0 group-hover:scale-105 transition-transform"
                />

                <div className="min-w-0 flex-1">
                  <h5 className="font-bold text-xs text-white truncate">{char.name}</h5>
                  <p className="text-[9px] text-slate-400 truncate">{char.universe}</p>
                </div>

                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center absolute top-2 right-2 shadow">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold"
          >
            Cancel
          </button>

          <button
            onClick={handleSaveAvatar}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-extrabold text-xs shadow-lg shadow-red-600/30 transition-transform hover:scale-105 flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Apply Character Avatar</span>
          </button>
        </div>

      </div>
    </div>
  );
};
