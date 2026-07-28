import React, { useState, useEffect } from 'react';
import { Letter, LetterCategory, ViewTab, MuseumStats } from './types';
import { INITIAL_LETTERS, INITIAL_STATS, CATEGORY_CONFIG, RARITY_CONFIG } from './data/initialLetters';
import { soundEngine } from './services/soundEngine';

import { StarfieldCanvas } from './components/StarfieldCanvas';
import { OpeningSequence } from './components/OpeningSequence';
import { MuseumHeader } from './components/MuseumHeader';
import { MuseumStatsBar } from './components/MuseumStatsBar';
import { EnvelopeCard } from './components/EnvelopeCard';
import { Globe3D } from './components/Globe3D';
import { LetterModal } from './components/LetterModal';
import { SubmitLetterModal } from './components/SubmitLetterModal';
import { SubmissionSuccessView } from './components/SubmissionSuccessView';
import { StoryCardGenerator } from './components/StoryCardGenerator';
import { CapsuleVaultView } from './components/CapsuleVaultView';
import { Constellation24 } from './components/Constellation24';

import { 
  Sparkles, 
  Filter, 
  Layers, 
  PlusCircle, 
  Shuffle, 
  Crown, 
  Building2,
  Heart,
  Globe2,
  Lock
} from 'lucide-react';

