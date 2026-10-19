"use client";

import { useMemo, useState } from "react";
import { HBars, type HBarDatum } from "@/components/charts/HBars";
import { Spotlight } from "@/components/annotations/Spotlight";
import { useLocale, useT } from "@/components/i18n/LocaleProvider";
import { AI_ACTIONS, aiText, isAutomatable, pct, variance, type AiAction } from "../ai";
import { AUTH_STATE_LABEL, recommendedQuote, useFmt, type PurchaseRequest, type Quote } from "../data";
import { AiMark, BrandButton, KV, Panel, PanelHead, QueueBadge, RiskBadge, StatusBadge } from "../bits";
import { useProcure } from "../state";

export function Detalle() {
  const { selected, go } = useProcure();
  const t = useT();
  if (!selected) {
    return (
      <div className="rounded-2xl border border-dashed border-hairline p-14 text-center">
        <p className="text-[14px] font-medium">{t({ en: "No case selected", es: "Ningún caso seleccionado" })}</p>
        <BrandButton small variant="soft" className="mt-4" onClick={() => go("bandeja")}>
          {t({ en: "Go to the inbox", es: "Ir a la bandeja" })}
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
  const locale = useLocale();
  const t = useT();
  const { fmtUSD } = useFmt();

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
        label: t({ en: "Last SIGA purchase", es: "Última compra SIGA" }),
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
  }, [r, selQuote, t, fmtUSD]);

  const audit = [...r.audit, ...(extraAudit[r.id] ?? [])];

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <BrandButton small variant="ghost" onClick={() => go("bandeja")}>
          ← {t({ en: "Back to the inbox", es: "Volver a la bandeja" })}
        </BrandButton>
        <span className="font-mono text-[11px] text-mute">{r.id}</span>
        <div className="ml-auto">
          <BrandButton small variant="soft" onClick={nextTourCase}>
            {t({ en: "Next demo case ▸", es: "Siguiente caso demo ▸" })}
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
                {t(r.scenario)}
              </span>
              <QueueBadge queue={r.queue} />
              {decided ? <StatusBadge status={decided} /> : <RiskBadge risk={r.recommendation.risk} />}
            </div>
            <h2 className="mt-2.5 text-xl font-semibold tracking-tight md:text-2xl">
              {t(r.material.name)}
            </h2>
            <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-ink/70">
              {t(r.request.observation)}
            </p>
            {r.flags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {r.flags.map((f) => (
                  <span
                    key={f.en}
                    className="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                    style={{ background: "var(--pr-warn-soft)", color: "var(--warn)" }}
                  >
                    ⚑ {t(f)}
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
                {t({ en: "Copilot recommendation", es: "Recomendación del copiloto" })}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-lg font-semibold tracking-tight text-[var(--pr-dark-ink)]">
                  {r.recommendation.supplier}
                </p>
                <p className="mt-1.5 max-w-xl text-[13px] leading-relaxed text-[var(--pr-dark-mute)]">
                  {t(r.recommendation.summary)}
                </p>
              </div>
              {r.recommendation.savings && (
                <span
                  className="rounded-full px-3 py-1.5 text-[12px] font-semibold"
                  style={{ background: "color-mix(in oklab, var(--ok) 18%, transparent)", color: "var(--ok)" }}
                >
                  ↓ {t(r.recommendation.savings)}
                </span>
              )}
            </div>
          </div>

          {/* Contexto SIGA */}
          <Panel>
            <PanelHead
              title={t({ en: "SIGA context", es: "Contexto SIGA" })}
              sub={t({ en: "What the ERP knows about this material", es: "Lo que el ERP sabe de este material" })}
            />
            <dl className="grid grid-cols-2 gap-2.5 p-5 md:grid-cols-4">
              <KV k={t({ en: "Code", es: "Código" })} v={r.material.code} mono />
              <KV k={t({ en: "Quantity", es: "Cantidad" })} v={`${r.request.quantity} ${t(r.material.unit)}`} mono />
              <KV k={t({ en: "Requester", es: "Solicitante" })} v={r.request.requester} />
              <KV k={t({ en: "Approver", es: "Aprobador" })} v={r.request.approver} />
              <KV k={t({ en: "Area", es: "Área" })} v={t(r.request.area)} />
              <KV k={t({ en: "SIGA status", es: "Estado SIGA" })} v={t(AUTH_STATE_LABEL[r.authorization.state])} />
              <KV
                k={t({ en: "Last supplier", es: "Último proveedor" })}
                v={r.history.lastSupplier ?? t({ en: "No history", es: "Sin historial" })}
              />
              <KV
                k={t({ en: "Last price", es: "Último precio" })}
                v={r.history.lastPrice !== null ? fmtUSD(r.history.lastPrice) : "—"}
                mono
              />
            </dl>
          </Panel>

          {/* Cotizaciones */}
          <Panel className="relative">
            <Spotlight
              note={t({
                en: "Pick a quote: totals, variance, the chart and the AI analysis update instantly.",
                es: "Elige una cotización: los totales, la variación, el gráfico y el análisis de IA se actualizan al instante.",
              })}
            />
            <PanelHead
              title={t({ en: "Quotes", es: "Cotizaciones" })}
              sub={t({
                en: `${r.quotes.length} of 3 required by policy`,
                es: `${r.quotes.length} de 3 requeridas por política`,
              })}
              right={
                r.quotes.length < 3 ? (
                  <BrandButton small onClick={() => setModal({ kind: "email", requestId: r.id })}>
                    {t({ en: "Request the missing quote", es: "Pedir cotización faltante" })}
                  </BrandButton>
                ) : undefined
              }
            />
            <div className="space-y-5 p-5">
              {r.quotes.length === 0 ? (
                <p className="rounded-xl border border-dashed border-hairline p-8 text-center text-[13px] text-mute">
                  {t({ en: "No quotes recorded yet.", es: "Sin cotizaciones registradas todavía." })}
                </p>
              ) : (
                <>
                  <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
                    {r.quotes.map((q) => (
                      <QuoteCard
                        key={q.id}
                        q={q}
                        unit={t(r.material.unit)}
                        selected={q.id === selQuote?.id}
                        recommended={q.supplier === r.recommendation.supplier}
                        onSelect={() => selectQuote(r.id, q.id)}
                      />
                    ))}
                  </div>

                  <div>
                    <p className="mb-1 text-[12px] font-medium text-mute">
                      {t({
                        en: "Unit price · compared with the last recorded purchase",
                        es: "Precio unitario · comparado con la última compra registrada",
                      })}
                    </p>
                    <HBars
                      data={chartData}
                      rowHeight={32}
                      labelWidth={150}
                      format={(n) => fmtUSD(n)}
                      tipLabel={t({ en: "Unit price", es: "Precio unitario" })}
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
              note={t({
                en: "Seven one-tap queries. Each answer is computed from this request's own data: deterministic and auditable.",
                es: "Siete consultas de un toque. El resultado se calcula con los datos de esta solicitud: determinístico y auditable.",
              })}
            />
            <div className="flex items-center gap-2.5 rounded-t-2xl px-4 py-3" style={{ background: "var(--pr-hero-grad)" }}>
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/15 text-[11px] font-black text-white">
                ◈
              </span>
              <div>
                <p className="text-[13px] font-semibold text-white">{t({ en: "AI copilot", es: "Copiloto IA" })}</p>
                <p className="text-[10.5px] text-white/70">
                  {t({
                    en: "Never approves silently: it recommends, explains and leaves evidence.",
                    es: "No aprueba en silencio: recomienda, explica y deja evidencia.",
                  })}
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
                    {t(a.label)}
                  </button>
                ))}
              </div>
              <div className="pr-ai-output mt-3 rounded-xl p-3.5">
                <p className="whitespace-pre-wrap text-[12.5px] leading-relaxed text-ink/85">
                  {aiText(aiAction, r, selQuote, locale)}
                </p>
              </div>
              {aiAction === "correo" && (
                <BrandButton
                  small
                  variant="soft"
                  className="mt-2.5 w-full"
                  onClick={() => setModal({ kind: "email", requestId: r.id })}
                >
                  {t({ en: "Open the editable draft", es: "Abrir borrador editable" })}
                </BrandButton>
              )}
            </div>
          </div>

          {/* Autorización */}
          <Panel>
            <PanelHead
              title={t({ en: "SIGA authorization", es: "Autorización SIGA" })}
              sub={
                role === "Jefatura"
                  ? t({ en: "Manager view · can decide", es: "Vista de jefatura · puede resolver" })
                  : t({ en: "Purchasing view", es: "Vista de compras" })
              }
            />
            <div className="space-y-3 p-4">
              <dl className="grid grid-cols-2 gap-2">
                <KV k={t({ en: "Authorization no.", es: "N.º autorización" })} v={r.authorization.number} mono />
                <KV k={t({ en: "Status", es: "Estado" })} v={t(AUTH_STATE_LABEL[r.authorization.state])} />
                <KV k={t({ en: "Max amount", es: "Monto máximo" })} v={fmtUSD(r.authorization.maxValue)} mono />
                <KV k={t({ en: "Expires", es: "Vence" })} v={r.authorization.expires} mono />
                <KV k={t({ en: "Requested by", es: "Solicita" })} v={r.authorization.requester} mono />
                <KV k={t({ en: "Approved by", es: "Autoriza" })} v={r.authorization.approver} mono />
              </dl>

              {total !== null && (
                <div
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 text-[12.5px] font-medium"
                  style={{
                    background: overLimit ? "var(--pr-danger-soft)" : "var(--pr-ok-soft)",
                    color: overLimit ? "var(--danger)" : "var(--ok)",
                  }}
                >
                  <span>{t({ en: "Total with the chosen offer", es: "Total con la oferta elegida" })}</span>
                  <span className="font-mono tabular-nums">{fmtUSD(total)}</span>
                </div>
              )}
              {overLimit && (
                <p className="text-[11.5px] leading-snug text-mute">
                  {t({
                    en: "Over the authorized cap: SIGA will require an extended authorization.",
                    es: "Supera el tope autorizado: SIGA exigirá una autorización ampliada.",
                  })}
                </p>
              )}

              {decided ? (
                <div className="flex items-center justify-center gap-2 rounded-xl border border-hairline py-3">
                  <StatusBadge status={decided} />
                  <span className="text-[12px] text-mute">{t({ en: "logged in SIGA", es: "registrada en SIGA" })}</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <BrandButton onClick={() => setModal({ kind: "approval", requestId: r.id })}>
                    {t({ en: "Approve…", es: "Aprobar…" })}
                  </BrandButton>
                  <BrandButton variant="ghost" onClick={() => decide(r.id, "devuelta")}>
                    {t({ en: "Return", es: "Devolver" })}
                  </BrandButton>
                  {isAutomatable(r) && (
                    <BrandButton
                      variant="soft"
                      className="col-span-2"
                      onClick={() => setModal({ kind: "rule", requestId: r.id })}
                    >
                      ◈ {t({ en: "Create automatic rule", es: "Crear regla automática" })}
                    </BrandButton>
                  )}
                </div>
              )}
            </div>
          </Panel>

          {/* Auditoría */}
          <Panel>
            <PanelHead
              title={t({ en: "Audit", es: "Auditoría" })}
              sub={t({ en: "Full trail for this case", es: "Trazabilidad completa del caso" })}
            />
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
                  <span className="text-[12px] leading-relaxed text-ink/75">{t(line)}</span>
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
  const t = useT();
  const { fmtUSD } = useFmt();
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
            ◈ {t({ en: "AI", es: "IA" })}
          </span>
        )}
      </div>
      <p className="mt-2 font-mono text-lg font-semibold tabular-nums tracking-tight">
        {fmtUSD(q.unitPrice)}
        <span className="ml-1 text-[11px] font-normal text-mute">/ {unit}</span>
      </p>
      <p className="mt-1.5 text-[11.5px] text-mute">
        {t({
          en: `${q.deliveryDays}-day delivery · ${q.paymentTerms.en} · valid to ${q.validUntil.slice(5)}`,
          es: `Entrega ${q.deliveryDays} días · ${q.paymentTerms.es} · vence ${q.validUntil.slice(5)}`,
        })}
      </p>
      {q.badges.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {q.badges.map((b) => (
            <span key={b.en} className="rounded-full border border-hairline px-2 py-0.5 text-[10px] text-mute">
              {t(b)}
            </span>
          ))}
        </div>
      )}
    </button>
  );
}

