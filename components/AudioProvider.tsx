import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

interface AudioContextType {
  playHover: () => void;
  playClick: () => void;
  playSwipe: () => void;
  isMuted: boolean;
  toggleMute: () => void;
}

const AudioContext = createContext<AudioContextType>({
  playHover: () => {},
  playClick: () => {},
  playSwipe: () => {},
  isMuted: true,
  toggleMute: () => {},
});

export const useAudio = () => useContext(AudioContext);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  
  // Ambient Nodes
  const ambientNodesRef = useRef<any[]>([]);
  
  // Scroll Audio Nodes
  const scrollNoiseNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const scrollGainRef = useRef<GainNode | null>(null);
  const scrollFilterRef = useRef<BiquadFilterNode | null>(null);
  const lastScrollYRef = useRef(0);
  const scrollVelocityRef = useRef(0);
  const rafRef = useRef<number>(0);
  
  // Reusable Buffers
  const noiseBufferRef = useRef<AudioBuffer | null>(null);

  // Initialize Audio Engine
  useEffect(() => {
    const initAudio = () => {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
        
        // Master Gain
        const masterGain = audioCtxRef.current.createGain();
        masterGain.gain.value = isMuted ? 0 : 0.5;
        masterGain.connect(audioCtxRef.current.destination);
        masterGainRef.current = masterGain;

        // Pre-generate noise buffer
        generateNoiseBuffer(audioCtxRef.current);
      }
    };

    const handleInteraction = () => {
      initAudio();
      if (audioCtxRef.current?.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      if (!isMuted) {
        startAmbient();
        startScrollNoise();
      }
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    
    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Handle Mute State
  useEffect(() => {
    if (!audioCtxRef.current || !masterGainRef.current) return;

    const ctx = audioCtxRef.current;
    const master = masterGainRef.current;
    const now = ctx.currentTime;

    if (isMuted) {
      // Fade out
      master.gain.cancelScheduledValues(now);
      master.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      setTimeout(() => {
        stopAmbient();
        stopScrollNoise();
      }, 500);
    } else {
      // Fade in
      if (ctx.state === 'suspended') ctx.resume();
      startAmbient();
      startScrollNoise();
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(0.001, now);
      master.gain.exponentialRampToValueAtTime(0.5, now + 1);
    }
  }, [isMuted]);

  // --- Scroll Physics Loop (Inertia System) ---
  useEffect(() => {
    const loop = () => {
      if (!isMuted && scrollGainRef.current && scrollFilterRef.current && audioCtxRef.current) {
        const currentScrollY = window.scrollY;
        const delta = Math.abs(currentScrollY - lastScrollYRef.current);
        lastScrollYRef.current = currentScrollY;

        // Add delta to velocity, apply drag/inertia
        // This makes the sound trail off naturally instead of cutting out
        scrollVelocityRef.current = scrollVelocityRef.current * 0.92 + delta * 0.08;

        // Map scroll velocity to volume and frequency
        const intensity = Math.min(scrollVelocityRef.current / 40, 1); 
        
        const now = audioCtxRef.current.currentTime;
        
        // Volume: rises with speed
        const targetGain = Math.max(0, intensity * 0.12);
        scrollGainRef.current.gain.setTargetAtTime(targetGain, now, 0.05);

        // Filter: opens up with speed (simulating wind rush)
        const targetFreq = 150 + (intensity * 600);
        scrollFilterRef.current.frequency.setTargetAtTime(targetFreq, now, 0.05);
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isMuted]);

  // --- Audio Generators ---

  const generateNoiseBuffer = (ctx: AudioContext) => {
    if (noiseBufferRef.current) return;
    const bufferSize = ctx.sampleRate * 2; // 2 seconds
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Pink Noise algorithm
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      data[i] *= 0.11; 
      b6 = white * 0.115926;
    }
    noiseBufferRef.current = buffer;
  };

  const startScrollNoise = () => {
    if (!audioCtxRef.current || !masterGainRef.current || scrollNoiseNodeRef.current || !noiseBufferRef.current) return;
    const ctx = audioCtxRef.current;
    
    const source = ctx.createBufferSource();
    source.buffer = noiseBufferRef.current;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 150; // Start muted

    const gain = ctx.createGain();
    gain.gain.value = 0; // Start silent

    source.connect(filter);
    filter.connect(gain);
    gain.connect(masterGainRef.current);

    source.start();

    scrollNoiseNodeRef.current = source;
    scrollFilterRef.current = filter;
    scrollGainRef.current = gain;
  };

  const stopScrollNoise = () => {
    if (scrollNoiseNodeRef.current) {
      try {
        scrollNoiseNodeRef.current.stop();
        scrollNoiseNodeRef.current.disconnect();
      } catch (e) {}
      scrollNoiseNodeRef.current = null;
    }
  };

  const startAmbient = () => {
    if (!audioCtxRef.current || !masterGainRef.current || ambientNodesRef.current.length > 0) return;
    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;

    // A soothing, airy pad chord (Fmaj7 add9) for a futuristic/hopeful feel
    // F3, A3, C4, E4, G4
    const freqs = [174.61, 220.00, 261.63, 329.63, 392.00]; 
    
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.value = f;
      osc.detune.value = Math.random() * 6 - 3; // Detune for width

      // LFO for slow movement (breathing)
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.05 + (Math.random() * 0.05); // Very slow
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.03; // Modulation depth
      
      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);
      
      gain.gain.value = 0.015; // Base volume (very quiet)

      // Filter to remove harshness
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 800;

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGainRef.current!);
      
      osc.start(now);
      lfo.start(now);
      
      ambientNodesRef.current.push({ osc, gain, lfo, lfoGain, filter });
    });
  };

  const stopAmbient = () => {
    ambientNodesRef.current.forEach(node => {
      try {
        node.osc.stop();
        node.lfo.stop();
        node.osc.disconnect();
        node.lfo.disconnect();
      } catch(e) {}
    });
    ambientNodesRef.current = [];
  };

  // --- Interaction SFX (Awwwards Style) ---

  const playHover = () => {
    if (isMuted || !audioCtxRef.current || !masterGainRef.current) return;
    const ctx = audioCtxRef.current;
    const t = ctx.currentTime;
    
    // "Breath" / Glassy Swell (Not a harsh ping)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.linearRampToValueAtTime(800, t + 0.3);
    
    // Soft attack, long release
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.04, t + 0.05); 
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

    osc.connect(gain);
    gain.connect(masterGainRef.current);
    
    osc.start(t);
    osc.stop(t + 0.4);
  };

  const playClick = () => {
    if (isMuted || !audioCtxRef.current || !masterGainRef.current) return;
    const ctx = audioCtxRef.current;
    const t = ctx.currentTime;
    
    // "Woodblock" / Mechanical Click
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(100, t + 0.1);
    
    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    
    // Subtle High-End Noise for texture
    if (noiseBufferRef.current) {
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBufferRef.current;
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.05, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
        noise.connect(noiseGain);
        noiseGain.connect(masterGainRef.current);
        noise.start(t);
        noise.stop(t + 0.1);
    }
    
    osc.connect(gain);
    gain.connect(masterGainRef.current);
    
    osc.start(t);
    osc.stop(t + 0.1);
  };

  const playSwipe = () => {
    if (isMuted || !audioCtxRef.current || !masterGainRef.current) return;
    const ctx = audioCtxRef.current;
    const t = ctx.currentTime;
    
    // Soft Air Swoosh
    if (!noiseBufferRef.current) return;
    
    const source = ctx.createBufferSource();
    source.buffer = noiseBufferRef.current;
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 1;
    filter.frequency.setValueAtTime(400, t);
    filter.frequency.exponentialRampToValueAtTime(1200, t + 0.3);
    
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    
    source.connect(filter);
    filter.connect(gain);
    gain.connect(masterGainRef.current);
    
    source.start(t);
    source.stop(t + 0.4);
  };

  return (
    <AudioContext.Provider value={{ playHover, playClick, playSwipe, isMuted, toggleMute: () => setIsMuted(!isMuted) }}>
      {children}
    </AudioContext.Provider>
  );
};
