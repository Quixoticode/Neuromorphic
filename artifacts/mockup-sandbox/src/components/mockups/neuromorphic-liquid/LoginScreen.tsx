import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Fingerprint, Loader2 } from "lucide-react";

const THEME = {
  bg: "#030508",
  card: "#0a0f1a",
  primary: "#00F0FF",
  secondary: "#FFB300",
  purple: "#7B4FFF",
  text: "#ffffff",
  textMuted: "#8892b0",
};

const NeuralCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Array<{ x: number; y: number; vx: number; vy: number }> = [];
    const particleCount = window.innerWidth < 768 ? 60 : 100;
    
    let mouse = { x: -1000, y: -1000 };
    
    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
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
        ctx.fillStyle = THEME.primary;
        ctx.globalAlpha = 0.5;
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
            ctx.strokeStyle = THEME.primary;
            ctx.globalAlpha = (1 - dist / 120) * 0.5;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const handleMouseLeave = () => {
      mouse = { x: -1000, y: -1000 };
    };

    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    
    resize();
    const animId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      if(canvas) {
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseleave", handleMouseLeave);
      }
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-auto z-0 mix-blend-screen opacity-40" />;
};

export const AnimatedXSynaLogo = ({ className = "w-32 h-32" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logoGradAnim" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={THEME.primary} />
        <stop offset="100%" stopColor={THEME.secondary} />
      </linearGradient>
    </defs>
    <motion.path 
      d="M20,20 Q50,50 80,80 M20,80 Q50,50 80,20" 
      stroke="url(#logoGradAnim)" 
      strokeWidth="6" 
      strokeLinecap="round" 
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, ease: "easeInOut" }}
    />
    <motion.circle 
      cx="50" cy="50" r="12" 
      fill={THEME.bg} 
      stroke="url(#logoGradAnim)" 
      strokeWidth="4" 
      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    />
  </svg>
);

const SynAILogo = () => (
  <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
    <path d="M50 20 Q70 20 80 40 Q90 60 70 80 Q50 90 30 80 Q10 60 20 40 Q30 20 50 20Z" stroke={THEME.primary} strokeWidth="2" strokeDasharray="4 4" />
    <circle cx="50" cy="50" r="8" fill={THEME.primary} />
    <circle cx="50" cy="20" r="4" fill={THEME.primary} />
    <circle cx="80" cy="40" r="4" fill={THEME.primary} />
    <circle cx="70" cy="80" r="4" fill={THEME.primary} />
    <circle cx="30" cy="80" r="4" fill={THEME.primary} />
    <circle cx="20" cy="40" r="4" fill={THEME.primary} />
    <path d="M50 50 L50 20 M50 50 L80 40 M50 50 L70 80 M50 50 L30 80 M50 50 L20 40" stroke={THEME.primary} strokeWidth="2" />
  </svg>
);

const XSynChipLogo = () => (
  <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
    <rect x="25" y="25" width="50" height="50" rx="8" stroke={THEME.primary} strokeWidth="3" />
    <path d="M15 35 L25 35 M15 50 L25 50 M15 65 L25 65" stroke={THEME.primary} strokeWidth="3" />
    <path d="M75 35 L85 35 M75 50 L85 50 M75 65 L85 65" stroke={THEME.primary} strokeWidth="3" />
    <path d="M35 15 L35 25 M50 15 L50 25 M65 15 L65 25" stroke={THEME.primary} strokeWidth="3" />
    <path d="M35 75 L35 85 M50 75 L50 85 M65 75 L65 85" stroke={THEME.primary} strokeWidth="3" />
    <path d="M35 50 L45 35 L55 65 L65 50" stroke={THEME.secondary} strokeWidth="3" strokeLinejoin="round" />
  </svg>
);

