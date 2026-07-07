"use client";

import type { ReactNode } from "react";

/** Floating tooltip box positioned inside a chart container (which must be
 *  `position: relative; overflow: visible`). Values are text-ink; identity
 *  comes from the swatch, never from coloring the text. */
export function Tip({
  x,
  y,
  children,
}: {
  x: number;
  y: number;
  children: ReactNode;
}) {
  return (
    <div
      className="pointer-events-none absolute z-20 min-w-28 rounded-lg border border-hairline bg-surface px-3 py-2"
      style={{
        left: x,
        top: y,
        transform: "translate(-50%, calc(-100% - 10px))",
      }}
    >
      {children}
    </div>
  );
}

export function TipRow({
  swatch,
  label,
  value,
}: {
  swatch?: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 whitespace-nowrap text-[12px]">
      {swatch && (
        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ background: swatch }}
        />
      )}
      <span className="text-mute">{label}</span>
      <span className="ml-auto pl-3 font-mono tabular-nums text-ink">{value}</span>
    </div>
  );
}

export function TipTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-mute">
      {children}
    </div>
  );
}
