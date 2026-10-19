"use client";

import "./procure.css";
import { AnimatePresence, motion } from "motion/react";
import { IntroPanel } from "@/components/annotations/IntroPanel";
import { ToastProvider } from "@/components/ui/Toast";
import { useT } from "@/components/i18n/LocaleProvider";
import type { Text } from "@/lib/i18n";
import { ProcureProvider, ROLE_LABEL, useProcure, type View } from "./state";
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

const NAV: { id: View; label: Text; icon: string }[] = [
  { id: "centro", label: { en: "SIGA hub", es: "Centro SIGA" }, icon: "⌂" },
  { id: "bandeja", label: { en: "Inbox", es: "Bandeja" }, icon: "▦" },
  { id: "automatizaciones", label: { en: "Automations", es: "Automatizaciones" }, icon: "◎" },
];

const TITLES: Record<View, { title: Text; sub: Text }> = {
  centro: {
    title: { en: "Purchasing hub", es: "Centro de compras" },
    sub: { en: "Synced with SIGA ERP · demo data", es: "Sincronizado con SIGA ERP · datos de demostración" },
  },
  bandeja: {
    title: { en: "Request inbox", es: "Bandeja de solicitudes" },
    sub: { en: "Every queue · filter, compare and decide", es: "Todas las colas · filtra, compara y decide" },
  },
  detalle: {
    title: { en: "Case detail", es: "Detalle del caso" },
    sub: { en: "Quotes, recommendation and audit trail", es: "Cotizaciones, recomendación y auditoría" },
  },
  automatizaciones: {
    title: { en: "Automations", es: "Automatizaciones" },
    sub: { en: "Auto-approval rules with tolerances", es: "Reglas de auto-aprobación con tolerancias" },
  },
};

function ProcureInner() {
  const { view, go, selected, role, toggleRole, startTour } = useProcure();
  const activeNav = view === "detalle" ? "bandeja" : view;
  const heading = TITLES[view];
  const t = useT();

  return (
    <div className="demo-procure mx-auto max-w-[1600px] px-4 py-6 md:px-8">
      <IntroPanel
        kicker={t({ en: "Client build", es: "Proyecto de cliente" })}
        title={t({ en: "Procurement copilot for a manufacturer", es: "Copiloto de compras para un fabricante" })}
        points={[
          t({
            en: "Reads purchase requests straight from the client's ERP.",
            es: "Lee las solicitudes de compra directamente del ERP del cliente.",
          }),
          t({
            en: "The AI recommends, explains, drafts, and leaves an audit trail.",
            es: "La IA recomienda, explica, redacta y deja un rastro de auditoría.",
          }),
          t({
            en: "Everything is clickable and every record is demo data.",
            es: "Todo es interactivo y cada registro contiene datos de demostración.",
          }),
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
                <p className="truncate text-[13.5px] font-bold tracking-tight">Procure</p>
                <p className="truncate text-[10.5px] text-mute">{t({ en: "SIGA purchasing hub", es: "Centro de compras SIGA" })}</p>
              </div>
            </div>

            <nav className="mt-2 flex gap-1 lg:flex-col" aria-label={t({ en: "Sections", es: "Secciones" })}>
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
                    <span className="hidden sm:inline">{t(n.label)}</span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-3 hidden rounded-xl border border-dashed border-hairline p-3 lg:block">
              <p className="tag !text-[9px]">{t({ en: "Demo mode", es: "Modo demo" })}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-mute">
                {t({
                  en: "No backend: the AI is deterministic and the data is fictional.",
                  es: "Sin backend: la IA es determinística y los datos son ficticios.",
                })}
              </p>
              <button
                type="button"
                onClick={startTour}
                className="mt-2 w-full rounded-lg py-1.5 text-[11.5px] font-semibold transition-transform active:scale-[0.98]"
                style={{ background: "var(--pr-brand-soft)", color: "var(--pr-brand)", border: "1px solid var(--pr-brand-border)" }}
              >
                {t({ en: "Guided demo ▸", es: "Demo guiado ▸" })}
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
                {t(heading.title)}
                {view === "detalle" && selected ? (
                  <span className="text-mute"> · {selected.id}</span>
                ) : null}
              </h1>
              <p className="truncate text-[12px] text-mute">{t(heading.sub)}</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="hidden items-center gap-2 rounded-full border border-hairline px-3 py-1.5 text-[11.5px] text-mute md:inline-flex">
                <span className="h-1.5 w-1.5 rounded-full animate-dot-pulse" style={{ background: "var(--ok)" }} />
                {t({ en: "SIGA connected · 08:48", es: "SIGA conectado · 08:48" })}
              </span>
              <button
                type="button"
                onClick={toggleRole}
                className="rounded-full border border-hairline px-3 py-1.5 text-[11.5px] font-medium text-ink transition-colors hover:border-ink/40"
              >
                {t({ en: "View", es: "Vista" })}: {t(ROLE_LABEL[role])} ⇄
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
