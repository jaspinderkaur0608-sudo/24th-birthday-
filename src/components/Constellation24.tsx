import React, { useState } from 'react';
import { soundEngine } from '../services/soundEngine';
import { Star, Flame, Sparkles, Lightbulb, Heart } from 'lucide-react';

export const Constellation24: React.FC = () => {
  const [activeStar, setActiveStar] = useState<number | null>(null);

  // 24 Constellation Wishes & Milestones for Chapter 24
  const wishes24 = [
    '01. Courage to explore unknown paths',
    '02. Quiet mornings with warm tea',
    '03. Serendipitous friendships across borders',
    '04. Creative breakthroughs in every project',
    '05. Laughter that makes your stomach ache',
    '06. Resilience through life\'s shifting seasons',
    '07. A heart that remains open and kind',
    '08. Starlight guidance during dark nights',
    '09. The wisdom to pause and breathe',
    '10. Music that moves your soul',
    '11. Unforgettable travels and sunsets',
    '12. Deep, unwavering peace of mind',
    '13. Faith in the beauty of your dreams',
    '14. Stories preserved for future generations',
    '15. Grace in moments of uncertainty',
    '16. Joy in the simplest everyday details',
    '17. Love that grows stronger with time',
    '18. Clear vision for Chapter 24',
    '19. Compassion for yourself and others',
    '20. Warm embraces from cherished people',
    '21. Endless curiosity about the universe',
    '22. The magic of unexpected miracles',
    '23. Radiance that lights up every room',
    '24. A lifetime of wonder, beauty & truth',
  ];

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 space-y-8 animate-fade-in">
      <div className="p-8 md:p-12 rounded-3xl glass-panel-gold border-2 border-amber-400/40 text-center relative overflow-hidden shadow-2xl">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-cinzel mb-4">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>Chapter 24 Celestial Motif</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-serif-display font-bold text-gradient-gold">
          The 24 Celestial Lanterns & Star Map
        </h1>

        <p className="text-sm md:text-lg font-serif-display italic text-indigo-100/90 max-w-2xl mx-auto mt-2">
          Click any of the 24 glowing lanterns floating among the stars to unlock its celestial blessing for Chapter 24.
        </p>

        {/* Active Star Blessing Display */}
        {activeStar !== null && (
          <div className="mt-6 p-6 rounded-2xl bg-slate-950/90 border border-amber-400/50 max-w-lg mx-auto animate-scale-in shadow-2xl">
            <div className="flex items-center justify-center gap-2 text-amber-300 font-cinzel text-xs mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Lantern Blessing #{activeStar + 1}</span>
            </div>
            <p className="text-xl font-serif-display text-gradient-gold italic font-semibold">
              "{wishes24[activeStar]}"
            </p>
          </div>
        )}
      </div>

      {/* 24 Lanterns Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {wishes24.map((wish, idx) => (
          <div
            key={idx}
            onClick={() => {
              soundEngine.playChime(500 + idx * 30, 0.4);
              setActiveStar(idx);
            }}
            className={`p-4 rounded-2xl glass-panel border transition cursor-pointer flex flex-col items-center justify-center text-center group ${
              activeStar === idx
                ? 'border-amber-300 bg-amber-500/20 scale-105 shadow-[0_0_25px_rgba(243,201,120,0.5)]'
                : 'border-amber-400/20 hover:border-amber-400/60 hover:-translate-y-1'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 via-amber-600 to-purple-900 flex items-center justify-center text-amber-200 shadow-lg group-hover:rotate-6 transition mb-3">
              <Flame className="w-6 h-6 text-amber-300 animate-pulse" />
            </div>

            <span className="font-cinzel text-xs font-bold text-amber-300 mb-1">
              Lantern #{idx + 1}
            </span>

            <p className="text-[11px] text-indigo-200/70 line-clamp-2 italic font-serif-display">
              {wish.split('. ')[1]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
