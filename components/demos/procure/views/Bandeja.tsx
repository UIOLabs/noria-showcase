"use client";

import { useMemo } from "react";
import { Spotlight } from "@/components/annotations/Spotlight";
import { isAutomatable } from "../ai";
import {
  fmtUSD,
  QUEUE_LABELS,
  REQUESTS,
  recommendedQuote,
  type PurchaseRequest,
  type QueueId,
  type Risk,
} from "../data";
import { AiMark, BrandButton, QueueBadge, RiskBadge, StatusBadge } from "../bits";
import { useProcure } from "../state";

const QUEUE_OPTIONS: (QueueId | "todas")[] = [
  "todas",
  "cotizacion",
  "aprobacion",
  "repetitiva",
  "alerta",
  "sinhistorial",
];

export function Bandeja() {
  const { filters, setFilters, density, setDensity } = useProcure();

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    return REQUESTS.filter((r) => {
      if (filters.queue !== "todas" && r.queue !== filters.queue) return false;
      if (filters.risk !== "todos" && r.recommendation.risk !== filters.risk) return false;
      if (
        q &&
        ![r.id, r.material.name, r.material.code, r.request.requester, r.request.area]
          .join(" ")
          .toLowerCase()
          .includes(q)
      )
        return false;
      return true;
    });
  }, [filters]);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="sticky top-16 z-30 -mx-1 rounded-2xl border border-hairline bg-canvas/90 px-4 py-3 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-44 flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mute">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </span>
            <input
              type="search"
              value={filters.q}
              onChange={(e) => setFilters({ q: e.target.value })}
              placeholder="Buscar material, código, solicitante…"
              className="w-full rounded-xl border border-hairline bg-surface py-2 pl-9 pr-3 text-[13px] text-ink placeholder:text-mute/70 transition-colors focus:border-[var(--pr-brand)] focus:outline-none"
            />
          </div>
          <select
            value={filters.queue}
            onChange={(e) => setFilters({ queue: e.target.value as QueueId | "todas" })}
            className="rounded-xl border border-hairline bg-surface px-3 py-2 text-[13px] text-ink focus:border-[var(--pr-brand)] focus:outline-none"
            aria-label="Filtrar por cola"
          >
            <option value="todas">Cola · todas</option>
            {QUEUE_OPTIONS.slice(1).map((qid) => (
              <option key={qid} value={qid}>
                {QUEUE_LABELS[qid as QueueId]}
              </option>
            ))}
          </select>
          <select
            value={filters.risk}
            onChange={(e) => setFilters({ risk: e.target.value as Risk | "todos" })}
            className="rounded-xl border border-hairline bg-surface px-3 py-2 text-[13px] text-ink focus:border-[var(--pr-brand)] focus:outline-none"
            aria-label="Filtrar por riesgo"
          >
            <option value="todos">Riesgo · todos</option>
            <option value="Bajo">Bajo</option>
            <option value="Medio">Medio</option>
            <option value="Alto">Alto</option>
          </select>
          <div className="ml-auto flex items-center rounded-xl border border-hairline p-0.5">
            {(["detallada", "compacta"] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDensity(d)}
                className={`rounded-[10px] px-3 py-1.5 text-[12px] font-medium capitalize transition-colors ${
                  density === d ? "text-[color:var(--pr-brand-ink)]" : "text-mute hover:text-ink"
                }`}
                style={density === d ? { background: "var(--pr-brand)" } : undefined}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-[1fr_300px]">
        {/* Cards */}
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-hairline p-14 text-center">
            <p className="text-[14px] font-medium">Sin resultados con estos filtros</p>
            <p className="mt-1 text-[12.5px] text-mute">Prueba limpiar la búsqueda o cambiar la cola.</p>
            <BrandButton
              small
              variant="soft"
              className="mt-4"
              onClick={() => setFilters({ q: "", queue: "todas", risk: "todos" })}
            >
              Limpiar filtros
            </BrandButton>
          </div>
        ) : (
          <div
            className={`grid gap-3.5 ${
              density === "compacta" ? "md:grid-cols-2 2xl:grid-cols-3" : "md:grid-cols-2"
            }`}
          >
            {filtered.map((r) => (
              <RequestCard key={r.id} r={r} compact={density === "compacta"} />
            ))}
          </div>
        )}

        {/* Copiloto side panel */}
        <CopilotoPanel filteredCount={filtered.length} />
      </div>
    </div>
  );
}

