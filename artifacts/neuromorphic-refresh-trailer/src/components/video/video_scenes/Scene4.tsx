import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, filter: 'blur(20px)' }}
      transition={{ duration: 1 }}
    >
      {/* Heartbeat pulse */}
      <motion.div 
        className="absolute w-full h-full bg-secondary/5 rounded-full blur-[100px] pointer-events-none"
        animate={{ scale: [1, 1.2, 1, 1.5, 1], opacity: [0.1, 0.3, 0.1, 0.4, 0.1] }}
        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
      />

      <div className="relative z-10 text-center flex flex-col items-center gap-6">
        <motion.h2 
          className="text-7xl font-light tracking-[0.3em] text-secondary font-display"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          AUGUST 2026
        </motion.h2>
        
        <motion.p 
          className="text-lg font-mono tracking-[0.5em] text-primary"
          initial={{ opacity: 0, letterSpacing: "1em" }}
          animate={phase >= 1 ? { opacity: 1, letterSpacing: "0.5em" } : { opacity: 0 }}
          transition={{ duration: 1.5, ease: "circOut" }}
        >
          LIVE SHOWCASE · DESIGN SYSTEM V2
        </motion.p>
      </div>

    </motion.div>
  );
}