const SynBridgeLogo = () => (
  <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
    <polygon points="30,25 45,33 45,50 30,58 15,50 15,33" fill={THEME.primary} opacity="0.8" />
    <polygon points="70,42 85,50 85,67 70,75 55,67 55,50" fill={THEME.secondary} opacity="0.8" />
    <motion.path 
      d="M30 42 C40 60, 60 30, 70 58" 
      stroke={THEME.purple} 
      strokeWidth="4" 
      strokeDasharray="8 8"
      animate={{ strokeDashoffset: [24, 0] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
    />
  </svg>
);

const ProductCard = ({ title, desc, icon, glowColor, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6, ease: "easeOut" }}
    whileHover={{ y: -4, boxShadow: `0 0 20px ${glowColor}40`, borderColor: glowColor }}
    className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/5 backdrop-blur-md cursor-pointer transition-all duration-300 group"
  >
    <div className="flex-shrink-0 relative">
      <div className="absolute inset-0 blur-md opacity-0 group-hover:opacity-50 transition-opacity" style={{ backgroundColor: glowColor }} />
      <div className="relative z-10">{icon}</div>
    </div>
    <div>
      <h3 className="text-white font-semibold text-lg">{title}</h3>
      <p style={{ color: THEME.textMuted }} className="text-sm">{desc}</p>
    </div>
  </motion.div>
);

export function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);
    setTimeout(() => setIsConnecting(false), 3000);
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col md:flex-row bg-[#030508] font-['Plus_Jakarta_Sans'] overflow-hidden selection:bg-white/10">
      
      {/* Left Panel */}
      <motion.div 
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 60 }}
        className="w-full md:w-[60%] relative flex flex-col justify-center p-8 md:p-16 lg:p-24 min-h-[60vh] md:min-h-screen z-10"
      >
        <NeuralCanvas />
        <div className="relative z-10 max-w-xl">
          <AnimatedXSynaLogo className="w-24 h-24 mb-6" />
          <h1 
            className="text-5xl md:text-7xl font-bold tracking-tight mb-4 bg-clip-text text-transparent"
            style={{ backgroundImage: `linear-gradient(to right, ${THEME.primary}, ${THEME.secondary})` }}
          >
            xSyna
          </h1>
          <p className="text-xl md:text-2xl font-medium mb-12" style={{ color: THEME.textMuted }}>
            Deine Intelligenz. Deine Zukunft.
          </p>

          <div className="space-y-4">
            <ProductCard 
              title="SynAI" 
              desc="Persönliche KI, die mit dir wächst" 
              icon={<SynAILogo />} 
              glowColor={THEME.primary} 
              delay={0.6} 
            />
            <ProductCard 
              title="xSyn" 
              desc="Neuromorpher Intelligenz-Chip" 
              icon={<XSynChipLogo />} 
              glowColor={THEME.secondary} 
              delay={0.8} 
            />
            <ProductCard 
              title="SynBridge" 
              desc="Bytes ↔ Spikes Übersetzer" 
              icon={<SynBridgeLogo />} 
              glowColor={THEME.purple} 
              delay={1.0} 
            />
          </div>
        </div>
      </motion.div>

      {/* Right Panel */}
      <motion.div 
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 60, delay: 0.2 }}
        className="w-full md:w-[40%] flex flex-col justify-center items-center p-8 relative z-20"
        style={{ backgroundColor: `${THEME.card}99`, backdropFilter: "blur(20px)", borderLeft: `1px solid ${THEME.primary}22` }}
      >
        <div className="w-full max-w-md space-y-8">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-white mb-2">Willkommen zurück</h2>
            <p style={{ color: THEME.textMuted }}>Sichere Verbindung zur Cortex aufbauen</p>
          </div>

          <form onSubmit={handleConnect} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <input 
                  type="email" 
                  id="email"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 pt-6 pb-2 text-white outline-none peer transition-all focus:border-[#00F0FF] focus:bg-white/10"
                  placeholder=" "
                  required
                />
                <label 
                  htmlFor="email" 
                  className="absolute left-4 top-4 text-sm text-[#8892b0] transition-all peer-focus:-translate-y-2 peer-focus:text-xs peer-focus:text-[#00F0FF] peer-valid:-translate-y-2 peer-valid:text-xs"
                >
                  E-Mail
                </label>
              </div>

              <div className="relative group">
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="password"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 pt-6 pb-2 text-white outline-none peer transition-all focus:border-[#00F0FF] focus:bg-white/10"
                  placeholder=" "
                  required
                />
                <label 
                  htmlFor="password" 
                  className="absolute left-4 top-4 text-sm text-[#8892b0] transition-all peer-focus:-translate-y-2 peer-focus:text-xs peer-focus:text-[#00F0FF] peer-valid:-translate-y-2 peer-valid:text-xs"
                >
                  Passwort
                </label>
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8892b0] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex justify-center py-2">
              <button 
                type="button"
                onMouseEnter={() => setIsScanning(true)}
                onMouseLeave={() => setIsScanning(false)}
                className="flex flex-col items-center justify-center gap-2 group"
              >
                <div className={`relative p-4 rounded-full border transition-all duration-300 ${isScanning ? 'border-[#00F0FF] bg-[#00F0FF]10' : 'border-white/10 bg-white/5'}`}>
                  {isScanning && (
                    <motion.div 
                      className="absolute inset-0 rounded-full border-t-2 border-[#00F0FF]"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                  )}
                  <Fingerprint size={32} className={`transition-colors ${isScanning ? 'text-[#00F0FF]' : 'text-[#8892b0]'}`} />
                </div>
                <span className={`text-xs uppercase tracking-widest font-bold transition-colors ${isScanning ? 'text-[#00F0FF]' : 'text-[#8892b0]'}`}>
                  Neural Auth
                </span>
              </button>
            </div>

            <button 
              type="submit"
              disabled={isConnecting}
              className="w-full relative px-8 py-4 rounded-xl font-bold overflow-hidden group transition-transform hover:-translate-y-1"
              style={{ backgroundColor: THEME.primary, color: THEME.bg }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
              <div className="flex items-center justify-center gap-2">
                {isConnecting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" /> Verbinde Cortex...
                  </>
                ) : (
                  <>Verbinden <ArrowRight size={20} /></>
                )}
              </div>
            </button>
          </form>

          <div className="flex items-center gap-4 py-2">
            <div className="h-px bg-white/10 flex-1" />
            <span className="text-sm font-medium text-[#8892b0]">oder</span>
            <div className="h-px bg-white/10 flex-1" />
          </div>

          <button className="w-full px-8 py-4 rounded-xl font-bold transition-all hover:-translate-y-1 border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-[#FFB300]50">
            Mit SynID verbinden
          </button>

          <div className="text-center pt-4">
            <a href="#" className="text-sm text-[#00F0FF] hover:text-white transition-colors">
              Noch kein Konto? Synapse öffnen →
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 text-xs font-['JetBrains_Mono'] text-[#8892b0] opacity-50">
          xSyna OS v2.1.0
        </div>
      </motion.div>
    </div>
  );
}
