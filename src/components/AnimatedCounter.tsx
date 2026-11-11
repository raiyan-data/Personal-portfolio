import { useEffect, useState, useRef } from 'react';
import { useInView, useReducedMotion } from 'motion/react';

interface AnimatedCounterProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

export default function AnimatedCounter({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 1.2,
  className = '',
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayValue(value);
      return;
    }

    if (!isInView) return;

    let startTimestamp: number | null = null;
    const startVal = 0;
    const endVal = value;
    const durationMs = duration * 1000;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / durationMs, 1);
      // easeOut cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const current = startVal + (endVal - startVal) * easedProgress;

      setDisplayValue(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(endVal);
      }
    };

    const animId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animId);
  }, [isInView, value, duration, shouldReduceMotion]);

  const formattedNumber = displayValue.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref} className={`font-mono-plex tabular-nums ${className}`}>
      {prefix}
      {formattedNumber}
      {suffix}
    </span>
  );
}
