"use client";

import { useMemo, useState } from "react";
import { HBars, type HBarDatum } from "@/components/charts/HBars";
import { Spotlight } from "@/components/annotations/Spotlight";
import { AI_ACTIONS, aiText, isAutomatable, variance, type AiAction } from "../ai";
import { fmtUSD, recommendedQuote, type PurchaseRequest, type Quote } from "../data";
import { AiMark, BrandButton, KV, Panel, PanelHead, QueueBadge, RiskBadge, StatusBadge } from "../bits";
import { useProcure } from "../state";

export function Detalle() {
  const { selected, go } = useProcure();
  if (!selected) {
    return (
      <div className="rounded-2xl border border-dashed border-hairline p-14 text-center">
        <p className="text-[14px] font-medium">Ningún caso seleccionado</p>
        <BrandButton small variant="soft" className="mt-4" onClick={() => go("bandeja")}>
          Ir a la bandeja
        </BrandButton>
      </div>
    );
  }
  return <DetalleInner key={selected.id} r={selected} />;
}

function DetalleInner({ r }: { r: PurchaseRequest }) {
  const {
    go,
    nextTourCase,
    selectedQuotes,
    selectQuote,
    decisions,
    decide,
    extraAudit,
    setModal,
    role,
  } = useProcure();

  const selQuote: Quote | undefined = useMemo(
    () => r.quotes.find((q) => q.id === selectedQuotes[r.id]) ?? recommendedQuote(r),
    [r, selectedQuotes]
  );
  const [aiAction, setAiAction] = useState<AiAction>("resumen");
  const decided = decisions[r.id];
  const total = selQuote ? selQuote.unitPrice * r.request.quantity : null;
  const overLimit = total !== null && total > r.authorization.maxValue;

  const chartData: HBarDatum[] = useMemo(() => {
    const rows: HBarDatum[] = [];
    if (r.history.lastPrice !== null) {
      rows.push({
        label: "Última compra SIGA",
        value: r.history.lastPrice,
        color: "var(--info)",
        valueLabel: fmtUSD(r.history.lastPrice),
      });
    }
    for (const q of r.quotes) {
      rows.push({
        label: q.supplier,
        value: q.unitPrice,
        color:
          q.id === selQuote?.id
            ? "var(--pr-brand)"
            : "color-mix(in oklab, var(--ink) 22%, transparent)",
        valueLabel: fmtUSD(q.unitPrice),
      });
    }
    return rows;
  }, [r, selQuote]);

  const audit = [...r.audit, ...(extraAudit[r.id] ?? [])];

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <BrandButton small variant="ghost" onClick={() => go("bandeja")}>
          ← Volver a la bandeja
        </BrandButton>
        <span className="font-mono text-[11px] text-mute">{r.id}</span>
        <div className="ml-auto">
          <BrandButton small variant="soft" onClick={nextTourCase}>
            Siguiente caso demo ▸
          </BrandButton>
        </div>
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-[1fr_360px]">
        {/* ------- MAIN column ------- */}
        <div className="min-w-0 space-y-5">
          {/* Hero */}
          <Panel className="p-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: "var(--pr-brand)" }}>
                {r.scenario}
              </span>
              <QueueBadge queue={r.queue} />
              {decided ? <StatusBadge status={decided} /> : <RiskBadge risk={r.recommendation.risk} />}
            </div>
            <h2 className="mt-2.5 text-xl font-semibold tracking-tight md:text-2xl">
              {r.material.name}
            </h2>
            <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-ink/70">
              {r.request.observation}
            </p>
            {r.flags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {r.flags.map((f) => (
                  <span
                    key={f}
                    className="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                    style={{ background: "var(--pr-warn-soft)", color: "var(--warn)" }}
                  >
                    ⚑ {f}
                  </span>
                ))}
              </div>
            )}
          </Panel>

          {/* Decision card (dark in both themes) */}
          <div className="rounded-2xl p-6" style={{ background: "var(--pr-dark-panel)" }}>
            <div className="flex items-center gap-2">
              <AiMark />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--pr-dark-mute)]">
                Recomendación del copiloto
              </span>
            </div>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-lg font-semibold tracking-tight text-[var(--pr-dark-ink)]">
                  {r.recommendation.supplier}
                </p>
                <p className="mt-1.5 max-w-xl text-[13px] leading-relaxed text-[var(--pr-dark-mute)]">
                  {r.recommendation.summary}
                </p>
              </div>
              {r.recommendation.savings && (
                <span
                  className="rounded-full px-3 py-1.5 text-[12px] font-semibold"
                  style={{ background: "color-mix(in oklab, var(--ok) 18%, transparent)", color: "var(--ok)" }}
                >
                  ↓ {r.recommendation.savings}
                </span>
              )}
            </div>
          </div>

          {/* Contexto SIGA */}
          <Panel>
            <PanelHead title="Contexto SIGA" sub="Lo que el ERP sabe de este material" />
            <dl className="grid grid-cols-2 gap-2.5 p-5 md:grid-cols-4">
              <KV k="Código" v={r.material.code} mono />
              <KV k="Cantidad" v={`${r.request.quantity} ${r.material.unit}`} mono />
              <KV k="Solicitante" v={r.request.requester} />
              <KV k="Aprobador" v={r.request.approver} />
              <KV k="Área" v={r.request.area} />
              <KV k="Estado SIGA" v={r.authorization.state} />
              <KV k="Último proveedor" v={r.history.lastSupplier ?? "Sin historial"} />
              <KV
                k="Último precio"
                v={r.history.lastPrice !== null ? fmtUSD(r.history.lastPrice) : "—"}
                mono
              />
            </dl>
          </Panel>

          {/* Cotizaciones */}
          <Panel className="relative">
            <Spotlight note="Pick a quote — totals, variance, the chart, and the AI reading all re-rank live." />
            <PanelHead
              title="Cotizaciones"
              sub={`${r.quotes.length} de 3 requeridas por política`}
              right={
                r.quotes.length < 3 ? (
                  <BrandButton small onClick={() => setModal({ kind: "email", requestId: r.id })}>
                    Pedir cotización faltante
                  </BrandButton>
                ) : undefined
              }
            />
            <div className="space-y-5 p-5">
              {r.quotes.length === 0 ? (
                <p className="rounded-xl border border-dashed border-hairline p-8 text-center text-[13px] text-mute">
                  Sin cotizaciones registradas todavía.
                </p>
              ) : (
                <>
                  <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
                    {r.quotes.map((q) => (
                      <QuoteCard
                        key={q.id}
                        q={q}
                        unit={r.material.unit}
                        selected={q.id === selQuote?.id}
                        recommended={q.supplier === r.recommendation.supplier}
                        onSelect={() => selectQuote(r.id, q.id)}
                      />
                    ))}
                  </div>

                  <div>
                    <p className="mb-1 text-[12px] font-medium text-mute">
                      Precio unitario · comparado con la última compra registrada
                    </p>
                    <HBars
                      data={chartData}
                      rowHeight={32}
                      labelWidth={150}
                      format={(n) => fmtUSD(n)}
                      tipLabel="Precio unitario"
                    />
                  </div>

                  <DecisionTable r={r} selQuote={selQuote} />
                </>
              )}
            </div>
          </Panel>
        </div>

        {/* ------- SIDE column ------- */}
        <div className="min-w-0 space-y-5 xl:sticky xl:top-24">
          {/* Copiloto */}
          <div className="relative rounded-2xl border border-hairline bg-surface">
            <Spotlight
              align="right"
              note="Seven one-tap prompts. Output is computed from this request's numbers — deterministic, auditable."
            />
            <div className="flex items-center gap-2.5 rounded-t-2xl px-4 py-3" style={{ background: "var(--pr-hero-grad)" }}>
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/15 text-[11px] font-black text-white">
                ◈
              </span>
              <div>
                <p className="text-[13px] font-semibold text-white">Copiloto IA</p>
                <p className="text-[10.5px] text-white/70">
                  No aprueba en silencio: recomienda, explica y deja evidencia.
                </p>
              </div>
            </div>
            <div className="p-4">
              <div className="flex flex-wrap gap-1.5">
                {AI_ACTIONS.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setAiAction(a.id)}
                    className="rounded-full border px-2.5 py-1 text-[11.5px] font-medium transition-colors"
                    style={
                      aiAction === a.id
                        ? { background: "var(--pr-brand)", color: "var(--pr-brand-ink)", borderColor: "var(--pr-brand)" }
                        : { borderColor: "var(--hairline)", color: "var(--mute)" }
                    }
                  >
                    {a.label}
                  </button>
                ))}
              </div>
              <div className="pr-ai-output mt-3 rounded-xl p-3.5">
                <p className="whitespace-pre-wrap text-[12.5px] leading-relaxed text-ink/85">
                  {aiText(aiAction, r, selQuote)}
                </p>
              </div>
              {aiAction === "correo" && (
                <BrandButton
                  small
                  variant="soft"
                  className="mt-2.5 w-full"
                  onClick={() => setModal({ kind: "email", requestId: r.id })}
                >
                  Abrir borrador editable
                </BrandButton>
              )}
            </div>
          </div>

          {/* Autorización */}
          <Panel>
            <PanelHead
              title="Autorización SIGA"
              sub={role === "Jefatura" ? "Vista de jefatura · puede resolver" : "Vista de compras"}
            />
            <div className="space-y-3 p-4">
              <dl className="grid grid-cols-2 gap-2">
                <KV k="N.º autorización" v={r.authorization.number} mono />
                <KV k="Estado" v={r.authorization.state} />
                <KV k="Monto máximo" v={fmtUSD(r.authorization.maxValue)} mono />
                <KV k="Vence" v={r.authorization.expires} mono />
                <KV k="Solicita" v={r.authorization.requester} mono />
                <KV k="Autoriza" v={r.authorization.approver} mono />
              </dl>

              {total !== null && (
                <div
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 text-[12.5px] font-medium"
                  style={{
                    background: overLimit ? "var(--pr-danger-soft)" : "var(--pr-ok-soft)",
                    color: overLimit ? "var(--danger)" : "var(--ok)",
                  }}
                >
                  <span>Total con la oferta elegida</span>
                  <span className="font-mono tabular-nums">{fmtUSD(total)}</span>
                </div>
              )}
              {overLimit && (
                <p className="text-[11.5px] leading-snug text-mute">
                  Supera el tope autorizado: SIGA exigirá una autorización ampliada.
                </p>
              )}

              {decided ? (
                <div className="flex items-center justify-center gap-2 rounded-xl border border-hairline py-3">
                  <StatusBadge status={decided} />
                  <span className="text-[12px] text-mute">registrada en SIGA</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <BrandButton onClick={() => setModal({ kind: "approval", requestId: r.id })}>
                    Aprobar…
                  </BrandButton>
                  <BrandButton variant="ghost" onClick={() => decide(r.id, "devuelta")}>
                    Devolver
                  </BrandButton>
                  {isAutomatable(r) && (
                    <BrandButton
                      variant="soft"
                      className="col-span-2"
                      onClick={() => setModal({ kind: "rule", requestId: r.id })}
                    >
                      ◈ Crear regla automática
                    </BrandButton>
                  )}
                </div>
              )}
            </div>
          </Panel>

          {/* Auditoría */}
          <Panel>
            <PanelHead title="Auditoría" sub="Trazabilidad completa del caso" />
            <ol className="space-y-0 p-4">
              {audit.map((line, i) => (
                <li key={i} className="relative flex gap-3 pb-4 last:pb-0">
                  {i < audit.length - 1 && (
                    <span className="absolute left-[5px] top-4 h-full w-px bg-[var(--hairline)]" />
                  )}
                  <span
                    className="relative mt-1 h-[11px] w-[11px] shrink-0 rounded-full border-2"
                    style={{
                      borderColor: "var(--pr-brand)",
                      background: i === audit.length - 1 ? "var(--pr-brand)" : "var(--surface)",
                    }}
                  />
                  <span className="text-[12px] leading-relaxed text-ink/75">{line}</span>
                </li>
              ))}
            </ol>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function QuoteCard({
  q,
  unit,
  selected,
  recommended,
  onSelect,
}: {
  q: Quote;
  unit: string;
  selected: boolean;
  recommended: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`rounded-2xl border border-hairline bg-canvas p-4 text-left transition-all hover:border-[var(--pr-brand-border)] ${
        selected ? "pr-quote-selected" : ""
      }`}
      aria-pressed={selected}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-[13px] font-semibold leading-snug">{q.supplier}</span>
        {recommended && (
          <span
            className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold"
            style={{ background: "var(--pr-brand-soft)", color: "var(--pr-brand)" }}
          >
            ◈ IA
          </span>
        )}
      </div>
      <p className="mt-2 font-mono text-lg font-semibold tabular-nums tracking-tight">
        {fmtUSD(q.unitPrice)}
        <span className="ml-1 text-[11px] font-normal text-mute">/ {unit}</span>
      </p>
      <p className="mt-1.5 text-[11.5px] text-mute">
        Entrega {q.deliveryDays} días · {q.paymentTerms} · vence {q.validUntil.slice(5)}
      </p>
      {q.badges.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {q.badges.map((b) => (
            <span key={b} className="rounded-full border border-hairline px-2 py-0.5 text-[10px] text-mute">
              {b}
            </span>
          ))}
        </div>
      )}
    </button>
  );
}

