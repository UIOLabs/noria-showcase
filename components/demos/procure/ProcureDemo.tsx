"use client";

import "./procure.css";
import { AnimatePresence, motion } from "motion/react";
import { IntroPanel } from "@/components/annotations/IntroPanel";
import { ToastProvider } from "@/components/ui/Toast";
import { ProcureProvider, useProcure, type View } from "./state";
import { ProcureModals } from "./modals";
import { Centro } from "./views/Centro";
import { Bandeja } from "./views/Bandeja";
import { Detalle } from "./views/Detalle";
import { Automatizaciones } from "./views/Automatizaciones";

export function ProcureDemo() {
  return (
    <ToastProvider>
      <ProcureProvider>
        <ProcureInner />
      </ProcureProvider>
    </ToastProvider>
  );
}

const NAV: { id: View; label: string; icon: string }[] = [
  { id: "centro", label: "Centro SIGA", icon: "⌂" },
  { id: "bandeja", label: "Bandeja", icon: "▦" },
  { id: "automatizaciones", label: "Automatizaciones", icon: "◎" },
];

const TITLES: Record<View, { title: string; sub: string }> = {
  centro: { title: "Centro de compras", sub: "Sincronizado con SIGA ERP · datos de demostración" },
  bandeja: { title: "Bandeja de solicitudes", sub: "Todas las colas · filtra, compara y decide" },
  detalle: { title: "Detalle del caso", sub: "Cotizaciones, recomendación y auditoría" },
  automatizaciones: { title: "Automatizaciones", sub: "Reglas de auto-aprobación con tolerancias" },
};

function ProcureInner() {
  const { view, go, selected, role, toggleRole, startTour } = useProcure();
  const activeNav = view === "detalle" ? "bandeja" : view;
  const heading = TITLES[view];

  return (
    <div className="demo-procure mx-auto max-w-[1600px] px-4 py-6 md:px-8" lang="es">
      <IntroPanel
        kicker="Noria Procure"
        title="Procurement copilot"
        points={[
          "Reads purchase requests straight from the client's ERP.",
          "AI recommends, explains, drafts, and leaves an audit trail.",
          "Fully clickable — every record here is demo data.",
        ]}
      />

      <div className="grid gap-5 lg:grid-cols-[236px_1fr]">
        {/* ---- Sidebar ---- */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-hairline bg-surface p-3">
            <div className="flex items-center gap-2.5 px-2 py-2">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[15px] font-black"
                style={{ background: "var(--pr-brand)", color: "var(--pr-brand-ink)" }}
              >
                P
              </span>
              <div className="min-w-0">
                <p className="truncate text-[13.5px] font-bold tracking-tight">Noria Procure</p>
                <p className="truncate text-[10.5px] text-mute">Centro de compras SIGA</p>
              </div>
            </div>

            <nav className="mt-2 flex gap-1 lg:flex-col" aria-label="Secciones del producto">
              {NAV.map((n) => {
                const active = activeNav === n.id;
                return (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => go(n.id)}
                    className={`flex flex-1 items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium transition-colors lg:flex-none ${
                      active ? "pr-nav-active" : "text-mute hover:bg-surface-2 hover:text-ink"
                    }`}
                    style={active ? { color: "var(--pr-brand)" } : undefined}
                    aria-current={active ? "page" : undefined}
                  >
                    <span className="w-4 text-center">{n.icon}</span>
                    <span className="hidden sm:inline">{n.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-3 hidden rounded-xl border border-dashed border-hairline p-3 lg:block">
              <p className="tag !text-[9px]">Modo demo</p>
              <p className="mt-1 text-[11px] leading-relaxed text-mute">
                Sin backend: la IA es determinística y los datos son ficticios.
              </p>
              <button
                type="button"
                onClick={startTour}
                className="mt-2 w-full rounded-lg py-1.5 text-[11.5px] font-semibold transition-transform active:scale-[0.98]"
                style={{ background: "var(--pr-brand-soft)", color: "var(--pr-brand)", border: "1px solid var(--pr-brand-border)" }}
              >
                Demo guiada ▸
              </button>
            </div>
          </div>
        </aside>

        {/* ---- Workspace ---- */}
        <div className="min-w-0">
          {/* Topbar */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold tracking-tight md:text-xl">
                {heading.title}
                {view === "detalle" && selected ? (
                  <span className="text-mute"> · {selected.id}</span>
                ) : null}
              </h1>
              <p className="truncate text-[12px] text-mute">{heading.sub}</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="hidden items-center gap-2 rounded-full border border-hairline px-3 py-1.5 text-[11.5px] text-mute md:inline-flex">
                <span className="h-1.5 w-1.5 rounded-full animate-dot-pulse" style={{ background: "var(--ok)" }} />
                SIGA conectado · 08:48
              </span>
              <button
                type="button"
                onClick={toggleRole}
                className="rounded-full border border-hairline px-3 py-1.5 text-[11.5px] font-medium text-ink transition-colors hover:border-ink/40"
              >
                Vista: {role} ⇄
              </button>
            </div>
          </div>

          {/* View */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={view === "detalle" ? `detalle-${selected?.id ?? "none"}` : view}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              {view === "centro" && <Centro />}
              {view === "bandeja" && <Bandeja />}
              {view === "detalle" && <Detalle />}
              {view === "automatizaciones" && <Automatizaciones />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <ProcureModals />
    </div>
  );
}
