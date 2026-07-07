import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import {
  Brain,
  Waves,
  Droplets,
  Zap,
  Network,
  Cpu,
  Shield,
  Layers,
  Orbit,
  Activity,
  Database,
  Sparkles,
  ArrowRight,
} from "lucide-react";

// --- Theme Definitions ---
const THEMES = {
  darkCortex: {
    id: "darkCortex",
    bg: "#030508",
    surface1: "#060b12",
    surface2: "#0a1220",
    primary: "#00E5FF",
    secondary: "#FFB300",
    accent3: "#7B4FFF",
    text: "#E8F4FF",
    muted: "#4A6080",
    name: "Dark Cortex",
  },
  midnightBio: {
    id: "midnightBio",
    bg: "#030508",
    surface1: "#060b12",
    surface2: "#0a1220",
    primary: "#7B4FFF",
    secondary: "#00E5FF",
    accent3: "#FFB300",
    text: "#E8F4FF",
    muted: "#4A6080",
    name: "Midnight Bio",
  },
  bioluminescent: {
    id: "bioluminescent",
    bg: "#030508",
    surface1: "#060b12",
    surface2: "#0a1220",
    primary: "#00FF88",
    secondary: "#FFB300",
    accent3: "#00E5FF",
    text: "#E8F4FF",
    muted: "#4A6080",
    name: "Bioluminescent",
  },
};

type Theme = keyof typeof THEMES;

