import { AnimatePresence, motion, easeOut } from "framer-motion";
import { useLocation } from "react-router-dom";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

const pageTransition = {
  duration: 0.16,
  ease: easeOut,
};

export function AnimatedRoutes({ children }: Props) {
  const location = useLocation();

  return (
    // Prevents the animation from running on the very first mount (page refresh).
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname.split('/')[1]} // Only animate on top-level route changes (e.g., /settings, /dashboard).
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
        style={{ height: "100%" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}