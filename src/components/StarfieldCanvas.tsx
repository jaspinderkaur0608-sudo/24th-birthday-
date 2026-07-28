import React, { useEffect, useRef } from 'react';

interface StarfieldCanvasProps {
  showConstellation24?: boolean;
}

export const StarfieldCanvas: React.FC<StarfieldCanvasProps> = ({ showConstellation24 = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse tracking for parallax
    let mouseX = width / 2;
    let mouseY = height / 2;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Generate 600 Stars
    const stars = Array.from({ length: 500 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.3,
      alpha: Math.random(),
      speed: Math.random() * 0.01 + 0.003,
      color: Math.random() > 0.8 ? '#F3C978' : Math.random() > 0.6 ? '#C7A4FF' : '#E0E6F8',
    }));

    // Generate 24 Floating Golden Lanterns (Representing Chapter 24)
    const lanterns = Array.from({ length: 24 }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 10 + Math.random() * 14,
      speedY: 0.15 + Math.random() * 0.25,
      swaySpeed: 0.005 + Math.random() * 0.01,
      swayOffset: Math.random() * Math.PI * 2,
      pulse: Math.random() * Math.PI,
      id: i + 1,
    }));

    // Generate 12 Floating Envelope Silhouettes
    const envelopes = Array.from({ length: 14 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 14 + Math.random() * 10,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.004,
      speedY: 0.1 + Math.random() * 0.2,
      speedX: (Math.random() - 0.5) * 0.15,
      opacity: 0.2 + Math.random() * 0.3,
    }));

    // "24" Constellation Stars (Normalized coordinates)
    // Digit 2 points & Digit 4 points
    const const24Points = [
      // Digit '2'
      { nx: 0.82, ny: 0.12 },
      { nx: 0.85, ny: 0.10 },
      { nx: 0.87, ny: 0.13 },
      { nx: 0.85, ny: 0.18 },
      { nx: 0.82, ny: 0.22 },
      { nx: 0.87, ny: 0.22 },
      // Digit '4'
      { nx: 0.90, ny: 0.10 },
      { nx: 0.88, ny: 0.17 },
      { nx: 0.93, ny: 0.17 },
      { nx: 0.92, ny: 0.10 },
      { nx: 0.92, ny: 0.22 },
    ];

    const const24Lines = [
      // '2' lines
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
      // '4' lines
      [6, 7], [7, 8], [9, 10],
    ];

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Deep Cosmic Nebula Background Gradient
      const grad = ctx.createRadialGradient(
        width * 0.5 + (mouseX - width / 2) * 0.05,
        height * 0.5 + (mouseY - height / 2) * 0.05,
        50,
        width * 0.5,
        height * 0.5,
        Math.max(width, height)
      );
      grad.addColorStop(0, '#0F1638');
      grad.addColorStop(0.4, '#0B1026');
      grad.addColorStop(0.8, '#060817');
      grad.addColorStop(1, '#03040C');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Aurora Purple Soft Glow Wave
      ctx.save();
      const auroraGrad = ctx.createLinearGradient(0, height, width, 0);
      auroraGrad.addColorStop(0, 'rgba(29, 19, 59, 0)');
      auroraGrad.addColorStop(0.5, `rgba(199, 164, 255, ${0.05 + Math.sin(time * 0.5) * 0.02})`);
      auroraGrad.addColorStop(1, 'rgba(68, 200, 181, 0)');
      ctx.fillStyle = auroraGrad;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      // Render Stars
      stars.forEach(s => {
        s.alpha += s.speed;
        if (s.alpha > 1 || s.alpha < 0.2) s.speed = -s.speed;

        const px = s.x + (mouseX - width / 2) * 0.01 * s.radius;
        const py = s.y + (mouseY - height / 2) * 0.01 * s.radius;

        ctx.fillStyle = s.color;
        ctx.globalAlpha = Math.max(0, Math.min(1, s.alpha));
        ctx.beginPath();
        ctx.arc(px, py, s.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Render 24 Floating Golden Lanterns
      lanterns.forEach(l => {
        l.y -= l.speedY;
        if (l.y < -30) l.y = height + 30;
        const sway = Math.sin(time * l.swaySpeed + l.swayOffset) * 20;
        const lx = l.x + sway + (mouseX - width / 2) * 0.02;
        const ly = l.y;

        const pulse = Math.sin(time * 2 + l.pulse) * 0.2 + 0.8;

        // Lantern Outer Glow
        const lGlow = ctx.createRadialGradient(lx, ly, 0, lx, ly, l.size * 2.5);
        lGlow.addColorStop(0, `rgba(243, 201, 120, ${0.4 * pulse})`);
        lGlow.addColorStop(0.6, `rgba(232, 165, 152, ${0.15 * pulse})`);
        lGlow.addColorStop(1, 'rgba(243, 201, 120, 0)');

        ctx.fillStyle = lGlow;
        ctx.beginPath();
        ctx.arc(lx, ly, l.size * 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Lantern Body
        ctx.save();
        ctx.translate(lx, ly);
        ctx.fillStyle = 'rgba(243, 201, 120, 0.9)';
        ctx.beginPath();
        ctx.roundRect(-l.size * 0.4, -l.size * 0.6, l.size * 0.8, l.size * 1.2, 4);
        ctx.fill();

        // Flame inner core
        ctx.fillStyle = '#FFF1D0';
        ctx.beginPath();
        ctx.arc(0, 0, l.size * 0.25 * pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Render Floating Envelopes
      envelopes.forEach(e => {
        e.y -= e.speedY;
        e.x += e.speedX;
        e.rot += e.rotSpeed;
        if (e.y < -40) e.y = height + 40;
        if (e.x < -40) e.x = width + 40;
        if (e.x > width + 40) e.x = -40;

        ctx.save();
        ctx.translate(e.x, e.y);
        ctx.rotate(e.rot);
        ctx.strokeStyle = `rgba(220, 230, 255, ${e.opacity})`;
        ctx.lineWidth = 1;
        ctx.strokeRect(-e.size * 0.6, -e.size * 0.4, e.size * 1.2, e.size * 0.8);

        // Flap triangle
        ctx.beginPath();
        ctx.moveTo(-e.size * 0.6, -e.size * 0.4);
        ctx.lineTo(0, 0);
        ctx.lineTo(e.size * 0.6, -e.size * 0.4);
        ctx.stroke();

        ctx.restore();
      });

      // Render Celestial "24" Constellation in Top Right Sky
      if (showConstellation24) {
        ctx.save();
        ctx.strokeStyle = 'rgba(243, 201, 120, 0.35)';
        ctx.lineWidth = 1.2;

        const pts = const24Points.map(p => ({
          x: p.nx * width,
          y: p.ny * height,
        }));

        // Draw Lines connecting stars
        const24Lines.forEach(([i1, i2]) => {
          const p1 = pts[i1];
          const p2 = pts[i2];
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        });

        // Draw glowing stars on constellation points
        pts.forEach((p, idx) => {
          const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 10);
          glow.addColorStop(0, 'rgba(255, 241, 208, 0.9)');
          glow.addColorStop(0.5, 'rgba(243, 201, 120, 0.4)');
          glow.addColorStop(1, 'rgba(243, 201, 120, 0)');

          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#FFF';
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fill();
        });

        // Label for "24" Constellation
        ctx.font = '12px "Cinzel", serif';
        ctx.fillStyle = 'rgba(243, 201, 120, 0.6)';
        ctx.fillText('CONSTELLATION 24', pts[0].x - 10, pts[0].y - 16);

        ctx.restore();
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [showConstellation24]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
};
