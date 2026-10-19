"use client";

import { useEffect, useRef, useState } from "react";
import { useT } from "@/components/i18n/LocaleProvider";
import type { Text } from "@/lib/i18n";
import { isAutomatable } from "../ai";
import { REQUESTS, SYNC_EVENTS, recommendedQuote, useFmt, type Formatters } from "../data";
import { BrandButton, Panel, PanelHead, QueueBadge, RiskBadge, StatusBadge } from "../bits";
import { useProcure, type Filters } from "../state";

export function Centro() {
  const { openDetail, go, setFilters, startTour, decisions, rules } = useProcure();

  const t = useT();
  const fmt = useFmt();
  const { fmtUSD } = fmt;
  const kpis = buildKpis(fmt);
  const priority = REQUESTS.slice(0, 6);

  return (
    <div className="space-y-5">
      {/* Hero + console */}
      <div className="grid gap-5 xl:grid-cols-[1.15fr_1fr]">
        <div
          className="relative flex flex-col justify-between overflow-hidden rounded-2xl p-7 md:p-9"
          style={{ background: "var(--pr-hero-grad)" }}
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">
              {t({ en: "Purchasing hub · SIGA ERP", es: "Centro de compras · SIGA ERP" })}
            </span>
            <h2 className="mt-3 max-w-md text-2xl font-semibold leading-snug tracking-tight text-white md:text-[28px]">
              {t({ en: "Purchasing, turned into clear decisions.", es: "Compras convertidas en decisiones claras." })}
            </h2>
            <p className="mt-3 max-w-md text-[13.5px] leading-relaxed text-white/80">
              {t({
                en: "SIGA stays the system of record. Procure syncs, compares, recommends, and leaves an audit trail behind every decision.",
                es: "SIGA sigue siendo el sistema origen. Procure sincroniza, compara, recomienda y deja auditoría de cada decisión.",
              })}
            </p>
          </div>
          <div className="mt-7 flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={startTour}
              className="rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-[#8d1b27] transition-transform active:scale-[0.98] hover:opacity-90"
            >
              {t({ en: "Start the tour ▸", es: "Iniciar recorrido ▸" })}
            </button>
            <button
              type="button"
              onClick={() => {
                setFilters({ queue: "alerta", risk: "todos", q: "" });
                go("bandeja");
              }}
              className="rounded-full border border-white/40 px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:border-white"
            >
              {t({ en: "See price alerts", es: "Ver alertas de precio" })}
            </button>
          </div>
        </div>

        <SyncConsole />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {kpis.map((k) => (
          <button
            key={k.label.en}
            type="button"
            onClick={() => {
              setFilters(k.filter);
              go("bandeja");
            }}
            className="group rounded-2xl border border-hairline bg-surface p-4 text-left transition-colors hover:border-ink/30"
          >
            <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-mute">
              {t(k.label)}
            </span>
            <span className="mt-1.5 block text-2xl font-semibold tracking-tight" style={k.accent ? { color: "var(--pr-brand)" } : undefined}>
              {k.value}
            </span>
            <span className="mt-0.5 block text-[11.5px] text-mute">{t(k.sub)}</span>
          </button>
        ))}
      </div>

      {/* Priority + rules preview */}
      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <Panel>
          <PanelHead
            title={t({ en: "Today's priorities", es: "Prioridad de hoy" })}
            sub={t({
              en: "The 6 cases the copilot suggests resolving first",
              es: "Los 6 casos que el copiloto sugiere resolver primero",
            })}
            right={
              <BrandButton small variant="soft" onClick={() => go("bandeja")}>
                {t({ en: "Open the full inbox", es: "Ver bandeja completa" })}
              </BrandButton>
            }
          />
          <ul className="divide-y divide-[var(--hairline)]">
            {priority.map((r, i) => {
              const q = recommendedQuote(r);
              const decided = decisions[r.id];
              return (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => openDetail(r.id)}
                    className="flex w-full items-center gap-4 px-5 py-3.5 text-left transition-colors hover:bg-surface-2"
                  >
                    <span className="font-mono text-[11px] text-mute">{String(i + 1).padStart(2, "0")}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13.5px] font-medium">{t(r.material.name)}</span>
                      <span className="mt-0.5 block truncate text-[11.5px] text-mute">
                        {r.id} · {t(r.scenario)}
                      </span>
                    </span>
                    <span className="hidden font-mono text-[12px] tabular-nums text-mute md:block">
                      {q ? fmtUSD(q.unitPrice * r.request.quantity) : "—"}
                    </span>
                    {decided ? <StatusBadge status={decided} /> : <RiskBadge risk={r.recommendation.risk} />}
                    <span className="text-mute">▸</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </Panel>

        <Panel className="flex flex-col">
          <PanelHead
            title={t({ en: "Smart rules", es: "Reglas inteligentes" })}
            sub={t({ en: "Repeat purchases that approve themselves", es: "Compras repetitivas que se aprueban solas" })}
            right={
              <BrandButton small variant="soft" onClick={() => go("automatizaciones")}>
                {t({ en: "Manage", es: "Administrar" })}
              </BrandButton>
            }
          />
          <div className="flex-1 space-y-3 p-5">
            {rules.slice(0, 2).map((rule) => (
              <div key={rule.id} className="rounded-xl border border-hairline bg-canvas p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] text-mute">{rule.id}</span>
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                    style={{ background: "var(--pr-ok-soft)", color: "var(--ok)" }}
                  >
                    {t({ en: "Active", es: "Activa" })}
                  </span>
                </div>
                <p className="mt-1.5 text-[13px] font-medium leading-snug">{t(rule.material)}</p>
                <p className="mt-1 text-[11.5px] text-mute">
                  {rule.supplier} · {t(rule.tolerance)} · {t({ en: "cap", es: "tope" })} {fmtUSD(rule.maxAuto)}
                </p>
              </div>
            ))}
            <p className="text-[11.5px] leading-relaxed text-mute">
              {t({
                en: `${REQUESTS.filter((r) => isAutomatable(r)).length} requests in the current inbox qualify for a new rule.`,
                es: `${REQUESTS.filter((r) => isAutomatable(r)).length} solicitudes de la bandeja actual califican para una regla nueva.`,
              })}
            </p>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function SyncConsole() {
  const t = useT();
  const [count, setCount] = useState(4);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => {
      setCount((c) => (c >= SYNC_EVENTS.length ? c : c + 1));
    }, 1500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [count]);

  const lines = SYNC_EVENTS.slice(0, count);
  const done = count >= SYNC_EVENTS.length;

  return (
    <div className="pr-console flex flex-col overflow-hidden rounded-2xl">
      <div className="flex items-center gap-2.5 border-b border-white/10 px-5 py-3">
        <span
          className={`h-2 w-2 rounded-full ${done ? "" : "animate-dot-pulse"}`}
          style={{ background: "var(--ok)" }}
        />
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--pr-dark-mute)]">
          {t({ en: "SIGA sync", es: "Sincronización SIGA" })}
        </span>
        <span className="ml-auto font-mono text-[10px] text-[var(--pr-dark-mute)]">
          {done ? t({ en: "up to date", es: "al día" }) : t({ en: "reading…", es: "leyendo…" })}
        </span>
      </div>
      <div ref={bodyRef} className="pr-console-body h-56 flex-1 overflow-y-auto px-5 py-3 xl:h-auto">
        {lines.map(t).map((l, i) => (
          <div key={l} className={i === lines.length - 1 ? "animate-row-enter" : undefined}>
            <span style={{ color: "var(--ok)" }}>▸</span>{" "}
            <span className="text-[var(--pr-dark-mute)]">{l.slice(0, 10)}</span>
            <span className="text-[var(--pr-dark-ink)]">{l.slice(10)}</span>
          </div>
        ))}
        {!done && <span className="inline-block h-3.5 w-1.5 animate-pulse bg-[var(--pr-dark-mute)]" />}
      </div>
    </div>
  );
}

function buildKpis({ fmtUSD }: Formatters): { label: Text; value: string; sub: Text; filter: Filters; accent: boolean }[] {
  const active = REQUESTS.length;
  const porAprobar = REQUESTS.filter((r) => r.queue === "aprobacion").length;
  const faltanCot = REQUESTS.filter((r) => r.quotes.length < 3).length;
  const auto = REQUESTS.filter((r) => isAutomatable(r)).length;
  const ahorro = REQUESTS.reduce((acc, r) => {
    const rec = recommendedQuote(r);
    if (!rec || r.quotes.length < 2) return acc;
    const worst = Math.max(...r.quotes.map((q) => q.unitPrice));
    return acc + (worst - rec.unitPrice) * r.request.quantity;
  }, 0);

  return [
    {
      label: { en: "Active requests", es: "Solicitudes activas" },
      value: String(active),
      sub: { en: "synced from SIGA", es: "sincronizadas desde SIGA" },
      filter: { queue: "todas", risk: "todos", q: "" },
      accent: false,
    },
    {
      label: { en: "To approve", es: "Por aprobar" },
      value: String(porAprobar),
      sub: { en: "with a complete case file", es: "con expediente completo" },
      filter: { queue: "aprobacion", risk: "todos", q: "" },
      accent: false,
    },
    {
      label: { en: "Missing quotes", es: "Faltan cotizaciones" },
      value: String(faltanCot),
      sub: { en: "under the 3-quote policy", es: "bajo la política de 3 ofertas" },
      filter: { queue: "cotizacion", risk: "todos", q: "" },
      accent: false,
    },
    {
      label: { en: "Automatable", es: "Automatizables" },
      value: String(auto),
      sub: { en: "rule candidates", es: "candidatas a regla" },
      filter: { queue: "repetitiva", risk: "todos", q: "" },
      accent: false,
    },
    {
      label: { en: "Estimated savings", es: "Ahorro estimado" },
      value: fmtUSD(Math.round(ahorro)),
      sub: { en: "vs. the month's worst offer", es: "vs. peor oferta del mes" },
      filter: { queue: "todas", risk: "todos", q: "" },
      accent: true,
    },
  ];
}
