"use client";

import { useState } from "react";
import { useMeasure } from "./useMeasure";
import { niceTicks } from "./scale";
import { Tip, TipRow, TipTitle } from "./Tip";

export type BarDatum = {
  label: string;
  value: number;
  /** Per-bar override (threshold coloring). Defaults to the chart color. */
  color?: string;
};

/**
 * Vertical column chart, single series. Mark spec: columns ≤24px, 4px rounded
 * data-end, square baseline, ≥2px air between bars, hairline gridlines.
 */
export function BarChart({
  data,
  height = 200,
  color = "var(--accent)",
  yFormat = (n: number) => String(n),
  tipLabel = "",
  surface = "var(--surface)",
}: {
  data: BarDatum[];
  height?: number;
  color?: string;
  yFormat?: (n: number) => string;
  /** Series name shown in the tooltip row. */
  tipLabel?: string;
  surface?: string;
}) {
  const { ref, width } = useMeasure<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);

  const padL = 42;
  const padB = 20;
  const padT = 8;
  const plotW = Math.max(width - padL - 8, 0);
  const plotH = height - padB - padT;

  const max = Math.max(...data.map((d) => d.value), 0);
  const ticks = niceTicks(max, 4);
  const top = ticks[ticks.length - 1] || 1;
  const y = (v: number) => padT + plotH - (v / top) * plotH;

  const band = data.length ? plotW / data.length : 0;
  const barW = Math.min(24, Math.max(band - 4, 2));
  // Label thinning so x labels never collide.
  const every = band >= 34 ? 1 : Math.ceil(34 / Math.max(band, 1));

  return (
    <div ref={ref} className="relative w-full" style={{ height }}>
      {width > 0 && (
        <svg width={width} height={height} role="img">
          {/* gridlines + y ticks */}
          {ticks.map((t) => (
            <g key={t}>
              <line x1={padL} x2={width - 4} y1={y(t)} y2={y(t)} stroke="var(--hairline)" strokeWidth={1} />
              <text x={padL - 6} y={y(t) + 3} textAnchor="end" fontSize={10} fill="var(--mute)" fontFamily="var(--font-mono)">
                {yFormat(t)}
              </text>
            </g>
          ))}

          {data.map((d, i) => {
            const x = padL + i * band + (band - barW) / 2;
            const h = Math.max(padT + plotH - y(d.value), 0);
            const r = Math.min(4, barW / 2, h);
            const yTop = y(d.value);
            return (
              <g key={i}>
                <path
                  d={`M${x},${yTop + h} L${x},${yTop + r} Q${x},${yTop} ${x + r},${yTop} L${x + barW - r},${yTop} Q${x + barW},${yTop} ${x + barW},${yTop + r} L${x + barW},${yTop + h} Z`}
                  fill={d.color ?? color}
                  opacity={hover === null || hover === i ? 1 : 0.45}
                  style={{ transition: "opacity 150ms" }}
                />
                {i % every === 0 && (
                  <text
                    x={x + barW / 2}
                    y={height - 6}
                    textAnchor="middle"
                    fontSize={10}
                    fill="var(--mute)"
                    fontFamily="var(--font-mono)"
                  >
                    {d.label}
                  </text>
                )}
                {/* hover hit target: full band */}
                <rect
                  x={padL + i * band}
                  y={padT}
                  width={band}
                  height={plotH}
                  fill="transparent"
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                />
              </g>
            );
          })}
        </svg>
      )}
      {hover !== null && data[hover] && (
        <Tip x={padL + hover * band + band / 2} y={y(data[hover].value)}>
          <TipTitle>{data[hover].label}</TipTitle>
          <TipRow
            swatch={data[hover].color ?? color}
            label={tipLabel}
            value={yFormat(data[hover].value)}
          />
        </Tip>
      )}
      {/* keep the surface prop referenced for future ring use */}
      <span className="hidden" data-surface={surface} />
    </div>
  );
}
