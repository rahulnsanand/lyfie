import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

// 1. Define an interface for the props
interface AnimatedPageProps {
  children: ReactNode;
}

// 2. Type the variants object to get autocomplete for Framer properties
const animations: Variants = {
  initial: { opacity: 0, y: 5 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -5 },
};

export default function AnimatedPage({ children }: AnimatedPageProps) {
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