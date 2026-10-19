"use client";

import { SparkBars } from "@/components/charts/Sparkline";
import { StackedBar } from "@/components/charts/StackedBar";
import { Spotlight } from "@/components/annotations/Spotlight";
import { useLocale, useT } from "@/components/i18n/LocaleProvider";
import {
  agoLabel,
  mmss,
  OUTCOME_META,
  OUTCOMES,
  type Board,
  type Outcome,
} from "../data";
import { PageHead, SectionLabel, StatusChip } from "../components/bits";

const OUTCOME_BAR_COLOR: Record<Outcome, string> = {
  connected: "var(--ok)",
  voicemail: "var(--warn)",
  no_answer: "color-mix(in oklab, var(--ink) 35%, transparent)",
  busy: "color-mix(in oklab, var(--ink) 22%, transparent)",
  wrong_number: "var(--danger)",
  do_not_call: "color-mix(in oklab, var(--danger) 60%, var(--ink))",
  failed: "color-mix(in oklab, var(--danger) 40%, transparent)",
};

function sliverColor(elapsed: number): string {
  if (elapsed > 120) return "var(--danger)";
  if (elapsed > 60) return "var(--warn)";
  return "var(--ok)";
}

export function LiveOps({ board, runningCampaigns }: { board: Board; runningCampaigns: number }) {
  const totalOutcomes = OUTCOMES.reduce((a, o) => a + board.outcomes[o], 0);
  const ranked = [...OUTCOMES].sort((a, b) => board.outcomes[b] - board.outcomes[a]);
  const locale = useLocale();
  const t = useT();

  return (
    <div>
      <PageHead
        eyebrow={t({ en: "Operations", es: "Operaciones" })}
        title={t({ en: "Live operations", es: "Operación en vivo" })}
        desc={t({
          en: "Every call in flight, in real time. Dialing stops the moment a person answers.",
          es: "Cada llamada en curso, en tiempo real. La marcación se detiene cuando una persona responde.",
        })}
        actions={
          <span className="inline-flex items-center gap-2 rounded-full border border-hairline px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/80">
            <span className="h-1.5 w-1.5 rounded-full animate-dot-pulse" style={{ background: "var(--ok)" }} />
            {t({ en: "live", es: "en vivo" })}
          </span>
        }
      />

      {/* Stat strip */}
      <div className="mb-8 grid grid-cols-2 divide-x divide-[var(--hairline)] rounded-2xl border border-hairline md:grid-cols-4">
        {[
          { label: t({ en: "Running", es: "Activas" }), value: String(runningCampaigns) },
          { label: t({ en: "Queued", es: "En cola" }), value: board.queued.toLocaleString("es-MX") },
          { label: t({ en: "In flight", es: "En curso" }), value: String(board.calls.length) },
          { label: t({ en: "Attempts today", es: "Intentos hoy" }), value: board.attemptsToday.toLocaleString("es-MX") },
        ].map((s) => (
          <div key={s.label} className="px-5 py-4">
            <p className="text-[11px] text-mute">{s.label}</p>
            <p className="mt-1 font-mono text-2xl tabular-nums">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_290px]">
        {/* In-flight table */}
        <div className="relative min-w-0">
          <Spotlight
            note={t({
              en: "Each row is a live AI call: the bar turns amber after 60 s and red after 120 s. Calls end and new ones start on their own.",
              es: "Cada fila es una llamada de IA en vivo: el indicador cambia a ámbar después de 60 s y a rojo después de 120 s. Las llamadas terminan y otras comienzan automáticamente.",
            })}
            align="left"
            className="!-left-4 !-top-3"
          />
          <SectionLabel
            accessory={
              <span className="font-mono text-[10px] text-mute">
                {board.calls.length} {t({ en: "active", es: "activas" })}
              </span>
            }
          >
            {t({ en: "Calls in flight", es: "Llamadas en curso" })}
          </SectionLabel>
          <div className="overflow-x-auto rounded-2xl border border-hairline">
            <table>
              <thead>
                <tr>
                  <th className="pt-3">{t({ en: "Debtor", es: "Deudor" })}</th>
                  <th className="pt-3">{t({ en: "Number", es: "Número" })}</th>
                  <th className="pt-3">{t({ en: "Campaign", es: "Campaña" })}</th>
                  <th className="pt-3 text-right">{t({ en: "Elapsed", es: "Transcurrido" })}</th>
                </tr>
              </thead>
              <tbody>
                {board.calls.map((c) => (
                  <tr key={c.id} className="relative animate-row-enter">
                    <td className="font-medium">{c.name}</td>
                    <td className="font-mono text-[12px] text-mute">{c.phone}</td>
                    <td className="max-w-[180px] truncate text-mute">{t(c.campaign)}</td>
                    <td className="text-right">
                      <span className="font-mono text-[13px] tabular-nums">{mmss(c.elapsed)}</span>
                      <span
                        className="dd-sliver"
                        style={{
                          width: `${Math.min((c.elapsed / 180) * 100, 100)}%`,
                          background: sliverColor(c.elapsed),
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[11px] text-mute">
            {t({
              en: "Rows update on a simulated cycle; outcomes land in the breakdown on the right.",
              es: "Las filas se actualizan con un ciclo simulado; los resultados aparecen en el desglose de la derecha.",
            })}
          </p>
        </div>

        {/* Right rail */}
        <div className="flex min-w-0 flex-col gap-7">
          <div>
            <SectionLabel
              accessory={<span className="font-mono text-[10px] text-mute">{t({ en: "every 30 s", es: "cada 30 s" })}</span>}
            >
              {t({ en: "Throughput", es: "Rendimiento" })}
            </SectionLabel>
            <p className="mb-2 font-mono text-3xl tabular-nums">
              {board.attemptsToday.toLocaleString("es-MX")}
              <span className="ml-2 text-[11px] text-mute">{t({ en: "attempts today", es: "intentos hoy" })}</span>
            </p>
            <SparkBars values={board.buckets} color="var(--accent)" height={44} flashKey={board.attemptsToday} />
          </div>

          <div>
            <SectionLabel>{t({ en: "Today's outcomes", es: "Resultados de hoy" })}</SectionLabel>
            <StackedBar
              segments={OUTCOMES.map((o) => ({
                label: t(OUTCOME_META[o].label),
                value: board.outcomes[o],
                color: OUTCOME_BAR_COLOR[o],
              }))}
            />
            <ul className="mt-3 flex flex-col gap-1.5">
              {ranked.map((o) => (
                <li key={o} className="flex items-center gap-2 text-[12px]">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: OUTCOME_BAR_COLOR[o] }} />
                  <span className="text-mute">{t(OUTCOME_META[o].label)}</span>
                  <span className="ml-auto font-mono tabular-nums">
                    {board.outcomes[o]}
                    <span className="ml-1.5 text-mute">
                      {Math.round((board.outcomes[o] / Math.max(totalOutcomes, 1)) * 100)}%
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <SectionLabel>{t({ en: "System health", es: "Estado del sistema" })}</SectionLabel>
            <div className="flex flex-col gap-2.5 rounded-2xl border border-hairline p-4">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-mute">{t({ en: "Dispatcher", es: "Despachador" })}</span>
                <StatusChip tone="ok" label={t({ en: "operational", es: "operativo" })} pulse />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-mute">{t({ en: "Voice provider", es: "Proveedor de voz" })}</span>
                <span className="font-mono text-[12px] tabular-nums">
                  {board.calls.length} / 20 {t({ en: "concurrent", es: "simultáneas" })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-mute">Webhooks</span>
                <StatusChip tone="ok" label="200 OK" />
              </div>
            </div>
          </div>

          <div>
            <SectionLabel>{t({ en: "Connected · this session", es: "Conectadas · esta sesión" })}</SectionLabel>
            <ul className="flex flex-col">
              {board.connected.map((c) => (
                <li key={`${c.phone}-${c.atTick}`} className="flex items-center gap-2.5 border-t border-hairline py-2.5 first:border-t-0">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--ok)" }} />
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium">{c.name}</p>
                    <p className="font-mono text-[11px] text-mute">{c.phone}</p>
                  </div>
                  <span className="ml-auto shrink-0 font-mono text-[10px] uppercase tracking-[0.1em] text-mute">
                    {agoLabel(board.tickCount - c.atTick, locale)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
