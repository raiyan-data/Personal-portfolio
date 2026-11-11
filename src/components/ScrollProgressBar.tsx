import { motion, useScroll, useReducedMotion } from 'motion/react';

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) return null;

  return (
    <div
      className="scroll-progress-bar absolute bottom-0 left-0 right-0 h-[2px] pointer-events-none z-20 overflow-hidden"
      aria-hidden="true"
    >
      <motion.div
        style={{ scaleX: scrollYProgress, transformOrigin: '0%' }}
        className="h-full bg-[var(--accent)]"
      />
    </div>
  );
}