export default function App() {
  const [showOpening, setShowOpening] = useState<boolean>(true);
  const [letters, setLetters] = useState<Letter[]>(() => {
    const saved = localStorage.getItem('birthday_letters_ch24');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_LETTERS;
      }
    }
    return INITIAL_LETTERS;
  });

  const [stats, setStats] = useState<MuseumStats>(() => {
    return {
      ...INITIAL_STATS,
      lettersArchived: INITIAL_STATS.lettersArchived + (letters.length - INITIAL_LETTERS.length),
      storiesPreserved: INITIAL_STATS.storiesPreserved + (letters.length - INITIAL_LETTERS.length),
    };
  });

  const [activeTab, setActiveTab] = useState<ViewTab>('museum');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<LetterCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & States
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [recentlySubmittedLetter, setRecentlySubmittedLetter] = useState<Letter | null>(null);
  const [storyCardLetter, setStoryCardLetter] = useState<Letter | null>(null);

  // Save letters to localStorage
  useEffect(() => {
    localStorage.setItem('birthday_letters_ch24', JSON.stringify(letters));
  }, [letters]);

  // Handle Letter Submission
  const handleLetterSubmit = (newLetter: Letter) => {
    setIsSubmitModalOpen(false);
    setLetters(prev => [newLetter, ...prev]);
    setStats(prev => ({
      ...prev,
      lettersArchived: prev.lettersArchived + 1,
      storiesPreserved: prev.storiesPreserved + 1,
    }));
    setRecentlySubmittedLetter(newLetter);
  };

  // Select Random Letter
  const handleSelectRandomLetter = () => {
    if (letters.length === 0) return;
    const randomIndex = Math.floor(Math.random() * letters.length);
    setSelectedLetter(letters[randomIndex]);
  };

  // Filtered letters for Museum Halls
  const filteredLetters = letters.filter(letter => {
    const matchesCategory = selectedCategoryFilter === 'all' || letter.category === selectedCategoryFilter;
    const matchesSearch = searchQuery.trim() === '' || 
      letter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      letter.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      letter.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `#${letter.archiveNumber}`.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const capsuleLetters = letters.filter(l => l.isCapsuleLetter || l.archiveNumber > 600);

  return (
    <div className="min-h-screen bg-[#020205] text-[#E0E0E0] font-sans selection:bg-purple-500/30 selection:text-amber-200 relative overflow-x-hidden">
      
      {/* Immersive Atmospheric Background Layers */}
      <div className="fixed inset-0 bg-immersive-radial pointer-events-none z-0" />
      <div className="fixed top-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-900/20 blur-[130px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-900/20 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="fixed inset-0 bg-stars-grid opacity-30 pointer-events-none z-0" />

      {/* 3D Celestial Background Canvas */}
      <StarfieldCanvas showConstellation24={true} />

      {/* Opening Cinematic Sequence */}
      {showOpening && (
        <OpeningSequence onComplete={() => setShowOpening(false)} />
      )}

      {/* Main Living Museum Application Layout */}
      {!showOpening && (
        <div className="relative z-10 flex flex-col min-h-screen">
          
          {/* Side Tagline (Large Screens) */}
          <div className="hidden xl:block fixed left-6 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
            <div className="rotate-[-90deg] origin-left text-[10px] tracking-[0.5em] uppercase text-white/30 whitespace-nowrap font-cinzel">
              Preserving Humanity Since 1999 • Chapter 24
            </div>
          </div>

          {/* Quick Category Navigation Bar (Right Side Large Screens) */}
          <div className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 flex-col gap-5 z-20 bg-slate-950/60 p-3 rounded-full border border-white/10 backdrop-blur-md">
            <div 
              onClick={() => { setSelectedCategoryFilter('dreams'); setActiveTab('museum'); }}
              className="group cursor-pointer flex items-center gap-3 justify-end"
              title="Filter Dreams"
            >
              <span className="text-[10px] uppercase font-cinzel text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity">Dreams</span>
              <div className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_10px_#a855f7] group-hover:scale-125 transition" />
            </div>
            <div 
              onClick={() => { setSelectedCategoryFilter('memories'); setActiveTab('museum'); }}
              className="group cursor-pointer flex items-center gap-3 justify-end"
              title="Filter Memories"
            >
              <span className="text-[10px] uppercase font-cinzel text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity">Memories</span>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-[0_0_10px_#eab308] group-hover:scale-125 transition" />
            </div>
            <div 
              onClick={() => { setSelectedCategoryFilter('advice'); setActiveTab('museum'); }}
              className="group cursor-pointer flex items-center gap-3 justify-end"
              title="Filter Advice"
            >
              <span className="text-[10px] uppercase font-cinzel text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">Advice</span>
              <div className="w-2.5 h-2.5 rounded-full bg-gray-300 shadow-[0_0_10px_#d1d5db] group-hover:scale-125 transition" />
            </div>
            <div 
              onClick={() => { setSelectedCategoryFilter('kindness'); setActiveTab('museum'); }}
              className="group cursor-pointer flex items-center gap-3 justify-end"
              title="Filter Kindness"
            >
              <span className="text-[10px] uppercase font-cinzel text-rose-300 opacity-0 group-hover:opacity-100 transition-opacity">Kindness</span>
              <div className="w-2.5 h-2.5 rounded-full bg-rose-400 shadow-[0_0_10px_#fb7185] group-hover:scale-125 transition" />
            </div>
          </div>

          {/* Header Navigation Bar */}
          <MuseumHeader
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
            onSelectRandomLetter={handleSelectRandomLetter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            capsuleCount={capsuleLetters.length}
          />

          {/* Living Museum Animated Stats Counters */}
          <MuseumStatsBar stats={stats} />

          {/* Dynamic Content Views */}
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 pb-16">
            
            {/* View 1: Main Museum Halls */}
            {activeTab === 'museum' && (
              <div className="space-y-8 animate-fade-in">
                
                {/* Hero Central Museum Arch Portal */}
                <div className="relative p-8 md:p-12 rounded-3xl glass-panel-arch border border-amber-400/30 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_0_100px_rgba(212,175,55,0.12)]">
                  
                  {/* Left Hero Narrative */}
                  <div className="max-w-2xl space-y-4 text-center md:text-left relative z-10">
                    <span className="text-[10px] tracking-[0.4em] uppercase text-purple-300/80 font-cinzel block">
                      A Digital World of Memories
                    </span>

                    <h2 className="text-4xl md:text-6xl font-light tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-100 to-amber-400 leading-tight font-serif-display">
                      The Birthday Letter Museum
                    </h2>

                    <div className="flex items-center justify-center md:justify-start gap-4 py-1">
                      <div className="h-[1px] w-12 bg-gradient-to-r from-amber-400/80 to-transparent" />
                      <span className="text-lg md:text-xl font-medium tracking-[0.2em] text-[#D4AF37] italic font-serif-display">
                        Chapter 24
                      </span>
                      <div className="h-[1px] w-12 bg-gradient-to-l from-amber-400/80 to-transparent" />
                    </div>

                    <p className="text-sm md:text-base font-serif-display italic text-gray-300 leading-relaxed max-w-xl">
                      "Every envelope contains a piece of someone. Memories, dreams, and stories collected for a single year floating among the stars."
                    </p>

                    {/* Quick Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 pt-2">
                      <button
                        onClick={() => setIsSubmitModalOpen(true)}
                        className="w-full sm:w-auto px-8 py-3.5 bg-[#D4AF37] text-black font-semibold text-xs tracking-widest uppercase rounded-full hover:scale-105 transition-all shadow-[0_0_30px_rgba(212,175,55,0.5)] cursor-pointer flex items-center justify-center gap-2"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>✨ Leave A Letter ✨</span>
                      </button>

                      <button
                        onClick={handleSelectRandomLetter}
                        className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/5 border border-amber-400/30 text-amber-200 font-cinzel text-xs hover:bg-white/10 transition cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Shuffle className="w-4 h-4 text-amber-400" />
                        <span>Unfold Random Story</span>
                      </button>
                    </div>
                  </div>

                  {/* Right Central Portal Feature */}
                  <div className="relative w-full md:w-[320px] h-[260px] flex items-center justify-center shrink-0">
                    {/* Floating Envelope Left Accent */}
                    <div className="absolute transform -rotate-12 -translate-x-28 -translate-y-8 w-24 h-16 bg-[#1a1a2e] border border-purple-500/40 rounded shadow-2xl flex flex-col p-2 pointer-events-none hidden sm:flex">
                      <div className="w-full h-full border border-white/10 flex items-end justify-end p-1">
                        <span className="text-[9px] text-purple-300/60 font-mono">#641</span>
                      </div>
                    </div>

                    {/* Floating Envelope Right Accent */}
                    <div className="absolute transform rotate-6 translate-x-28 translate-y-6 w-28 h-20 bg-[#2e1a1a] border border-rose-500/40 rounded shadow-2xl flex flex-col p-2 pointer-events-none hidden sm:flex">
                      <div className="w-full h-full border border-white/10 flex items-end justify-end p-1">
                        <span className="text-[9px] text-rose-300/60 italic font-serif-display">#Kindness</span>
                      </div>
                    </div>

                    {/* Main Arch Portal */}
                    <div className="w-56 h-64 bg-white/5 backdrop-blur-xl border border-white/20 rounded-t-full shadow-[0_0_80px_rgba(212,175,55,0.2)] flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-16 h-16 rounded-full border-2 border-[#D4AF37] flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(212,175,55,0.5)] bg-slate-950/80">
                        <span className="text-2xl text-[#FFD700] font-cinzel font-bold">24</span>
                      </div>
                      <p className="text-xs leading-relaxed text-gray-300 font-serif-display italic">
                        The Living Museum Arch
                      </p>
                      <span className="mt-3 text-[10px] tracking-[0.2em] uppercase text-amber-300/80 font-cinzel">
                        Chapter 24
                      </span>
                    </div>
                  </div>

                </div>

                {/* Category Filter Pills */}
                <div className="flex items-center justify-between gap-4 overflow-x-auto py-2 border-b border-amber-400/10">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-xs font-cinzel text-indigo-200/80 hidden sm:inline">Filter By Category:</span>
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
                    <button
                      onClick={() => {
                        soundEngine.playChime(600, 0.2);
                        setSelectedCategoryFilter('all');
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                        selectedCategoryFilter === 'all'
                          ? 'bg-amber-400 text-amber-950 font-bold shadow-md'
                          : 'bg-slate-900/60 border border-amber-400/20 text-indigo-200 hover:text-white'
                      }`}
                    >
                      ✨ All Envelopes ({letters.length})
                    </button>

                    {(Object.keys(CATEGORY_CONFIG) as LetterCategory[]).map(catKey => {
                      const c = CATEGORY_CONFIG[catKey];
                      const isSelected = selectedCategoryFilter === catKey;
                      const count = letters.filter(l => l.category === catKey).length;
                      return (
                        <button
                          key={catKey}
                          onClick={() => {
                            soundEngine.playChime(700, 0.2);
                            setSelectedCategoryFilter(catKey);
                          }}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                            isSelected
                              ? 'bg-amber-500/25 border border-amber-400 text-amber-200 font-bold'
                              : 'bg-slate-900/60 border border-amber-400/20 text-indigo-200 hover:text-white'
                          }`}
                        >
                          <span>{c.emoji}</span>
                          <span>{c.label} ({count})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Envelopes Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 pt-2">
                  {filteredLetters.map(letter => (
                    <EnvelopeCard
                      key={letter.id}
                      letter={letter}
                      onOpen={setSelectedLetter}
                    />
                  ))}
                </div>

                {filteredLetters.length === 0 && (
                  <div className="text-center py-16 p-8 rounded-3xl glass-panel border border-amber-400/20 space-y-3">
                    <Sparkles className="w-8 h-8 text-amber-400 mx-auto" />
                    <h3 className="text-xl font-serif-display text-slate-100">No envelopes match your search</h3>
                    <p className="text-xs text-indigo-200/60">Try searching for a different name, city, or category.</p>
                  </div>
                )}
              </div>
            )}

            {/* View 2: Interactive 3D Globe */}
            {activeTab === 'globe' && (
              <div className="space-y-6 animate-fade-in">
                <Globe3D
                  letters={letters}
                  onSelectLetter={setSelectedLetter}
                  selectedCategory={selectedCategoryFilter === 'all' ? undefined : selectedCategoryFilter}
                />
              </div>
            )}

            {/* View 3: Category Showcase */}
            {activeTab === 'categories' && (
              <div className="space-y-8 animate-fade-in">
                <div className="text-center space-y-2">
                  <span className="text-xs font-cinzel text-amber-300 uppercase tracking-widest">
                    Museum Archives By Theme
                  </span>
                  <h1 className="text-3xl md:text-5xl font-serif-display font-bold text-gradient-gold">
                    Six Celestial Envelope Categories
                  </h1>
                  <p className="text-sm font-serif-display italic text-indigo-100/80 max-w-lg mx-auto">
                    Every letter category radiates its own distinct glow among the museum stars.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(Object.keys(CATEGORY_CONFIG) as LetterCategory[]).map(catKey => {
                    const c = CATEGORY_CONFIG[catKey];
                    const catLetters = letters.filter(l => l.category === catKey);

                    return (
                      <div
                        key={catKey}
                        onClick={() => {
                          setSelectedCategoryFilter(catKey);
                          setActiveTab('museum');
                        }}
                        className={`p-6 rounded-3xl glass-panel border border-amber-400/30 hover:border-amber-400 transition cursor-pointer hover:-translate-y-1 shadow-xl flex flex-col justify-between min-h-[220px]`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-3xl">{c.emoji}</span>
                            <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 font-mono text-xs font-bold">
                              {catLetters.length} Envelopes
                            </span>
                          </div>

                          <h3 className="text-2xl font-serif-display font-bold text-slate-100">
                            {c.label}
                          </h3>

                          <p className="text-xs text-indigo-200/80 font-sans leading-relaxed">
                            {c.description}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-cinzel text-amber-300">
                          <span>Explore Category</span>
                          <span>→</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* View 4: Rare Envelope Vault */}
            {activeTab === 'rare' && (
              <div className="space-y-8 animate-fade-in">
                <div className="p-8 rounded-3xl glass-panel-gold border-2 border-amber-400/40 text-center space-y-3 shadow-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-cinzel">
                    <Crown className="w-4 h-4 text-amber-400" />
                    <span>Grand Collector's Collection</span>
                  </div>

                  <h1 className="text-3xl md:text-5xl font-serif-display font-bold text-gradient-gold">
                    Rare Celestial Envelopes
                  </h1>

                  <p className="text-sm font-serif-display italic text-indigo-100/90 max-w-xl mx-auto">
                    Golden Envelopes, Moonlight Envelopes, Cosmic Envelopes, and Founder's Collection items.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {letters
                    .filter(l => l.rarity !== 'standard')
                    .map(letter => (
                      <EnvelopeCard
                        key={letter.id}
                        letter={letter}
                        onOpen={setSelectedLetter}
                      />
                    ))}
                </div>
              </div>
            )}

            {/* View 5: Birthday Capsule Vault */}
            {activeTab === 'capsule' && (
              <CapsuleVaultView
                capsuleLetters={capsuleLetters}
                onOpenLetter={setSelectedLetter}
                onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
              />
            )}

            {/* View 6: Constellation 24 */}
            {activeTab === 'constellation' && (
              <Constellation24 />
            )}

          </main>

          {/* Corner Archive Seal Badge */}
          <div className="hidden md:block fixed bottom-6 right-6 text-right pointer-events-none z-20">
            <p className="text-[10px] text-amber-400/70 uppercase tracking-widest font-cinzel">Archive Seal</p>
            <div className="w-12 h-12 border border-amber-400/40 rounded-full flex items-center justify-center mt-1 bg-slate-950/70 backdrop-blur-md opacity-80 shadow-[0_0_15px_rgba(212,175,55,0.25)]">
              <span className="text-[9px] font-cinzel text-amber-300 font-bold">MXXIV</span>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-auto py-8 px-4 border-t border-amber-400/20 text-center text-xs text-indigo-200/60 font-serif-display italic space-y-2">
            <p>The Birthday Letter Museum • Chapter 24</p>
            <p className="text-[10px] font-sans text-indigo-300/40">
              A fairytale digital art installation floating among the stars. Preserving stories forever.
            </p>
          </footer>

        </div>
      )}

      {/* Modals & Overlays */}
      <LetterModal
        letter={selectedLetter}
        onClose={() => setSelectedLetter(null)}
        onGenerateStoryCard={letter => {
          setSelectedLetter(null);
          setStoryCardLetter(letter);
        }}
      />

      <SubmitLetterModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmit={handleLetterSubmit}
        nextArchiveNumber={stats.lettersArchived + 1}
      />

      {recentlySubmittedLetter && (
        <SubmissionSuccessView
          submittedLetter={recentlySubmittedLetter}
          onExploreMuseum={() => {
            setRecentlySubmittedLetter(null);
            setActiveTab('museum');
          }}
          onGenerateStoryCard={letter => {
            setRecentlySubmittedLetter(null);
            setStoryCardLetter(letter);
          }}
        />
      )}

      {storyCardLetter && (
        <StoryCardGenerator
          letter={storyCardLetter}
          onClose={() => setStoryCardLetter(null)}
        />
      )}

    </div>
  );
}
