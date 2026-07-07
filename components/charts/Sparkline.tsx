"use client";

import { useMeasure } from "./useMeasure";

/** Compact line sparkline for stat tiles. De-emphasized hue; no axes. */
export function Sparkline({
  values,
  color = "var(--mute)",
  accent = "var(--accent)",
  height = 28,
}: {
  values: number[];
  color?: string;
  /** Endpoint dot color (current period). */
  accent?: string;
  height?: number;
}) {
  const { ref, width } = useMeasure<HTMLDivElement>();
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const n = values.length;
  const x = (i: number) => (n > 1 ? (i / (n - 1)) * (width - 8) + 4 : width / 2);
  const y = (v: number) => 4 + (height - 8) * (1 - (v - min) / Math.max(max - min, 1e-9));
  const d = values.map((v, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(v)}`).join(" ");

  return (
    <div ref={ref} className="w-full" style={{ height }}>
      {width > 0 && n > 1 && (
        <svg width={width} height={height}>
          <path d={d} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={x(n - 1)} cy={y(values[n - 1])} r={3} fill={accent} />
        </svg>
      )}
    </div>
  );
}

/**
 * Bar sparkline for live throughput — newest bar flashes on arrival
 * (drive `flashKey` with the sample count).
 */
export function SparkBars({
  values,
  color = "var(--accent)",
  height = 44,
  flashKey,
}: {
  values: number[];
  color?: string;
  height?: number;
  flashKey?: number | string;
}) {
  const { ref, width } = useMeasure<HTMLDivElement>();
  const max = Math.max(...values, 1);
  const n = values.length;
  const gap = 2;
  const barW = n > 0 ? Math.max((width - gap * (n - 1)) / n, 1) : 0;

  return (
    <div ref={ref} className="w-full" style={{ height }}>
      {width > 0 && (
        <svg width={width} height={height}>
          {values.map((v, i) => {
            const h = Math.max((v / max) * (height - 4), v > 0 ? 2 : 0);
            const last = i === n - 1;
            return (
              <rect
                key={last ? `${i}-${flashKey}` : i}
                x={i * (barW + gap)}
                y={height - h}
                width={barW}
                height={h}
                rx={Math.min(2, barW / 2)}
                fill={color}
                opacity={last ? 1 : 0.55}
                className={last ? "animate-row-enter" : undefined}
              />
            );
          })}
        </svg>
      )}
    </div>
  );
}
