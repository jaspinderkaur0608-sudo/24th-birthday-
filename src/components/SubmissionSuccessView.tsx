import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Letter } from '../types';
import { soundEngine } from '../services/soundEngine';
import { Sparkles, Share2, Globe, Heart, ArrowRight } from 'lucide-react';

interface SubmissionSuccessViewProps {
  submittedLetter: Letter;
  onExploreMuseum: () => void;
  onGenerateStoryCard: (letter: Letter) => void;
}

export const SubmissionSuccessView: React.FC<SubmissionSuccessViewProps> = ({
  submittedLetter,
  onExploreMuseum,
  onGenerateStoryCard,
}) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    soundEngine.playUnfoldShimmer();

    const t1 = setTimeout(() => setPhase(1), 1200);  // Envelope seals & floats
    const t2 = setTimeout(() => setPhase(2), 3500);  // "Your letter now lives here."
    const t3 = setTimeout(() => setPhase(3), 6000);  // "Archive #643 has been preserved."
    const t4 = setTimeout(() => setPhase(4), 8500);  // "Your story is now part of something bigger."
    const t5 = setTimeout(() => setPhase(5), 11000); // "Thank you for helping build Chapter 24."
    const t6 = setTimeout(() => setPhase(6), 13500); // Final camera pullback & CTAs

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#030511] flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      {/* Background Floating Envelope Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-t from-amber-500/10 via-purple-900/20 to-transparent blur-3xl"
        />

        {/* Floating Lanterns and Lights */}
        {Array.from({ length: 24 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: '100vh', opacity: 0 }}
            animate={{ y: '-20vh', opacity: [0.2, 0.9, 0.2] }}
            transition={{ duration: 10 + (i % 5), repeat: Infinity, delay: i * 0.3 }}
            className="absolute w-3 h-3 rounded-full bg-amber-300 shadow-[0_0_20px_rgba(243,201,120,0.8)]"
            style={{ left: `${(i * 4.2) % 100}%` }}
          />
        ))}
      </div>

      {/* Floating Sealed Envelope Animation */}
      <AnimatePresence>
        {phase < 6 && (
          <motion.div
            initial={{ y: 100, scale: 0.8, opacity: 0 }}
            animate={{ y: -20, scale: 1.1, opacity: 1 }}
            exit={{ y: -200, opacity: 0 }}
            transition={{ duration: 2, ease: 'easeOut' }}
            className="relative z-20 mb-8"
          >
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-600 to-purple-900 border-2 border-amber-300 shadow-[0_0_50px_rgba(243,201,120,0.7)] flex flex-col items-center justify-center p-3 animate-float">
              <span className="text-3xl mb-1">{submittedLetter.sealSymbol || '✨'}</span>
              <span className="text-[10px] font-cinzel font-bold text-amber-200">
                #{submittedLetter.archiveNumber}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Poetic Message Lines */}
      <div className="relative z-20 max-w-2xl min-h-[160px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {phase === 2 && (
            <motion.p
              key="p2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1.2 }}
              className="text-2xl md:text-3xl font-serif-display text-amber-200 italic"
            >
              "Your letter now lives here."
            </motion.p>
          )}

          {phase === 3 && (
            <motion.div
              key="p3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1.2 }}
              className="space-y-1"
            >
              <p className="text-xl md:text-2xl font-serif-display text-indigo-100 italic">
                Archive #{submittedLetter.archiveNumber} has been preserved.
              </p>
              <p className="text-xs font-cinzel text-amber-300/80 uppercase tracking-widest">
                Sealed in Chapter 24 Vault
              </p>
            </motion.div>
          )}

          {phase === 4 && (
            <motion.p
              key="p4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1.2 }}
              className="text-2xl md:text-3xl font-serif-display text-purple-200 italic"
            >
              "Your story is now part of something bigger."
            </motion.p>
          )}

          {phase === 5 && (
            <motion.div
              key="p5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1.2 }}
              className="space-y-2"
            >
              <p className="text-2xl md:text-3xl font-serif-display text-gradient-gold font-bold">
                "Thank you for helping build Chapter 24."
              </p>
              <p className="text-lg font-serif-display text-amber-100/90 italic">
                "Thank you for making my birthday so special."
              </p>
            </motion.div>
          )}

          {phase >= 6 && (
            <motion.div
              key="p6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-cinzel">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Preserved Forever • Archive #{submittedLetter.archiveNumber}</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-serif-display font-bold text-gradient-gold">
                  Welcome to Chapter 24
                </h2>
                <p className="text-sm md:text-base font-serif-display italic text-indigo-100/80 max-w-lg mx-auto">
                  Your envelope joins 600+ letters floating among the stars, illumination for the entire universe.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    soundEngine.playChime(1000, 0.4);
                    onGenerateStoryCard(submittedLetter);
                  }}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-amber-950 font-cinzel font-bold text-xs tracking-wider shadow-[0_0_30px_rgba(243,201,120,0.4)] hover:scale-105 transition cursor-pointer flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Generate Instagram Story Card</span>
                </button>

                <button
                  onClick={() => {
                    soundEngine.playChime(660, 0.3);
                    onExploreMuseum();
                  }}
                  className="px-6 py-3 rounded-full bg-slate-900/80 border border-amber-400/40 text-amber-200 hover:text-white hover:bg-slate-800 font-cinzel text-xs tracking-wider transition cursor-pointer flex items-center gap-2"
                >
                  <Globe className="w-4 h-4 text-amber-400" />
                  <span>Explore The Museum Halls</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
