import { motion } from 'motion/react';
import { SWISS_EASE } from '../config.ts';

interface HexagonPortraitProps {
  imageSrc?: string;
  altText?: string;
  className?: string;
  heroStarted?: boolean;
  shouldReduceMotion?: boolean;
  speedMultiplier?: number;
  delayOffset?: number;
}

export default function HexagonPortrait({
  imageSrc = '/images/portrait.jpg',
  altText = 'Raiyan Islam Portfolio',
  className = '',
  heroStarted = true,
  shouldReduceMotion = false,
  speedMultiplier = 1,
  delayOffset = 0,
}: HexagonPortraitProps) {
  const webpSrc = imageSrc.endsWith('.jpg') ? imageSrc.replace(/\.jpg$/, '.webp') : undefined;

  const initialClip = 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%)';
  const fullClip = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';

  return (
    <div className={`relative max-[399px]:w-[280px] w-[320px] lg:w-[400px] aspect-[400/440] shrink-0 select-none ${className}`}>
      {/* 6px accent outline hexagon behind it draws in with an SVG stroke-dashoffset (800ms) */}
      <svg
        viewBox="-6 -6 412 452"
        className="absolute -inset-[6px] w-[calc(100%+12px)] h-[calc(100%+12px)] pointer-events-none z-0 overflow-visible"
        aria-hidden="true"
      >
        <motion.path
          d="M 200 0 L 400 110 L 400 330 L 200 440 L 0 330 L 0 110 Z"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="6"
          strokeLinejoin="miter"
          strokeMiterlimit="4"
          initial={{ pathLength: shouldReduceMotion ? 1 : 0 }}
          animate={heroStarted ? { pathLength: 1 } : { pathLength: shouldReduceMotion ? 1 : 0 }}
          transition={{
            duration: 0.8 * speedMultiplier,
            ease: SWISS_EASE,
            delay: delayOffset,
          }}
        />
      </svg>

      {/* Inner Photo Hexagon: clip-path animates from center point to full hexagon over 900ms */}
      <motion.div
        className="relative w-full h-full bg-[var(--surface)] overflow-hidden z-10"
        initial={{ clipPath: shouldReduceMotion ? fullClip : initialClip }}
        animate={heroStarted ? { clipPath: fullClip } : { clipPath: shouldReduceMotion ? fullClip : initialClip }}
        transition={{
          duration: 0.9 * speedMultiplier,
          ease: SWISS_EASE,
          delay: delayOffset,
        }}
        aria-label="Portrait container"
      >
        <picture className="w-full h-full block">
          {webpSrc && <source type="image/webp" srcSet={webpSrc} />}
          {/* Photo inside scales from 1.15 to 1 over 1200ms */}
          <motion.img
            src={imageSrc}
            alt={altText}
            width={1254}
            height={1254}
            loading="eager"
            decoding="async"
            style={{ objectPosition: '55% 20%' }}
            className="w-full h-full object-cover block"
            initial={{ scale: shouldReduceMotion ? 1 : 1.15 }}
            animate={heroStarted ? { scale: 1 } : { scale: shouldReduceMotion ? 1 : 1.15 }}
            transition={{
              duration: 1.2 * speedMultiplier,
              ease: SWISS_EASE,
              delay: delayOffset,
            }}
          />
        </picture>
      </motion.div>
    </div>
  );
}
