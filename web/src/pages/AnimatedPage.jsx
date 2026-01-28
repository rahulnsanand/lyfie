import { motion } from 'framer-motion';

const animations = {
  initial: { opacity: 0, y: 5 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -5 },
};

export default function AnimatedPage({ children }) {
  return (
    <motion.div
      variants={animations}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.1, ease: "circOut" }}
      style={{ width: '100%' }} 
    >
      {children}
    </motion.div>
  );
}