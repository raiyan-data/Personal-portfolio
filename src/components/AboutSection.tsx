import SectionHeader from './SectionHeader.tsx';
import Stack from './Stack.tsx';

export default function AboutSection() {
  const faqs = [
    {
      question: 'What are you studying?',
      answer:
        'I am completing my Associate of Science in Computer Science at Montgomery College with a 4.0 GPA, and transferring to the University of Maryland for my Bachelor of Science. My coursework emphasizes software systems, precalculus, statistics, and communications.',
    },
    {
      question: 'What are you looking for?',
      answer:
        'I am seeking technical internships and engineering roles where I can contribute to data pipelines, C++ software, or generative AI infrastructure while finishing my degree.',
    },
    {
      question: 'What data tools do you use?',
      answer:
        'I work extensively with Microsoft Excel for advanced data modeling, deduplication, and quality control. For software projects, I build custom data structures and parser scripts in C++ and Python.',
    },
    {
      question: 'How do I contact you?',
      answer:
        'You can email me directly at rmhislam@gmail.com or submit a message through the contact form below. I check inquiries daily.',
    },
  ];

  return (
    <section id="about" className="section-padding bg-[var(--bg)] border-t border-[var(--rule)]">
      <div className="content-container">
        {/* Section Heading Block */}
        <SectionHeader
          number="04"
          label="About"
          title="Background and focus"
          intro="Academic pathway, technical goals, and frequently asked inquiries."
        />

        {/* Bio, Outside of Code, and Facts: spans 8 columns */}
        <div className="grid grid-cols-12 gap-[var(--s-6)] md:gap-[var(--s-6)] lg:gap-[var(--s-7)] items-start">
          <div className="col-span-12 lg:col-span-8 flex flex-col justify-between">
            <Stack gap={6}>
              {/* Paragraphs: 16px apart */}
              <Stack gap={4} className="editorial-prose text-[var(--ink)]">
                <p className="editorial-body">
                  I am a computer science student at Montgomery College preparing to transfer to the University of Maryland to complete my bachelor&rsquo;s degree.
                </p>
                <p className="editorial-body">
                  My academic coursework centers on computing fundamentals and statistics.
                </p>
                <p className="editorial-body">
                  In my Senate internship, I learned how to audit and organize sensitive constituent datasets with meticulous attention to detail.
                </p>
                <p className="editorial-body">
                  I am preparing for a career in AI engineering, focusing on generative AI systems, model workflows, and machine learning infrastructure.
                </p>
                <p className="editorial-body">
                  In my independent projects, I write C++ games and tools to gain a deeper understanding of how software works at a lower level.
                </p>
              </Stack>

              {/* Outside of code: 8px between label and text */}
              <div className="pt-[var(--s-6)] border-t border-[var(--rule)]">
                <Stack gap={2}>
                  <span className="label-mono">Outside of code</span>
                  <p className="editorial-body text-[var(--ink)]">
                    When I am not writing software or inspecting data, I coordinate youth programs and manage audio-visual setups for community events.
                  </p>
                </Stack>
              </div>

              {/* Facts row: stacks vertically on phone with 1px rule between facts and 16px padding; horizontal on tablet/desktop */}
              <div className="pt-[var(--s-6)] border-t border-[var(--rule)]">
                <div className="flex flex-col md:flex-row md:flex-wrap md:items-center md:gap-[var(--s-7)] divide-y md:divide-y-0 divide-[var(--rule)] font-mono-plex text-[13px] text-[var(--muted)]">
                  <div className="py-[var(--s-4)] md:py-0">
                    <Stack gap={2}>
                      <span className="label-mono">Current Base</span>
                      <span className="text-[var(--ink)]">Silver Spring, MD</span>
                    </Stack>
                  </div>
                  <div className="py-[var(--s-4)] md:py-0">
                    <Stack gap={2}>
                      <span className="label-mono">Transfer Destination</span>
                      <span className="text-[var(--ink)]">University of Maryland</span>
                    </Stack>
                  </div>
                  <div className="py-[var(--s-4)] md:py-0">
                    <Stack gap={2}>
                      <span className="label-mono">Career Goal</span>
                      <span className="text-[var(--ink)]">AI Engineering</span>
                    </Stack>
                  </div>
                </div>
              </div>
            </Stack>
          </div>
        </div>

        {/* Expandable FAQ: 80px top padding (56px under 768px), items 16px apart, 24px inner padding, question and answer 12px apart */}
        <div className="border-t border-[var(--rule)] pt-[var(--s-9)] md:pt-[var(--s-10)] mt-[var(--s-9)] md:mt-[var(--s-10)]">
          <Stack gap={6}>
            <Stack gap={2}>
              <span className="label-mono">Reference</span>
              <h3 className="editorial-h3 text-[var(--ink)]">
                Frequently asked questions
              </h3>
            </Stack>

            <Stack gap={4}>
              {faqs.map((faq, idx) => (
                <details
                  key={idx}
                  className="group border border-[var(--rule)] bg-[var(--surface)] rounded-[4px] p-[var(--s-6)] transition-colors duration-150"
                >
                  <summary className="cursor-pointer list-none min-h-[56px] flex items-center justify-between text-[16px] sm:text-[17px] font-semibold text-[var(--ink)] select-none swiss-focus">
                    <span className="pr-[var(--s-4)]">{faq.question}</span>
                    <span
                      className="font-mono-plex text-[20px] font-normal text-[var(--muted)] group-open:rotate-45 transition-transform duration-200 shrink-0 select-none"
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </summary>
                  <div className="pt-[var(--s-3)] mt-[var(--s-3)] text-[15px] sm:text-[16px] leading-[1.6] text-[var(--muted)] border-t border-[var(--rule)]">
                    <p className="editorial-body text-[var(--muted)]">{faq.answer}</p>
                  </div>
                </details>
              ))}
            </Stack>
          </Stack>
        </div>
      </div>
    </section>
  );
}
