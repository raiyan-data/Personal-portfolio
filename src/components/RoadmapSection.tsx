import { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useReducedMotion } from 'motion/react';
import SectionHeader from './SectionHeader.tsx';
import Stack from './Stack.tsx';
import { SWISS_EASE } from '../config.ts';

type RoadmapPhaseType = 'Now' | 'Next' | 'Then' | 'Goal';

interface RoadmapPhase {
  id: string;
  phase: RoadmapPhaseType;
  label: string;
  title: string;
  sentences: string;
}

const ROADMAP_PHASES: RoadmapPhase[] = [
  {
    id: 'phase-now',
    phase: 'Now',
    label: '01 / Current',
    title: 'Foundational degree completion.',
    sentences:
      'Finishing my A.S. in Computer Science at Montgomery College. This semester I am focused on keeping my 4.0 and building a third C++ project that goes beyond games.',
  },
  {
    id: 'phase-next',
    phase: 'Next',
    label: '02 / University',
    title: 'Degree transfer and upper-level systems.',
    sentences:
      'Transferring to the University of Maryland to complete my computer science degree. There I want to take machine learning courses and join a club or research group working on AI.',
  },
  {
    id: 'phase-then',
    phase: 'Then',
    label: '03 / Specialization',
    title: 'Generative AI and deployment workflows.',
    sentences:
      'Moving into AI engineering, focused on generative AI systems and how models get deployed. My first goal is to build a small data-cleaning tool that uses a language model, and put it online so anyone can try it.',
  },
  {
    id: 'phase-goal',
    phase: 'Goal',
    label: '04 / Focus',
    title: '',
    sentences:
      'I want to work on problems where messy, real-world data has to become something people can trust, ideally on a team that ships AI products.',
  },
];

const phaseWordVariants = {
  enter: (dir: number) => ({
    y: dir >= 0 ? '60%' : '-60%',
    opacity: 1,
  }),
  center: {
    y: '0%',
    opacity: 1,
  },
  exit: (dir: number) => ({
    y: dir >= 0 ? '-60%' : '60%',
    opacity: 0.8,
  }),
};

