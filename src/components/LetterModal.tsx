import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Letter } from '../types';
import { CATEGORY_CONFIG, RARITY_CONFIG } from '../data/initialLetters';
import { soundEngine } from '../services/soundEngine';
import { MapPin, X, Share2, Sparkles, Download, Heart, Quote } from 'lucide-react';

interface LetterModalProps {
  letter: Letter | null;
  onClose: () => void;
  onGenerateStoryCard: (letter: Letter) => void;
}

export const LetterModal: React.FC<LetterModalProps> = ({
  letter,
  onClose,
  onGenerateStoryCard,
}) => {
  const [isUnfolded, setIsUnfolded] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (letter) {
      setIsUnfolded(false);
      setLiked(false);
      soundEngine.playSealBreak();
      const timer = setTimeout(() => {
        setIsUnfolded(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [letter]);

  if (!letter) return null;

  const cat = CATEGORY_CONFIG[letter.category];
  const rarity = RARITY_CONFIG[letter.rarity];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl rounded-3xl glass-panel-gold border-2 border-amber-400/40 shadow-2xl p-6 md:p-10 my-8 overflow-hidden"
        >
          {/* Background Ambient Particles */}
          <div className="absolute inset-0 pointer-events-none opacity-30">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
          </div>

          {/* Close Button */}
          <button
            onClick={() => {
              soundEngine.playChime(500, 0.2);
              onClose();
            }}
            className="absolute top-6 right-6 p-2 rounded-full bg-slate-900/80 border border-amber-400/30 text-amber-200 hover:text-white hover:bg-slate-800 transition cursor-pointer z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Unfolding Animation Container */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Wax Seal Breaking Transition Header */}
            <motion.div
              initial={{ rotate: -10, scale: 1.2 }}
              animate={isUnfolded ? { rotate: 0, scale: 1 } : { rotate: 10, scale: 1.3 }}
              className="w-16 h-16 rounded-full border-2 border-amber-300 bg-gradient-to-br from-amber-400 via-amber-600 to-amber-900 flex items-center justify-center text-2xl shadow-[0_0_30px_rgba(243,201,120,0.6)] mb-4"
            >
              <span>{letter.sealSymbol || '✉️'}</span>
            </motion.div>

            {/* Archive Header Info */}
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${cat.badgeBg} ${cat.badgeText}`}>
                {cat.emoji} {cat.label}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-cinzel bg-amber-400/10 border border-amber-400/30 text-amber-300">
                Archive #{letter.archiveNumber}
              </span>
            </div>

            <span className="text-xs font-cinzel text-indigo-200/60 uppercase tracking-widest mb-6">
              {rarity.label}
            </span>

            {/* Letter Content Paper Container */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isUnfolded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full p-6 md:p-8 rounded-2xl bg-[#090D22]/90 border border-amber-400/30 shadow-inner relative my-2"
            >
              <Quote className="w-8 h-8 text-amber-400/20 absolute top-4 left-4" />

              <div className="relative z-10 text-center my-4">
                <p className="text-lg md:text-2xl font-serif-display leading-relaxed text-amber-100 italic tracking-wide">
                  "{letter.content}"
                </p>
              </div>

              {/* Signature Block */}
              <div className="mt-8 pt-4 border-t border-amber-400/20 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-indigo-200/80">
                <div className="flex items-center gap-2">
                  <span className="font-serif-display text-base font-semibold text-amber-200">
                    — {letter.name}
                  </span>
                  {letter.location && (
                    <span className="flex items-center gap-1 text-xs text-indigo-300/70">
                      <MapPin className="w-3 h-3 text-amber-400" />
                      {letter.location}
                    </span>
                  )}
                </div>

                <span className="text-xs text-indigo-300/50 font-mono">
                  Preserved for Chapter 24
                </span>
              </div>
            </motion.div>

            {/* Modal Actions */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {/* Like / Heart Button */}
              <button
                onClick={() => {
                  soundEngine.playChime(1200, 0.4);
                  setLiked(!liked);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-medium border transition flex items-center gap-2 cursor-pointer ${
                  liked
                    ? 'bg-rose-500/20 border-rose-400/60 text-rose-300'
                    : 'bg-slate-900/60 border-amber-400/20 text-indigo-200 hover:text-amber-300'
                }`}
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-rose-400 text-rose-400' : ''}`} />
                <span>{liked ? 'Preserved with Love' : 'Send Love'}</span>
              </button>

              {/* Share Instagram Story Card */}
              <button
                onClick={() => {
                  soundEngine.playChime(900, 0.4);
                  onGenerateStoryCard(letter);
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-amber-950 font-cinzel font-bold text-xs shadow-lg hover:scale-105 transition cursor-pointer flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Instagram Story Card (1080x1920)</span>
              </button>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
