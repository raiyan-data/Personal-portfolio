import { useState, useEffect, useRef } from 'react';
import { ArrowDown, ArrowUpRight, Plus, Linkedin, Mail, Globe } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import HexagonPortrait from './HexagonPortrait.tsx';
import AnimatedCounter from './AnimatedCounter.tsx';
import Stack from './Stack.tsx';
import Card from './Card.tsx';
import { SWISS_EASE } from '../config.ts';

interface HeroProps {
  onOpenCvModal?: () => void;
  heroStarted?: boolean;
  isFirstLoad?: boolean;
}

const SCRAMBLE_CHARS = '#%&@?/0123456789';
const LINE_1_TEXT = 'Messy data in.';
const LINE_1_CHARS = LINE_1_TEXT.split('');

// Spaces and punctuation are never scrambled
const isNonScramblable = (char: string) => char === ' ' || char === '.';

export default function Hero({
  onOpenCvModal: _onOpenCvModal,
  heroStarted = true,
  isFirstLoad = false,
}: HeroProps) {
  const shouldReduceMotion = useReducedMotion();

  // Repeat visits: play scramble at 50% speed (half duration)
  const timeScale = shouldReduceMotion ? 0 : isFirstLoad ? 1 : 0.5;

  // Track which characters are currently displayed for Line 1
  const [displayedChars, setDisplayedChars] = useState<string[]>(() => {
    // Initial display before sequence starts: scrambled letters, untouched spaces/punctuation
    return LINE_1_CHARS.map((char) =>
      isNonScramblable(char)
        ? char
        : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
    );
  });

  // Animation phase flags
  const [line2Visible, setLine2Visible] = useState(false);
  const [restStarted, setRestStarted] = useState(false);

  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayedChars(LINE_1_CHARS);
      setLine2Visible(true);
      setRestStarted(true);
      return;
    }

    if (!heroStarted) return;

    // Timeline parameters:
    // 1. Pause for 300ms after curtain clears so the eye lands on it first
    // 2. Show scrambled characters for 600ms before any character begins to resolve
    // 3. Stagger resolution left to right with 110ms between characters
    // 4. Each character flickers at 80ms per swap and locks after ~400ms
    // 5. Line 1 finishes around 2.5s after curtain clears
    const pauseBeforeScramble = 300 * timeScale;
    const scrambleBeforeResolve = 600 * timeScale;
    const charStagger = 110 * timeScale;
    const lockDuration = 400 * timeScale;
    const swapInterval = 80 * timeScale;

    // Map scramblable characters to ranks [0..10]
    let scramblableCount = 0;
    const charRanks: number[] = [];
    LINE_1_CHARS.forEach((char) => {
      if (isNonScramblable(char)) {
        charRanks.push(-1);
      } else {
        charRanks.push(scramblableCount++);
      }
    });

    // Start resolution base time
    const resolveStartTime = pauseBeforeScramble + scrambleBeforeResolve;
    const lastRank = Math.max(0, scramblableCount - 1);
    const line1FinishTime = resolveStartTime + lastRank * charStagger + lockDuration;

    // Line 2 starts 400ms after Line 1 finishes, slides up over 900ms
    const line2StartTime = line1FinishTime + 400 * timeScale;
    const line2Duration = 900 * timeScale;
    const line2FinishTime = line2StartTime + line2Duration;

    // Hold final headline still for at least 500ms before paragraph and buttons slide in
    const restStartTime = line2FinishTime + 500 * timeScale;

    let startTimestamp: number | null = null;
    let line2Triggered = false;
    let restTriggered = false;

    const tick = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;

      // Update Line 1 characters
      if (elapsed >= line1FinishTime) {
        setDisplayedChars(LINE_1_CHARS);
      } else {
        const swapCycle = Math.floor(elapsed / Math.max(16, swapInterval));
        const updated = LINE_1_CHARS.map((targetChar, idx) => {
          if (isNonScramblable(targetChar)) {
            return targetChar;
          }

          const rank = charRanks[idx];
          const charResolveStart = resolveStartTime + rank * charStagger;
          const charLockTime = charResolveStart + lockDuration;

          // Before resolve start or during resolution before locking: flicker
          if (elapsed < charLockTime) {
            // Pseudo-random character based on index and swapCycle
            const charIndex = (swapCycle * 7 + idx * 13) % SCRAMBLE_CHARS.length;
            return SCRAMBLE_CHARS[charIndex];
          }

          // Locked to the real letter
          return targetChar;
        });

        setDisplayedChars(updated);
      }

      // Check Line 2 trigger (400ms after Line 1 finishes)
      if (elapsed >= line2StartTime && !line2Triggered) {
        line2Triggered = true;
        setLine2Visible(true);
      }

      // Check Rest trigger (500ms hold after Line 2 settles)
      if (elapsed >= restStartTime && !restTriggered) {
        restTriggered = true;
        setRestStarted(true);
      }

      // Continue animation until rest of the hero has started
      if (elapsed < restStartTime + 100) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplayedChars(LINE_1_CHARS);
        setLine2Visible(true);
        setRestStarted(true);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [heroStarted, shouldReduceMotion, timeScale]);

  const chips = [
    'C++',
    'Excel',
    'Data cleaning',
    'Data modeling',
    'Object-oriented design',
    'Hardware diagnostics',
  ];

  const scrollToHowIWork = () => {
    const el = document.getElementById('how-i-work');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="top" className="section-padding border-b border-[var(--rule)] relative overflow-hidden bg-[var(--bg)]">
      <div className="content-container relative z-10">
        {/* Main Hero Layout: single column on phone (<768px), two columns on tablet (768-1023px) and desktop (1024px+) */}
        <div className="min-h-0 md:min-h-[640px] grid grid-cols-12 gap-[var(--s-6)] md:gap-[var(--s-6)] lg:gap-[var(--s-7)] items-center">
          {/* LEFT COLUMN: 12 cols on phone, 7 cols on tablet/desktop */}
          <div className="col-span-12 md:col-span-7">
            <Stack gap={6} className="items-start">
              {/* Eyebrow: 48px 2px --ink line + Plex Mono 12px uppercase */}
              <div className="flex items-center gap-[var(--s-3)]">
                <motion.span
                  className="w-[var(--s-8)] h-[2px] bg-[var(--ink)] inline-block shrink-0 origin-left"
                  initial={{ scaleX: shouldReduceMotion ? 1 : 0 }}
                  animate={restStarted ? { scaleX: 1 } : { scaleX: shouldReduceMotion ? 1 : 0 }}
                  transition={{
                    duration: 0.6 * (isFirstLoad ? 1 : 0.6),
                    ease: SWISS_EASE,
                  }}
                  aria-hidden="true"
                />
                <motion.span
                  className="label-mono text-[var(--ink)]"
                  initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 8 }}
                  animate={restStarted ? { opacity: 1, y: 0 } : { opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 8 }}
                  transition={{
                    duration: 0.5 * (isFirstLoad ? 1 : 0.6),
                    ease: SWISS_EASE,
                  }}
                >
                  Computer Science / Maryland
                </motion.span>
              </div>

              {/* Headline: Line 1 slow scramble with fixed char width; Line 2 slides up 400ms after Line 1 finishes */}
              <h1
                className="editorial-h1 text-[var(--ink)] whitespace-normal lg:whitespace-nowrap"
                aria-label="Messy data in. Clear answers out."
              >
                {/* Line 1: Real text in screen-reader DOM from the start */}
                <div className="overflow-hidden block">
                  <span className="sr-only">Messy data in.</span>
                  <span aria-hidden="true" className="block select-none">
                    {LINE_1_CHARS.map((targetChar, idx) => {
                      const isFixed = isNonScramblable(targetChar);
                      const charToRender = shouldReduceMotion
                        ? targetChar
                        : displayedChars[idx] || targetChar;

                      if (isFixed) {
                        return (
                          <span key={idx} className="inline-block">
                            {targetChar === ' ' ? '\u00A0' : targetChar}
                          </span>
                        );
                      }

                      return (
                        <span key={idx} className="inline-block relative">
                          {/* Ghost character preserves the exact width, height, and kerning of the real letter */}
                          <span className="invisible select-none" aria-hidden="true">
                            {targetChar}
                          </span>
                          {/* Displayed glyph centered in the exact box with zero line jump or reflow */}
                          <span
                            className="absolute inset-0 flex items-center justify-center select-none"
                            aria-hidden="true"
                          >
                            {charToRender}
                          </span>
                        </span>
                      );
                    })}
                  </span>
                </div>

                {/* Line 2: slides up from mask over 900ms after Line 1 finishes */}
                <div className="overflow-hidden block">
                  <span className="sr-only">Clear answers out.</span>
                  <motion.span
                    aria-hidden="true"
                    className="block"
                    initial={{ y: shouldReduceMotion ? 0 : '100%' }}
                    animate={line2Visible || shouldReduceMotion ? { y: 0 } : { y: '100%' }}
                    transition={{
                      duration: 0.9 * (isFirstLoad ? 1 : 0.6),
                      ease: SWISS_EASE,
                    }}
                  >
                    Clear answers out.
                  </motion.span>
                </div>
              </h1>

              {/* Paragraph: slides up 16px after Line 2 settles */}
              <motion.p
                initial={{ y: shouldReduceMotion ? 0 : 16, opacity: shouldReduceMotion ? 1 : 0 }}
                animate={restStarted || shouldReduceMotion ? { y: 0, opacity: 1 } : { y: 16, opacity: 0 }}
                transition={{
                  duration: 0.5 * (isFirstLoad ? 1 : 0.6),
                  ease: SWISS_EASE,
                }}
                className="text-[16px] lg:text-[18px] leading-[1.6] text-[var(--ink)] font-normal max-w-[480px]"
              >
                I&rsquo;m a computer science student at Montgomery College, heading to the University of Maryland. I have sorted constituent data for a U.S. Senate office and build C++ games on the side. Next stop: AI engineering.
              </motion.p>

              {/* Buttons: slide up 16px with 60ms stagger after Line 2 settles */}
              <motion.div
                initial={{ y: shouldReduceMotion ? 0 : 16, opacity: shouldReduceMotion ? 1 : 0 }}
                animate={restStarted || shouldReduceMotion ? { y: 0, opacity: 1 } : { y: 16, opacity: 0 }}
                transition={{
                  duration: 0.5 * (isFirstLoad ? 1 : 0.6),
                  ease: SWISS_EASE,
                  delay: 0.06 * (isFirstLoad ? 1 : 0.6),
                }}
                className="w-full md:w-auto flex flex-col md:flex-row items-center gap-[var(--s-3)]"
              >
                <a
                  href="#contact"
                  className="btn-primary w-full md:w-auto h-[48px] md:h-auto min-h-[44px]"
                >
                  <span className="relative z-10">Let&rsquo;s talk</span>
                </a>

                <a
                  href="#work"
                  className="group/vw min-h-[44px] inline-flex items-center justify-center gap-[var(--s-2)] text-[15px] font-medium text-[var(--ink)] swiss-focus py-[var(--s-2)] w-full md:w-auto"
                >
                  <span>View work</span>
                  <span className="w-[var(--s-6)] h-[var(--s-6)] bg-[var(--ink)] text-[var(--bg)] flex items-center justify-center rounded-[2px] transition-transform duration-150 group-hover/vw:translate-x-1 group-hover/vw:-translate-y-1">
                    <ArrowUpRight size={14} strokeWidth={2.5} />
                  </span>
                </a>
              </motion.div>
            </Stack>
          </div>

          {/* RIGHT COLUMN: 12 cols on phone, 5 cols on tablet/desktop */}
          <div className="col-span-12 md:col-span-5 flex flex-col items-center justify-center">
            {/* Desktop Quote */}
            <div className="w-full hidden md:block text-right mb-[var(--s-4)]">
              <span className="editorial-small text-[var(--muted)] font-mono-plex">
                &ldquo;Clean data makes better decisions.&rdquo;
              </span>
            </div>

            {/* Hexagon with Rotating Badge: begins after Line 2 has settled */}
            <div className="relative flex items-center justify-center">
              <HexagonPortrait
                heroStarted={restStarted || Boolean(shouldReduceMotion)}
                shouldReduceMotion={Boolean(shouldReduceMotion)}
                speedMultiplier={isFirstLoad ? 1 : 0.6}
                delayOffset={0}
                altText="Raiyan Islam Portfolio"
              />

              {/* Rotating circle badge: scales from 0.6 to 1 and starts spinning */}
              <motion.a
                href="#roadmap"
                initial={{ scale: shouldReduceMotion ? 1 : 0.6, opacity: shouldReduceMotion ? 1 : 0 }}
                animate={restStarted || shouldReduceMotion ? { scale: 1, opacity: 1 } : { scale: 0.6, opacity: 0 }}
                transition={{
                  duration: 0.6 * (isFirstLoad ? 1 : 0.6),
                  ease: SWISS_EASE,
                  delay: 0.1 * (isFirstLoad ? 1 : 0.6),
                }}
                className="absolute left-0 sm:-left-[var(--s-4)] md:-left-[var(--s-7)] bottom-0 md:bottom-auto md:top-1/2 md:-translate-y-1/2 w-[88px] h-[88px] sm:w-[96px] sm:h-[96px] md:w-[128px] md:h-[128px] flex items-center justify-center rounded-full swiss-focus z-20 group min-w-[44px] min-h-[44px]"
                aria-label="Scroll to roadmap section"
                title="Scroll for the roadmap"
              >
                {/* Rotating SVG text ring (24s linear infinite) */}
                <svg
                  viewBox="0 0 128 128"
                  className={`w-full h-full pointer-events-none select-none ${
                    shouldReduceMotion ? '' : 'animate-[spin_24s_linear_infinite]'
                  }`}
                >
                  <defs>
                    <path
                      id="circleTextPath"
                      d="M 64,64 m -44,0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0"
                    />
                  </defs>
                  <text className="fill-[var(--ink)] font-mono-plex text-[10.5px] font-medium uppercase tracking-[0.2em]">
                    <textPath href="#circleTextPath">
                      SCROLL FOR ROADMAP * SCROLL FOR ROADMAP *
                    </textPath>
                  </text>
                </svg>

                {/* Inner circle with down-arrow icon */}
                <span className="absolute w-[50px] h-[50px] sm:w-[54px] sm:h-[54px] md:w-[72px] md:h-[72px] rounded-full bg-[var(--surface)] border border-[var(--rule)] flex items-center justify-center text-[var(--ink)] group-hover:border-[var(--ink)] transition-colors duration-150">
                  <ArrowDown size={18} strokeWidth={2} />
                </span>
              </motion.a>
            </div>

            {/* Quote moved below hexagon centered on phone */}
            <div className="w-full block md:hidden text-center mt-[var(--s-4)]">
              <span className="editorial-small text-[var(--muted)] font-mono-plex">
                &ldquo;Clean data makes better decisions.&rdquo;
              </span>
            </div>

            {/* Follow row: centered on phone, 44px touch targets */}
            <div className="w-full flex items-center justify-center md:justify-end gap-[var(--s-2)] sm:gap-[var(--s-3)] mt-[var(--s-6)]">
              <span className="editorial-small font-medium text-[var(--ink)] whitespace-nowrap text-[13px] sm:text-[14px]">
                Check and follow me
              </span>
              <span className="w-[var(--s-4)] sm:w-[var(--s-7)] md:w-[var(--s-8)] h-[1px] bg-[var(--rule)] inline-block shrink-0" aria-hidden="true" />
              <div className="flex items-center gap-[var(--s-1)] shrink-0">
                <a
                  href="https://www.linkedin.com/in/raiyan-islam-/"
                  target="_blank"
                  rel="noreferrer"
                  className="w-[44px] h-[44px] flex items-center justify-center swiss-focus group"
                  aria-label="LinkedIn profile"
                  title="LinkedIn"
                >
                  <span className="w-[var(--s-6)] h-[var(--s-6)] rounded-full bg-[var(--ink)] text-[var(--bg)] flex items-center justify-center group-hover:opacity-80 transition-opacity duration-150">
                    <Linkedin size={12} strokeWidth={2.5} />
                  </span>
                </a>

                <a
                  href="mailto:rmhislam@gmail.com"
                  className="w-[44px] h-[44px] flex items-center justify-center swiss-focus group"
                  aria-label="Send email"
                  title="Email"
                >
                  <span className="w-[var(--s-6)] h-[var(--s-6)] rounded-full bg-[var(--ink)] text-[var(--bg)] flex items-center justify-center group-hover:opacity-80 transition-opacity duration-150">
                    <Mail size={12} strokeWidth={2.5} />
                  </span>
                </a>

                <a
                  href="https://sites.google.com/view/raiyan-islam/2d-games"
                  target="_blank"
                  rel="noreferrer"
                  className="w-[44px] h-[44px] flex items-center justify-center swiss-focus group"
                  aria-label="External 2D games portfolio"
                  title="Portfolio site"
                >
                  <span className="w-[var(--s-6)] h-[var(--s-6)] rounded-full bg-[var(--ink)] text-[var(--bg)] flex items-center justify-center group-hover:opacity-80 transition-opacity duration-150">
                    <Globe size={12} strokeWidth={2.5} />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* HERO BOTTOM ROW: begins after Line 2 has settled */}
        <div className="grid grid-cols-12 gap-[var(--s-6)] md:gap-[var(--s-6)] lg:gap-[var(--s-7)] mt-[var(--s-10)] pt-[var(--s-8)] border-t border-[var(--rule)] items-start">
          {/* Stats: 3 cols */}
          <div className="col-span-12 lg:col-span-6 flex flex-col justify-between">
            <Stack gap={6}>
              <div className="grid grid-cols-3 gap-[var(--s-3)] sm:gap-[var(--s-4)] md:gap-[var(--s-6)] lg:gap-[var(--s-7)]">
                <Stack gap={2}>
                  <AnimatedCounter
                    value={4.0}
                    decimals={1}
                    duration={1.2 * (isFirstLoad ? 1 : 0.6)}
                    className="text-[28px] sm:text-[32px] lg:text-[48px] font-mono-plex font-medium leading-none text-[var(--ink)] tabular-nums"
                  />
                  <div className="editorial-small text-[var(--muted)] font-sans leading-tight">
                    GPA
                  </div>
                </Stack>

                <Stack gap={2}>
                  <AnimatedCounter
                    value={3}
                    duration={1.2 * (isFirstLoad ? 1 : 0.6)}
                    className="text-[28px] sm:text-[32px] lg:text-[48px] font-mono-plex font-medium leading-none text-[var(--ink)] tabular-nums"
                  />
                  <div className="editorial-small text-[var(--muted)] font-sans leading-tight">
                    Years leading events
                  </div>
                </Stack>

                <Stack gap={2}>
                  <AnimatedCounter
                    value={2}
                    duration={1.2 * (isFirstLoad ? 1 : 0.6)}
                    className="text-[28px] sm:text-[32px] lg:text-[48px] font-mono-plex font-medium leading-none text-[var(--ink)] tabular-nums"
                  />
                  <div className="editorial-small text-[var(--muted)] font-sans leading-tight">
                    C++ games built
                  </div>
                </Stack>
              </div>

              {/* Squiggle line: hidden on phone, visible on md+ */}
              <div className="hidden md:block pt-[var(--s-2)]">
                <svg
                  width="240"
                  height="24"
                  viewBox="0 0 240 24"
                  fill="none"
                  className="overflow-visible"
                  aria-hidden="true"
                >
                  <motion.path
                    d="M2 14 C 20 6, 35 20, 55 12 C 75 4, 90 20, 110 12 C 130 4, 145 20, 165 12 C 185 4, 200 20, 220 12 C 228 9, 235 11, 238 12"
                    stroke="var(--ink)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: shouldReduceMotion ? 1 : 0 }}
                    animate={restStarted || shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
                    transition={{ duration: 0.8 * (isFirstLoad ? 1 : 0.6), ease: SWISS_EASE }}
                  />
                </svg>
              </div>
            </Stack>
          </div>

          {/* Skills panel: Card component with internal Stack */}
          <div className="col-span-12 lg:col-span-6 relative mt-[var(--s-4)] lg:mt-0">
            {/* Plus button rotates in from -90deg */}
            <motion.button
              type="button"
              onClick={scrollToHowIWork}
              initial={{ rotate: shouldReduceMotion ? 0 : -90, opacity: shouldReduceMotion ? 1 : 0 }}
              animate={restStarted || shouldReduceMotion ? { rotate: 0, opacity: 1 } : { rotate: -90, opacity: 0 }}
              transition={{
                duration: 0.6 * (isFirstLoad ? 1 : 0.6),
                ease: SWISS_EASE,
              }}
              className="absolute top-[var(--s-4)] right-[var(--s-4)] lg:top-0 lg:left-0 lg:right-auto lg:-translate-x-1/2 lg:-translate-y-1/2 w-[44px] h-[44px] lg:w-[56px] lg:h-[56px] rounded-full bg-[var(--ink)] text-[var(--bg)] flex items-center justify-center swiss-focus group z-20 cursor-pointer transition-colors duration-150"
              aria-label="Jump to operating principles"
              title="View how I work"
            >
              <Plus
                size={20}
                strokeWidth={2.5}
                className="transition-transform duration-200 group-hover:rotate-90 lg:w-6 lg:h-6"
              />
            </motion.button>

            <Card gap={4}>
              <div className="pr-[var(--s-8)] lg:pr-0">
                <span className="label-mono">
                  Primary Competencies
                </span>
              </div>

              {/* Chips stagger in from translateY 12px (50ms each) */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-[var(--s-3)]">
                {chips.map((chip, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ y: shouldReduceMotion ? 0 : 12, opacity: shouldReduceMotion ? 1 : 0 }}
                    animate={restStarted || shouldReduceMotion ? { y: 0, opacity: 1 } : { y: 12, opacity: 0 }}
                    transition={{
                      duration: 0.4 * (isFirstLoad ? 1 : 0.6),
                      ease: SWISS_EASE,
                      delay: idx * 0.05 * (isFirstLoad ? 1 : 0.6),
                    }}
                    className="bg-[var(--bg)] text-[var(--ink)] border border-[var(--rule)] text-[14px] font-medium font-sans rounded-[4px] px-[var(--s-3)] py-[var(--s-2)] text-center select-none cursor-default"
                  >
                    {chip}
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Scroll cue: small Plex Mono "Scroll" label with 1px, 32px vertical line below looping translateY pulse */}
        <motion.div
          initial={{ opacity: shouldReduceMotion ? 1 : 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.5,
            delay: shouldReduceMotion ? 0 : isFirstLoad ? 5.2 : 2.5,
          }}
          className="hidden sm:flex absolute bottom-[var(--s-4)] left-1/2 -translate-x-1/2 flex-col items-center gap-[var(--s-2)] pointer-events-none select-none z-10"
          aria-hidden="true"
        >
          <span className="font-mono-plex text-[11px] uppercase tracking-[0.15em] text-[var(--muted)]">
            Scroll
          </span>
          <div className="w-[1px] h-[32px] bg-[var(--rule)] overflow-hidden relative">
            <motion.div
              className="w-full h-[16px] bg-[var(--ink)]"
              animate={shouldReduceMotion ? {} : { y: [-16, 32] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: 'easeInOut',
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