function DecisionTable({ r, selQuote }: { r: PurchaseRequest; selQuote: Quote | undefined }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-hairline">
      <table className="w-full min-w-[560px] text-left text-[12.5px]">
        <thead>
          <tr className="border-b border-hairline bg-surface-2 font-mono text-[10px] uppercase tracking-[0.12em] text-mute">
            <th className="px-3.5 py-2.5 font-medium">Proveedor</th>
            <th className="px-3.5 py-2.5 font-medium">Unitario</th>
            <th className="px-3.5 py-2.5 font-medium">Total</th>
            <th className="px-3.5 py-2.5 font-medium">Entrega</th>
            <th className="px-3.5 py-2.5 font-medium">Variación</th>
            <th className="px-3.5 py-2.5 font-medium">Lectura IA</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--hairline)]">
          {r.quotes.map((q) => {
            const v = variance(r, q);
            const reading =
              r.history.lastPrice === null
                ? "Sin historial"
                : v !== null && Math.abs(v) > 0.08
                  ? "Revisión manual"
                  : "Dentro de rango";
            const isSel = q.id === selQuote?.id;
            return (
              <tr key={q.id} className={isSel ? "bg-surface-2" : undefined}>
                <td className="px-3.5 py-2.5 font-medium">
                  {isSel && <span style={{ color: "var(--pr-brand)" }}>▸ </span>}
                  {q.supplier}
                </td>
                <td className="px-3.5 py-2.5 font-mono tabular-nums">{fmtUSD(q.unitPrice)}</td>
                <td className="px-3.5 py-2.5 font-mono tabular-nums">
                  {fmtUSD(q.unitPrice * r.request.quantity)}
                </td>
                <td className="px-3.5 py-2.5 text-mute">{q.deliveryDays} días</td>
                <td
                  className="px-3.5 py-2.5 font-mono tabular-nums"
                  style={{
                    color:
                      v === null
                        ? "var(--mute)"
                        : v > 0.08
                          ? "var(--danger)"
                          : v < -0.02
                            ? "var(--ok)"
                            : "var(--mute)",
                  }}
                >
                  {v === null ? "—" : `${v > 0 ? "+" : ""}${(v * 100).toFixed(1).replace(".", ",")} %`}
                </td>
                <td className="px-3.5 py-2.5 text-mute">{reading}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
