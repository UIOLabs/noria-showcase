"use client";

import { useState } from "react";
import { useMeasure } from "./useMeasure";
import { Tip, TipRow, TipTitle } from "./Tip";

export type HBarDatum = {
  label: string;
  value: number;
  color?: string;
  /** Optional right-hand direct label; defaults to formatted value. */
  valueLabel?: string;
};

/**
 * Horizontal bars — labels in an ink column on the left, value at the bar tip
 * (direct labels, per spec). Bars ≤16px, rounded data-end, square baseline.
 */
export function HBars({
  data,
  color = "var(--accent)",
  rowHeight = 30,
  labelWidth = 132,
  format = (n: number) => String(n),
  tipLabel = "",
  max,
}: {
  data: HBarDatum[];
  color?: string;
  rowHeight?: number;
  labelWidth?: number;
  format?: (n: number) => string;
  tipLabel?: string;
  max?: number;
}) {
  const { ref, width } = useMeasure<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const height = data.length * rowHeight;

  const valueSpace = 56;
  const plotW = Math.max(width - labelWidth - valueSpace, 0);
  const top = max ?? (Math.max(...data.map((d) => d.value), 0) || 1);

  return (
    <div ref={ref} className="relative w-full" style={{ height }}>
      {width > 0 && (
        <svg width={width} height={height} role="img">
          {data.map((d, i) => {
            const w = Math.max((d.value / top) * plotW, 0);
            const barH = Math.min(14, rowHeight - 12);
            const yMid = i * rowHeight + rowHeight / 2;
            const yBar = yMid - barH / 2;
            const r = Math.min(4, barH / 2, w);
            return (
              <g
                key={i}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                opacity={hover === null || hover === i ? 1 : 0.5}
                style={{ transition: "opacity 150ms" }}
              >
                <text x={labelWidth - 10} y={yMid + 4} textAnchor="end" fontSize={12} fill="var(--ink)" opacity={0.8}>
                  {d.label.length > 18 ? `${d.label.slice(0, 17)}…` : d.label}
                </text>
                <line x1={labelWidth} x2={labelWidth} y1={i * rowHeight + 4} y2={(i + 1) * rowHeight - 4} stroke="var(--hairline)" strokeWidth={1} />
                <path
                  d={`M${labelWidth},${yBar} L${labelWidth + w - r},${yBar} Q${labelWidth + w},${yBar} ${labelWidth + w},${yBar + r} L${labelWidth + w},${yBar + barH - r} Q${labelWidth + w},${yBar + barH} ${labelWidth + w - r},${yBar + barH} L${labelWidth},${yBar + barH} Z`}
                  fill={d.color ?? color}
                />
                <text x={labelWidth + w + 8} y={yMid + 4} fontSize={11} fill="var(--mute)" fontFamily="var(--font-mono)">
                  {d.valueLabel ?? format(d.value)}
                </text>
                <rect x={0} y={i * rowHeight} width={width} height={rowHeight} fill="transparent" />
              </g>
            );
          })}
        </svg>
      )}
      {hover !== null && data[hover] && (
        <Tip x={labelWidth + Math.max((data[hover].value / top) * plotW, 0) / 2} y={hover * rowHeight + 6}>
          <TipTitle>{data[hover].label}</TipTitle>
          <TipRow swatch={data[hover].color ?? color} label={tipLabel} value={data[hover].valueLabel ?? format(data[hover].value)} />
        </Tip>
      )}
    </div>
  );
}
