import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function Scene5() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1000),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 4000), // fade out
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center bg-[#030508]"
      initial={{ opacity: 0 }}
      animate={phase < 3 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      exit={{ opacity: 0 }}
      transition={{ duration: phase < 3 ? 1 : 1.5 }}
    >
      <div className="relative z-10 flex flex-col items-center">
        {/* Converging particles to Logo */}
        <motion.div 
          className="text-5xl font-bold tracking-widest text-white mb-4 flex items-center gap-3"
          initial={{ filter: 'blur(20px)', opacity: 0, scale: 2 }}
          animate={{ filter: 'blur(0px)', opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <div className="w-8 h-8 bg-primary shadow-[0_0_20px_#00F0FF] rounded-sm rotate-45" />
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

      <motion.div 
        className="absolute bottom-12 font-mono text-primary/80 tracking-widest text-sm"
        initial={{ opacity: 0 }}
        animate={phase >= 2 ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1 }}
      >
        neuromorphic.live
      </motion.div>
    </motion.div>
  );
}
