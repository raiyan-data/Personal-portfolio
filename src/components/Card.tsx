import { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react';
import Stack, { SpacingScale } from './Stack.tsx';

interface CardProps<T extends ElementType = 'div'> {
  as?: T;
  gap?: SpacingScale | string;
  className?: string;
  children: ReactNode;
}

export default function Card<T extends ElementType = 'div'>({
  as,
  gap,
  className = '',
  children,
  ...props
}: CardProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof CardProps<T>>) {
  const Component = as || 'article';

  return (
    <Component
      className={`border border-[var(--rule)] bg-[var(--surface)] text-[var(--ink)] p-[var(--s-6)] md:p-[var(--s-7)] rounded-[4px] ${className}`.trim()}
      {...props}
    >
      <Stack gap={gap}>
        {children}
      </Stack>
    </Component>
  );
}
