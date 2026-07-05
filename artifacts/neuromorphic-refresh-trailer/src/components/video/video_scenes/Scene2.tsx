import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function Scene2() {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(g => !g);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(20px)' }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 scanline z-50 pointer-events-none opacity-30" />
      
      {/* Glitching UI cards */}
      <motion.div 
        className={`absolute w-96 h-64 bg-white/5 border border-white/20 backdrop-blur-xl rounded-2xl flex flex-col p-6 ${glitch ? 'glitch-anim' : ''}`}
        style={{ x: '-15vw', y: '-5vh', rotate: -5 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0, 0.8, 0.2, 0.9], x: ['-15vw', '-14vw', '-16vw', '-15vw'] }}
        transition={{ duration: 3, times: [0, 0.2, 0.5, 1] }}
      >
        <div className="w-1/2 h-4 bg-white/20 rounded mb-4" />
        <div className="w-full h-2 bg-white/10 rounded mb-2" />
        <div className="w-4/5 h-2 bg-white/10 rounded mb-8" />
        <div className="mt-auto w-full h-12 bg-primary/20 border border-primary/50 rounded-lg flex items-center justify-center">
          <div className="w-1/3 h-2 bg-primary/80 rounded" />
        </div>
      </motion.div>

      {/* LEAKED text */}
      <motion.h1 
        className="absolute z-40 text-8xl font-black text-red-500 tracking-widest mix-blend-screen"
        initial={{ opacity: 0, scale: 2 }}
        animate={{ opacity: [0, 1, 0, 1, 0, 0.8], scale: 1 }}
        transition={{ duration: 4, times: [0, 0.1, 0.2, 0.3, 0.5, 1] }}
      >
        LEAKED
      </motion.h1>

    </motion.div>
  );
}
