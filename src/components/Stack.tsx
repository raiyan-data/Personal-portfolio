import { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react';

export type SpacingScale = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

interface StackProps<T extends ElementType = 'div'> {
  as?: T;
  gap?: SpacingScale | string;
  className?: string;
  children: ReactNode;
}

const gapClassMap: Record<SpacingScale, string> = {
  1: 'gap-[var(--s-1)]',
  2: 'gap-[var(--s-2)]',
  3: 'gap-[var(--s-3)]',
  4: 'gap-[var(--s-4)]',
  5: 'gap-[var(--s-5)]',
  6: 'gap-[var(--s-6)]',
  7: 'gap-[var(--s-7)]',
  8: 'gap-[var(--s-8)]',
  9: 'gap-[var(--s-9)]',
  10: 'gap-[var(--s-10)]',
  11: 'gap-[var(--s-11)]',
};

export default function Stack<T extends ElementType = 'div'>({
  as,
  gap,
  className = '',
  children,
  ...props
}: StackProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof StackProps<T>>) {
  const Component = as || 'div';
  let gapClass = '';
  if (typeof gap === 'number' && gap in gapClassMap) {
    gapClass = gapClassMap[gap as SpacingScale];
  } else if (typeof gap === 'string') {
    gapClass = gap;
  }

  return (
    <Component className={`flex flex-col ${gapClass} ${className}`.trim()} {...props}>
      {children}
    </Component>
  );
}