export default function RoadmapSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineColumnRef = useRef<HTMLDivElement>(null);
  const chapterElementsRef = useRef<(HTMLElement | null)[]>([]);

  const shouldReduceMotion = useReducedMotion();

  // Active state representing the current chapter
  const [displayPhase, setDisplayPhase] = useState<RoadmapPhaseType>('Now');
  const [displayIdx, setDisplayIdx] = useState<number>(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  // Track revealed panels so they play once and stay revealed forever
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(() =>
    new Set(shouldReduceMotion ? [0, 1, 2, 3] : [0])
  );

  // Swap serialization refs
  const isSwappingRef = useRef(false);
  const currentIdxRef = useRef(0);
  const scrollDirectionRef = useRef<1 | -1>(1);
  const nextTargetRef = useRef<{ phase: RoadmapPhaseType; idx: number; dir: 1 | -1 } | null>(null);

  // Apply a phase update cleanly
  const applyPhase = useCallback((phase: RoadmapPhaseType, idx: number, dir: 1 | -1) => {
    isSwappingRef.current = true;
    currentIdxRef.current = idx;
    setDirection(dir);
    setDisplayPhase(phase);
    setDisplayIdx(idx);
    setRevealedIndices((prev) => {
      const next = new Set(prev);
      for (let i = 0; i <= idx; i++) {
        next.add(i);
      }
      return next;
    });
  }, []);

  // Handle completion of a swap animation
  const handleSwapFinished = useCallback(() => {
    isSwappingRef.current = false;
    if (nextTargetRef.current) {
      const next = nextTargetRef.current;
      nextTargetRef.current = null;
      if (next.idx !== currentIdxRef.current) {
        applyPhase(next.phase, next.idx, next.dir);
      }
    }
  }, [applyPhase]);

  // Commit phase if active for at least 400ms
  const commitPhase = useCallback(
    (idx: number, dir: 1 | -1) => {
      if (idx === currentIdxRef.current) return;
      const targetItem = ROADMAP_PHASES[idx];
      if (!targetItem) return;

      if (isSwappingRef.current) {
        nextTargetRef.current = { phase: targetItem.phase, idx, dir };
      } else {
        applyPhase(targetItem.phase, idx, dir);
      }
    },
    [applyPhase]
  );

  // IntersectionObserver with rootMargin "-45% 0px -45% 0px" and 400ms dwell verification
  useEffect(() => {
    const elements = chapterElementsRef.current.filter(Boolean) as HTMLElement[];
    if (!elements.length) return;

    let lastScrollY = window.scrollY;
    const onScroll = () => {
      const curY = window.scrollY;
      if (curY > lastScrollY) {
        scrollDirectionRef.current = 1;
      } else if (curY < lastScrollY) {
        scrollDirectionRef.current = -1;
      }
      lastScrollY = curY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    let dwellTimeout: ReturnType<typeof setTimeout> | null = null;
    let candidateIdx: number | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          const idx = elements.indexOf(target);
          if (idx === -1) return;

          if (entry.isIntersecting) {
            candidateIdx = idx;
            if (dwellTimeout) clearTimeout(dwellTimeout);

            // A chapter must stay active for at least 400ms before phase word and counter update
            dwellTimeout = setTimeout(() => {
              commitPhase(idx, scrollDirectionRef.current);
            }, 400);
          } else {
            // Cancel pending update if chapter leaves the middle 10% before 400ms
            if (candidateIdx === idx) {
              candidateIdx = null;
              if (dwellTimeout) {
                clearTimeout(dwellTimeout);
                dwellTimeout = null;
              }
            }
          }
        });
      },
      {
        rootMargin: '-45% 0px -45% 0px',
        threshold: 0,
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      if (dwellTimeout) clearTimeout(dwellTimeout);
    };
  }, [commitPhase]);

  // Scroll progress for vertical timeline line
  const { scrollYProgress } = useScroll({
    target: timelineColumnRef,
    offset: ['start 40%', 'end 60%'],
  });

  // Smooth line follow with useSpring stiffness 60, damping 20
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
    restDelta: 0.001,
  });

  const lineHeight = useTransform(
    shouldReduceMotion ? scrollYProgress : smoothProgress,
    [0, 1],
    ['0%', '100%']
  );

  return (
    <section
      id="roadmap"
      ref={containerRef}
      className="section-padding bg-[var(--bg)] border-t border-[var(--rule)] relative"
    >
      <div className="content-container">
        {/* Section Heading Block */}
        <SectionHeader
          number="02"
          label="Roadmap"
          title="Where this is going"
          intro="The work above shows what I have built so far. This is what I am building toward."
        />

        {/* Two-Column Grid: left 4 cols sticky panel (hidden on phone), right 8 cols chapters */}
        <div className="grid grid-cols-12 gap-[var(--s-6)] md:gap-[var(--s-6)] lg:gap-[var(--s-7)] items-start relative">
          {/* Left 4 Cols: Sticky Panel on Desktop/Tablet (top: 120px) - hidden on phone */}
          <div className="hidden md:block md:col-span-4 sticky top-[var(--s-11)] self-start pr-[var(--s-6)]">
            <Stack gap={2}>
              <span className="label-mono">Milestone Phase</span>

              {/* Huge Plex Mono Numeral with Vertical Direction-Aware Rolling Transition (900ms) */}
              <div className="h-[120px] lg:h-[160px] overflow-hidden relative flex items-center">
                {shouldReduceMotion ? (
                  <div className="font-mono-plex text-[clamp(64px,10vw,120px)] font-semibold leading-[0.9] text-[var(--ink)] tracking-tight tabular-nums select-none">
                    {displayPhase}
                  </div>
                ) : (
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={displayPhase}
                      custom={direction}
                      variants={phaseWordVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.9, ease: SWISS_EASE }}
                      onAnimationComplete={(definition) => {
                        if (definition === 'center') {
                          handleSwapFinished();
                        }
                      }}
                      className="font-mono-plex text-[clamp(64px,10vw,120px)] font-semibold leading-[0.9] text-[var(--ink)] tracking-tight tabular-nums select-none"
                    >
                      {displayPhase}
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>

              {/* Active Phase Details in Sticky Panel: Always strictly in lockstep with the phase word */}
              <div className="pt-[var(--s-6)] border-t border-[var(--rule)] mt-[var(--s-6)] font-mono-plex text-[13px] text-[var(--muted)]">
                <Stack gap={1}>
                  <div className="text-[var(--ink)] font-medium">
                    Phase 0{displayIdx + 1} of 0{ROADMAP_PHASES.length}
                  </div>
                  <div>Roadmap projection: Current to Goal</div>
                </Stack>
              </div>
            </Stack>
          </div>

          {/* Right 8 Cols on Tablet/Desktop, 12 Cols on Phone: Chapters List with Vertical Timeline */}
          <div
            ref={timelineColumnRef}
            className="col-span-12 md:col-span-8 relative pl-[var(--s-7)] md:pl-[var(--s-8)]"
          >
            {/* Background 2px vertical line in --rule */}
            <div
              className="absolute left-[5px] md:left-[7px] top-[var(--s-4)] bottom-[var(--s-7)] w-[2px] bg-[var(--rule)]"
              aria-hidden="true"
            />

            {/* Animated 2px vertical line in --accent driven smoothly by spring */}
            <motion.div
              style={shouldReduceMotion ? { height: '100%' } : { height: lineHeight }}
              className="absolute left-[5px] md:left-[7px] top-[var(--s-4)] w-[2px] bg-[var(--accent)] origin-top z-10"
              aria-hidden="true"
            />

            {/* 4 Phases: 80px between chapters on desktop, 56px on phone */}
            <Stack gap="gap-[var(--s-9)] md:gap-[var(--s-10)]">
              {ROADMAP_PHASES.map((phaseItem, idx) => (
                <PhaseRow
                  key={phaseItem.id}
                  ref={(el) => {
                    chapterElementsRef.current[idx] = el;
                  }}
                  phaseItem={phaseItem}
                  index={idx}
                  isActive={displayIdx === idx}
                  isRevealed={revealedIndices.has(idx)}
                  shouldReduceMotion={Boolean(shouldReduceMotion)}
                />
              ))}
            </Stack>
          </div>
        </div>

        {/* End of Section: one line, "Want to talk about it?" with a "Contact me" link */}
        <div className="mt-[var(--s-9)] md:mt-[var(--s-10)] pt-[var(--s-7)] md:pt-[var(--s-8)] border-t border-[var(--rule)] flex flex-col md:flex-row md:items-center justify-between gap-[var(--s-6)]">
          <p className="editorial-h2 max-w-2xl text-[var(--ink)]">
            Want to talk about it?
          </p>

          <a
            href="#contact"
            className="btn-primary self-start md:self-auto shrink-0 min-h-[44px]"
          >
            <span>Contact me</span>
            <ArrowRight size={14} strokeWidth={2} />
          </a>
        </div>
      </div>
    </section>
  );
}