// --- CSS styles & Keyframes ---
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Space+Grotesk:wght@300..700&display=swap');

    .font-display {
      font-family: 'Space Grotesk', sans-serif;
    }
    .font-body {
      font-family: 'DM Sans', sans-serif;
    }
    
    @keyframes liquidMorph {
      0%   { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
      33%  { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
      66%  { border-radius: 40% 60% 30% 70% / 40% 40% 60% 50%; }
      100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
    }
    
    .blob-1 { animation: liquidMorph 15s ease-in-out infinite alternate; }
    .blob-2 { animation: liquidMorph 22s ease-in-out infinite alternate-reverse; }
    .blob-3 { animation: liquidMorph 18s ease-in-out infinite alternate; }
    .blob-4 { animation: liquidMorph 25s ease-in-out infinite alternate-reverse; }

    @keyframes gradientSweep {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    .bg-sweep {
      background-size: 200% 200%;
      animation: gradientSweep 20s ease infinite;
    }
    
    /* Hide scrollbar for clean horizontal scroll */
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .no-scrollbar {
      -ms-overflow-style: none;  /* IE and Edge */
      scrollbar-width: none;  /* Firefox */
    }
  `}</style>
);

// --- Background Component ---
const LiquidBackground = ({ theme }: { theme: typeof THEMES[Theme] }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Ripple effect on interaction
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let ripples: Array<{ x: number; y: number; radius: number; alpha: number; maxRadius: number }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 2;
        r.alpha -= 0.02;

        if (r.alpha <= 0) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = \`\${theme.primary}\${Math.floor(r.alpha * 255).toString(16).padStart(2, '0')}\`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      requestAnimationFrame(draw);
    };
    const animId = requestAnimationFrame(draw);

    const handlePointer = (e: PointerEvent) => {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        alpha: 0.8,
        maxRadius: 150
      });
    };
    
    window.addEventListener("pointerdown", handlePointer);
    window.addEventListener("pointermove", (e) => {
      if (Math.random() > 0.9) handlePointer(e); // occasional ripple on move
    });

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", handlePointer);
      cancelAnimationFrame(animId);
    };
  }, [theme]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-sweep"
         style={{ background: \`linear-gradient(45deg, \${theme.bg}, \${theme.surface1}, \${theme.bg})\` }}>
      
      {/* Flowing gradient bands */}
      <div className="absolute inset-0 opacity-20 bg-sweep mix-blend-screen"
           style={{ backgroundImage: \`linear-gradient(120deg, transparent, \${theme.primary}22, transparent, \${theme.accent3}22, transparent)\` }} />

      {/* Morphing Blobs */}
      <motion.div 
        className="blob-1 absolute blur-[100px] rounded-full mix-blend-screen"
        style={{ width: '800px', height: '800px', backgroundColor: \`\${theme.primary}1A\`, left: '-20%', top: '-20%' }}
        animate={{ x: [0, 100, 0], y: [0, 50, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div 
        className="blob-2 absolute blur-[120px] rounded-full mix-blend-screen"
        style={{ width: '900px', height: '900px', backgroundColor: \`\${theme.secondary}14\`, right: '-10%', bottom: '-10%' }}
        animate={{ x: [0, -100, 0], y: [0, -50, 0] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />
      <motion.div 
        className="blob-3 absolute blur-[90px] rounded-full mix-blend-screen"
        style={{ width: '600px', height: '600px', backgroundColor: \`\${theme.accent3}0F\`, left: '40%', top: '30%' }}
        animate={{ x: [0, 50, -50, 0], y: [0, -50, 50, 0] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Ripple Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-10 opacity-60 mix-blend-screen" />
    </div>
  );
};

// --- XSyna Logo ---
const Logo = ({ theme }: { theme: typeof THEMES[Theme] }) => (
  <div className="relative flex items-center justify-center w-48 h-48">
    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full z-10 drop-shadow-2xl">
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={theme.primary} />
          <stop offset="100%" stopColor={theme.secondary} />
        </linearGradient>
      </defs>
      <path d="M20,20 Q50,50 80,80 M20,80 Q50,50 80,20" stroke="url(#logoGrad)" strokeWidth="6" strokeLinecap="round" />
      <circle cx="50" cy="50" r="10" fill={theme.bg} stroke="url(#logoGrad)" strokeWidth="4" />
    </svg>
    {/* Axons */}
    <svg viewBox="0 0 200 200" className="absolute inset-[-50%] w-[200%] h-[200%] z-0 opacity-50">
      {[...Array(8)].map((_, i) => (
        <motion.line
          key={i}
          x1="100" y1="100"
          x2={100 + Math.cos((i * Math.PI) / 4) * 80}
          y2={100 + Math.sin((i * Math.PI) / 4) * 80}
          stroke={theme.primary}
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ strokeDasharray: "0 200", strokeDashoffset: 0 }}
          animate={{ strokeDasharray: ["0 200", "200 0", "0 200"] }}
          transition={{ duration: 4, delay: i * 0.2, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </svg>
  </div>
);

// --- Glass Card ---
const GlassCard3D = ({ title, subtitle, icon: Icon, stat, theme }: any) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [blobPos, setBlobPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Max rotation 12deg
    const rotateXValue = ((y - centerY) / centerY) * -12;
    const rotateYValue = ((x - centerX) / centerX) * 12;
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
    setBlobPos({ x, y });
  };

  return (
    <motion.div
      className="relative p-8 rounded-3xl backdrop-blur-2xl border flex flex-col justify-between overflow-hidden"
      style={{ 
        backgroundColor: "rgba(255, 255, 255, 0.04)", 
        borderColor: "rgba(255, 255, 255, 0.08)",
        height: '240px',
        transformPerspective: 800
      }}
      animate={{ rotateX: isHovered ? rotateX : 0, rotateY: isHovered ? rotateY : 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30, mass: 20 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="absolute w-40 h-40 rounded-full mix-blend-screen pointer-events-none transition-opacity duration-300"
        style={{ 
          background: \`radial-gradient(circle, \${theme.primary}44 0%, transparent 70%)\`,
          transform: \`translate(\${blobPos.x - 80}px, \${blobPos.y - 80}px)\`,
          opacity: isHovered ? 1 : 0
        }}
      />
      
      <div className="relative z-10 flex items-start justify-between">
        <div className="p-4 rounded-2xl" style={{ backgroundColor: \`\${theme.primary}22\`, color: theme.primary }}>
          <Icon size={32} strokeWidth={1.5} />
        </div>
        <div className="text-right">
          <div className="text-4xl font-display font-bold" style={{ color: theme.text }}>{stat}</div>
        </div>
      </div>
      <div className="relative z-10 mt-auto">
        <h3 className="text-xl font-display font-bold mb-1" style={{ color: theme.text }}>{title}</h3>
        <p className="font-body text-sm" style={{ color: theme.muted }}>{subtitle}</p>
      </div>
    </motion.div>
  );
};


// --- Liquid States Demos ---
const WaveProgressBar = ({ theme }: { theme: any }) => {
  return (
    <div className="h-12 w-full relative rounded-full overflow-hidden border" style={{ borderColor: \`\${theme.primary}33\`, backgroundColor: \`\${theme.surface1}88\` }}>
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <motion.path
          d="M0,24 Q50,0 100,24 T200,24 T300,24 T400,24 T500,24 V48 H0 Z"
          fill={theme.primary}
          opacity={0.3}
          animate={{ x: [-100, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        <motion.path
          d="M0,24 Q50,48 100,24 T200,24 T300,24 T400,24 T500,24 V48 H0 Z"
          fill={theme.primary}
          opacity={0.6}
          animate={{ x: [-100, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </svg>
    </div>
  );
};

const LiquidFill = ({ theme }: { theme: any }) => {
  return (
    <div className="w-32 h-32 rounded-full border-4 relative overflow-hidden flex items-center justify-center" style={{ borderColor: \`\${theme.primary}44\`, backgroundColor: \`\${theme.surface1}\` }}>
      <motion.div
        className="absolute bottom-0 w-[200%] h-[200%] blob-1"
        style={{ backgroundColor: theme.primary, opacity: 0.8, borderRadius: '40%' }}
        animate={{ y: [100, -20, 100], rotate: [0, 360] }}
        transition={{ y: { duration: 8, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: 5, repeat: Infinity, ease: "linear" } }}
      />
      <div className="relative z-10 font-display font-bold text-xl mix-blend-difference text-white">74%</div>
    </div>
  );
};

const MorphingDataChip = ({ theme }: { theme: any }) => {
  return (
    <motion.div
      className="w-32 h-32 flex items-center justify-center font-body text-sm font-bold text-center"
      style={{ backgroundColor: \`\${theme.secondary}22\`, color: theme.secondary, border: \`1px solid \${theme.secondary}66\` }}
      animate={{ borderRadius: ["20%", "50%", "30%", "40%", "20%"] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      Syncing...
    </motion.div>
  );
};

const FlowingParticleStream = ({ theme }: { theme: any }) => {
  return (
    <div className="relative w-full h-32 flex items-center border rounded-2xl px-6" style={{ borderColor: \`\${theme.accent3}44\`, backgroundColor: \`\${theme.surface1}88\` }}>
      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.primary }} />
      <div className="flex-1 relative h-full">
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <path id="flowPath" d="M0,64 Q100,20 200,64 T400,64" fill="none" stroke={theme.accent3} strokeWidth="2" strokeOpacity={0.3} strokeDasharray="4 4" />
        </svg>
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full top-0 left-0"
            style={{ backgroundColor: theme.accent3, boxShadow: \`0 0 10px \${theme.accent3}\` }}
            animate={{ offsetDistance: ["0%", "100%"] }}
            transition={{ duration: 3, repeat: Infinity, delay: i, ease: "linear" }}
            style={{ offsetPath: "path('M0,64 Q100,20 200,64 T400,64')", offsetRotate: "auto" } as any}
          />
        ))}
      </div>
      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.secondary }} />
    </div>
  );
};

// --- Motion Demos ---
const MotionCard = ({ title, children, theme }: any) => (
  <div className="p-6 rounded-2xl border flex flex-col items-center justify-center gap-6 h-48 backdrop-blur-md"
       style={{ backgroundColor: \`\${theme.surface2}88\`, borderColor: \`\${theme.primary}22\` }}>
    <div className="flex-1 flex items-center justify-center w-full relative">{children}</div>
    <div className="font-display text-sm tracking-wider uppercase text-center" style={{ color: theme.muted }}>{title}</div>
  </div>
);


// --- Main Component ---
export function DesignSystemV3() {
  const [activeThemeKey, setActiveThemeKey] = useState<Theme>("darkCortex");
  const theme = THEMES[activeThemeKey];
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeChapter, setActiveChapter] = useState(0);

  const chapters = ["HERO", "GLASS CARDS", "LIQUID STATES", "MOTION LANG", "TYPOGRAPHY", "ICON SYSTEM"];

  const scrollToChapter = (index: number) => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        left: window.innerWidth * index,
        behavior: 'smooth'
      });
      setActiveChapter(index);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const index = Math.round(containerRef.current.scrollLeft / window.innerWidth);
        setActiveChapter(index);
      }
    };
    const ref = containerRef.current;
    if (ref) ref.addEventListener('scroll', handleScroll);
    return () => { if (ref) ref.removeEventListener('scroll', handleScroll); };
  }, []);

  return (
    <div className="font-body text-base min-h-screen overflow-hidden selection:bg-white/10" style={{ color: theme.text, backgroundColor: theme.bg }}>
      <GlobalStyles />
      <LiquidBackground theme={theme} />

      {/* Navigation Pills */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 rounded-full backdrop-blur-xl border"
           style={{ backgroundColor: \`\${theme.surface2}AA\`, borderColor: \`\${theme.primary}33\` }}>
        {chapters.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToChapter(i)}
            className="w-3 h-3 rounded-full transition-all duration-300"
            style={{ 
              backgroundColor: activeChapter === i ? theme.primary : theme.muted,
              transform: activeChapter === i ? 'scale(1.5)' : 'scale(1)',
              boxShadow: activeChapter === i ? \`0 0 10px \${theme.primary}\` : 'none'
            }}
          />
        ))}
      </div>

      {/* Horizontal Scroll Container */}
      <div 
        ref={containerRef}
        className="flex flex-nowrap overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth w-screen h-screen no-scrollbar relative z-10"
      >
        
        {/* CHAPTER 1: HERO */}
        <section className="flex-shrink-0 w-screen h-screen snap-start flex flex-col items-center justify-center relative px-6">
          <Logo theme={theme} />
          
          <div className="text-center mt-12 space-y-4">
            <h1 className="font-display text-[5vw] font-bold leading-none tracking-tight">
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: \`linear-gradient(135deg, \${theme.primary}, \${theme.secondary})\` }}>
                Neuromorphic Liquid
              </span>
            </h1>
            <p className="font-mono tracking-[0.2em] text-sm uppercase" style={{ color: theme.muted }}>Design System v3</p>
          </div>

          <div className="flex gap-4 mt-16">
            {(Object.keys(THEMES) as Theme[]).map((t) => {
              const isAct = activeThemeKey === t;
              return (
                <button
                  key={t}
                  onClick={() => setActiveThemeKey(t)}
                  className="relative px-6 py-3 rounded-full font-display font-bold text-sm overflow-hidden group border transition-all"
                  style={{ 
                    borderColor: isAct ? THEMES[t].primary : \`\${THEMES[t].primary}44\`,
                    color: isAct ? THEMES[t].bg : THEMES[t].text,
                  }}
                >
                  <motion.div 
                    className="absolute inset-0 z-0"
                    initial={false}
                    animate={{ y: isAct ? 0 : '100%' }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    style={{ backgroundColor: THEMES[t].primary }}
                  />
                  <span className="relative z-10">{THEMES[t].name}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* CHAPTER 2: GLASS CARDS */}
        <section className="flex-shrink-0 w-screen h-screen snap-start flex flex-col items-center justify-center px-6 md:px-24">
          <div className="w-full max-w-5xl mx-auto space-y-12">
            <div className="text-left">
              <h2 className="font-display text-5xl font-bold mb-4">Liquid Glass Interfaces</h2>
              <p className="text-xl" style={{ color: theme.muted }}>Reactive surfaces with true depth mapping.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <GlassCard3D title="Neural Sync" subtitle="Biological coupling rate" icon={Brain} stat="99.8%" theme={theme} />
              <GlassCard3D title="Synaptic Load" subtitle="Current cognitive processing" icon={Cpu} stat="42 TF" theme={theme} />
              <GlassCard3D title="Data Cortex" subtitle="Retained memory patterns" icon={Database} stat="18.4 PB" theme={theme} />
              <GlassCard3D title="Bio Pulse" subtitle="System vitality reading" icon={Waves} stat="142 BPM" theme={theme} />
            </div>
          </div>
        </section>

        {/* CHAPTER 3: LIQUID STATES */}
        <section className="flex-shrink-0 w-screen h-screen snap-start flex flex-col items-center justify-center px-6 md:px-24">
          <div className="w-full max-w-5xl mx-auto space-y-12">
             <div className="text-left">
              <h2 className="font-display text-5xl font-bold mb-4">Fluid States</h2>
              <p className="text-xl" style={{ color: theme.muted }}>Organic representations of data in motion.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-12">
                <div className="space-y-4">
                  <h3 className="font-display text-xl font-bold" style={{ color: theme.primary }}>Wave Progress</h3>
                  <WaveProgressBar theme={theme} />
                </div>
                <div className="space-y-4">
                  <h3 className="font-display text-xl font-bold" style={{ color: theme.accent3 }}>Particle Flow Stream</h3>
                  <FlowingParticleStream theme={theme} />
                </div>
              </div>
              <div className="flex justify-around items-center h-full">
                <div className="flex flex-col items-center gap-6">
                  <h3 className="font-display text-xl font-bold" style={{ color: theme.primary }}>Volumetric Fill</h3>
                  <LiquidFill theme={theme} />
                </div>
                <div className="flex flex-col items-center gap-6">
                  <h3 className="font-display text-xl font-bold" style={{ color: theme.secondary }}>State Morph</h3>
                  <MorphingDataChip theme={theme} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CHAPTER 4: MOTION LANGUAGE */}
        <section className="flex-shrink-0 w-screen h-screen snap-start flex flex-col items-center justify-center px-6 md:px-24 overflow-y-auto">
          <div className="w-full max-w-5xl mx-auto space-y-12 py-12">
            <div className="text-left">
              <h2 className="font-display text-5xl font-bold mb-4">Motion Language</h2>
              <p className="text-xl" style={{ color: theme.muted }}>Physics-based interactions that feel alive.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <MotionCard title="Spring Bounce" theme={theme}>
                <motion.div className="w-12 h-12 rounded-full" style={{ backgroundColor: theme.primary }}
                  animate={{ y: [-40, 40] }} transition={{ type: "spring", bounce: 0.7, duration: 1.5, repeat: Infinity, repeatType: "reverse" }} />
              </MotionCard>
              
              <MotionCard title="Liquid Ease" theme={theme}>
                <motion.div className="w-12 h-12 rounded-2xl" style={{ backgroundColor: theme.secondary }}
                  animate={{ x: [-50, 50] }} transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], repeat: Infinity, repeatType: "reverse" }} />
              </MotionCard>
              
              <MotionCard title="Morph" theme={theme}>
                <motion.div className="w-16 h-16" style={{ backgroundColor: theme.accent3 }}
                  animate={{ borderRadius: ["50%", "10px"] }} transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }} />
              </MotionCard>
              
              <MotionCard title="Ripple" theme={theme}>
                <div className="relative flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full z-10" style={{ backgroundColor: theme.primary }} />
                  <motion.div className="absolute w-16 h-16 rounded-full border-2" style={{ borderColor: theme.primary }}
                    animate={{ scale: [0, 2], opacity: [1, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }} />
                </div>
              </MotionCard>
              
              <MotionCard title="Pulse" theme={theme}>
                 <motion.div className="w-12 h-12 rounded-full" style={{ backgroundColor: \`\${theme.secondary}44\`, boxShadow: \`0 0 20px \${theme.secondary}\` }}
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
              </MotionCard>
              
              <MotionCard title="Flow" theme={theme}>
                 <motion.div animate={{ x: [-20, 20, -20] }} transition={{ duration: 3, ease: "linear", repeat: Infinity }}>
                   <ArrowRight size={32} color={theme.accent3} />
                 </motion.div>
              </MotionCard>
            </div>
          </div>
        </section>

        {/* CHAPTER 5: TYPOGRAPHY */}
        <section className="flex-shrink-0 w-screen h-screen snap-start flex flex-col items-center justify-center px-6 md:px-24">
          <div className="w-full max-w-6xl mx-auto space-y-12">
            <div className="text-left">
              <h2 className="font-display text-5xl font-bold mb-4">Type System</h2>
              <p className="text-xl" style={{ color: theme.muted }}>Geometric precision meets organic flow.</p>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-16 items-start">
              <div className="flex-1 space-y-8">
                <h3 className="font-display text-[6vw] font-bold leading-[0.9] tracking-tighter bg-clip-text text-transparent"
                    style={{ backgroundImage: \`linear-gradient(to right, \${theme.primary}, \${theme.accent3})\` }}>
                  Space<br/>Grotesk
                </h3>
                <div className="font-mono text-sm p-6 rounded-xl border bg-black/40" style={{ borderColor: \`\${theme.primary}33\`, color: theme.text }}>
                  <span style={{ color: theme.primary }}>const</span> typography = {'{\n'}
                  {'  '}display: <span style={{ color: theme.secondary }}>'Space Grotesk'</span>,\n
                  {'  '}body: <span style={{ color: theme.secondary }}>'DM Sans'</span>\n
                  {'}'}<motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} style={{ color: theme.primary }}>_</motion.span>
                </div>
              </div>
              
              <div className="flex-1 space-y-6 font-display text-right w-full">
                <div className="flex justify-end items-center gap-6 border-b pb-4" style={{ borderColor: \`\${theme.muted}44\` }}>
                  <span className="text-sm font-mono" style={{ color: theme.muted }}>W200</span>
                  <p className="text-4xl font-extralight">Liquid State</p>
                </div>
                <div className="flex justify-end items-center gap-6 border-b pb-4" style={{ borderColor: \`\${theme.muted}44\` }}>
                  <span className="text-sm font-mono" style={{ color: theme.muted }}>W400</span>
                  <p className="text-4xl font-normal">Liquid State</p>
                </div>
                <div className="flex justify-end items-center gap-6 border-b pb-4" style={{ borderColor: \`\${theme.muted}44\` }}>
                  <span className="text-sm font-mono" style={{ color: theme.muted }}>W600</span>
                  <p className="text-4xl font-semibold">Liquid State</p>
                </div>
                <div className="flex justify-end items-center gap-6">
                  <span className="text-sm font-mono" style={{ color: theme.muted }}>W800</span>
                  <p className="text-4xl font-extrabold text-transparent bg-clip-text" style={{ backgroundImage: \`linear-gradient(to right, \${theme.secondary}, \${theme.primary})\` }}>Liquid State</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CHAPTER 6: ICON SYSTEM */}
        <section className="flex-shrink-0 w-screen h-screen snap-start flex flex-col items-center justify-center px-6 md:px-24">
          <div className="w-full max-w-5xl mx-auto space-y-12">
            <div className="text-left">
              <h2 className="font-display text-5xl font-bold mb-4">Glyph Protocol</h2>
              <p className="text-xl" style={{ color: theme.muted }}>Symbols of the neural architecture.</p>
            </div>
            
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {[
                { icon: Brain, name: "Cortex" },
                { icon: Waves, name: "Pulse" },
                { icon: Droplets, name: "Liquid" },
                { icon: Zap, name: "Energy" },
                { icon: Network, name: "Synapse" },
                { icon: Cpu, name: "Process" },
                { icon: Shield, name: "Secure" },
                { icon: Layers, name: "Depth" },
                { icon: Orbit, name: "Orbit" },
                { icon: Activity, name: "Vitals" },
                { icon: Database, name: "Memory" },
                { icon: Sparkles, name: "Magic" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="relative group flex flex-col items-center justify-center p-6 rounded-2xl border backdrop-blur-md cursor-pointer"
                  style={{ backgroundColor: \`\${theme.surface2}88\`, borderColor: \`\${theme.surface1}\` }}
                  whileHover="hover"
                  initial="rest"
                >
                  <motion.div 
                    className="absolute inset-0 rounded-2xl opacity-0"
                    variants={{
                      hover: { opacity: 1, boxShadow: \`inset 0 0 20px \${theme.primary}44, 0 0 10px \${theme.primary}66\`, borderColor: theme.primary }
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 opacity-0"
                    style={{ borderColor: theme.primary }}
                    variants={{
                      hover: { scale: 1.2, opacity: 0, transition: { duration: 0.8, ease: "easeOut" } }
                    }}
                  />
                  
                  <motion.div
                    variants={{
                      rest: { scale: 1, color: theme.text },
                      hover: { scale: 1.2, color: theme.primary, transition: { type: "spring", stiffness: 400, damping: 10 } }
                    }}
                    className="relative z-10 mb-4"
                  >
                    <item.icon size={32} strokeWidth={1.5} />
                  </motion.div>
                  <span className="text-xs font-mono tracking-widest uppercase relative z-10" style={{ color: theme.muted }}>{item.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
