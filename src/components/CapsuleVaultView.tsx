import React, { useState, useEffect } from 'react';
import { Letter } from '../types';
import { CATEGORY_CONFIG } from '../data/initialLetters';
import { soundEngine } from '../services/soundEngine';
import { Lock, Unlock, Sparkles, Clock, Globe, ShieldCheck, Key } from 'lucide-react';

interface CapsuleVaultViewProps {
  capsuleLetters: Letter[];
  onOpenLetter: (letter: Letter) => void;
  onOpenSubmitModal: () => void;
}

export const CapsuleVaultView: React.FC<CapsuleVaultViewProps> = ({
  capsuleLetters,
  onOpenLetter,
  onOpenSubmitModal,
}) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 24,
    minutes: 42,
    seconds: 18,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSimulateUnlock = () => {
    soundEngine.playSealBreak();
    setIsUnlocked(!isUnlocked);
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 space-y-8 animate-fade-in">
      {/* Vault Hero Header */}
      <div className="p-8 md:p-12 rounded-3xl glass-panel-gold border-2 border-amber-400/40 relative overflow-hidden text-center shadow-2xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-cinzel mb-4">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Core Birthday Feature • Chapter 24 Vault</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-serif-display font-bold text-gradient-gold">
          The Chapter 24 Birthday Capsule
        </h1>

        <p className="text-sm md:text-lg font-serif-display italic text-indigo-100/90 max-w-2xl mx-auto mt-2">
          Every new letter written by visitors is wax-sealed inside this vault. Hidden until the 24th birthday unlock ceremony begins.
        </p>

        {/* Live Countdown Timer Bar */}
        <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-4 p-4 rounded-2xl bg-slate-950/80 border border-amber-400/30 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-cinzel text-amber-300/80 border-r border-amber-400/20 pr-4">
            <Clock className="w-4 h-4 text-amber-400 animate-spin-slow" />
            <span>Capsule Countdown:</span>
          </div>

          <div className="flex items-center gap-3 font-mono text-xl md:text-2xl font-bold text-amber-200">
            <div className="text-center">
              <span>{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="block text-[9px] font-sans text-indigo-300/60 uppercase">Hours</span>
            </div>
            <span className="text-amber-400/60">:</span>
            <div className="text-center">
              <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="block text-[9px] font-sans text-indigo-300/60 uppercase">Mins</span>
            </div>
            <span className="text-amber-400/60">:</span>
            <div className="text-center">
              <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className="block text-[9px] font-sans text-indigo-300/60 uppercase">Secs</span>
            </div>
          </div>

          {/* Simulate Birthday Ceremony Button */}
          <button
            onClick={handleSimulateUnlock}
            className="ml-2 px-4 py-2 rounded-xl bg-amber-400/10 border border-amber-400/40 hover:bg-amber-400/20 text-amber-200 text-xs font-cinzel transition cursor-pointer flex items-center gap-2"
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span>{isUnlocked ? 'Relock Capsule' : 'Simulate Birthday Unlock'}</span>
          </button>
        </div>
      </div>

      {/* Sealed Letters Grid or Locked State */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif-display font-semibold text-slate-100 flex items-center gap-2">
              {isUnlocked ? <Unlock className="w-5 h-5 text-emerald-400" /> : <Lock className="w-5 h-5 text-amber-400" />}
              <span>
                {isUnlocked ? 'Unlocked Capsule Letters' : 'Sealed Envelopes Inside Vault'} ({capsuleLetters.length})
              </span>
            </h2>
            <p className="text-xs text-indigo-200/60">
              {isUnlocked
                ? 'The ceremony has begun! All letters are now readable.'
                : 'Envelopes are stored securely. Contents remain secret until unlocked.'}
            </p>
          </div>

          <button
            onClick={onOpenSubmitModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-amber-950 font-bold text-xs font-cinzel shadow-md hover:scale-105 transition cursor-pointer flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Seal A New Letter</span>
          </button>
        </div>

        {/* Letters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {capsuleLetters.map(letter => {
            const cat = CATEGORY_CONFIG[letter.category];
            return (
              <div
                key={letter.id}
                onClick={() => {
                  if (isUnlocked) {
                    onOpenLetter(letter);
                  } else {
                    soundEngine.playChime(400, 0.3);
                  }
                }}
                className={`p-5 rounded-2xl glass-panel border transition ${
                  isUnlocked
                    ? 'border-emerald-400/40 hover:border-emerald-300 cursor-pointer hover:-translate-y-1'
                    : 'border-amber-400/30 opacity-90'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className={`px-2 py-0.5 rounded-full border ${cat.badgeBg} ${cat.badgeText}`}>
                    {cat.emoji} {cat.label}
                  </span>
                  <span className="font-mono text-amber-300">#{letter.archiveNumber}</span>
                </div>

                <div className="text-center py-4">
                  <div className={`w-10 h-10 mx-auto rounded-full ${isUnlocked ? 'bg-emerald-500/20 border-emerald-400' : 'bg-amber-500/20 border-amber-400'} border flex items-center justify-center text-lg mb-2 shadow-md`}>
                    {isUnlocked ? '🔓' : '🔒'}
                  </div>
                  <h3 className="font-serif-display text-base font-bold text-slate-100">
                    {letter.name}
                  </h3>
                  <p className="text-xs text-indigo-200/70 mt-0.5">
                    📍 {letter.location}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 text-center text-xs font-cinzel text-amber-300/80">
                  {isUnlocked ? 'Click To Read Unlocked Letter' : 'Sealed inside Birthday Capsule'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
