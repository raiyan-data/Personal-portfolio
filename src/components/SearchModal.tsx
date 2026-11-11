import { useEffect, useState, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchItem {
  section: string;
  title: string;
  matchSnippet: string;
  anchor: string;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const searchableIndex: SearchItem[] = [
    // Case Studies / Work
    {
      section: 'Work',
      title: 'Senate constituent data (Case Study 01)',
      matchSnippet: 'Excel, Data cleaning, Quality checks, constituent feedback case study',
      anchor: '#work',
    },
    {
      section: 'Work',
      title: 'National hospital dataset (Case Study 02)',
      matchSnippet: 'Excel, Data modeling, national hospital records, dot map',
      anchor: '#work',
    },
    {
      section: 'Work',
      title: 'Interactive narrative engine & 2D obstacle game (Case Study 03)',
      matchSnippet: 'C++, OOD, State machines, branching story system, game logic',
      anchor: '#work',
    },
    // Roadmap
    {
      section: 'Roadmap',
      title: 'Now: Finishing A.S. in Computer Science at Montgomery College',
      matchSnippet: 'Montgomery College, foundational computing, degree completion, academic milestones',
      anchor: '#roadmap',
    },
    {
      section: 'Roadmap',
      title: 'Next: Transferring to University of Maryland',
      matchSnippet: 'University of Maryland, computer science degree, upper-level software systems',
      anchor: '#roadmap',
    },
    {
      section: 'Roadmap',
      title: 'Then: Moving into AI engineering',
      matchSnippet: 'Generative AI systems, model deployment workflows, machine learning',
      anchor: '#roadmap',
    },
    {
      section: 'Roadmap',
      title: 'Goal: Future engineering vision and target focus',
      matchSnippet: 'Production AI engineering, real-world systems, team problem solving',
      anchor: '#roadmap',
    },
    // How I work
    {
      section: 'How I work',
      title: '01: Verify raw data before downstream layers',
      matchSnippet: 'Data auditing, input validation, ground-truth logging',
      anchor: '#how-i-work',
    },
    {
      section: 'How I work',
      title: '02: Separate state mechanics from presentation logic',
      matchSnippet: 'Modular state machines, decoupled architectures, software design',
      anchor: '#how-i-work',
    },
    {
      section: 'How I work',
      title: '03: Design workflows to tolerate unexpected failure',
      matchSnippet: 'Fallback routes, error boundaries, graceful degradation',
      anchor: '#how-i-work',
    },
    // About
    {
      section: 'About',
      title: 'Academic background & transfer',
      matchSnippet: 'Montgomery College, University of Maryland transfer, AI engineering',
      anchor: '#about',
    },
    {
      section: 'About',
      title: 'Outside of code',
      matchSnippet: 'Youth program coordination, audio-visual event staging, hardware diagnostics',
      anchor: '#about',
    },
    // FAQ questions
    {
      section: 'About / FAQ',
      title: 'What are you studying?',
      matchSnippet: 'A.S. in Computer Science at Montgomery College, transferring to UMD',
      anchor: '#about',
    },
    {
      section: 'About / FAQ',
      title: 'What are you looking for?',
      matchSnippet: 'Software engineering internships, data pipelines, C++, AI engineering',
      anchor: '#about',
    },
    {
      section: 'About / FAQ',
      title: 'What data tools do you use?',
      matchSnippet: 'Microsoft Excel, data validation, C++, Python data scripts',
      anchor: '#about',
    },
    {
      section: 'About / FAQ',
      title: 'How do I contact you?',
      matchSnippet: 'rmhislam@gmail.com, direct contact form, inquiry channel',
      anchor: '#about',
    },
    // Contact & Resume
    {
      section: 'Contact',
      title: 'Direct Email & Form Transmission',
      matchSnippet: 'rmhislam@gmail.com, LinkedIn, message dispatch',
      anchor: '#contact',
    },
    {
      section: 'Resume',
      title: 'Curriculum Vitae / Resume dossier',
      matchSnippet: 'Download resume, experience, education, competencies overview',
      anchor: '#contact',
    },
  ];

  const results = searchableIndex.filter((item) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.matchSnippet.toLowerCase().includes(q) ||
      item.section.toLowerCase().includes(q)
    );
  });

  // Reset selected index on query change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[selectedIndex]) {
          handleSelect(results[selectedIndex].anchor);
        }
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      setTimeout(() => inputRef.current?.focus(), 50);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, results, selectedIndex, onClose]);

  if (!isOpen) return null;

  const handleSelect = (anchor: string) => {
    onClose();
    const el = document.querySelector(anchor);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[var(--s-9)] sm:pt-[var(--s-10)] p-[var(--s-4)] sm:p-[var(--s-6)] pb-[calc(var(--s-4)+env(safe-area-inset-bottom))] bg-black/60"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Site search"
    >
      <div
        className="w-full max-w-[620px] bg-[var(--surface)] text-[var(--ink)] border border-[var(--rule)] rounded-[4px] p-[var(--s-4)] sm:p-[var(--s-6)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-[var(--s-3)] border-b border-[var(--rule)] pb-[var(--s-4)] mb-[var(--s-4)]">
          <Search size={18} className="text-[var(--muted)] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, tags, experience, FAQ..."
            className="w-full text-[16px] font-mono-plex bg-transparent text-[var(--ink)] placeholder:text-[var(--muted)]/60 outline-none"
            aria-label="Search query"
          />
          <button
            type="button"
            onClick={onClose}
            className="w-[44px] h-[44px] flex items-center justify-center border border-[var(--rule)] rounded-[4px] text-[var(--muted)] hover:text-[var(--ink)] swiss-focus shrink-0 cursor-pointer"
            aria-label="Close search"
          >
            <X size={18} />
          </button>
        </div>

        {/* Results List with keyboard highlight */}
        <div ref={listRef} className="max-h-[380px] overflow-y-auto divide-y divide-[var(--rule)]">
          {results.length === 0 ? (
            <div className="py-[var(--s-7)] text-center text-[14px] font-mono-plex text-[var(--muted)]">
              No matching records for &ldquo;{query}&rdquo;
            </div>
          ) : (
            results.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelect(item.anchor)}
                  className={`w-full py-[var(--s-3)] px-[var(--s-3)] min-h-[44px] flex items-center justify-between text-left transition-colors duration-150 rounded-[4px] swiss-focus group ${
                    isSelected
                      ? 'bg-[var(--ink)] text-[var(--bg)]'
                      : 'hover:bg-[var(--bg)] text-[var(--ink)]'
                  }`}
                >
                  <div className="pr-[var(--s-4)]">
                    <div
                      className={`flex items-center gap-[var(--s-2)] font-mono-plex text-[11px] uppercase tracking-[0.08em] mb-[var(--s-1)] ${
                        isSelected ? 'text-[var(--bg)]/80' : 'text-[var(--muted)]'
                      }`}
                    >
                      <span>{item.section}</span>
                    </div>
                    <div className="text-[15px] font-medium leading-snug">
                      {item.title}
                    </div>
                    <div
                      className={`text-[12px] font-mono-plex truncate max-w-[420px] mt-[var(--s-1)] ${
                        isSelected ? 'text-[var(--bg)]/70' : 'text-[var(--muted)]'
                      }`}
                    >
                      {item.matchSnippet}
                    </div>
                  </div>
                  <ArrowRight
                    size={14}
                    className={`shrink-0 transition-transform ${
                      isSelected ? 'text-[var(--bg)] translate-x-1' : 'text-[var(--muted)] group-hover:text-[var(--accent)]'
                    }`}
                  />
                </button>
              );
            })
          )}
        </div>

        {/* Keyboard shortcut hint bar */}
        <div className="pt-[var(--s-3)] mt-[var(--s-3)] border-t border-[var(--rule)] flex items-center justify-between text-[11px] font-mono-plex text-[var(--muted)]">
          <span>&uarr; &darr; to navigate · Enter to jump</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  );
}