function RequestCard({ r, compact }: { r: PurchaseRequest; compact: boolean }) {
  const { openDetail, decisions } = useProcure();
  const q = recommendedQuote(r);
  const decided = decisions[r.id];

  return (
    <button
      type="button"
      onClick={() => openDetail(r.id)}
      className="group flex flex-col rounded-2xl border border-hairline bg-surface p-4 text-left transition-all hover:border-[var(--pr-brand-border)] hover:bg-surface-2"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] text-mute">{r.id}</span>
        {decided ? <StatusBadge status={decided} /> : <RiskBadge risk={r.recommendation.risk} />}
      </div>
      <h4 className="mt-2 text-[14px] font-semibold leading-snug tracking-tight">{r.material.name}</h4>
      <p className="mt-1 text-[12px] text-mute">
        {r.request.quantity} {r.material.unit} · {r.request.area} · {r.request.requester}
      </p>
      {!compact && (
        <p className="mt-2 line-clamp-2 text-[12.5px] leading-relaxed text-ink/70">
          {r.request.observation}
        </p>
      )}
      <div className="mt-3 flex items-center gap-2 border-t border-hairline pt-3">
        <AiMark />
        <span className="min-w-0 flex-1 truncate text-[12px] text-ink/75">
          {q ? (
            <>
              Sugerido: <strong className="font-semibold">{r.recommendation.supplier}</strong> ·{" "}
              {fmtUSD(q.unitPrice * r.request.quantity)}
            </>
          ) : (
            "Sin cotizaciones aún"
          )}
        </span>
        <QueueBadge queue={r.queue} />
      </div>
    </button>
  );
}

function CopilotoPanel({ filteredCount }: { filteredCount: number }) {
  const { setFilters } = useProcure();
  const alto = REQUESTS.filter((r) => r.recommendation.risk === "Alto").length;
  const faltan = REQUESTS.filter((r) => r.quotes.length < 3).length;
  const auto = REQUESTS.filter((r) => isAutomatable(r)).length;

  return (
    <aside className="sticky top-36 hidden rounded-2xl border border-hairline bg-surface xl:block">
      <Spotlight
        align="right"
        note="El copiloto resume la bandeja y sus botones controlan los filtros de la izquierda."
      />
      <div
        className="flex items-center gap-2.5 rounded-t-2xl px-4 py-3"
        style={{ background: "var(--pr-hero-grad)" }}
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/15 text-[11px] font-black text-white">
          ◈
        </span>
        <div>
          <p className="text-[13px] font-semibold text-white">Copiloto IA</p>
          <p className="text-[10.5px] text-white/70">Lectura de la bandeja</p>
        </div>
      </div>
      <div className="space-y-3 p-4">
        <p className="pr-ai-output rounded-xl p-3 text-[12.5px] leading-relaxed text-ink/85">
          Hay <strong>{REQUESTS.length} solicitudes activas</strong>: {alto} de
          riesgo alto, {faltan} con cotizaciones incompletas y {auto} candidatas
          a automatización. Mostrando {filteredCount} con los filtros actuales.
        </p>
        <div className="space-y-1.5">
          {[
            { label: "Ver riesgo alto", f: { risk: "Alto" as const, queue: "todas" as const, q: "" } },
            { label: "Ver faltantes de cotización", f: { queue: "cotizacion" as const, risk: "todos" as const, q: "" } },
            { label: "Ver alertas de precio", f: { queue: "alerta" as const, risk: "todos" as const, q: "" } },
            { label: "Ver automatizables", f: { queue: "repetitiva" as const, risk: "todos" as const, q: "" } },
          ].map((b) => (
            <button
              key={b.label}
              type="button"
              onClick={() => setFilters(b.f)}
              className="flex w-full items-center justify-between rounded-xl border border-hairline bg-canvas px-3 py-2 text-[12.5px] font-medium transition-colors hover:border-[var(--pr-brand-border)]"
            >
              {b.label}
              <span className="text-mute">▸</span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => setFilters({ q: "", queue: "todas", risk: "todos" })}
            className="w-full rounded-xl px-3 py-2 text-[12px] text-mute transition-colors hover:text-ink"
          >
            Limpiar filtros
          </button>
        </div>
      </div>
    </aside>
  );
}
