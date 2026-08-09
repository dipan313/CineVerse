import React, { useState, useEffect } from 'react';
import { Film, Sparkles, Zap, Shield, Globe } from 'lucide-react';

interface CinematicLoaderProps {
  onComplete: () => void;
}

export const CinematicLoader: React.FC<CinematicLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [stageText, setStageText] = useState('CALIBRATING 4K THEATRICAL REGISTRY...');
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setStageText('WELCOME TO CINEVERSE');
          setTimeout(() => {
            setIsFadingOut(true);
            setTimeout(onComplete, 600);
          }, 400);
          return 100;
        }

        const next = prev + Math.floor(Math.random() * 8 + 4);
        if (next >= 25 && next < 55) {
          setStageText('SYNCHRONIZING MCU, DC, TOLLYWOOD & BENGAL ARCHIVES...');
        } else if (next >= 55 && next < 85) {
          setStageText('INITIALIZING FILMMAKER CINESPACE & VOICE LOUNGES...');
        } else if (next >= 85) {
          setStageText('ENGAGING 35MM CINEMATIC PROJECTOR...');
        }

        return Math.min(next, 100);
      });
    }, 80);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-50 bg-[#06070c] flex flex-col items-center justify-center p-6 select-none transition-opacity duration-700 ${
      isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
    }`}>
      
      {/* Cinematic Ambient Glows & Anamorphic Light Leaks */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-red-600/20 rounded-full blur-[140px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-amber-500/15 rounded-full blur-[140px] animate-pulse delay-700" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.08)_0%,transparent_70%)]" />

      <div className="relative z-10 flex flex-col items-center max-w-md w-full text-center space-y-8">
        
        {/* Projector Optical Aperture Wheel */}
        <div className="relative flex items-center justify-center">
          
          {/* Outer Rotating Glowing Shutter Ring */}
          <div className="w-28 h-28 rounded-full border border-red-500/20 border-t-red-500 border-r-amber-400 animate-spin" style={{ animationDuration: '3s' }} />
          
          {/* Counter-rotating Inner Ring */}
          <div className="absolute w-20 h-20 rounded-full border border-dashed border-cyan-500/30 border-b-cyan-400 animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }} />
          
          {/* Center Glowing CineVerse Icon */}
          <div className="absolute w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-600 via-red-500 to-amber-500 flex items-center justify-center shadow-2xl shadow-red-600/60">
            <Film className="w-7 h-7 text-white animate-pulse" />
          </div>

          {/* Film Frame Ticks */}
          <span className="absolute -top-3 text-[9px] font-mono text-red-500/70 tracking-widest">35MM</span>
          <span className="absolute -bottom-3 text-[9px] font-mono text-amber-500/70 tracking-widest">24 FPS</span>
        </div>

        {/* Brand Reveal Typography */}
        <div className="space-y-2">
          <div className="font-heading font-black text-4xl sm:text-5xl tracking-tighter text-white flex items-center justify-center gap-1">
            <span>CINE</span>
            <span className="bg-gradient-to-r from-red-500 to-amber-400 bg-clip-text text-transparent">VERSE</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-[10px] font-mono tracking-[0.3em] text-slate-400 uppercase">
            <span>Theatrical</span>
            <span className="w-1 h-1 rounded-full bg-red-500" />
            <span>Multiverse</span>
            <span className="w-1 h-1 rounded-full bg-amber-400" />
            <span>Cinema</span>
          </div>
        </div>

        {/* Progress Bar & Status Text */}
        <div className="w-full space-y-3 pt-4">
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/10 relative">
            <div 
              className="h-full bg-gradient-to-r from-red-600 via-red-500 to-amber-400 rounded-full transition-all duration-150 shadow-[0_0_15px_rgba(239,68,68,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400 text-[10px] truncate max-w-[280px]">
              {stageText}
            </span>
            <span className="text-amber-400 font-bold">{progress}%</span>
          </div>
        </div>

        {/* Studio Marks */}
        <div className="flex items-center gap-4 text-[10px] text-slate-500 pt-2 border-t border-white/5">
          <span>4K DOLBY VISION</span>
          <span>•</span>
          <span>IMAX CERTIFIED</span>
          <span>•</span>
          <span>CINEPEDIA AI</span>
        </div>

      </div>

    </div>
  );
};
