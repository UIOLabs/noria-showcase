"use client";

/* Small presentational pieces shared across Procure views. */

import type { QueueId, Risk } from "./data";
import { QUEUE_LABELS } from "./data";

export function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-2xl border border-hairline bg-surface ${className}`}>
      {children}
    </section>
  );
}

export function PanelHead({
  title,
  sub,
  right,
}: {
  title: string;
  sub?: string;
  right?: React.ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline px-5 py-3.5">
      <div>
        <h3 className="text-[15px] font-semibold tracking-tight">{title}</h3>
        {sub && <p className="mt-0.5 text-[12px] text-mute">{sub}</p>}
      </div>
      {right}
    </header>
  );
}

const RISK_STYLE: Record<Risk, { bg: string; fg: string }> = {
  Bajo: { bg: "var(--pr-ok-soft)", fg: "var(--ok)" },
  Medio: { bg: "var(--pr-warn-soft)", fg: "var(--warn)" },
  Alto: { bg: "var(--pr-danger-soft)", fg: "var(--danger)" },
};

export function RiskBadge({ risk }: { risk: Risk }) {
  const s = RISK_STYLE[risk];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
      style={{ background: s.bg, color: s.fg }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.fg }} />
      Riesgo {risk.toLowerCase()}
    </span>
  );
}

export function QueueBadge({ queue }: { queue: QueueId }) {
  return (
    <span className="inline-flex items-center rounded-full border border-hairline px-2.5 py-0.5 text-[11px] text-mute">
      {QUEUE_LABELS[queue]}
    </span>
  );
}

export function StatusBadge({ status }: { status: "aprobada" | "devuelta" }) {
  const ok = status === "aprobada";
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
      style={{
        background: ok ? "var(--pr-ok-soft)" : "var(--pr-danger-soft)",
        color: ok ? "var(--ok)" : "var(--danger)",
      }}
    >
      {ok ? "✓ Aprobada" : "↩ Devuelta"}
    </span>
  );
}

export function KV({ k, v, mono = false }: { k: string; v: React.ReactNode; mono?: boolean }) {
  return (
    <div className="rounded-xl border border-hairline bg-canvas px-3 py-2.5">
      <dt className="text-[10px] font-medium uppercase tracking-[0.12em] text-mute">{k}</dt>
      <dd className={`mt-0.5 truncate text-[13px] text-ink ${mono ? "font-mono tabular-nums" : "font-medium"}`}>
        {v}
      </dd>
    </div>
  );
}

export function BrandButton({
  children,
  onClick,
  variant = "solid",
  className = "",
  small = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "solid" | "soft" | "ghost";
  className?: string;
  small?: boolean;
}) {
  const base = `inline-flex items-center justify-center gap-1.5 rounded-full font-semibold tracking-tight transition-all active:scale-[0.98] ${
    small ? "px-3 py-1.5 text-[12px]" : "px-4 py-2 text-[13px]"
  }`;
  const styles: Record<string, React.CSSProperties> = {
    solid: { background: "var(--pr-brand)", color: "var(--pr-brand-ink)" },
    soft: { background: "var(--pr-brand-soft)", color: "var(--pr-brand)", border: "1px solid var(--pr-brand-border)" },
    ghost: {},
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} ${variant === "ghost" ? "border border-hairline text-ink hover:border-ink/40" : "hover:opacity-90"} ${className}`}
      style={styles[variant]}
    >
      {children}
    </button>
  );
}

export function AiMark() {
  return (
    <span
      className="inline-flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-black"
      style={{ background: "var(--pr-brand)", color: "var(--pr-brand-ink)" }}
    >
      ◈
    </span>
  );
}
