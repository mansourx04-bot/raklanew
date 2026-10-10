import { cn } from '@/lib/utils';

export function BallIcon({ className, bg = '#0B3D2E', slash = '#C6F432', ball = '#F5F5F0', ink = '#0A0F0D', rounded = true }: { className?: string; bg?: string | null; slash?: string; ball?: string; ink?: string; rounded?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      {bg && <rect width="64" height="64" rx={rounded ? 14 : 0} fill={bg} />}
      <path d="M6 40 L22 40 L18 46 L2 46Z M10 30 L24 30 L21 35 L7 35Z" fill={slash} />
      <circle cx="38" cy="32" r="17" fill={ball} />
      <path d="M38 23 l7 5 -2.7 8.3h-8.6L31 28z" fill={ink} />
      <path d="M38 15v8M45 28l8-3M42.3 36.3l5 6.7M33.7 36.3l-5 6.7M31 28l-8-3" stroke={ink} strokeWidth="2" />
    </svg>
  );
}

/** Original italic RAKLA wordmark with a compact football accent. */
export function Wordmark({ className, color = '#F5F5F0', accent = '#C6F432', showArabic = true }: { className?: string; color?: string; accent?: string; showArabic?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)} dir="ltr">
      <svg viewBox="0 0 264 56" className="h-full w-auto" role="img" aria-label="RAKLA">
        <g transform="skewX(-14) translate(14 0)" fill={color}>
          {/* R */}
          <path d="M8 6h26c10 0 16 6 16 14 0 6-3 10-8 12l10 18H38l-8-16h-8v16H8zM22 17v8h10c3 0 4-2 4-4s-1-4-4-4z" />
          {/* A */}
          <path d="M66 6h14l18 44H84l-3-8H65l-3 8H48zM69 32h9l-4.5-13z" />
          {/* K */}
          <path d="M100 6h14v17l14-17h17l-18 20 19 24h-17l-15-20v20h-14z" />
          {/* L */}
          <path d="M148 6h14v32h20v12h-34z" />
          {/* Final A remains a readable letter, with a football accent beside it. */}
          <path d="M195 6h14l18 44h-14l-3-8h-16l-3 8h-14zM198 32h9l-4.5-13z" />
        </g>
        {/* Football accent and speed slash */}
        <g transform="translate(40 -2) scale(1)">
          <circle cx="200" cy="28" r="17" fill={accent} />
          <path d="M200 19.5l6.6 4.8-2.5 7.8h-8.2l-2.5-7.8z" fill="#0A0F0D" />
          <path d="M200 11v8.5M206.6 24.3l7.6-2.6M204.1 32.1l4.6 6.2M195.9 32.1l-4.6 6.2M193.4 24.3l-7.6-2.6" stroke="#0A0F0D" strokeWidth="1.8" />
          <path d="M168 44h14l-3 6h-14zM172 34h10l-2.5 5h-10z" fill={accent} />
        </g>
      </svg>
      {showArabic && (
        <span className="font-display font-black leading-none" style={{ color, fontSize: '0.62em' }} lang="ar">
          ركلة
        </span>
      )}
    </span>
  );
}
