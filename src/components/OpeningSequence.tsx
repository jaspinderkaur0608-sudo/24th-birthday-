import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundEngine } from '../services/soundEngine';
import { Sparkles, DoorOpen, Volume2 } from 'lucide-react';

interface OpeningSequenceProps {
  onComplete: () => void;
}

export const OpeningSequence: React.FC<OpeningSequenceProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(0);
  const [fireflyPos, setFireflyPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    // Start ambient music softly
    soundEngine.startAmbientMusic();

    // Animate firefly motion
    const interval = setInterval(() => {
      setFireflyPos({
        x: 30 + Math.sin(Date.now() * 0.001) * 30,
        y: 30 + Math.cos(Date.now() * 0.0012) * 30,
      });
    }, 50);

    // Timeline for poetic intro text
    const timers = [
      setTimeout(() => setStep(1), 1500),  // Single firefly
      setTimeout(() => setStep(2), 3500),  // Multi lights
      setTimeout(() => setStep(3), 6000),  // "As every birthday approaches..."
      setTimeout(() => setStep(4), 8500),  // "...we collect gifts."
      setTimeout(() => setStep(5), 11000), // "...but some things are far more precious."
      setTimeout(() => setStep(6), 13500), // "Memories. Dreams. Lessons. Stories."
      setTimeout(() => setStep(7), 16500), // "For my 24th birthday..."
      setTimeout(() => setStep(8), 19000), // "...I collected letters."
      setTimeout(() => setStep(9), 21500), // Doors open & Grand Title + Button
    ];

    return () => {
      clearInterval(interval);
      timers.forEach(clearTimeout);
    };
  }, []);

  const handleEnter = () => {
    soundEngine.playUnfoldShimmer();
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#03040C] flex flex-col items-center justify-center overflow-hidden select-none">
      {/* Background canvas of drifting magical fireflies & floating light envelopes */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Firefly 1 */}
        {step >= 1 && (
          <motion.div
            animate={{ x: `${fireflyPos.x}%`, y: `${fireflyPos.y}%` }}
            transition={{ ease: 'linear', duration: 0.1 }}
            className="absolute w-4 h-4 rounded-full bg-amber-200 shadow-[0_0_30px_10px_rgba(243,201,120,0.8)]"
          />
        )}

        {/* Swirling light dust / envelopes */}
        {step >= 2 && (
          <div className="absolute inset-0">
            {Array.from({ length: 60 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0.2, 0.9, 0.2],
                  scale: [0.5, 1.2, 0.5],
                  y: ['100vh', '-10vh'],
                  x: [`${(i * 17) % 100}vw`, `${((i * 17) + 30) % 100}vw`],
                }}
                transition={{
                  duration: 8 + (i % 5),
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: 'easeInOut',
                }}
                className={`absolute rounded-full ${
                  i % 3 === 0
                    ? 'w-3 h-3 bg-amber-300 shadow-[0_0_20px_rgba(243,201,120,0.9)]'
                    : i % 3 === 1
                    ? 'w-2 h-2 bg-purple-300 shadow-[0_0_15px_rgba(199,164,255,0.9)]'
                    : 'w-2 h-2 bg-cyan-300 shadow-[0_0_15px_rgba(122,224,237,0.9)]'
                }`}
              />
            ))}
          </div>
        )}

        {/* Floating Museum Architecture Silhouette appearing in distance */}
        {step >= 8 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.35, scale: 1 }}
            transition={{ duration: 3 }}
            className="absolute bottom-0 w-full h-[60vh] bg-gradient-to-t from-amber-500/10 via-purple-900/20 to-transparent flex justify-center items-end"
          >
            <div className="w-[800px] h-[300px] border-t-2 border-x-2 border-amber-400/30 rounded-t-full glass-panel-gold blur-sm" />
          </motion.div>
        )}
      </div>

      {/* Skip Button */}
      <button
        onClick={handleEnter}
        className="absolute top-6 right-6 z-50 text-xs font-cinzel text-amber-200/60 hover:text-amber-200 px-4 py-2 rounded-full border border-amber-400/20 bg-slate-900/50 backdrop-blur-md transition flex items-center gap-2"
      >
        <span>Skip Introduction</span>
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
      </button>

      {/* Music Indicator */}
      <div className="absolute top-6 left-6 z-50 flex items-center gap-2 text-xs font-cinzel text-amber-200/60 bg-slate-900/40 px-3 py-1.5 rounded-full border border-amber-400/20">
        <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span>Sound On</span>
      </div>

      {/* Poetic Text Sequence */}
      <div className="relative z-20 text-center max-w-2xl px-6">
        <AnimatePresence mode="wait">
          {step === 3 && (
            <motion.p
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1.5 }}
              className="text-2xl md:text-3xl font-serif-display text-indigo-200 tracking-wide italic"
            >
              "As every birthday approaches..."
            </motion.p>
          )}

          {step === 4 && (
            <motion.p
              key="step4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1.5 }}
              className="text-2xl md:text-3xl font-serif-display text-amber-200 tracking-wide italic"
            >
              "...we collect gifts."
            </motion.p>
          )}

          {step === 5 && (
            <motion.p
              key="step5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1.5 }}
              className="text-2xl md:text-3xl font-serif-display text-purple-200 tracking-wide italic"
            >
              "...but some things are far more precious."
            </motion.p>
          )}

          {step === 6 && (
            <motion.div
              key="step6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 1.8 }}
              className="space-y-2 text-3xl md:text-4xl font-serif-display text-gradient-gold tracking-widest uppercase"
            >
              <p>Memories.</p>
              <p>Dreams.</p>
              <p>Lessons.</p>
              <p>Stories.</p>
            </motion.div>
          )}

          {step === 7 && (
            <motion.p
              key="step7"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1.5 }}
              className="text-3xl md:text-4xl font-serif-display text-amber-100 italic"
            >
              "For my 24th birthday..."
            </motion.p>
          )}

          {step === 8 && (
            <motion.p
              key="step8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1.5 }}
              className="text-3xl md:text-4xl font-serif-display text-gradient-gold font-semibold"
            >
              "...I collected letters."
            </motion.p>
          )}

          {step >= 9 && (
            <motion.div
              key="step9"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 2 }}
              className="space-y-6"
            >
              {/* Grand Doors Opening Golden Light */}
              <motion.div
                initial={{ width: '0px' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, ease: 'easeOut' }}
                className="h-0.5 bg-gradient-to-r from-transparent via-amber-300 to-transparent mx-auto max-w-md shadow-[0_0_20px_#F3C978]"
              />

              <div className="space-y-2">
                <span className="text-xs uppercase font-cinzel tracking-[0.3em] text-amber-300/80">
                  Chapter 24
                </span>
                <h1 className="text-4xl md:text-6xl font-serif-display font-bold text-gradient-gold drop-shadow-2xl">
                  The Birthday Letter Museum
                </h1>
                <p className="text-lg md:text-xl font-serif-display italic text-indigo-100/90 max-w-lg mx-auto">
                  Every envelope contains a piece of someone.
                </p>
              </div>

              {/* Enter Museum Button */}
              <motion.button
                whileHover={{ scale: 1.06, boxShadow: '0 0 40px rgba(243,201,120,0.6)' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleEnter}
                className="relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-amber-950 font-cinzel font-bold text-base shadow-[0_0_30px_rgba(243,201,120,0.4)] cursor-pointer group"
              >
                <Sparkles className="w-5 h-5 text-amber-950 group-hover:rotate-12 transition" />
                <span>✨ Enter The Museum ✨</span>
                <DoorOpen className="w-5 h-5 text-amber-950 group-hover:translate-x-1 transition" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
