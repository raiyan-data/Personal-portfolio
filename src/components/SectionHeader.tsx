import { useRef, useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { SWISS_EASE } from '../config.ts';
import Stack from './Stack.tsx';

interface SectionHeaderProps {
  label: string;
  title: string;
  intro?: string;
  number?: string;
  className?: string;
}

export default function SectionHeader({
  label,
  title,
  intro,
  number,
  className = '',
}: SectionHeaderProps) {
  const shouldReduceMotion = useReducedMotion();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (shouldReduceMotion) {
      setInView(true);
      return;
    }
    const timer = setTimeout(() => setInView(true), 500);
    const el = headingRef.current;
    if (!el || !('IntersectionObserver' in window)) {
      setInView(true);
      return () => clearTimeout(timer);
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [shouldReduceMotion]);

  const displayLabel = number ? `${number} / ${label}` : label;

  return (
    <header className={`mb-[var(--s-8)] md:mb-[var(--s-9)] ${className}`.trim()}>
      <Stack gap={4}>
        <span className="label-mono">{displayLabel}</span>
        <div className="overflow-hidden">
          <motion.h2
            ref={headingRef}
            initial={false}
            animate={{ y: inView ? '0%' : '100%' }}
            transition={{ duration: 0.8, ease: SWISS_EASE }}
            className="editorial-h2 text-[var(--ink)]"
          >
            {title}
          </motion.h2>
        </div>
        {intro && <p className="editorial-intro">{intro}</p>}
      </Stack>
    </header>
  );
}
