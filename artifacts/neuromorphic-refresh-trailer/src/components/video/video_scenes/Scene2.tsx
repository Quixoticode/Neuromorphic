import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Activity, Cpu, Network } from 'lucide-react';

export function Scene2() {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(g => !g);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  const cardStyle = "bg-[#0a0f1a]/67 border border-white/5 backdrop-blur-[24px] rounded-2xl p-6 absolute";
  const glowStyle = { boxShadow: 'inset 0 0 30px rgba(0, 240, 255, 0.13)' };

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
        className={`${cardStyle} ${glitch ? 'glitch-anim' : ''}`}
        style={{ ...glowStyle, x: '-25vw', y: '-15vh', rotate: -8 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0, 0.8, 0.2, 0.9], x: ['-25vw', '-24vw', '-26vw', '-25vw'] }}
        transition={{ duration: 3, times: [0, 0.2, 0.5, 1], repeat: Infinity, repeatType: 'reverse' }}
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-xl bg-[#00F0FF]/15">
            <Cpu className="text-[#00F0FF] w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">SynAI</h3>
            <p className="text-sm text-[#8892b0]">Neural Core</p>
          </div>
        </div>
        <div className="text-3xl font-bold text-white">2.4B params</div>
      </motion.div>

      <motion.div 
        className={`${cardStyle} ${glitch ? 'glitch-anim' : ''}`}
        style={{ ...glowStyle, x: '10vw', y: '10vh', rotate: 5 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0.9, 0.1, 0.8, 0], x: ['10vw', '11vw', '9vw', '10vw'] }}
        transition={{ duration: 3.5, times: [0, 0.3, 0.7, 1], delay: 0.5, repeat: Infinity, repeatType: 'reverse' }}
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-xl bg-[#00F0FF]/15">
            <Activity className="text-[#00F0FF] w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">xSyn</h3>
            <p className="text-sm text-[#8892b0]">Adaptive UI</p>
          </div>
        </div>
        <div className="text-3xl font-bold text-white">847ms</div>
      </motion.div>

      <motion.div 
        className={`${cardStyle} ${glitch ? 'glitch-anim' : ''}`}
        style={{ ...glowStyle, x: '-5vw', y: '25vh', rotate: -3 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0.2, 0.9, 0.3, 0.8], x: ['-5vw', '-4vw', '-6vw', '-5vw'] }}
        transition={{ duration: 2.5, times: [0, 0.4, 0.6, 1], delay: 1, repeat: Infinity, repeatType: 'reverse' }}
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-xl bg-[#00F0FF]/15">
            <Network className="text-[#00F0FF] w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">SynBridge</h3>
            <p className="text-sm text-[#8892b0]">Protocol v3</p>
          </div>
        </div>
        <div className="text-3xl font-bold text-white">99.9%</div>
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
