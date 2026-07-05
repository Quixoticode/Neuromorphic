import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function Scene3() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2500)
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const title = "NEUROMORPHIC".split('');

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.8 }}
    >
      <div className="relative z-10 text-center">
        <h1 className="text-[6vw] font-black tracking-[0.2em] text-white leading-none font-display">
          {title.map((char, i) => (
            <motion.span 
              key={i} 
              className="inline-block"
              initial={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
              animate={phase >= 1 ? { opacity: 1, x: 0, filter: 'blur(0px)' } : {}}
              transition={{ duration: 0.4, delay: phase >= 1 ? i * 0.08 : 0, type: 'spring', stiffness: 200 }}
              style={{ textShadow: '0 0 20px rgba(0, 240, 255, 0.5)' }}
            >
              {char}
            </motion.span>
          ))}
        </h1>
        
        <div className="overflow-hidden mt-2">
          <motion.h2 
            className="text-[4vw] font-bold tracking-[0.4em] text-primary"
            initial={{ y: "100%", opacity: 0 }}
            animate={phase >= 2 ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }}
            transition={{ duration: 0.8, type: 'spring', damping: 20 }}
          >
            REFRESH
          </motion.h2>
        </div>
      </div>

      <motion.div 
        className="absolute bottom-10 right-10 flex items-center gap-2 opacity-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 3 }}
      >
        <div className="w-4 h-4 bg-secondary rounded-sm" />
        <span className="font-mono text-sm tracking-widest text-secondary">xSyna</span>
      </motion.div>
    </motion.div>
  );
}
