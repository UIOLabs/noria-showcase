"use client";

import { useState } from "react";

export type DonutDatum = { label: string; value: number; color: string };

/**
 * Donut with 2px surface gaps between segments (the gap separates, never a
 * stroke). Pair it with an external Legend — identity never rides on hue alone.
 */
export function Donut({
  data,
  size = 168,
  thickness = 22,
  centerLabel,
  centerValue,
  surface = "var(--surface)",
  onHover,
}: {
  data: DonutDatum[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string;
  surface?: string;
  onHover?: (index: number | null) => void;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const total = data.reduce((a, d) => a + d.value, 0) || 1;
  const r = size / 2 - thickness / 2 - 2;
  const cx = size / 2;
  const cy = size / 2;
  // 2px gap expressed as an angle at this radius
  const padAngle = 2 / r;

  let acc = -Math.PI / 2;
  const segs = data
    .filter((d) => d.value > 0)
    .map((d, i) => {
      const angle = (d.value / total) * Math.PI * 2;
      const a0 = acc + padAngle / 2;
      const a1 = acc + angle - padAngle / 2;
      acc += angle;
      return { ...d, a0, a1: Math.max(a1, a0 + 0.01), i };
    });

  function arc(a0: number, a1: number): string {
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const large = a1 - a0 > Math.PI ? 1 : 0;
    return `M${x0},${y0} A${r},${r} 0 ${large} 1 ${x1},${y1}`;
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} role="img">
        {segs.map((s) => (
          <path
            key={s.i}
            d={arc(s.a0, s.a1)}
            fill="none"
            stroke={s.color}
            strokeWidth={hover === s.i ? thickness + 4 : thickness}
            strokeLinecap="butt"
            opacity={hover === null || hover === s.i ? 1 : 0.45}
            style={{ transition: "opacity 150ms, stroke-width 150ms" }}
            onMouseEnter={() => {
              setHover(s.i);
              onHover?.(s.i);
            }}
            onMouseLeave={() => {
              setHover(null);
              onHover?.(null);
            }}
          />
        ))}
      </svg>
      {(centerLabel || centerValue) && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          {hover !== null && data[hover] ? (
            <>
              <span className="text-lg font-semibold tabular-nums">
                {Math.round((data[hover].value / total) * 100)}%
              </span>
              <span className="mt-0.5 max-w-[70%] text-[10px] leading-tight text-mute">
                {data[hover].label}
              </span>
            </>
          ) : (
            <>
              <span className="text-lg font-semibold">{centerValue}</span>
              <span className="mt-0.5 text-[10px] text-mute">{centerLabel}</span>
            </>
          )}
        </div>
      )}
      <span className="hidden" data-surface={surface} />
    </div>
  );
}
