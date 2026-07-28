// Web Audio Synthesizer for "The Birthday Letter Museum"

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isMusicPlaying: boolean = false;
  private ambientGain: GainNode | null = null;
  private musicTimer: number | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.15, this.ctx.currentTime, 0.2);
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Soft celestial chime for button hover or UI clicks
  public playChime(freq: number = 880, duration: number = 0.8) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      // Gentle frequency bend up
      osc.frequency.exponentialRampToValueAtTime(freq * 1.05, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio context error fallback
    }
  }

  // Play envelope unfold shimmer
  public playUnfoldShimmer() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          this.playChime(freq, 0.9);
        }, idx * 70);
      });
    } catch {
      // Ignore
    }
  }

  // Play wax seal pop / crunch sound
  public playSealBreak() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.15);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);

      // Add a higher sparkle tone right after
      setTimeout(() => {
        this.playChime(1174.66, 0.6); // D6
      }, 120);
    } catch {
      // Ignore
    }
  }

  // Ambient celestial music generator (soft piano + celesta arpeggios + warm pad)
  public startAmbientMusic() {
    if (this.isMusicPlaying) return;
    this.isMusicPlaying = true;
    this.initContext();

    if (!this.ctx) return;

    // Create a master gain for ambient music
    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : 0.12, this.ctx.currentTime);
    this.ambientGain.connect(this.ctx.destination);

    // Warm background synth pad
    this.createPadSynth();

    // Celestial arpeggio loop
    const scale = [261.63, 329.63, 392.00, 493.88, 523.25, 659.25, 783.99, 987.77]; // C major 7 / 9 notes
    let noteIdx = 0;

    const playNextNote = () => {
      if (!this.isMusicPlaying || !this.ctx || !this.ambientGain) return;

      const freq = scale[noteIdx % scale.length];
      noteIdx = (noteIdx + Math.floor(Math.random() * 3) + 1) % scale.length;

      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      // Alternate between sine (celesta) and triangle (soft music box)
      osc.type = Math.random() > 0.4 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      noteGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      noteGain.gain.linearRampToValueAtTime(0.06, this.ctx.currentTime + 0.2);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 2.5);

      osc.connect(noteGain);
      noteGain.connect(this.ambientGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 2.6);

      const nextDelay = 800 + Math.random() * 1400; // Peaceful irregular timing
      this.musicTimer = window.setTimeout(playNextNote, nextDelay);
    };

    playNextNote();
  }

  private createPadSynth() {
    if (!this.ctx || !this.ambientGain) return;

    const freqs = [130.81, 164.81, 196.00]; // C3, E3, G3 warm chord
    freqs.forEach(f => {
      if (!this.ctx || !this.ambientGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, this.ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.02, this.ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ambientGain);

      osc.start();
    });
  }

  public stopAmbientMusic() {
    this.isMusicPlaying = false;
    if (this.musicTimer) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
  }
}

export const soundEngine = new SoundEngine();
