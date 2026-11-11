import { useState } from 'react';
import { ArrowRight, ArrowUpRight, X } from 'lucide-react';
import SectionHeader from './SectionHeader.tsx';
import Photo from './Photo.tsx';
import Card from './Card.tsx';
import Stack from './Stack.tsx';

interface CaseStudyRows {
  problem: string;
  whatIDid: string;
  result: string;
  nextTime: string;
}

interface WorkItem {
  id: string;
  label: string;
  title: string;
  caseStudy: CaseStudyRows;
  tags: string[];
  links: Array<{
    text: string;
    url?: string;
    isExternal?: boolean;
  }>;
  imageSrc?: string;
  imageAlt?: string;
  objectPosition?: string;
  width?: number;
  height?: number;
}

// 8px circles (r=4) forming contiguous US outline with ~40 dots in --accent
const US_DOTS: Array<{ x: number; y: number; isAccent: boolean }> = [
  // Row 0 (NW to Great Lakes to NE)
  { x: 80, y: 55, isAccent: false }, { x: 102, y: 55, isAccent: true }, { x: 124, y: 55, isAccent: false },
  { x: 146, y: 55, isAccent: true }, { x: 168, y: 55, isAccent: false }, { x: 190, y: 55, isAccent: false },
  { x: 212, y: 55, isAccent: true }, { x: 234, y: 55, isAccent: false }, { x: 256, y: 55, isAccent: true },
  { x: 300, y: 55, isAccent: false }, { x: 366, y: 55, isAccent: true }, { x: 388, y: 55, isAccent: false },
  // Row 1 (WA to ME)
  { x: 58, y: 75, isAccent: true }, { x: 80, y: 75, isAccent: false }, { x: 102, y: 75, isAccent: false },
  { x: 124, y: 75, isAccent: true }, { x: 146, y: 75, isAccent: false }, { x: 168, y: 75, isAccent: true },
  { x: 190, y: 75, isAccent: false }, { x: 212, y: 75, isAccent: false }, { x: 234, y: 75, isAccent: true },
  { x: 256, y: 75, isAccent: false }, { x: 278, y: 75, isAccent: true }, { x: 300, y: 75, isAccent: false },
  { x: 322, y: 75, isAccent: true }, { x: 344, y: 75, isAccent: false }, { x: 366, y: 75, isAccent: true },
  { x: 388, y: 75, isAccent: false }, { x: 410, y: 75, isAccent: true },
  // Row 2 (OR, ID, MT, ND, MN, WI, MI, NY, MA)
  { x: 58, y: 95, isAccent: false }, { x: 80, y: 95, isAccent: true }, { x: 102, y: 95, isAccent: false },
  { x: 124, y: 95, isAccent: false }, { x: 146, y: 95, isAccent: true }, { x: 168, y: 95, isAccent: false },
  { x: 190, y: 95, isAccent: true }, { x: 212, y: 95, isAccent: false }, { x: 234, y: 95, isAccent: true },
  { x: 256, y: 95, isAccent: false }, { x: 278, y: 95, isAccent: false }, { x: 300, y: 95, isAccent: true },
  { x: 322, y: 95, isAccent: false }, { x: 344, y: 95, isAccent: true }, { x: 366, y: 95, isAccent: false },
  { x: 388, y: 95, isAccent: true }, { x: 410, y: 95, isAccent: false }, { x: 432, y: 95, isAccent: true },
  // Row 3 (CA, NV, UT, WY, SD, IA, IL, IN, OH, PA, NJ)
  { x: 58, y: 115, isAccent: true }, { x: 80, y: 115, isAccent: false }, { x: 102, y: 115, isAccent: true },
  { x: 124, y: 115, isAccent: false }, { x: 146, y: 115, isAccent: false }, { x: 168, y: 115, isAccent: true },
  { x: 190, y: 115, isAccent: false }, { x: 212, y: 115, isAccent: true }, { x: 234, y: 115, isAccent: false },
  { x: 256, y: 115, isAccent: true }, { x: 278, y: 115, isAccent: false }, { x: 300, y: 115, isAccent: true },
  { x: 322, y: 115, isAccent: false }, { x: 344, y: 115, isAccent: false }, { x: 366, y: 115, isAccent: true },
  { x: 388, y: 115, isAccent: false }, { x: 410, y: 115, isAccent: true },
  // Row 4 (CA, AZ, CO, NE, MO, KY, WV, VA, MD)
  { x: 80, y: 135, isAccent: false }, { x: 102, y: 135, isAccent: true }, { x: 124, y: 135, isAccent: false },
  { x: 146, y: 135, isAccent: true }, { x: 168, y: 135, isAccent: false }, { x: 190, y: 135, isAccent: true },
  { x: 212, y: 135, isAccent: false }, { x: 234, y: 135, isAccent: false }, { x: 256, y: 135, isAccent: true },
  { x: 278, y: 135, isAccent: false }, { x: 300, y: 135, isAccent: true }, { x: 322, y: 135, isAccent: false },
  { x: 344, y: 135, isAccent: true }, { x: 366, y: 135, isAccent: false }, { x: 388, y: 135, isAccent: true },
  // Row 5 (CA, AZ, NM, KS, OK, AR, TN, NC)
  { x: 102, y: 155, isAccent: false }, { x: 124, y: 155, isAccent: true }, { x: 146, y: 155, isAccent: false },
  { x: 168, y: 155, isAccent: true }, { x: 190, y: 155, isAccent: false }, { x: 212, y: 155, isAccent: true },
  { x: 234, y: 155, isAccent: false }, { x: 256, y: 155, isAccent: true }, { x: 278, y: 155, isAccent: false },
  { x: 300, y: 155, isAccent: false }, { x: 322, y: 155, isAccent: true }, { x: 344, y: 155, isAccent: false },
  { x: 366, y: 155, isAccent: true },
  // Row 6 (Texas, Deep South, GA, SC)
  { x: 190, y: 175, isAccent: false }, { x: 212, y: 175, isAccent: true }, { x: 234, y: 175, isAccent: false },
  { x: 256, y: 175, isAccent: true }, { x: 278, y: 175, isAccent: false }, { x: 300, y: 175, isAccent: true },
  { x: 322, y: 175, isAccent: false }, { x: 344, y: 175, isAccent: true }, { x: 366, y: 175, isAccent: false },
  // Row 7 (Deep Texas, Florida peninsula)
  { x: 212, y: 195, isAccent: false }, { x: 234, y: 195, isAccent: true }, { x: 366, y: 195, isAccent: true },
  // Row 8 (South Florida)
  { x: 376, y: 215, isAccent: false }
];

