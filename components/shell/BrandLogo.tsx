/**
 * Noria brand logo — the "liquid chrome" NORIA wordmark, ported from the
 * Noria site. Skewed Archivo Black filled with a metallic vertical gradient,
 * standing on an emerald light-pool. Ramp + stroke are theme-aware via the
 * --logo-* variables in globals.css.
 */

type Size = "sm" | "md";

// height (px) → width derived from the cropped viewBox aspect (252 / 82).
const HEIGHTS: Record<Size, number> = {
  sm: 40, // nav
  md: 42, // footer
};

const RATIO = 252 / 82;

export function BrandLogo({
  size = "sm",
  className,
}: {
  size?: Size;
  className?: string;
}) {
  const h = HEIGHTS[size];
  const w = Math.round(h * RATIO);
  const chromeId = `noria-chrome-${size}`;
  const strokeId = `noria-stroke-${size}`;

  return (
    <svg
      width={w}
      height={h}
      viewBox="34 30 252 82"
      className={className}
      role="img"
      aria-label="Noria"
    >
      <defs>
        <linearGradient id={chromeId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--logo-c0)" />
          <stop offset="0.38" stopColor="var(--logo-c1)" />
          <stop offset="0.5" stopColor="var(--logo-c2)" />
          <stop offset="0.55" stopColor="var(--logo-c3)" />
          <stop offset="0.78" stopColor="var(--logo-c4)" />
          <stop offset="1" stopColor="var(--logo-c5)" />
        </linearGradient>
        <linearGradient id={strokeId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--logo-stroke-top)" />
          <stop offset="1" stopColor="var(--logo-stroke-bottom)" />
        </linearGradient>
      </defs>

      <text
        x="160"
        y="82"
        textAnchor="middle"
        fontWeight="900"
        fontSize="66"
        fill={`url(#${chromeId})`}
        stroke={`url(#${strokeId})`}
        strokeWidth="1.4"
        transform="skewX(-6)"
        style={{ fontFamily: "var(--font-archivo), sans-serif" }}
      >
        NORIA
      </text>

      <ellipse cx="160" cy="103" rx="122" ry="5.5" fill="var(--logo-glow)" opacity="0.28" />
      <ellipse cx="160" cy="103" rx="72" ry="3" fill="var(--logo-glow)" opacity="0.5" />
    </svg>
  );
}
