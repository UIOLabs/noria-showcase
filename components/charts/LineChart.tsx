"use client";

import { useState } from "react";
import { useMeasure } from "./useMeasure";
import { niceTicks } from "./scale";
import { Tip, TipRow, TipTitle } from "./Tip";

export type LineSeries = {
  name: string;
  color: string;
  values: (number | null)[];
  /** ~10% opacity wash under the line */
  area?: boolean;
  dashed?: boolean;
};

/**
 * Multi-series line chart, one y axis (never two). 2px lines, round caps,
 * crosshair + tooltip on hover, hovered points ringed in the surface color.
 * A dashed reference line (target) is supported as annotation.
 */
export function LineChart({
  series,
  labels,
  height = 200,
  yFormat = (n: number) => String(n),
  refLine,
  yMax,
  surface = "var(--surface)",
}: {
  series: LineSeries[];
  labels: string[];
  height?: number;
  yFormat?: (n: number) => string;
  refLine?: { value: number; label?: string };
  yMax?: number;
  surface?: string;
}) {
  const { ref, width } = useMeasure<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);

  const padL = 42;
  const padB = 20;
  const padT = 8;
  const plotW = Math.max(width - padL - 10, 0);
  const plotH = height - padB - padT;

  const allValues = series.flatMap((s) => s.values.filter((v): v is number => v !== null));
  const dataMax = Math.max(...allValues, refLine?.value ?? 0, 0);
  const ticks = niceTicks(yMax ?? dataMax, 4);
  const top = ticks[ticks.length - 1] || 1;

  const n = labels.length;
  const x = (i: number) => padL + (n > 1 ? (i / (n - 1)) * plotW : plotW / 2);
  const y = (v: number) => padT + plotH - (v / top) * plotH;

  const every = n > 0 && plotW / n < 34 ? Math.ceil(34 / Math.max(plotW / n, 1)) : 1;

  function pathFor(vals: (number | null)[]): string {
    let d = "";
    vals.forEach((v, i) => {
      if (v === null) return;
      d += d === "" || vals[i - 1] === null ? `M${x(i)},${y(v)}` : `L${x(i)},${y(v)}`;
    });
    return d;
  }

  function onMove(e: React.MouseEvent<SVGRectElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const i = Math.round(((px) / Math.max(plotW, 1)) * (n - 1));
    setHover(Math.min(Math.max(i, 0), n - 1));
  }

  return (
    <div ref={ref} className="relative w-full" style={{ height }}>
      {width > 0 && (
        <svg width={width} height={height} role="img">
          {ticks.map((t) => (
            <g key={t}>
              <line x1={padL} x2={width - 6} y1={y(t)} y2={y(t)} stroke="var(--hairline)" strokeWidth={1} />
              <text x={padL - 6} y={y(t) + 3} textAnchor="end" fontSize={10} fill="var(--mute)" fontFamily="var(--font-mono)">
                {yFormat(t)}
              </text>
            </g>
          ))}

          {labels.map((l, i) =>
            i % every === 0 ? (
              <text key={i} x={x(i)} y={height - 6} textAnchor="middle" fontSize={10} fill="var(--mute)" fontFamily="var(--font-mono)">
                {l}
              </text>
            ) : null
          )}

          {refLine && (
            <g>
              <line
                x1={padL}
                x2={width - 6}
                y1={y(refLine.value)}
                y2={y(refLine.value)}
                stroke="var(--mute)"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
              {refLine.label && (
                <text x={width - 8} y={y(refLine.value) - 4} textAnchor="end" fontSize={9} fill="var(--mute)" fontFamily="var(--font-mono)">
                  {refLine.label}
                </text>
              )}
            </g>
          )}

          {series.map((s) =>
            s.area ? (
              <path
                key={`${s.name}-area`}
                d={`${pathFor(s.values)} L${x(n - 1)},${y(0)} L${x(0)},${y(0)} Z`}
                fill={s.color}
                fillOpacity={0.1}
                stroke="none"
              />
            ) : null
          )}

          {series.map((s) => (
            <path
              key={s.name}
              d={pathFor(s.values)}
              fill="none"
              stroke={s.color}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={s.dashed ? "5 5" : undefined}
            />
          ))}

          {/* crosshair + ringed points */}
          {hover !== null && (
            <g>
              <line x1={x(hover)} x2={x(hover)} y1={padT} y2={padT + plotH} stroke="var(--hairline)" strokeWidth={1} />
              {series.map((s) => {
                const v = s.values[hover];
                return v === null || v === undefined ? null : (
                  <circle key={s.name} cx={x(hover)} cy={y(v)} r={4} fill={s.color} stroke={surface} strokeWidth={2} />
                );
              })}
            </g>
          )}

          <rect
            x={padL}
            y={padT}
            width={plotW}
            height={plotH}
            fill="transparent"
            onMouseMove={onMove}
            onMouseLeave={() => setHover(null)}
          />
        </svg>
      )}

      {hover !== null && (
        <Tip x={x(hover)} y={padT + 4}>
          <TipTitle>{labels[hover]}</TipTitle>
          {series.map((s) => {
            const v = s.values[hover];
            return v === null || v === undefined ? null : (
              <TipRow key={s.name} swatch={s.color} label={s.name} value={yFormat(v)} />
            );
          })}
        </Tip>
      )}
    </div>
  );
}
