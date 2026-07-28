import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LetterCategory, Letter, EnvelopeRarity } from '../types';
import { CATEGORY_CONFIG } from '../data/initialLetters';
import { soundEngine } from '../services/soundEngine';
import { Sparkles, Lock, X, MapPin, Send, HelpCircle } from 'lucide-react';

interface SubmitLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (letter: Letter) => void;
  nextArchiveNumber: number;
}

export const SubmitLetterModal: React.FC<SubmitLetterModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  nextArchiveNumber,
}) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<LetterCategory>('memories');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    soundEngine.playSealBreak();

    // Determine Rarity randomly
    const rand = Math.random();
    let rarity: EnvelopeRarity = 'standard';
    if (rand > 0.85) rarity = 'golden';
    else if (rand > 0.70) rarity = 'cosmic';
    else if (rand > 0.55) rarity = 'moonlight';

    const newLetter: Letter = {
      id: `letter-${Date.now()}`,
      name: name.trim() || 'A Gentle Stranger',
      location: location.trim() || 'Floating in Starlight',
      category,
      content: content.trim(),
      archiveNumber: nextArchiveNumber,
      rarity,
      dateCreated: new Date().toISOString().split('T')[0],
      isCapsuleLetter: true, // Sealed in Birthday Capsule!
      waxColor: rarity === 'golden' ? '#F3C978' : '#C7A4FF',
      sealSymbol: rarity === 'golden' ? '✨' : '✉️',
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onSubmit(newLetter);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        className="relative w-full max-w-xl rounded-3xl glass-panel-gold border-2 border-amber-400/40 shadow-2xl p-6 md:p-8 my-8"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-slate-900/80 border border-amber-400/30 text-amber-200 hover:text-white transition cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-cinzel mb-2">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Sealed Birthday Capsule • Archive #{nextArchiveNumber}</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-serif-display font-bold text-gradient-gold">
            Leave A Letter for Chapter 24
          </h2>

          <p className="text-xs text-indigo-200/80 mt-1 max-w-md mx-auto">
            Your letter will be wax-sealed in the Chapter 24 Birthday Capsule. It joins hundreds of stories floating among the stars.
          </p>
        </div>

        {/* Submission Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name & Location Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-cinzel text-amber-200/90 mb-1">
                Your Name <span className="text-indigo-300/50">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Aria, A Friend, Traveler"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-amber-400/30 text-xs text-slate-100 placeholder:text-indigo-300/40 focus:outline-none focus:border-amber-400/80 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-cinzel text-amber-200/90 mb-1">
                Location <span className="text-indigo-300/50">(Optional)</span>
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-amber-400/60 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="e.g. Kyoto, Paris, Starlight"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-amber-400/30 text-xs text-slate-100 placeholder:text-indigo-300/40 focus:outline-none focus:border-amber-400/80 transition"
                />
              </div>
            </div>
          </div>

          {/* Category Selection Grid */}
          <div>
            <label className="block text-xs font-cinzel text-amber-200/90 mb-1.5">
              Envelope Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(CATEGORY_CONFIG) as LetterCategory[]).map(key => {
                const c = CATEGORY_CONFIG[key];
                const isSelected = category === key;
                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() => {
                      soundEngine.playChime(750, 0.2);
                      setCategory(key);
                    }}
                    className={`p-2 rounded-xl text-xs font-medium border transition text-left flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-semibold'
                        : 'bg-slate-900/60 border-white/10 text-indigo-200/70 hover:border-amber-400/40 hover:text-slate-100'
                    }`}
                  >
                    <span>{c.emoji}</span>
                    <span className="truncate">{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Letter Message Area */}
          <div>
            <label className="block text-xs font-cinzel text-amber-200/90 mb-1">
              Your Letter, Memory, Advice or Story
            </label>
            <textarea
              required
              rows={5}
              placeholder="Write your heartfelt message, joke, memory, advice, or dream for Chapter 24..."
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full p-3.5 rounded-xl bg-slate-900/80 border border-amber-400/30 text-sm text-slate-100 placeholder:text-indigo-300/40 focus:outline-none focus:border-amber-400/80 transition leading-relaxed font-serif-display italic"
            />
          </div>

          {/* Birthday Capsule Assurance Info Box */}
          <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-400/30 flex items-start gap-2.5 text-xs text-purple-200/90">
            <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-amber-300">Sealed Capsule Guarantee:</span> Your letter will be stored safely inside the Chapter 24 Birthday Capsule. It will join the museum stars and unlock on the 24th birthday ceremony!
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-amber-950 font-cinzel font-bold text-sm tracking-wider shadow-[0_0_25px_rgba(243,201,120,0.4)] hover:scale-[1.02] transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Wax-Sealing Envelope...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-950" />
                <span>Wax Seal & Launch To Museum (Archive #{nextArchiveNumber})</span>
                <Send className="w-4 h-4 text-amber-950" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