function DecisionTable({ r, selQuote }: { r: PurchaseRequest; selQuote: Quote | undefined }) {
  const locale = useLocale();
  const t = useT();
  const { fmtUSD } = useFmt();
  return (
    <div className="overflow-x-auto rounded-xl border border-hairline">
      <table className="w-full min-w-[560px] text-left text-[12.5px]">
        <thead>
          <tr className="border-b border-hairline bg-surface-2 font-mono text-[10px] uppercase tracking-[0.12em] text-mute">
            <th className="px-3.5 py-2.5 font-medium">{t({ en: "Supplier", es: "Proveedor" })}</th>
            <th className="px-3.5 py-2.5 font-medium">{t({ en: "Unit", es: "Unitario" })}</th>
            <th className="px-3.5 py-2.5 font-medium">Total</th>
            <th className="px-3.5 py-2.5 font-medium">{t({ en: "Delivery", es: "Entrega" })}</th>
            <th className="px-3.5 py-2.5 font-medium">{t({ en: "Change", es: "Variación" })}</th>
            <th className="px-3.5 py-2.5 font-medium">{t({ en: "AI reading", es: "Lectura IA" })}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--hairline)]">
          {r.quotes.map((q) => {
            const v = variance(r, q);
            const reading =
              r.history.lastPrice === null
                ? t({ en: "No history", es: "Sin historial" })
                : v !== null && Math.abs(v) > 0.08
                  ? t({ en: "Manual review", es: "Revisión manual" })
                  : t({ en: "Within range", es: "Dentro de rango" });
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
                <td className="px-3.5 py-2.5 text-mute">
                  {q.deliveryDays} {t({ en: "days", es: "días" })}
                </td>
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
                  {v === null ? "—" : pct(v, locale)}
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
