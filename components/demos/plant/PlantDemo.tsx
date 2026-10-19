"use client";

import { useState } from "react";
import "./plant.css";
import { ToastProvider } from "@/components/ui/Toast";
import { IntroPanel } from "@/components/annotations/IntroPanel";
import { useT } from "@/components/i18n/LocaleProvider";
import type { Text } from "@/lib/i18n";
import { TODAY_LABEL } from "./data";
import { PanelView } from "./views/PanelView";
import { FloorView } from "./views/FloorView";
import { SchedulerView } from "./views/SchedulerView";

type View = "panel" | "floor" | "sched";

const NAV: { key: View; label: Text }[] = [
  { key: "panel", label: { en: "Dashboard", es: "Panel" } },
  { key: "floor", label: { en: "Floor", es: "Planta" } },
  { key: "sched", label: { en: "Scheduler", es: "Planificador" } },
];

export function PlantDemo() {
  const [view, setView] = useState<View>("panel");
  const t = useT();

  return (
    <ToastProvider>
      <div className="demo-plant mx-auto max-w-[1600px] px-4 py-6 md:px-8">
        <IntroPanel
          kicker={t({ en: "Client build", es: "Proyecto de cliente" })}
          title={t({
            en: "Manufacturing control for a flexible-packaging plant",
            es: "Control de manufactura para una fábrica de empaques flexibles",
          })}
          points={[
            t({
              en: "Mirrors the plant's ERP as a live view of the floor.",
              es: "Refleja el ERP de la fábrica en una vista de planta en vivo.",
            }),
            t({
              en: "The scheduler plans on real machine capacity and is tested against what actually happened.",
              es: "El planificador considera la capacidad real de las máquinas y la valida contra la realidad.",
            }),
            t({ en: "Every record is demo data.", es: "Todos los registros contienen datos de demostración." }),
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
                {t({ en: "Control center", es: "Centro de control" })}
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-1 md:ml-4" aria-label={t({ en: "Plant OS views", es: "Vistas de Plant OS" })}>
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
                {t(n.label)}
              </button>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3 font-mono text-[11px]" style={{ color: "var(--pl-navy-mute)" }}>
            <span className="hidden items-center gap-2 md:flex">
              <span className="h-1.5 w-1.5 rounded-full animate-dot-pulse" style={{ background: "var(--ok)" }} />
              VETRA ERP
            </span>
            <span className="rounded-full border px-3 py-1" style={{ borderColor: "color-mix(in oklab, var(--pl-navy-ink) 20%, transparent)" }}>
              {t(TODAY_LABEL)}
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
