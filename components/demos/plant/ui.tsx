"use client";

import { useEffect, useState } from "react";

/** Fake first-load: views shimmer briefly before data "arrives". */
export function useLoaded(ms = 600) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), ms);
    return () => clearTimeout(t);
  }, [ms]);
  return loaded;
}

export function Panel({
  title,
  accessory,
  children,
  className = "",
  bodyClassName = "",
}: {
  title?: string;
  accessory?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={`pl-panel overflow-hidden ${className}`}>
      {title && (
        <header className="flex items-center justify-between gap-3 border-b border-hairline px-4 py-3">
          <h3 className="font-mono text-[10px] uppercase tracking-[0.16em] text-mute">{title}</h3>
          {accessory}
        </header>
      )}
      <div className={bodyClassName || "p-4"}>{children}</div>
    </section>
  );
}

export function Dot({ color, pulse = false }: { color: string; pulse?: boolean }) {
  return (
    <span
      className={`inline-block h-2 w-2 shrink-0 rounded-full ${pulse ? "pl-health" : ""}`}
      style={{ background: color, ["--dot" as string]: color }}
    />
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-shimmer rounded-xl bg-surface-2 ${className}`} />;
}

export function SkeletonView() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
      <Skeleton className="h-72" />
    </div>
  );
}

/** KPI card with threshold coloring on the big value. */
export function KpiCard({
  label,
  value,
  sub,
  tone = "ink",
  pill,
  pillTone = "ok",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "ink" | "ok" | "warn" | "danger";
  pill?: string;
  pillTone?: "ok" | "warn" | "danger";
}) {
  const toneColor =
    tone === "ok" ? "var(--ok)" : tone === "warn" ? "var(--warn)" : tone === "danger" ? "var(--danger)" : "var(--ink)";
  const pillColor = pillTone === "ok" ? "var(--ok)" : pillTone === "warn" ? "var(--warn)" : "var(--danger)";
  return (
    <div className="pl-panel p-4">
      <div className="flex items-start justify-between gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-mute">{label}</span>
        {pill && (
          <span
            className="rounded-full px-2 py-0.5 font-mono text-[10px] tabular-nums"
            style={{ color: pillColor, background: `color-mix(in oklab, ${pillColor} 14%, transparent)` }}
          >
            {pill}
          </span>
        )}
      </div>
      <div className="mt-2 text-[26px] font-semibold leading-none tracking-tight" style={{ color: toneColor }}>
        {value}
      </div>
      {sub && <div className="mt-2 text-[12px] text-mute">{sub}</div>}
    </div>
  );
}

/** Small stat chip used on the floor / scheduler action bars. */
export function StatChip({
  label,
  value,
  tone,
  onClick,
  active = false,
}: {
  label: string;
  value: string;
  tone?: "ok" | "warn" | "danger";
  onClick?: () => void;
  active?: boolean;
}) {
  const color =
    tone === "ok" ? "var(--ok)" : tone === "warn" ? "var(--warn)" : tone === "danger" ? "var(--danger)" : "var(--ink)";
  return (
    <button
      type="button"
      onClick={onClick}
      data-active={active}
      className={`pl-panel flex min-w-[104px] flex-col items-start gap-1 px-3.5 py-2.5 text-left transition-colors ${
        onClick ? "cursor-pointer hover:border-ink/30" : "cursor-default"
      }`}
    >
      <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-mute">{label}</span>
      <span className="font-mono text-lg font-semibold leading-none tabular-nums" style={{ color }}>
        {value}
      </span>
    </button>
  );
}

/** Estado badge (tabla de órdenes). */
export function EstadoBadge({ estado }: { estado: string }) {
  const map: Record<string, { c: string; bg: boolean }> = {
    "En producción": { c: "var(--ok)", bg: true },
    "Pendiente OP": { c: "var(--warn)", bg: true },
    "Por crear OP": { c: "var(--warn)", bg: true },
    Atrasada: { c: "var(--danger)", bg: true },
    "En cola": { c: "var(--mute)", bg: true },
    Cotizado: { c: "var(--info)", bg: true },
    Operativa: { c: "var(--ok)", bg: true },
    "En cambio": { c: "var(--warn)", bg: true },
    Mantenimiento: { c: "var(--mute)", bg: true },
  };
  const s = map[estado] ?? { c: "var(--mute)", bg: true };
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide"
      style={{ color: s.c, background: `color-mix(in oklab, ${s.c} 12%, transparent)` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.c }} />
      {estado}
    </span>
  );
}
