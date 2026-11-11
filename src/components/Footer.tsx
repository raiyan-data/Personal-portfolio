import { ArrowUp, ArrowDown } from 'lucide-react';
import Stack from './Stack.tsx';
import { LAST_UPDATED } from '../config.ts';

interface FooterProps {
  onOpenCvModal?: () => void;
}

export default function Footer({ onOpenCvModal }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-[var(--rule)] bg-[var(--bg)] py-[var(--s-8)] pb-[calc(var(--s-8)+env(safe-area-inset-bottom))] transition-colors duration-150">
      <div className="content-container">
        {/* Bottom Footer Row: stacks and centers on phone (12px apart: copyright, last updated, resume link, back-to-top) */}
        <div className="flex flex-col items-center justify-center text-center sm:flex-row sm:items-center sm:justify-between sm:text-left gap-[var(--s-3)] sm:gap-[var(--s-6)] font-mono-plex text-[13px] text-[var(--muted)]">
          {/* Copyright */}
          <div>
            <span>&copy; 2026 Raiyan Islam</span>
          </div>

          {/* Last updated */}
          <span className="tabular-nums">Last updated: {LAST_UPDATED}</span>

          {/* Resume link */}
          {onOpenCvModal && (
            <button
              type="button"
              onClick={onOpenCvModal}
              className="min-h-[44px] inline-flex items-center gap-[var(--s-2)] text-[var(--ink)] swiss-link swiss-focus cursor-pointer"
            >
              <span>Download resume</span>
              <ArrowDown size={13} strokeWidth={2} />
            </button>
          )}

          {/* Back to top link */}
          <button
            type="button"
            onClick={scrollToTop}
            className="min-h-[44px] inline-flex items-center gap-[var(--s-2)] text-[var(--ink)] swiss-link swiss-focus cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp size={13} strokeWidth={2} />
          </button>
        </div>
      </div>
    </footer>
  );
}
