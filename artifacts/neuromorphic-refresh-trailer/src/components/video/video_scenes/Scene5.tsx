import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function Scene5() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),  // Ecosystem text
      setTimeout(() => setPhase(2), 1500), // Neural net
      setTimeout(() => setPhase(3), 2000), // Nodes layer 2
      setTimeout(() => setPhase(4), 2500), // Nodes layer 3
      setTimeout(() => setPhase(5), 3500), // 2027 ref
      setTimeout(() => setPhase(6), 4500), // fade out
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center bg-[#030508]"
      initial={{ opacity: 0 }}
      animate={phase < 6 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      exit={{ opacity: 0 }}
      transition={{ duration: phase < 6 ? 1 : 1.5 }}
    >
      <div className="relative z-10 flex flex-col items-center -mt-20">
        {/* Converging particles to Logo */}
        <motion.div 
          className="text-5xl font-bold tracking-widest text-white mb-4 flex flex-col items-center gap-6"
          initial={{ filter: 'blur(20px)', opacity: 0, scale: 2 }}
          animate={{ filter: 'blur(0px)', opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="logoGradS5" gradientUnits="userSpaceOnUse" x1="20" y1="20" x2="80" y2="80">
                <stop offset="0%" stopColor="#9ffcff"/><stop offset="50%" stopColor="#b6f5b4"/><stop offset="100%" stopColor="#ffdf66"/>
              </linearGradient>
            </defs>
            <motion.path
              d="M20,20.6 C32.7,20.6 41.7,28.3 50,50 M80,20.6 C67.3,20.6 58.3,28.3 50,50 M20,79.4 C32.7,79.4 41.7,71.7 50,50 M80,79.4 C67.3,79.4 58.3,71.7 50,50"
              stroke="url(#logoGradS5)"
              strokeWidth="7.8"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            <motion.g
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 1, type: "spring" }}
              style={{ transformOrigin: "50px 50px" }}
            >
              <circle cx="50" cy="50" r="11.9" fill="url(#logoGradS5)" />
              <circle cx="50" cy="50" r="7.8" fill="#0d1117" />
              <circle cx="50" cy="50" r="4" fill="#fff" />
            </motion.g>
          </svg>
          <span>xSyna</span>
        </motion.div>

        <motion.p 
          className="text-xl font-light tracking-[0.4em] text-white/60 uppercase"
          initial={{ opacity: 0, y: 10 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0 }}
          transition={{ duration: 1 }}
        >
          Ecosystem
        </motion.p>
      </div>

      {/* Intelligence Model Diagram */}
      <motion.div
        className="absolute bottom-32 flex flex-col items-center"
        initial={{ scale: 0, y: 100, opacity: 0 }}
        animate={phase >= 2 ? { scale: 1, y: 0, opacity: 1 } : { scale: 0, y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <div className="font-mono text-[10px] text-[#00F0FF] mb-4 tracking-widest uppercase">Intelligence Model v3</div>
        <svg width="200" height="120" viewBox="0 0 200 120" fill="none">
          {/* Edges */}
          <path d="M40,20 L100,60 L160,20 M40,60 L100,60 L160,60 M40,100 L100,60 L160,100" stroke="#ffffff" strokeOpacity="0.1" strokeWidth="2" />
          <motion.path d="M40,20 L100,60 M40,60 L100,60 M40,100 L100,60" stroke="#00F0FF" strokeOpacity="0.4" strokeWidth="2" initial={{ pathLength: 0 }} animate={phase >= 3 ? { pathLength: 1 } : { pathLength: 0 }} transition={{ duration: 0.5 }} />
          <motion.path d="M100,60 L160,20 M100,60 L160,60 M100,60 L160,100" stroke="#7B4FFF" strokeOpacity="0.4" strokeWidth="2" initial={{ pathLength: 0 }} animate={phase >= 4 ? { pathLength: 1 } : { pathLength: 0 }} transition={{ duration: 0.5 }} />
          
          {/* Nodes */}
          {/* Layer 1 */}
          <circle cx="40" cy="20" r="4" fill="#00F0FF" fillOpacity={phase >= 2 ? 0.6 : 0.1} />
          <circle cx="40" cy="60" r="4" fill="#00F0FF" fillOpacity={phase >= 2 ? 0.6 : 0.1} />
          <circle cx="40" cy="100" r="4" fill="#00F0FF" fillOpacity={phase >= 2 ? 0.6 : 0.1} />
          {/* Layer 2 */}
          <circle cx="100" cy="60" r="6" fill="#7B4FFF" fillOpacity={phase >= 3 ? 0.8 : 0.1} />
          {/* Layer 3 */}
          <circle cx="160" cy="20" r="4" fill="#FFB300" fillOpacity={phase >= 4 ? 1 : 0.1} />
          <circle cx="160" cy="60" r="4" fill="#FFB300" fillOpacity={phase >= 4 ? 1 : 0.1} />
          <circle cx="160" cy="100" r="4" fill="#FFB300" fillOpacity={phase >= 4 ? 1 : 0.1} />
        </svg>
      </motion.div>

      <motion.div 
        className="absolute bottom-16 flex flex-col items-center gap-2 font-mono text-primary/80 tracking-widest text-sm"
        initial={{ opacity: 0 }}
        animate={phase >= 2 ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <span>neuromorphic.live</span>
        <motion.span 
          className="text-[10px] text-[#8892b0]"
          initial={{ opacity: 0 }}
          animate={phase >= 5 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 2 }}
        >
          → 2027: Autonomous Evolution
        </motion.span>
      </motion.div>
    </motion.div>
  );
}
