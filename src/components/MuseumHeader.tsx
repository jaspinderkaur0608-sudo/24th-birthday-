import React, { useState } from 'react';
import { ViewTab } from '../types';
import { soundEngine } from '../services/soundEngine';
import { 
  Building2, 
  Globe, 
  Layers, 
  Sparkles, 
  Lock, 
  PlusCircle, 
  Volume2, 
  VolumeX, 
  Shuffle, 
  Search,
  Star
} from 'lucide-react';

interface MuseumHeaderProps {
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
  onOpenSubmitModal: () => void;
  onSelectRandomLetter: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  capsuleCount: number;
  isSupabaseLive?: boolean;
}

export const MuseumHeader: React.FC<MuseumHeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenSubmitModal,
  onSelectRandomLetter,
  searchQuery,
  setSearchQuery,
  capsuleCount,
  isSupabaseLive = false,
}) => {
  const [isMuted, setIsMuted] = useState(soundEngine.getMuted());

  const handleToggleMute = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundEngine.playChime(880, 0.4);
    }
  };

  const navItems: { id: ViewTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'museum', label: 'Museum Halls', icon: <Building2 className="w-4 h-4" /> },
    { id: 'globe', label: '3D Globe', icon: <Globe className="w-4 h-4" /> },
    { id: 'categories', label: 'Categories', icon: <Layers className="w-4 h-4" /> },
    { id: 'rare', label: 'Rare Vault', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'capsule', label: 'Birthday Capsule', icon: <Lock className="w-4 h-4" />, badge: capsuleCount },
    { id: 'constellation', label: 'Constellation 24', icon: <Star className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full px-4 md:px-8 py-3 bg-[#050714]/80 backdrop-blur-xl border-b border-amber-400/20 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
        
        {/* Brand & Chapter 24 Title */}
        <div className="flex items-center justify-between w-full lg:w-auto">
          <div 
            onClick={() => setActiveTab('museum')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-600 to-purple-800 p-0.5 shadow-[0_0_20px_rgba(243,201,120,0.3)] group-hover:scale-105 transition">
              <div className="w-full h-full bg-[#0B1026] rounded-[14px] flex items-center justify-center text-amber-300 font-cinzel font-bold text-lg">
                24
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-serif-display font-bold text-gradient-gold tracking-wide">
                  The Birthday Letter Museum
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 font-cinzel text-[10px] tracking-widest">
                  CHAPTER 24
                </span>
                {isSupabaseLive ? (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 font-mono text-[10px]" title="Connected to Supabase shared database">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Supabase Live
                  </span>
                ) : (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-400/20 text-amber-300/70 font-mono text-[10px]" title="Supabase credentials pending in Vercel/env">
                    Supabase Ready
                  </span>
                )}
              </div>
              <p className="text-[11px] text-indigo-200/60 font-sans hidden sm:block">
                A living universe of stories, memories & dreams
              </p>
            </div>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={handleToggleMute}
              className="p-2 rounded-xl bg-slate-900/60 border border-amber-400/20 text-amber-300 hover:bg-slate-800"
              title="Toggle Audio"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            </button>

            <button
              onClick={onOpenSubmitModal}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-amber-950 font-semibold text-xs flex items-center gap-1 shadow-md"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Leave Letter</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto max-w-full py-1 scrollbar-none">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  soundEngine.playChime(660, 0.3);
                  setActiveTab(item.id);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-amber-500/15 border border-amber-400/40 text-amber-200 shadow-[0_0_15px_rgba(243,201,120,0.15)] font-semibold'
                    : 'text-indigo-200/70 hover:text-slate-100 hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-amber-400 text-amber-950 font-bold text-[10px]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Search, Audio, Random & Leave Letter CTA (Desktop) */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-indigo-300/50 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search museum..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 w-36 focus:w-48 transition-all rounded-xl bg-slate-900/60 border border-amber-400/20 text-xs text-slate-100 placeholder:text-indigo-300/40 focus:outline-none focus:border-amber-400/60"
            />
          </div>

          {/* Random Story Button */}
          <button
            onClick={() => {
              soundEngine.playUnfoldShimmer();
              onSelectRandomLetter();
            }}
            className="p-2 rounded-xl bg-slate-900/60 border border-amber-400/20 text-indigo-200 hover:text-amber-300 hover:border-amber-400/40 transition cursor-pointer"
            title="Unfold A Random Letter"
          >
            <Shuffle className="w-4 h-4" />
          </button>

          {/* Audio Equalizer Button */}
          <button
            onClick={handleToggleMute}
            className="p-2 rounded-xl bg-slate-900/60 border border-amber-400/20 text-indigo-200 hover:text-amber-300 hover:border-amber-400/40 transition cursor-pointer flex items-center gap-1.5"
            title="Toggle Ambient Soundtrack"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-slate-500" />
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              </>
            )}
          </button>

          {/* Leave A Letter CTA */}
          <button
            onClick={() => {
              soundEngine.playChime(1046.5, 0.5);
              onOpenSubmitModal();
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-amber-950 font-cinzel font-bold text-xs tracking-wide shadow-[0_0_20px_rgba(243,201,120,0.3)] hover:scale-105 transition cursor-pointer flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Leave A Letter</span>
          </button>
        </div>

      </div>
    </header>
  );
};
