import React, { useState } from 'react';
import { X, ShieldAlert, Film } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGuestAccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onGuestAccess }) => {
  const [view, setView] = useState<'login' | 'request'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-[#0e111a] border border-white/10 p-8 shadow-2xl space-y-6 relative">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {view === 'login' ? (
          <div className="space-y-5">
            <div className="text-center space-y-1">
              <div className="font-heading font-extrabold text-3xl tracking-tighter text-white">
                CINE<span className="text-red-500">VERSE</span>
              </div>
              <h3 className="font-heading font-bold text-lg text-white">Sign In to Cineverse</h3>
              <p className="text-xs text-slate-400">Track and rate your global cinema collections</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#141724] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#141724] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition-all"
              >
                Sign in
              </button>

              <button
                onClick={() => {
                  onGuestAccess();
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs font-semibold text-slate-300 transition-colors"
              >
                View as guest
              </button>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => setView('request')}
                className="text-xs text-red-400 hover:underline"
              >
                Request access / Register
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="text-center space-y-1">
              <h3 className="font-heading font-bold text-lg text-white">Request Access</h3>
              <p className="text-xs text-slate-400">Account registrations require admin approval</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2 text-xs text-amber-300">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Your account will be verified by the admin before sign in.</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Your Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full bg-[#141724] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Email</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full bg-[#141724] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  alert("Access request sent!");
                  setView('login');
                }}
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition-all"
              >
                Submit Request
              </button>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => setView('login')}
                className="text-xs text-slate-400 hover:underline"
              >
                Back to Sign in
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
