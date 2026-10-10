import { cn } from '@/lib/utils';

type BrandLogoProps = {
  variant: 'light' | 'dark';
  className?: string;
};

export function BrandLogo({ variant, className }: BrandLogoProps) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}rakla-logo-${variant}.png`}
      alt="RAKLA ركلة"
      className={cn('block w-auto object-contain', className)}
    />
  );
}

export function BrandIcon({ className }: { className?: string }) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}rakla-icon.png`}
      alt="RAKLA"
      className={cn('block aspect-square object-contain', className)}
    />
  );
}
