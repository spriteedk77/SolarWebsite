import { cn } from '@/lib/utils';

type Props = {
  children: React.ReactNode;
  className?: string;
  /** `narrow` is used for long-form reading (articles, legal pages). */
  width?: 'default' | 'narrow' | 'wide';
};

const widths = {
  narrow: 'max-w-3xl',
  default: 'max-w-6xl',
  wide: 'max-w-[88rem]',
};

export function Container({ children, className, width = 'default' }: Props) {
  return (
    <div className={cn('mx-auto w-full px-5 sm:px-6 lg:px-8', widths[width], className)}>
      {children}
    </div>
  );
}
