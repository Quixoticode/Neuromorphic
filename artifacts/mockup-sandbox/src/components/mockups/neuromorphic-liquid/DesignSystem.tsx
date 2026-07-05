import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Cpu, Network, Zap, Shield, ShieldAlert, Loader2, Play } from "lucide-react";
import { Progress } from "@/components/ui/progress";

// --- Theme Definitions ---
const THEMES = {
  darkCortex: {
    id: "darkCortex",
    bg: "#030508",
    card: "#0a0f1a",
    cardHover: "#0d1520",
    primary: "#00F0FF",
    secondary: "#FFB300",
    text: "#ffffff",
    textMuted: "#8892b0",
    name: "Dark Cortex",
  },
  midnightBio: {
    id: "midnightBio",
    bg: "#050b1a",
    card: "#0a1229",
    cardHover: "#0f1a36",
    primary: "#7B4FFF",
    secondary: "#00F0FF",
    text: "#ffffff",
    textMuted: "#7c88b0",
    name: "Midnight Bio",
  },
  bioluminescent: {
    id: "bioluminescent",
    bg: "#011a0a",
    card: "#022912",
    cardHover: "#03381a",
    primary: "#00FF88",
    secondary: "#FFB300",
    text: "#ffffff",
    textMuted: "#7cb092",
    name: "Bioluminescent",
  },
};

type Theme = keyof typeof THEMES;

// --- Custom Hooks ---
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

// --- Components ---

const NeuralCanvas = ({ theme }: { theme: Theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentTheme = THEMES[theme];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Array<{ x: number; y: number; vx: number; vy: number }> = [];
    const particleCount = window.innerWidth < 768 ? 80 : 150;
    
    let mouse = { x: -1000, y: -1000 };
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const isMobile = window.innerWidth < 768;
      
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        if (!isMobile) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200) {
            p.x -= dx * 0.01;
            p.y -= dy * 0.01;
          }
        }
        
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = currentTheme.primary;
        ctx.globalAlpha = 0.6;
        ctx.fill();
        
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = currentTheme.primary;
            ctx.globalAlpha = 1 - dist / 120;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouse = { x: -1000, y: -1000 };
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    
    resize();
    const animId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, [theme, currentTheme.primary]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 mix-blend-screen"
      style={{ opacity: 0.4 }}
    />
  );
};

const XSynaLogo = ({ theme }: { theme: typeof THEMES[Theme] }) => (
  <svg width="64" height="64" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={theme.primary} />
        <stop offset="100%" stopColor={theme.secondary} />
      </linearGradient>
    </defs>
    <path d="M20,20 Q50,50 80,80 M20,80 Q50,50 80,20" stroke="url(#logoGrad)" strokeWidth="6" strokeLinecap="round" />
    <circle cx="50" cy="50" r="10" fill={theme.bg} stroke="url(#logoGrad)" strokeWidth="4" />
  </svg>
);

const GlassCard = ({ title, subtitle, icon: Icon, stat, themeObj, index }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="relative p-6 rounded-2xl border border-white/5 overflow-hidden group backdrop-blur-[24px]"
      style={{ backgroundColor: `${themeObj.card}aa` }}
    >
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ 
          boxShadow: `inset 0 0 30px ${themeObj.primary}22, 0 0 15px ${themeObj.primary}11`,
          border: `1px solid ${themeObj.primary}44`
        }} 
      />
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div 
          className="p-3 rounded-xl"
          style={{ backgroundColor: `${themeObj.primary}15`, color: themeObj.primary }}
        >
          <Icon size={24} />
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold tracking-tight" style={{ color: themeObj.text }}>
            {stat}
          </div>
        </div>
      </div>
      <div className="relative z-10">
        <h3 className="text-xl font-semibold mb-1" style={{ color: themeObj.text }}>{title}</h3>
        <p className="text-sm font-medium" style={{ color: themeObj.textMuted }}>{subtitle}</p>
      </div>
    </motion.div>
  );
};

