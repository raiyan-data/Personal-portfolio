import SectionHeader from './SectionHeader.tsx';
import Stack from './Stack.tsx';

interface PrincipleItem {
  number: string;
  principle: string;
  example: string;
}

export default function HowIWorkSection() {
  const principles: PrincipleItem[] = [
    {
      number: '01',
      principle: 'Verify the raw data before trusting downstream layers',
      example:
        'When handling sensitive records or large datasets, assumption is the primary vector for silent corruption. I build rigorous manual and careful checks before any aggregation takes place, verifying inputs directly against source logs.',
    },
    {
      number: '02',
      principle: 'Separate state mechanics from presentation logic',
      example:
        'Coupling underlying data models directly to rendering code creates fragile architectures that break under modification. In my C++ game engines and data work, I isolate state machines so core logic remains modular and testable.',
    },
    {
      number: '03',
      principle: 'Design workflows to tolerate unexpected real-world failure',
      example:
        'Live operational execution and uncurated user records rarely follow clean textbook conditions. I establish fallback branches and explicit error boundaries early so software and data pipelines degrade gracefully instead of failing silently.',
    },
  ];

  return (
    <section
      id="how-i-work"
      className="section-padding bg-[var(--bg)] border-t border-[var(--rule)]"
    >
      <div className="content-container">
        {/* Section Heading Block */}
        <SectionHeader
          number="03"
          label="How I work"
          title="How I work"
          intro="A set of core operating principles derived from auditing messy datasets, architecting modular software, and coordinating live events."
        />

        {/* 3-Column Grid: 40px gap on phone, 24px on tablet, 32px on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--s-8)] md:gap-[var(--s-6)] lg:gap-[var(--s-7)]">
          {principles.map((item) => (
            <div
              key={item.number}
              className="border-t border-[var(--rule)] pt-[var(--s-6)] flex flex-col"
            >
              {/* How I Work items: 1px rule, 24px, number, 12px, H3, 12px, body */}
              <Stack gap={3}>
                <span className="label-mono">
                  {item.number}
                </span>

                <h3 className="editorial-h3 text-[var(--ink)]">
                  {item.principle}
                </h3>

                <p className="editorial-body text-[var(--ink)]">
                  {item.example}
                </p>
              </Stack>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