function UsHospitalDotMap() {
  return (
    <div
      className="w-full aspect-[16/9] bg-[var(--rule)]/20 border border-[var(--rule)] rounded-[4px] relative overflow-hidden flex items-center justify-center p-[var(--s-3)] select-none"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 480 270"
        className="w-full h-full max-h-full object-contain pointer-events-none"
      >
        {US_DOTS.map((dot, idx) => (
          <circle
            key={idx}
            cx={dot.x}
            cy={dot.y}
            r={4}
            fill={dot.isAccent ? 'var(--accent)' : 'var(--ink)'}
            opacity={dot.isAccent ? 1 : 0.2}
          />
        ))}
      </svg>
      <span className="absolute bottom-2.5 right-3 label-mono">
        Sample layout
      </span>
    </div>
  );
}

export default function WorkSection() {
  const [activeModalItem, setActiveModalItem] = useState<WorkItem | null>(null);

  // Exactly 3 cards as case studies: Senate constituent data, National hospital dataset, Interactive narrative engine
  const workItems: WorkItem[] = [
    {
      id: 'senate-data',
      label: 'Case Study 01 / Public Operations',
      title: 'Senate constituent data',
      caseStudy: {
        problem:
          'Policy feedback came in as raw spreadsheet data that staff could not easily search.',
        whatIDid:
          'Organized constituent feedback on policy issues into sorted, searchable sheets so staff could see what people were asking for. Cleaned and checked sensitive records for input and syntax errors.',
        result:
          'Staff could sort and search it to see what people were asking for.',
        nextTime:
          'Implement automated Python validation pipelines at ingestion rather than relying on multi-pass worksheet verification.',
      },
      tags: ['Excel', 'Data cleaning', 'Quality checks'],
      links: [],
      imageSrc: '/images/union-station.jpg',
      imageAlt: 'Union Station in Washington, D.C.',
      objectPosition: '50% 60%',
      width: 1600,
      height: 912,
    },
    {
      id: 'hospital-dataset',
      label: 'Case Study 02 / Public Health Analytics',
      title: 'National hospital dataset',
      caseStudy: {
        problem:
          'Hospital records covered the whole country and were hard to scan.',
        whatIDid:
          'Structured a dataset covering hospitals across the U.S. into a layout that is easy to filter and read across regions and facility types.',
        result:
          'The dataset became easy to filter and read.',
        nextTime:
          'Store the normalized records in an indexed SQLite database with spatial query endpoints for GIS integration.',
      },
      tags: ['Excel', 'Data modeling', 'Public Health'],
      links: [],
    },
    {
      id: 'narrative-engine',
      label: 'Case Study 03 / Software Architecture',
      title: 'Interactive narrative engine',
      caseStudy: {
        problem:
          'Branching stories get messy fast as choices pile up.',
        whatIDid:
          'A branching story system in C++. Object-oriented scene design and a state machine that moves the story based on player choices. Also authored a real-time 2D obstacle game in C++ with boundary logic and input handling.',
        result:
          'Choices move the story through clear states, separate from the drawing code.',
        nextTime:
          'Introduce JSON data serialization for dialogue trees to separate story writing completely from compiled C++ game loops.',
      },
      tags: ['C++', 'OOD', 'State machines', 'Game logic'],
      links: [
        {
          text: 'View narrative engine',
          url: 'https://sites.google.com/view/raiyan-islam/2d-games',
          isExternal: true,
        },
        {
          text: 'View 2D obstacle game',
          url: 'https://sites.google.com/view/raiyan-islam/2d-games',
          isExternal: true,
        },
      ],
      imageSrc: '/images/echoes-library.jpg',
      imageAlt: 'Title screen of Echoes of the Forgotten Library',
      objectPosition: '50% 40%',
      width: 501,
      height: 261,
    },
  ];

  return (
    <section
      id="work"
      className="section-padding bg-[var(--bg)] border-t border-[var(--rule)]"
    >
      <div className="content-container">
        {/* Section Heading Block */}
        <SectionHeader
          number="01"
          label="Work"
          title="Selected work"
          intro="Detailed case studies across government data operations, structured public health records, and C++ software systems."
        />

        {/* Responsive Grid: Cards in grid have gap equal to grid gutter (16px phone, 24px tablet, 32px desktop) */}
        <div className="grid grid-cols-12 gap-[var(--s-4)] md:gap-[var(--s-6)] lg:gap-[var(--s-7)]">
          {workItems.map((item, index) => {
            // Tablet: cards 1 & 2 span 6 cols, card 3 spans 12 cols. Desktop: all span 12 cols.
            const colSpanClass =
              index === 2
                ? 'col-span-12'
                : 'col-span-12 md:col-span-6 lg:col-span-12';

            return (
              <div key={item.id} className={colSpanClass}>
                {/* Card inside order: image, 24px, label, 8px, H3, 12px, body, 24px, tags, 16px, link */}
                <Card className="h-full justify-between hover:border-[var(--ink)] transition-colors duration-150 group">
                  {/* Top content group */}
                  <Stack gap={6}>
                    {/* 1. Image */}
                    <div>
                      {item.id === 'hospital-dataset' ? (
                        <UsHospitalDotMap />
                      ) : (
                        <Photo
                          src={item.imageSrc}
                          alt={`Raiyan Islam Portfolio - ${item.imageAlt || item.title}`}
                          ratio="16/9"
                          objectPosition={item.objectPosition}
                          width={item.width}
                          height={item.height}
                          scaleOnHover={true}
                        />
                      )}
                    </div>

                    {/* 2. Label -> 8px -> H3 -> 12px -> Body */}
                    <Stack gap={2}>
                      <span className="label-mono">{item.label}</span>
                      <h3 className="editorial-h3 text-[20px] lg:text-[24px] text-[var(--ink)]">
                        {item.title}
                      </h3>
                      <div className="pt-[var(--s-1)]">
                        {/* Body: Label to value pairs with 8px between label and value, 24px between pairs */}
                        <Stack gap={6}>
                          <Stack gap={2}>
                            <span className="label-mono">Problem</span>
                            <p className="editorial-body text-[var(--ink)]">
                              {item.caseStudy.problem}
                            </p>
                          </Stack>

                          <Stack gap={2}>
                            <span className="label-mono">What I did</span>
                            <p className="editorial-body text-[var(--ink)]">
                              {item.caseStudy.whatIDid}
                            </p>
                          </Stack>

                          <Stack gap={2}>
                            <span className="label-mono">Result</span>
                            <p className="editorial-body text-[var(--ink)]">
                              {item.caseStudy.result}
                            </p>
                          </Stack>

                          <Stack gap={2}>
                            <span className="label-mono">Next time</span>
                            <p className="editorial-body text-[var(--ink)]">
                              {item.caseStudy.nextTime}
                            </p>
                          </Stack>
                        </Stack>
                      </div>
                    </Stack>
                  </Stack>

                  {/* Bottom group: 24px above tags, tags, 16px, links */}
                  <div className="pt-[var(--s-6)]">
                    <Stack gap={4}>
                      {/* Tags row: 8px between tags */}
                      <div className="pt-[var(--s-4)] border-t border-[var(--rule)]">
                        <div className="flex flex-wrap items-center gap-[var(--s-2)] font-mono-plex text-[12px] text-[var(--muted)]">
                          {item.tags.map((tag, idx) => (
                            <span key={idx} className="inline-flex items-center gap-[var(--s-2)]">
                              <span>{tag}</span>
                              {idx < item.tags.length - 1 && (
                                <span className="text-[var(--rule)] select-none" aria-hidden="true">
                                  /
                                </span>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Links row */}
                      {item.links.length > 0 && (
                        <div className="flex flex-wrap items-center gap-[var(--s-4)]">
                          {item.links.map((link, lIdx) =>
                            link.isExternal && link.url ? (
                              <a
                                key={lIdx}
                                href={link.url}
                                target="_blank"
                                rel="noreferrer"
                                className="min-h-[44px] inline-flex items-center gap-[var(--s-2)] text-[14px] font-medium text-[var(--ink)] hover:text-[var(--accent)] underline underline-offset-4 font-sans swiss-focus transition-colors duration-150"
                              >
                                <span>{link.text}</span>
                                <span className="transition-transform duration-150 group-hover:translate-x-1 inline-block">
                                  <ArrowUpRight size={14} strokeWidth={2} />
                                </span>
                              </a>
                            ) : (
                              <button
                                key={lIdx}
                                type="button"
                                onClick={() => setActiveModalItem(item)}
                                className="min-h-[44px] inline-flex items-center gap-[var(--s-2)] text-[14px] font-medium text-[var(--ink)] hover:text-[var(--accent)] underline underline-offset-4 font-sans swiss-focus transition-colors duration-150 cursor-pointer"
                              >
                                <span>{link.text}</span>
                                <span className="transition-transform duration-150 group-hover:translate-x-1 inline-block">
                                  <ArrowRight size={14} strokeWidth={2} />
                                </span>
                              </button>
                            )
                          )}
                        </div>
                      )}
                    </Stack>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Modal */}
      {activeModalItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-[var(--s-4)] sm:p-[var(--s-6)] md:p-[var(--s-8)] bg-black/60 pb-[calc(16px+env(safe-area-inset-bottom))]"
          onClick={() => setActiveModalItem(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-[680px] max-h-[90vh] overflow-y-auto bg-[var(--surface)] text-[var(--ink)] border border-[var(--rule)] rounded-[4px] p-[var(--s-6)] md:p-[var(--s-7)]"
            onClick={(e) => e.stopPropagation()}
          >
            <Stack gap={6}>
              <div className="flex items-start justify-between border-b border-[var(--rule)] pb-[var(--s-4)]">
                <Stack gap={2}>
                  <span className="label-mono">{activeModalItem.label}</span>
                  <h3 className="editorial-h3 text-[var(--ink)]">{activeModalItem.title}</h3>
                </Stack>
                <button
                  type="button"
                  onClick={() => setActiveModalItem(null)}
                  className="w-[44px] h-[44px] flex items-center justify-center border border-[var(--rule)] rounded-[4px] text-[var(--muted)] hover:text-[var(--ink)] swiss-focus"
                  aria-label="Close dialog"
                >
                  <X size={18} />
                </button>
              </div>

              {activeModalItem.id === 'hospital-dataset' ? (
                <UsHospitalDotMap />
              ) : (
                <Photo
                  src={activeModalItem.imageSrc}
                  alt={`Raiyan Islam Portfolio - ${activeModalItem.imageAlt || activeModalItem.title}`}
                  ratio="16/9"
                  objectPosition={activeModalItem.objectPosition}
                  width={activeModalItem.width}
                  height={activeModalItem.height}
                />
              )}

              {/* Four Labeled Rows in Plex Mono 12px labels with 16px body */}
              <Stack gap={6}>
                <Stack gap={2}>
                  <span className="label-mono">Problem</span>
                  <p className="editorial-body text-[var(--ink)]">
                    {activeModalItem.caseStudy.problem}
                  </p>
                </Stack>

                <Stack gap={2}>
                  <span className="label-mono">What I did</span>
                  <p className="editorial-body text-[var(--ink)]">
                    {activeModalItem.caseStudy.whatIDid}
                  </p>
                </Stack>

                <Stack gap={2}>
                  <span className="label-mono">Result</span>
                  <p className="editorial-body text-[var(--ink)]">
                    {activeModalItem.caseStudy.result}
                  </p>
                </Stack>

                <Stack gap={2}>
                  <span className="label-mono">Next time</span>
                  <p className="editorial-body text-[var(--ink)]">
                    {activeModalItem.caseStudy.nextTime}
                  </p>
                </Stack>
              </Stack>

              <div className="border-t border-[var(--rule)] pt-[var(--s-4)]">
                <Stack gap={2}>
                  <span className="label-mono">Competencies Applied</span>
                  <div className="font-mono-plex text-[13px] text-[var(--muted)]">
                    {activeModalItem.tags.join(' / ')}
                  </div>
                </Stack>
              </div>

              <div className="flex justify-end border-t border-[var(--rule)] pt-[var(--s-4)]">
                <button
                  type="button"
                  onClick={() => setActiveModalItem(null)}
                  className="btn-primary min-h-[44px]"
                >
                  <span>Close overview</span>
                </button>
              </div>
            </Stack>
          </div>
        </div>
      )}
    </section>
  );
}