const ScrollRevealBlock = ({ index, primary, secondary, muted }: { index: number; primary: string; secondary: string; muted: string }) => {
  const { ref, isVisible } = useScrollReveal();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="pl-6 relative"
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-full" style={{ background: `linear-gradient(to bottom, ${primary}, ${secondary})` }} />
      <h3 className="text-2xl font-semibold mb-2">Protocol Phase 0{index}</h3>
      <p className="max-w-3xl leading-relaxed" style={{ color: muted }}>
        The neuromorphic framework adapts to environmental constraints. Content blocks are not static; they manifest physically through smooth, mathematically modeled translations that mimic biological movement rather than mechanical easing.
      </p>
    </motion.div>
  );
};

export function DesignSystem() {
  const [activeThemeKey, setActiveThemeKey] = useState<Theme>("darkCortex");
  const theme = THEMES[activeThemeKey];

  return (
    <div 
      className="min-h-screen w-full overflow-x-hidden font-['Plus_Jakarta_Sans'] transition-colors duration-700 ease-in-out selection:bg-white/10"
      style={{ backgroundColor: theme.bg, color: theme.text }}
    >
      <NeuralCanvas theme={activeThemeKey} />
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 lg:px-12 flex flex-col gap-32">
        
        {/* 1. Hero Header */}
        <section className="flex flex-col items-center justify-center text-center min-h-[60vh] gap-8 pt-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <XSynaLogo theme={theme} />
          </motion.div>
          
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span 
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: `linear-gradient(to right, ${theme.primary}, ${theme.secondary})` }}
              >
                Neuromorphic Liquid v2
              </span>
            </h1>
            <motion.p 
              className="text-xl md:text-2xl font-medium tracking-wide max-w-2xl mx-auto"
              style={{ color: theme.textMuted }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Organic. Fluid. Reactive. Adaptive.
            </motion.p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            {(Object.keys(THEMES) as Theme[]).map((t) => (
              <motion.button
                key={t}
                onClick={() => setActiveThemeKey(t)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{ 
                  boxShadow: activeThemeKey === t ? `0 0 20px ${THEMES[t].primary}40` : 'none'
                }}
                className={`px-6 py-3 rounded-full text-sm font-bold tracking-wider uppercase transition-all duration-300 border backdrop-blur-md`}
                style={{
                  backgroundColor: activeThemeKey === t ? `${THEMES[t].primary}22` : `${THEMES[t].card}88`,
                  borderColor: activeThemeKey === t ? THEMES[t].primary : 'transparent',
                  color: activeThemeKey === t ? THEMES[t].primary : THEMES[t].textMuted,
                }}
              >
                {THEMES[t].name}
              </motion.button>
            ))}
          </div>
        </section>

        {/* 3. Liquid Glass Cards */}
        <section className="space-y-12">
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-3xl font-bold">Liquid Glass Interfaces</h2>
            <p style={{ color: theme.textMuted }}>Reactive surfaces that respond to presence.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard title="Neural Sync" subtitle="Real-time biological synchronization" icon={Activity} stat="99.8%" themeObj={theme} index={0} />
            <GlassCard title="Synaptic Load" subtitle="Current cognitive processing" icon={Cpu} stat="42 TFLOPS" themeObj={theme} index={1} />
            <GlassCard title="Data Cortex" subtitle="Stored memory patterns" icon={Network} stat="18.4 PB" themeObj={theme} index={2} />
            <GlassCard title="Bio Pulse" subtitle="System vitality reading" icon={Zap} stat="142 BPM" themeObj={theme} index={3} />
          </div>
        </section>

        {/* 4. Bio-Buttons Showcase */}
        <section className="space-y-12">
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-3xl font-bold">Bio-Buttons</h2>
            <p style={{ color: theme.textMuted }}>Interactive elements with organic feedback loops.</p>
          </div>
          <div className="flex flex-wrap gap-6 items-center">
            {/* Primary Bio */}
            <button 
              className="relative px-8 py-4 rounded-xl font-bold overflow-hidden group transition-transform hover:-translate-y-1"
              style={{ backgroundColor: theme.primary, color: theme.bg }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
              <div className="flex items-center gap-2">
                <Play size={18} /> Primary Bio
              </div>
            </button>

            {/* Amber Pulse */}
            <button 
              className="px-8 py-4 rounded-xl font-bold transition-all hover:-translate-y-1"
              style={{ 
                backgroundColor: `${theme.secondary}22`, 
                color: theme.secondary,
                border: `1px solid ${theme.secondary}66`,
                boxShadow: `0 0 0 ${theme.secondary}00`
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = `0 0 20px ${theme.secondary}66`}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = `0 0 0 ${theme.secondary}00`}
            >
              <div className="flex items-center gap-2">
                <Zap size={18} /> Amber Pulse
              </div>
            </button>

            {/* Ghost Neural */}
            <button 
              className="px-8 py-4 rounded-xl font-bold transition-all hover:-translate-y-1 group"
              style={{ 
                border: `1px solid ${theme.primary}66`,
                color: theme.primary
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${theme.primary}22`;
                e.currentTarget.style.borderColor = theme.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = `${theme.primary}66`;
              }}
            >
              <div className="flex items-center gap-2">
                <Network size={18} /> Ghost Neural
              </div>
            </button>

            {/* Danger Spike */}
            <button 
              className="px-8 py-4 rounded-xl font-bold transition-all hover:-translate-y-1"
              style={{ 
                backgroundColor: `#ff003315`, 
                color: '#ff3366',
                border: `1px solid #ff003366`
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = `0 0 20px #ff003366`}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = `0 0 0 transparent`}
            >
              <div className="flex items-center gap-2">
                <ShieldAlert size={18} /> Danger Spike
              </div>
            </button>

            {/* Loading Bio */}
            <button 
              className="px-8 py-4 rounded-xl font-bold cursor-wait opacity-80"
              style={{ backgroundColor: `${theme.card}`, color: theme.textMuted, border: `1px solid ${theme.primary}33` }}
              disabled
            >
              <div className="flex items-center gap-2">
                <Loader2 size={18} className="animate-spin" style={{ color: theme.primary }} /> Syncing...
              </div>
            </button>
          </div>
        </section>

        {/* 5. Loading & Database Sync Animations */}
        <section className="space-y-12">
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-3xl font-bold">Fluid States</h2>
            <p style={{ color: theme.textMuted }}>Continuous visual feedback for system processes.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Sync Progress */}
            <div className="p-8 rounded-2xl backdrop-blur-xl space-y-6" style={{ backgroundColor: `${theme.card}aa`, border: `1px solid ${theme.primary}22` }}>
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Activity size={18} style={{ color: theme.primary }} /> Database Sync
              </h3>
              
              <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className="absolute top-0 left-0 bottom-0 rounded-full"
                  style={{ backgroundColor: theme.primary }}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <div className="absolute top-0 right-0 bottom-0 w-8" style={{ background: `linear-gradient(to right, transparent, ${theme.secondary})` }} />
                </motion.div>
              </div>
              
              <div className="flex justify-between text-xs" style={{ color: theme.textMuted }}>
                <span>Transferring patterns...</span>
                <span className="font-mono">SYS_SYNC</span>
              </div>
            </div>

            {/* Connections */}
            <div className="p-8 rounded-2xl backdrop-blur-xl space-y-6 flex flex-col justify-center" style={{ backgroundColor: `${theme.card}aa`, border: `1px solid ${theme.primary}22` }}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Network size={18} style={{ color: theme.secondary }} /> Synaptic Status
                </h3>
                
                <div className="flex gap-2">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: theme.primary }}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex items-center w-full h-8 relative">
                {[0, 1, 2, 3, 4, 5].map(i => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{ backgroundColor: theme.primary }}
                    initial={{ left: "-10%", opacity: 0 }}
                    animate={{ left: "110%", opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3, ease: "linear" }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 6. Typography */}
        <section className="space-y-12">
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-3xl font-bold">Neuro-Typography</h2>
            <p style={{ color: theme.textMuted }}>Legible at any cognitive load.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8 p-8 rounded-2xl" style={{ backgroundColor: `${theme.card}66` }}>
              <div>
                <p className="text-sm mb-4" style={{ color: theme.textMuted }}>Plus Jakarta Sans</p>
                <div className="space-y-4">
                  <p className="text-4xl font-extralight">The Neural Age (200)</p>
                  <p className="text-4xl font-normal">The Neural Age (400)</p>
                  <p className="text-4xl font-semibold">The Neural Age (600)</p>
                  <p className="text-4xl font-extrabold">The Neural Age (800)</p>
                </div>
              </div>
              
              <div className="pt-8 border-t border-white/10 space-y-4">
                <p className="text-3xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(to right, ${theme.primary}, ${theme.secondary})` }}>Cyan to Amber</p>
                <p className="text-3xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(to right, ${theme.secondary}, ${theme.primary})` }}>Amber to Cyan</p>
                <p className="text-3xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(to right, #ffffff, ${theme.primary})` }}>White to Cyan</p>
              </div>
            </div>

            <div className="p-8 rounded-2xl font-['JetBrains_Mono'] text-sm leading-relaxed overflow-x-auto" style={{ backgroundColor: '#020305', border: `1px solid ${theme.primary}33` }}>
              <div className="flex gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <pre>
                <code>
                  <span style={{ color: theme.primary }}>function</span> <span style={{ color: '#fff' }}>initializeCortex</span>() {'{\n'}
                  {'  '}const <span style={{ color: theme.secondary }}>syncRate</span> = <span style={{ color: '#fff' }}>0.998</span>;\n
                  {'  '}if (status === <span style={{ color: theme.secondary }}>'READY'</span>) {'{\n'}
                  {'    '}await connect(syncRate);\n
                  {'  }\n'}
                  {'}'}<motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    style={{ color: theme.primary }}
                  >_</motion.span>
                </code>
              </pre>
            </div>
          </div>
        </section>

        {/* 7. Iconography */}
        <section className="space-y-12">
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-3xl font-bold">Custom Glyphs</h2>
            <p style={{ color: theme.textMuted }}>Vector precision with biological curves.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: "Synapse Node", d: "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" },
              { name: "Neural Pulse", d: "M2 12h4l2-9 5 18 3-9h6" },
              { name: "Cortex Grid", d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" },
              { name: "Bio Shield", d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
              { name: "Liquid Core", d: "M12 2.69l5.66 4.2c3.54 2.62 5.09 7.15 3.86 11.39-1.22 4.24-5.26 7.03-9.52 7.03s-8.3-2.79-9.52-7.03c-1.23-4.24.32-8.77 3.86-11.39L12 2.69z" },
              { name: "Data Dendrite", d: "M12 3v18M12 14l7-7M12 14l-7-7M12 8l4-4M12 8L8 4" }
            ].map((icon, i) => (
              <motion.div 
                key={i}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center justify-center p-6 rounded-2xl gap-4 group cursor-pointer"
                style={{ backgroundColor: `${theme.card}aa`, border: `1px solid white`, borderColor: 'rgba(255,255,255,0.05)' }}
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform group-hover:scale-110">
                  <defs>
                    <linearGradient id={`grad-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={theme.primary} />
                      <stop offset="100%" stopColor={theme.secondary} />
                    </linearGradient>
                  </defs>
                  <path d={icon.d} stroke={`url(#grad-${i})`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-xs font-semibold text-center" style={{ color: theme.textMuted }}>{icon.name}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 8. Scroll Reveal */}
        <section className="space-y-12 pb-24">
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-3xl font-bold">Intersection Protocol</h2>
            <p style={{ color: theme.textMuted }}>Content emerges as it enters awareness.</p>
          </div>

          <div className="space-y-8">
            <ScrollRevealBlock index={1} primary={theme.primary} secondary={theme.secondary} muted={theme.textMuted} />
            <ScrollRevealBlock index={2} primary={theme.primary} secondary={theme.secondary} muted={theme.textMuted} />
            <ScrollRevealBlock index={3} primary={theme.primary} secondary={theme.secondary} muted={theme.textMuted} />
          </div>
        </section>

      </div>
    </div>
  );
}
