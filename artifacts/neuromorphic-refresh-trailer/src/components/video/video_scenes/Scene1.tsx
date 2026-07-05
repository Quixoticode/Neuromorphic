import { motion } from 'framer-motion';

export function Scene1() {
  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 1 }}
    >
      {/* Central dot */}
      <motion.div
        className="absolute w-4 h-4 bg-primary rounded-full shadow-[0_0_30px_#00F0FF]"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0.8] }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
      
      {/* Axon lines */}
      <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
        <motion.path
          d="M 50vw 50vh Q 40vw 30vh 20vw 20vh T 5vw 40vh"
          fill="transparent"
          stroke="#00F0FF"
          strokeWidth="2"
          strokeLinecap="round"
          className="opacity-60"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
        />
        <motion.path
          d="M 50vw 50vh Q 60vw 70vh 80vw 80vh T 95vw 60vh"
          fill="transparent"
          stroke="#00F0FF"
          strokeWidth="2"
          strokeLinecap="round"
          className="opacity-60"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.2, delay: 0.8, ease: "easeInOut" }}
        />
        <motion.path
          d="M 50vw 50vh Q 70vw 30vh 85vw 15vh"
          fill="transparent"
          stroke="#FFB300"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="opacity-40"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.8, delay: 1.2, ease: "easeInOut" }}
        />
      </svg>
      
      {/* Pulse rings */}
      <motion.div 
        className="absolute w-32 h-32 border border-primary/40 rounded-full"
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 4, opacity: 0 }}
        transition={{ duration: 3, delay: 1.5, repeat: Infinity }}
      />
    </motion.div>
  );
}
