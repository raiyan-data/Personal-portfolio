import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { SWISS_EASE } from '../config.ts';

interface LoadingScreenProps {
  onHeroStart?: () => void;
  onFinish?: () => void;
}

export default function LoadingScreen({ onHeroStart, onFinish }: LoadingScreenProps) {
  const [show, setShow] = useState(() => {
    if (typeof window === 'undefined') return false;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return false;
    // Skip loader on anchor links
    if (window.location.hash) return false;
    const hasVisited = sessionStorage.getItem('portfolio_visited');
    return !hasVisited;
  });

  const [counter, setCounter] = useState(0);
  const [isSliding, setIsSliding] = useState(false);

  useEffect(() => {
    if (!show) {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      window.scrollTo(0, 0);
      onHeroStart?.();
      onFinish?.();
      return;
    }

    // Lock scroll during loader
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);

    const keepScrollAtZero = () => {
      if (window.scrollY !== 0 || window.scrollX !== 0) {
        window.scrollTo(0, 0);
      }
    };
    window.addEventListener('scroll', keepScrollAtZero, { passive: true });

    let startTimestamp: number | null = null;
    const duration = 1200; // 0 to 1.2s counter

    let animId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(progress * 100);
      setCounter(current);

      if (progress < 1) {
        animId = requestAnimationFrame(step);
      } else {
        setCounter(100);
        setIsSliding(true);

        // Layer slides up in 600ms (1.2s to 1.8s). Curtain has fully cleared at 1.8s.
        setTimeout(() => {
          sessionStorage.setItem('portfolio_visited', 'true');
          // Release scroll lock when curtain finishes sliding away
          document.documentElement.style.overflow = '';
          document.body.style.overflow = '';
          window.scrollTo(0, 0);
          setShow(false);
          onHeroStart?.();
          onFinish?.();
        }, 600);
      }
    };

    animId = requestAnimationFrame(step);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('scroll', keepScrollAtZero);
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      window.scrollTo(0, 0);
    };
  }, [show, onHeroStart, onFinish]);

  if (!show) return null;

  const displayCount = String(counter).padStart(3, '0');

  return (
    <motion.div
      initial={{ y: '0%' }}
      animate={isSliding ? { y: '-100%' } : { y: '0%' }}
      transition={{ duration: 0.6, ease: SWISS_EASE }}
      className="fixed inset-0 z-50 bg-[var(--bg)] pointer-events-none select-none flex flex-col justify-between p-[var(--s-6)] md:p-[var(--s-8)] overflow-hidden"
      aria-hidden="true"
    >
      {/* Wordmark "Raiyan Islam" top-left */}
      <div className="text-[17px] font-semibold tracking-tight text-[var(--ink)]">
        Raiyan Islam
      </div>

      {/* Plex Mono counter 000 to 100 bottom-left (48px, tabular-nums) */}
      <div className="flex flex-col gap-[var(--s-2)]">
        <div className="font-mono-plex text-[48px] font-semibold text-[var(--ink)] tabular-nums leading-none">
          {displayCount}
        </div>
      </div>

      {/* 2px --accent line along the bottom that fills left to right with the counter */}
      <div
        className="absolute bottom-0 left-0 h-[2px] bg-[var(--accent)] transition-all ease-linear"
        style={{
          width: `${counter}%`,
        }}
      />
    </motion.div>
  );
}
