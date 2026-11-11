import SectionHeader from './SectionHeader.tsx';

interface SectionHeadingProps {
  number?: string;
  label: string;
  title: string;
  description?: string;
  intro?: string;
  className?: string;
}

export default function SectionHeading({
  number,
  label,
  title,
  description,
  intro,
  className,
}: SectionHeadingProps) {
  return (
    <SectionHeader
      number={number}
      label={label}
      title={title}
      intro={intro || description}
      className={className}
    />
  );
}
