import { useEffect, useState } from 'react';
import { X, Copy, Check, ArrowDown } from 'lucide-react';
import Stack from './Stack.tsx';

interface CvModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CvModal({ isOpen, onClose }: CvModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyText = async () => {
    const plainCv = `
RAIYAN ISLAM
Computer Science Student · Montgomery College / University of Maryland Transfer
Silver Spring, MD · rmhislam@gmail.com
Portfolio: https://sites.google.com/view/raiyan-islam/2d-games

EDUCATION
Montgomery College, Rockville, MD
Associate of Science in Computer Science, 2024 to 2026
Cumulative GPA: 4.0 / 4.0 · Dean's List
Transferring to the University of Maryland, College Park for B.S. in Computer Science
Relevant Coursework: Statistics, Computer Concepts, Precalculus, Communications.

EXPERIENCE
U.S. Senate, Washington, D.C.
Senate Data Intern (2026)
- Organized constituent feedback on policy issues into sorted, searchable sheets so staff could see what people were asking for.
- Cleaned and checked sensitive records for input and syntax errors.

School System Information Technology, College Park, MD
IT Intern (2025)
- Repaired hardware faults on school computers, networks and displays.
- Mapped cabling and deployed standard machine images.

Young Muslims Organization, Maryland Region
Event Coordinator (2023 to Present)
- Run scheduling, venues and equipment for weekly youth programs.
- Manage the audio and video setup at large events.

SKILLS & PROFICIENCIES
Programming: C++, object-oriented design, state machines
Data: Excel (advanced), data cleaning, data modeling
Systems: hardware diagnostics, network topology, audio and video production
Career Goal: AI Engineering
    `.trim();

    try {
      await navigator.clipboard.writeText(plainCv);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-[var(--s-4)] sm:p-[var(--s-6)] pb-[calc(var(--s-4)+env(safe-area-inset-bottom))] bg-black/60"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cv-modal-title"
    >
      <div
        className="w-full max-w-[820px] max-h-[92vh] overflow-y-auto bg-[var(--surface)] text-[var(--ink)] border border-[var(--rule)] rounded-[4px] p-[var(--s-6)] lg:p-[var(--s-8)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-[var(--s-3)] border-b border-[var(--rule)] pb-[var(--s-4)] mb-[var(--s-7)]">
          <div className="flex items-center gap-[var(--s-3)]">
            <span className="label-mono">Resume Dossier</span>
            <span className="font-mono-plex text-[12px] text-[var(--muted)]">
              November 4, 2026
            </span>
          </div>

          <div className="flex items-center gap-[var(--s-2)]">
            <button
              type="button"
              onClick={handleCopyText}
              className="min-h-[44px] px-[var(--s-3)] py-[var(--s-1)] border border-[var(--rule)] rounded-[4px] text-[12px] font-mono-plex text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--bg)] transition-colors duration-150 swiss-focus inline-flex items-center gap-[var(--s-2)] cursor-pointer"
              title="Copy plain text resume"
            >
              {copied ? <Check size={14} className="text-[var(--ink)]" /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="min-h-[44px] px-[var(--s-3)] py-[var(--s-1)] border border-[var(--rule)] rounded-[4px] text-[12px] font-mono-plex text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--bg)] transition-colors duration-150 swiss-focus inline-flex items-center gap-[var(--s-2)] cursor-pointer"
              title="Print or save as PDF"
            >
              <ArrowDown size={14} />
              <span>Print / PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-[44px] h-[44px] flex items-center justify-center border border-[var(--rule)] rounded-[4px] text-[var(--muted)] hover:text-[var(--ink)] swiss-focus cursor-pointer"
              aria-label="Close resume modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Resume Document Content */}
        <Stack gap={7} className="font-sans">
          {/* Header */}
          <div className="border-b border-[var(--rule)] pb-[var(--s-6)]">
            <Stack gap={2}>
              <h1 id="cv-modal-title" className="editorial-h2 text-[var(--ink)]">
                Raiyan Islam
              </h1>
              <Stack gap={1} className="font-mono-plex text-[13px] text-[var(--muted)]">
                <div>Silver Spring, MD · rmhislam@gmail.com</div>
                <div>
                  Montgomery College (A.S. Computer Science) · Transferring to University of Maryland
                </div>
              </Stack>
            </Stack>
          </div>

          {/* Education */}
          <section>
            <Stack gap={3}>
              <h2 className="label-mono border-b border-[var(--rule)] pb-[var(--s-2)]">
                Education
              </h2>
              <Stack gap={2}>
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                  <div>
                    <span className="font-semibold text-[17px] text-[var(--ink)]">Montgomery College</span>
                    <span className="editorial-small text-[var(--muted)] ml-[var(--s-2)]">Rockville, MD</span>
                  </div>
                  <span className="font-mono-plex text-[13px] text-[var(--muted)] tabular-nums">
                    2024 to 2026
                  </span>
                </div>
                <div className="editorial-body text-[var(--ink)]">
                  Associate of Science in Computer Science · 4.0 GPA · Dean&rsquo;s List
                </div>
                <div className="editorial-small text-[var(--muted)]">
                  Transferring to the University of Maryland, College Park for Bachelor of Science.
                </div>
                <div className="text-[13px] font-mono-plex text-[var(--muted)] pt-[var(--s-1)]">
                  Coursework: Statistics, Computer Concepts, Precalculus, Communications.
                </div>
              </Stack>
            </Stack>
          </section>

          {/* Experience */}
          <section>
            <Stack gap={4}>
              <h2 className="label-mono border-b border-[var(--rule)] pb-[var(--s-2)]">
                Experience
              </h2>
              <Stack gap={6}>
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-[var(--s-1)]">
                    <span className="font-semibold text-[16px] text-[var(--ink)]">
                      Senate Data Intern
                    </span>
                    <span className="font-mono-plex text-[12px] text-[var(--muted)] tabular-nums">
                      2026
                    </span>
                  </div>
                  <div className="text-[13px] font-mono-plex text-[var(--muted)] mb-[var(--s-2)]">
                    U.S. Senate · Washington, D.C.
                  </div>
                  <Stack gap={2} as="ul" className="list-disc list-inside editorial-body text-[var(--ink)]">
                    <li>Organized constituent feedback on policy issues into sorted, searchable sheets so staff could see what people were asking for.</li>
                    <li>Cleaned and checked sensitive records for input and syntax errors.</li>
                  </Stack>
                </div>

                <div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-[var(--s-1)]">
                    <span className="font-semibold text-[16px] text-[var(--ink)]">
                      IT Intern
                    </span>
                    <span className="font-mono-plex text-[12px] text-[var(--muted)] tabular-nums">
                      2025
                    </span>
                  </div>
                  <div className="text-[13px] font-mono-plex text-[var(--muted)] mb-[var(--s-2)]">
                    School System Information Technology · College Park, MD
                  </div>
                  <Stack gap={2} as="ul" className="list-disc list-inside editorial-body text-[var(--ink)]">
                    <li>Repaired hardware faults on school computers, networks and displays.</li>
                    <li>Mapped cabling and deployed standard machine images.</li>
                  </Stack>
                </div>

                <div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-[var(--s-1)]">
                    <span className="font-semibold text-[16px] text-[var(--ink)]">
                      Event Coordinator
                    </span>
                    <span className="font-mono-plex text-[12px] text-[var(--muted)] tabular-nums">
                      2023 to present
                    </span>
                  </div>
                  <div className="text-[13px] font-mono-plex text-[var(--muted)] mb-[var(--s-2)]">
                    Young Muslims Organization · Maryland Region
                  </div>
                  <Stack gap={2} as="ul" className="list-disc list-inside editorial-body text-[var(--ink)]">
                    <li>Run scheduling, venues and equipment for weekly youth programs.</li>
                    <li>Manage the audio and video setup at large events.</li>
                  </Stack>
                </div>
              </Stack>
            </Stack>
          </section>

          {/* Skills */}
          <section>
            <Stack gap={3}>
              <h2 className="label-mono border-b border-[var(--rule)] pb-[var(--s-2)]">
                Skills
              </h2>
              <Stack gap={2} className="editorial-body">
                <div>
                  <span className="font-medium text-[var(--ink)]">Programming:</span>{' '}
                  <span className="font-mono-plex text-[14px] text-[var(--muted)]">
                    C++, object-oriented design, state machines
                  </span>
                </div>
                <div>
                  <span className="font-medium text-[var(--ink)]">Data:</span>{' '}
                  <span className="font-mono-plex text-[14px] text-[var(--muted)]">
                    Excel (advanced), data cleaning, data modeling
                  </span>
                </div>
                <div>
                  <span className="font-medium text-[var(--ink)]">Systems:</span>{' '}
                  <span className="font-mono-plex text-[14px] text-[var(--muted)]">
                    hardware diagnostics, network topology, audio and video production
                  </span>
                </div>
              </Stack>
            </Stack>
          </section>
        </Stack>

        {/* Modal Close Footer */}
        <div className="mt-[var(--s-7)] pt-[var(--s-6)] border-t border-[var(--rule)] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="btn-primary min-h-[44px]"
          >
            <span>Close Window</span>
          </button>
        </div>
      </div>
    </div>
  );
}
