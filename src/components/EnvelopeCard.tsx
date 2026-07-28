import React from 'react';
import { Letter } from '../types';
import { CATEGORY_CONFIG, RARITY_CONFIG } from '../data/initialLetters';
import { soundEngine } from '../services/soundEngine';
import { MapPin, Lock, Sparkles, Eye } from 'lucide-react';

interface EnvelopeCardProps {
  letter: Letter;
  onOpen: (letter: Letter) => void;
}

export const EnvelopeCard: React.FC<EnvelopeCardProps> = ({ letter, onOpen }) => {
  const cat = CATEGORY_CONFIG[letter.category];
  const rarity = RARITY_CONFIG[letter.rarity];

  const handleClick = () => {
    soundEngine.playUnfoldShimmer();
    onOpen(letter);
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => soundEngine.playChime(1100, 0.2)}
      className={`group relative p-6 rounded-2xl glass-panel border ${rarity.borderStyle} ${rarity.bgGlow} transition-all duration-500 cursor-pointer hover:-translate-y-2 hover:shadow-2xl overflow-hidden flex flex-col justify-between min-h-[220px]`}
    >
      {/* Subtle Envelope Paper Texture Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] via-transparent to-black/20 pointer-events-none" />

      {/* Top Envelope Flap Shadow Line */}
      <div className="absolute top-0 left-0 right-0 h-16 border-b border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent clip-flap pointer-events-none" />

      {/* Top Details Header */}
      <div className="relative z-10 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium border ${cat.badgeBg} ${cat.badgeText} flex items-center gap-1 shadow-sm`}>
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </span>

          {letter.rarity !== 'standard' && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-cinzel bg-amber-400/10 border border-amber-400/40 text-amber-300 font-bold tracking-wider">
              {rarity.label}
            </span>
          )}
        </div>

        <span className="text-[11px] font-mono text-indigo-200/60 font-semibold tracking-wider">
          #{letter.archiveNumber}
        </span>
      </div>

      {/* Envelope Center Wax Seal & Sender Name */}
      <div className="relative z-10 my-4 text-center flex flex-col items-center justify-center">
        {/* Wax Seal Circle */}
        <div className={`w-12 h-12 rounded-full border-2 ${rarity.sealClass} flex items-center justify-center text-lg shadow-lg group-hover:scale-110 group-hover:rotate-6 transition duration-300 mb-2`}>
          <span>{letter.sealSymbol || '✉️'}</span>
        </div>

        <h3 className="text-lg font-serif-display font-semibold text-slate-100 group-hover:text-amber-200 transition">
          {letter.name}
        </h3>

        {letter.location && (
          <div className="flex items-center gap-1 text-xs text-indigo-200/70 mt-0.5">
            <MapPin className="w-3 h-3 text-amber-400/80" />
            <span>{letter.location}</span>
          </div>
        )}
      </div>

      {/* Bottom Envelope Footer */}
      <div className="relative z-10 flex items-center justify-between text-xs text-indigo-200/50 pt-2 border-t border-white/5">
        <div className="flex items-center gap-1.5 text-amber-300/80 group-hover:text-amber-200 transition">
          <Lock className="w-3 h-3" />
          <span className="font-serif-display italic">Sealed Message</span>
        </div>

        <div className="flex items-center gap-1 text-slate-300 opacity-0 group-hover:opacity-100 transition duration-300 text-[11px] font-medium">
          <span>Unfold</span>
          <Eye className="w-3.5 h-3.5 text-amber-400" />
        </div>
      </div>

      {/* Corner Sparkle for Rare Envelopes */}
      {letter.rarity === 'golden' && (
        <Sparkles className="absolute top-2 right-2 w-4 h-4 text-amber-300 animate-pulse pointer-events-none" />
      )}
    </div>
  );
};
