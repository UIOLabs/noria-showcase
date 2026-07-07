"use client";

import { useState } from "react";
import "./plant.css";
import { ToastProvider } from "@/components/ui/Toast";
import { IntroPanel } from "@/components/annotations/IntroPanel";
import { PanelView } from "./views/PanelView";
import { FloorView } from "./views/FloorView";
import { SchedulerView } from "./views/SchedulerView";

type View = "panel" | "floor" | "sched";

const NAV: { key: View; label: string }[] = [
  { key: "panel", label: "Panel" },
  { key: "floor", label: "Planta" },
  { key: "sched", label: "Planificador" },
];

// Hardcoded (not toLocaleDateString) so server/client HTML always match.
const dateLabel = "mié, 24 jun 2026";

export function PlantDemo() {
  const [view, setView] = useState<View>("panel");

  return (
    <ToastProvider>
      <div className="demo-plant mx-auto max-w-[1600px] px-4 py-6 md:px-8" lang="es">
        <IntroPanel
          kicker="Noria Plant OS"
          title="Manufacturing control for a flexible-packaging factory"
          points={[
            "Mirrors the factory's ERP into a live floor view.",
            "The scheduler plans against real machine capacity — 'vs Realidad' backtests it.",
            "Every record here is demo data.",
          ]}
        />

        {/* Product chrome */}
        <div
          className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl px-4 py-3"
          style={{ background: "var(--pl-navy)", color: "var(--pl-navy-ink)" }}
        >
          <div className="flex items-center gap-2.5">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg font-mono text-sm font-bold"
              style={{ background: "var(--pl-accent)", color: "var(--pl-accent-ink)" }}
            >
              P
            </span>
            <div className="leading-tight">
              <p className="text-[13px] font-bold tracking-wide">PLANT OS</p>
              <p className="font-mono text-[9px] uppercase tracking-[0.16em]" style={{ color: "var(--pl-navy-mute)" }}>
                Centro de control
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-1 md:ml-4" aria-label="Vistas de Plant OS">
            {NAV.map((n) => (
              <button
                key={n.key}
                type="button"
                onClick={() => setView(n.key)}
                className="rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors"
                style={
                  view === n.key
                    ? { background: "color-mix(in oklab, var(--pl-navy-ink) 14%, transparent)", color: "var(--pl-navy-ink)" }
                    : { color: "var(--pl-navy-mute)" }
                }
              >
                {n.label}
              </button>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3 font-mono text-[11px]" style={{ color: "var(--pl-navy-mute)" }}>
            <span className="hidden items-center gap-2 md:flex">
              <span className="h-1.5 w-1.5 rounded-full animate-dot-pulse" style={{ background: "var(--ok)" }} />
              VETRA ERP
            </span>
            <span className="rounded-full border px-3 py-1" style={{ borderColor: "color-mix(in oklab, var(--pl-navy-ink) 20%, transparent)" }}>
              {dateLabel}
            </span>
          </div>
        </div>

        <div className="mt-4">
          {view === "panel" && <PanelView />}
          {view === "floor" && <FloorView />}
          {view === "sched" && <SchedulerView />}
        </div>
      </div>
    </ToastProvider>
  );
}
