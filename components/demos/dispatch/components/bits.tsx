"use client";

import type { ReactNode } from "react";
import type { Tone } from "../data";

const TONE_COLOR: Record<Tone, string> = {
  ok: "var(--ok)",
  warn: "var(--warn)",
  danger: "var(--danger)",
  mute: "var(--mute)",
};

/** Dot + uppercase mono label. Identity = dot color + text, never color alone. */
export function StatusChip({
  tone,
  label,
  pulse = false,
}: {
  tone: Tone;
  label: string;
  pulse?: boolean;
}) {
  const c = TONE_COLOR[tone];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink/80"
      style={{ background: `color-mix(in oklab, ${c} 10%, transparent)` }}
    >
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${pulse ? "animate-dot-pulse" : ""}`}
        style={{ background: c }}
      />
      {label}
    </span>
  );
}

export function PageHead({
  eyebrow,
  title,
  desc,
  actions,
}: {
  eyebrow: string;
  title: string;
  desc?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="tag">{eyebrow}</p>
        <h2 className="mt-1.5 text-[28px] font-light tracking-tight md:text-[32px]">{title}</h2>
        {desc && <p className="mt-1 max-w-xl text-[13px] text-mute">{desc}</p>}
      </div>
      {actions}
    </div>
  );
}

export function SectionLabel({ children, accessory }: { children: ReactNode; accessory?: ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <span className="tag">{children}</span>
      {accessory}
    </div>
  );
}

export function KV({ k, v }: { k: string; v: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 border-t border-hairline py-2.5">
      <span className="text-[11px] text-mute">{k}</span>
      <span className="font-mono text-[13px] tabular-nums text-ink">{v}</span>
    </div>
  );
}

export function GhostButton({
  children,
  onClick,
  disabled = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-full border border-hairline px-4 py-1.5 text-[13px] font-medium text-ink transition-colors hover:border-ink/40 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

export function SolidButton({
  children,
  onClick,
  disabled = false,
  danger = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-full px-4 py-1.5 text-[13px] font-medium transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      style={{
        background: danger ? "var(--danger)" : "var(--accent)",
        color: "var(--bg)",
      }}
    >
      {children}
    </button>
  );
}