interface PhaseRowProps {
  phaseItem: RoadmapPhase;
  index: number;
  isActive: boolean;
  isRevealed: boolean;
  shouldReduceMotion: boolean;
  ref: (el: HTMLElement | null) => void;
}

function ArrowConnector() {
  return (
    <>
      {/* Horizontal 2px --ink line with arrow on desktop (768px+) */}
      <svg
        className="hidden md:block w-[32px] h-[16px] text-[var(--ink)] shrink-0"
        viewBox="0 0 32 16"
        fill="none"
        aria-hidden="true"
      >
        <line x1="0" y1="8" x2="26" y2="8" stroke="currentColor" strokeWidth="2" />
        <polyline
          points="20,3 27,8 20,13"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      {/* Vertical 2px --ink line with arrow pointing down on phones (<768px) */}
      <svg
        className="block md:hidden w-[16px] h-[16px] text-[var(--ink)] shrink-0"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <line x1="8" y1="0" x2="8" y2="12" stroke="currentColor" strokeWidth="2" />
        <polyline
          points="3,7 8,13 13,7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </>
  );
}

function PhaseRow({
  phaseItem,
  index: _index,
  isActive,
  isRevealed,
  shouldReduceMotion,
  ref,
}: PhaseRowProps) {
  const isGoal = phaseItem.phase === 'Goal';

  return (
    <article
      ref={ref}
      className="min-h-0 md:min-h-[70vh] flex flex-col justify-center relative py-[var(--s-4)] md:py-[var(--s-7)] first:pt-[var(--s-2)]"
    >
      {/* Node: 12px on phone, 16px on desktop; 300ms color transition strictly following the active chapter */}
      <div
        className={`absolute -left-[var(--s-7)] md:-left-[var(--s-8)] top-[var(--s-6)] md:top-[var(--s-8)] w-[12px] h-[12px] md:w-[16px] md:h-[16px] rounded-[2px] transition-colors duration-[300ms] z-20 ${
          isActive
            ? 'bg-[var(--accent)] border-2 border-[var(--accent)]'
            : 'bg-[var(--surface)] border-2 border-[var(--rule)]'
        }`}
        aria-hidden="true"
      />

      <Stack gap={6}>
        {/* Top group */}
        <Stack gap={3}>
          {/* Phone Phase Word */}
          <div className="md:hidden">
            <span className="font-mono-plex text-[48px] font-semibold text-[var(--ink)] leading-none select-none block">
              {phaseItem.phase}
            </span>
          </div>

          <Stack gap={2}>
            {/* Label */}
            <span className="label-mono">{phaseItem.label}</span>

            {/* 04 Focus: Set the sentence in H3 at 28px. Other phases: Standard H3 */}
            {isGoal ? (
              <h3
                className={`text-[28px] font-semibold leading-[1.2] transition-colors duration-[400ms] ${
                  isActive ? 'text-[var(--ink)]' : 'text-[var(--muted)]'
                }`}
              >
                {phaseItem.sentences}
              </h3>
            ) : (
              <h3
                className={`editorial-h3 transition-colors duration-[400ms] ${
                  isActive ? 'text-[var(--ink)]' : 'text-[var(--muted)]'
                }`}
              >
                {phaseItem.title}
              </h3>
            )}
          </Stack>

          {/* Sentences for phases 01, 02, 03 (04 Focus uses H3 directly) with 400ms color transition */}
          {!isGoal && (
            <p
              className={`editorial-body transition-colors duration-[400ms] ${
                isActive ? 'text-[var(--ink)]' : 'text-[var(--muted)]'
              }`}
            >
              {phaseItem.sentences}
            </p>
          )}
        </Stack>

        {/* Static HTML / inline SVG Panel: 16:9 ratio, --surface background, 1px --rule border, 4px radius, aria-hidden */}
        {!isGoal && (
          <div className="w-full max-w-lg aspect-[16/9] overflow-hidden">
            <motion.div
              initial={
                shouldReduceMotion || isRevealed
                  ? { clipPath: 'inset(0 0% 0 0)' }
                  : { clipPath: 'inset(0 100% 0 0)' }
              }
              animate={{
                clipPath: isRevealed || shouldReduceMotion ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)',
              }}
              transition={{ duration: 1.2, ease: SWISS_EASE }}
              className="w-full h-full"
            >
              {/* 01 Current: a vertical list of three rows in Plex Mono 14px, each separated by a 1px --rule: "C++", "Excel", "Data cleaning". A small --accent 8px square marks the first row. */}
              {phaseItem.phase === 'Now' && (
                <div
                  className="w-full h-full bg-[var(--surface)] border border-[var(--rule)] rounded-[4px] p-[var(--s-4)] sm:p-[var(--s-6)] md:p-[var(--s-7)] flex flex-col justify-center divide-y divide-[var(--rule)]"
                  aria-hidden="true"
                >
                  <div className="py-[var(--s-2)] sm:py-[var(--s-3)] first:pt-0 flex items-center gap-[var(--s-3)] font-mono-plex text-[14px] text-[var(--ink)] font-medium">
                    <span className="w-[8px] h-[8px] bg-[var(--accent)] shrink-0 rounded-[1px]" />
                    <span>C++</span>
                  </div>
                  <div className="py-[var(--s-2)] sm:py-[var(--s-3)] flex items-center gap-[var(--s-3)] font-mono-plex text-[14px] text-[var(--ink)] font-medium pl-[var(--s-5)]">
                    <span>Excel</span>
                  </div>
                  <div className="py-[var(--s-2)] sm:py-[var(--s-3)] last:pb-0 flex items-center gap-[var(--s-3)] font-mono-plex text-[14px] text-[var(--ink)] font-medium pl-[var(--s-5)]">
                    <span>Data cleaning</span>
                  </div>
                </div>
              )}

              {/* 02 University: two boxes in a row, 4px radius, 1px --ink border, labeled "Montgomery College" and "University of Maryland" in Plex Mono 14px, joined by a 2px --ink line with an arrow. The second box has an --accent 2px border. */}
              {phaseItem.phase === 'Next' && (
                <div
                  className="w-full h-full bg-[var(--surface)] border border-[var(--rule)] rounded-[4px] p-[var(--s-3)] sm:p-[var(--s-6)] md:p-[var(--s-7)] flex flex-col justify-center"
                  aria-hidden="true"
                >
                  <div className="flex flex-col md:flex-row items-center justify-center gap-[var(--s-2)] sm:gap-[var(--s-4)] w-full">
                    <div className="border border-[var(--ink)] rounded-[4px] px-[var(--s-3)] sm:px-[var(--s-4)] py-[var(--s-1)] sm:py-[var(--s-3)] font-mono-plex text-[13px] sm:text-[14px] text-[var(--ink)] font-medium text-center whitespace-nowrap">
                      Montgomery College
                    </div>

                    <ArrowConnector />

                    <div className="border-2 border-[var(--accent)] rounded-[4px] px-[var(--s-3)] sm:px-[var(--s-4)] py-[var(--s-1)] sm:py-[var(--s-3)] font-mono-plex text-[13px] sm:text-[14px] text-[var(--ink)] font-medium text-center whitespace-nowrap">
                      University of Maryland
                    </div>
                  </div>
                </div>
              )}

              {/* 03 Specialization: three boxes in a row labeled "Data", "Model", "Deploy" in Plex Mono 14px, joined by 2px --ink arrows. The "Deploy" box has an --accent 2px border. */}
              {phaseItem.phase === 'Then' && (
                <div
                  className="w-full h-full bg-[var(--surface)] border border-[var(--rule)] rounded-[4px] p-[var(--s-2)] sm:p-[var(--s-6)] md:p-[var(--s-7)] flex flex-col justify-center"
                  aria-hidden="true"
                >
                  <div className="flex flex-col md:flex-row items-center justify-center gap-[var(--s-1)] sm:gap-[var(--s-4)] w-full">
                    <div className="border border-[var(--ink)] rounded-[4px] px-[var(--s-4)] sm:px-[var(--s-5)] py-[var(--s-1)] sm:py-[var(--s-3)] font-mono-plex text-[13px] sm:text-[14px] text-[var(--ink)] font-medium text-center">
                      Data
                    </div>

                    <ArrowConnector />

                    <div className="border border-[var(--ink)] rounded-[4px] px-[var(--s-4)] sm:px-[var(--s-5)] py-[var(--s-1)] sm:py-[var(--s-3)] font-mono-plex text-[13px] sm:text-[14px] text-[var(--ink)] font-medium text-center">
                      Model
                    </div>

                    <ArrowConnector />

                    <div className="border-2 border-[var(--accent)] rounded-[4px] px-[var(--s-4)] sm:px-[var(--s-5)] py-[var(--s-1)] sm:py-[var(--s-3)] font-mono-plex text-[13px] sm:text-[14px] text-[var(--ink)] font-medium text-center">
                      Deploy
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </Stack>
    </article>
  );
}
