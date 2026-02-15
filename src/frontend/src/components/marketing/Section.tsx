import { cn } from '@/lib/utils';
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll';
import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  variant?: 'white' | 'grey';
  className?: string;
  reveal?: boolean;
}

export default function Section({ children, variant = 'white', className, reveal = true }: SectionProps) {
  const { ref, isVisible } = useRevealOnScroll();

  return (
    <section
      ref={reveal ? ref : null}
      className={cn(
        'py-16 transition-all duration-700 md:py-24',
        variant === 'grey' && 'bg-muted/30',
        variant === 'white' && 'bg-background',
        reveal && !isVisible && 'translate-y-8 opacity-0',
        reveal && isVisible && 'translate-y-0 opacity-100',
        className
      )}
    >
      <div className="container">{children}</div>
    </section>
  );
}
