import React, { useState, useEffect } from 'react';
import { MuseumStats } from '../types';
import { Mail, Globe2, Sparkles, Building2, Flame } from 'lucide-react';

interface MuseumStatsBarProps {
  stats: MuseumStats;
}

export const MuseumStatsBar: React.FC<MuseumStatsBarProps> = ({ stats }) => {
  const [counts, setCounts] = useState({
    letters: 0,
    locations: 0,
    stories: 0,
    wings: 0,
  });

  useEffect(() => {
    const duration = 2000;
    const steps = 40;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = Math.min(step / steps, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      setCounts({
        letters: Math.floor(stats.lettersArchived * easeProgress),
        locations: Math.floor(stats.locationsRepresented * easeProgress),
        stories: Math.floor(stats.storiesPreserved * easeProgress),
        wings: Math.floor(stats.museumWingsOpened * easeProgress),
      });

      if (step >= steps) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [stats]);

  const statItems = [
    {
      label: 'Letters Archived',
      value: `${counts.letters}+`,
      icon: <Mail className="w-5 h-5 text-amber-400" />,
      color: 'border-amber-400/30 bg-amber-500/5',
    },
    {
      label: 'Locations Represented',
      value: `${counts.locations}+`,
      icon: <Globe2 className="w-5 h-5 text-cyan-400" />,
      color: 'border-cyan-400/30 bg-cyan-500/5',
    },
    {
      label: 'Stories Preserved',
      value: `${counts.stories}+`,
      icon: <Sparkles className="w-5 h-5 text-purple-400" />,
      color: 'border-purple-400/30 bg-purple-500/5',
    },
    {
      label: 'Museum Wings Opened',
      value: `${counts.wings}`,
      icon: <Building2 className="w-5 h-5 text-rose-400" />,
      color: 'border-rose-400/30 bg-rose-500/5',
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto my-6 px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {statItems.map((item, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-2xl glass-panel border ${item.color} flex items-center gap-3.5 hover:scale-[1.02] transition shadow-lg`}
          >
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/10 shadow-inner">
              {item.icon}
            </div>
            <div>
              <div className="text-xl md:text-2xl font-cinzel font-bold text-slate-100 tracking-tight">
                {item.value}
              </div>
              <div className="text-xs text-indigo-200/70 font-sans">
                {item.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Subtitle Banner */}
      <div className="mt-3 py-2 px-4 rounded-xl glass-panel-gold flex items-center justify-between text-xs text-amber-200/90 font-serif-display italic">
        <div className="flex items-center gap-2">
          <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Chapter 24: Twenty-four celestial lanterns floating among the stars preserving every letter.</span>
        </div>
        <span className="hidden sm:inline-block text-[10px] uppercase font-cinzel text-amber-300/60 tracking-widest">
          Living Archives
        </span>
      </div>
    </div>
  );
};
