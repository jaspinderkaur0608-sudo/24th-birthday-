import React, { useRef, useEffect, useState } from 'react';
import { Letter } from '../types';
import { CATEGORY_CONFIG } from '../data/initialLetters';
import { soundEngine } from '../services/soundEngine';
import { Download, Share2, X, Check, Sparkles } from 'lucide-react';

interface StoryCardGeneratorProps {
  letter: Letter | null;
  onClose: () => void;
}

export const StoryCardGenerator: React.FC<StoryCardGeneratorProps> = ({ letter, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dataUrl, setDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!letter) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 1080 x 1920 Instagram Story Resolution
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cat = CATEGORY_CONFIG[letter.category];

    // Background Dark Cosmic Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1920);
    bgGrad.addColorStop(0, '#050714');
    bgGrad.addColorStop(0.3, '#0B1026');
    bgGrad.addColorStop(0.7, '#191238');
    bgGrad.addColorStop(1, '#050714');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1080, 1920);

    // Draw Starlight Stars
    for (let i = 0; i < 200; i++) {
      const sx = Math.random() * 1080;
      const sy = Math.random() * 1920;
      const sr = Math.random() * 3 + 1;
      ctx.fillStyle = Math.random() > 0.5 ? '#F3C978' : '#C7A4FF';
      ctx.globalAlpha = Math.random() * 0.8 + 0.2;
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Outer Decorative Border Frame
    ctx.strokeStyle = 'rgba(243, 201, 120, 0.4)';
    ctx.lineWidth = 6;
    ctx.strokeRect(60, 60, 960, 1800);

    ctx.strokeStyle = 'rgba(243, 201, 120, 0.2)';
    ctx.lineWidth = 2;
    ctx.strokeRect(80, 80, 920, 1760);

    // Corner Ornaments
    const drawCorner = (x: number, y: number) => {
      ctx.fillStyle = '#F3C978';
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fill();
    };
    drawCorner(80, 80);
    drawCorner(1000, 80);
    drawCorner(80, 1840);
    drawCorner(1000, 1840);

    // Header Branding
    ctx.textAlign = 'center';
    ctx.fillStyle = '#F3C978';
    ctx.font = '700 36px "Cinzel", serif';
    ctx.fillText('CHAPTER 24', 540, 200);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 56px "Cormorant Garamond", serif';
    ctx.fillText('The Birthday Letter Museum', 540, 270);

    ctx.fillStyle = '#C7A4FF';
    ctx.font = 'italic 32px "Cormorant Garamond", serif';
    ctx.fillText('Floating among the stars forever', 540, 320);

    // 3D-Styled Envelope Graphic Frame
    const evX = 180;
    const evY = 420;
    const evW = 720;
    const evH = 900;

    // Envelope Outer Glow
    ctx.shadowColor = 'rgba(243, 201, 120, 0.4)';
    ctx.shadowBlur = 40;

    ctx.fillStyle = '#090E26';
    ctx.strokeStyle = '#F3C978';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(evX, evY, evW, evH, 32);
    ctx.fill();
    ctx.stroke();

    ctx.shadowBlur = 0; // Reset shadow

    // Envelope Flap Lines
    ctx.strokeStyle = 'rgba(243, 201, 120, 0.4)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(evX, evY);
    ctx.lineTo(540, evY + 320);
    ctx.lineTo(evX + evW, evY);
    ctx.stroke();

    // Wax Seal Badge
    ctx.fillStyle = '#F3C978';
    ctx.beginPath();
    ctx.arc(540, evY + 320, 60, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#050714';
    ctx.font = '48px serif';
    ctx.fillText(letter.sealSymbol || '✉️', 540, evY + 336);

    // Contributor Name & Location inside envelope
    ctx.fillStyle = '#F3C978';
    ctx.font = '700 48px "Cormorant Garamond", serif';
    ctx.fillText(letter.name, 540, evY + 480);

    if (letter.location) {
      ctx.fillStyle = '#E0E6F8';
      ctx.font = '32px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`📍 ${letter.location}`, 540, evY + 530);
    }

    // Category & Archive Pill
    ctx.fillStyle = 'rgba(199, 164, 255, 0.2)';
    ctx.strokeStyle = 'rgba(199, 164, 255, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(340, evY + 590, 400, 60, 30);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#FFF1D0';
    ctx.font = '600 28px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`${cat.emoji} ${cat.label} • Archive #${letter.archiveNumber}`, 540, evY + 630);

    // Quote snippet
    ctx.fillStyle = '#E0E6F8';
    ctx.font = 'italic 32px "Cormorant Garamond", serif';
    const snippet = letter.content.length > 90 ? letter.content.substring(0, 90) + '...' : letter.content;
    ctx.fillText(`"${snippet}"`, 540, evY + 740);

    // Footer Text Callout
    ctx.fillStyle = '#FFF1D0';
    ctx.font = '700 42px "Cormorant Garamond", serif';
    ctx.fillText('💌 My letter now lives in', 540, 1450);

    ctx.fillStyle = '#F3C978';
    ctx.font = '700 48px "Cormorant Garamond", serif';
    ctx.fillText('The Birthday Letter Museum', 540, 1510);

    ctx.fillStyle = '#C7A4FF';
    ctx.font = '30px "Cinzel", serif';
    ctx.fillText('CHAPTER 24 • LIVING ARCHIVES', 540, 1570);

    setDataUrl(canvas.toDataURL('image/png'));
  }, [letter]);

  if (!letter) return null;

  const handleDownload = () => {
    soundEngine.playChime(1000, 0.4);
    const link = document.createElement('a');
    link.download = `Birthday-Letter-Archive-${letter.archiveNumber}-Story.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleCopyLink = () => {
    soundEngine.playChime(880, 0.3);
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-xl glass-panel-gold p-6 rounded-3xl border border-amber-400/40 shadow-2xl flex flex-col items-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 border border-amber-400/30 text-amber-200 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-cinzel mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Instagram Story Card (1080 × 1920)</span>
        </div>

        <h3 className="text-xl font-serif-display font-bold text-gradient-gold mb-4 text-center">
          Share Your Preserved Envelope
        </h3>

        {/* Hidden Generation Canvas */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Card Preview */}
        {dataUrl && (
          <div className="w-56 h-96 rounded-2xl overflow-hidden border-2 border-amber-400/40 shadow-2xl mb-6">
            <img src={dataUrl} alt="Instagram Story Card Preview" className="w-full h-full object-cover" />
          </div>
        )}

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 w-full">
          <button
            onClick={handleDownload}
            className="flex-1 min-w-[180px] py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-amber-950 font-cinzel font-bold text-xs shadow-lg hover:scale-105 transition cursor-pointer flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Story Card</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="py-3 px-5 rounded-xl bg-slate-900/80 border border-amber-400/30 text-amber-200 font-cinzel text-xs hover:bg-slate-800 transition cursor-pointer flex items-center gap-2"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'Link Copied!' : 'Copy Museum Link'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
