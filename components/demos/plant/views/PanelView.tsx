"use client";

import { useState } from "react";
import { BarChart } from "@/components/charts/BarChart";
import { LineChart } from "@/components/charts/LineChart";
import { HBars } from "@/components/charts/HBars";
import { Modal } from "@/components/ui/Modal";
import { fmtCompact } from "@/components/charts/scale";
import {
  CLIENTS,
  VENDORS,
  KPIS,
  MONTHS_12,
  REVENUE_MONTHLY,
  MARGIN_MONTHLY,
  SCRAP_MONTHLY,
  SCRAP_TARGET,
  MONTHS_6,
  FAMILY_LABEL,
  useFmt,
  type Client,
  type Vendor,
} from "../data";
import { Panel, KpiCard, Dot, useLoaded, SkeletonView } from "../ui";
import { useLocale, useT } from "@/components/i18n/LocaleProvider";

function marginTone(pct: number) {
  return pct > 30 ? "var(--ok)" : pct >= 20 ? "var(--warn)" : "var(--danger)";
}
function scrapTone(pct: number) {
  return pct < 8 ? "var(--ok)" : pct <= 15 ? "var(--warn)" : "var(--danger)";
}

export function PanelView() {
  const loaded = useLoaded();
  const [client, setClient] = useState<Client | null>(null);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const locale = useLocale();
  const t = useT();
  const { fmtUSD, fmtNum, fmtPct } = useFmt();
  const months = MONTHS_12[locale];

  if (!loaded) return <SkeletonView />;

  return (
    <div className="space-y-4">
      {/* Data strip */}
      <div className="pl-panel px-4 py-2.5 font-mono text-[11px] tracking-wide text-mute">
        {t({
          en: `Data: Jan 2024 – Jun 2026 · ${fmtNum(14860)} work orders · 30 months · 312 clients · Flexible packaging · Flexopack Andina`,
          es: `Datos: Ene 2024 – Jun 2026 · ${fmtNum(14860)} órdenes de producción · 30 meses · 312 clientes · Empaque flexible · Flexopack Andina`,
        })}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <KpiCard
          label={t({ en: "Total revenue (12m)", es: "Facturación total (12m)" })}
          value={fmtUSD(KPIS.revenue)}
          sub={t({
            en: `${fmtNum(KPIS.revenueOps)} WOs invoiced`,
            es: `${fmtNum(KPIS.revenueOps)} OPs facturadas`,
          })}
          pill={`+${fmtPct(KPIS.revenueYoY)} ${t({ en: "YoY", es: "a/a" })}`}
          pillTone="ok"
        />
        <KpiCard
          label={t({ en: "Median gross margin", es: "Margen bruto mediano" })}
          value={fmtPct(KPIS.marginMedian)}
          sub={t({
            en: `${fmtUSD(KPIS.marginTotal)} total margin`,
            es: `${fmtUSD(KPIS.marginTotal)} de margen total`,
          })}
          tone="warn"
        />
        <KpiCard
          label={t({ en: "Scrap rate", es: "Tasa de merma" })}
          value={fmtPct(KPIS.scrapRate)}
          sub={t({
            en: `${fmtNum(KPIS.scrapKg)} kg · target ${SCRAP_TARGET}%`,
            es: `${fmtNum(KPIS.scrapKg)} kg · objetivo ${SCRAP_TARGET}%`,
          })}
          tone="warn"
          pill={`${fmtPct(KPIS.scrapDeltaPp)} pp ${t({ en: "YoY", es: "a/a" })}`}
          pillTone="ok"
        />
        <KpiCard
          label={t({ en: "Negative-margin WOs", es: "OPs con margen negativo" })}
          value={fmtNum(KPIS.negOps)}
          sub={t({
            en: `${fmtUSD(KPIS.negLoss)} cumulative loss`,
            es: `${fmtUSD(KPIS.negLoss)} de pérdida acumulada`,
          })}
          tone="danger"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-3 xl:grid-cols-5">
        <Panel title={t({ en: "Monthly revenue & margin", es: "Facturación y margen mensual" })} className="xl:col-span-3">
          {/* Dos paneles alineados, un eje cada uno — nunca doble eje. */}
          <BarChart
            data={months.map((m, i) => ({ label: m, value: REVENUE_MONTHLY[i] }))}
            height={190}
            color="var(--st-ext)"
            yFormat={(n) => `$${fmtCompact(n)}`}
            tipLabel={t({ en: "Revenue", es: "Facturación" })}
          />
          <div className="mt-1 border-t border-hairline pt-2">
            <LineChart
              series={[
                {
                  name: t({ en: "Gross margin", es: "Margen bruto" }),
                  color: "var(--st-cor)",
                  values: MARGIN_MONTHLY,
                  area: true,
                },
              ]}
              labels={months}
              height={110}
              yFormat={(n) => `${n}%`}
              yMax={40}
            />
          </div>
        </Panel>

        <Panel title={t({ en: "Scrap rate trend", es: "Tendencia de tasa de merma" })} className="xl:col-span-2">
          <LineChart
            series={[
              { name: t({ en: "Scrap rate", es: "Tasa de merma" }), color: "var(--warn)", values: SCRAP_MONTHLY, area: true },
            ]}
            labels={months}
            height={316}
            yFormat={(n) => `${n}%`}
            yMax={14}
            refLine={{ value: SCRAP_TARGET, label: `${t({ en: "target", es: "objetivo" })} ${SCRAP_TARGET}%` }}
          />
        </Panel>
      </div>

      {/* Tables */}
      <div className="grid gap-3 xl:grid-cols-2">
        <Panel title={t({ en: "Top clients by revenue", es: "Principales clientes por facturación" })} bodyClassName="overflow-x-auto">
          <table className="pl-table">
            <thead>
              <tr>
                <th>{t({ en: "Client", es: "Cliente" })}</th>
                <th className="pl-num">{t({ en: "Revenue", es: "Facturación" })}</th>
                <th className="pl-num">{t({ en: "Margin", es: "Margen" })}</th>
                <th className="pl-num">{t({ en: "Scrap", es: "Merma" })}</th>
                <th className="pl-num">{t({ en: "WOs", es: "OPs" })}</th>
                <th>{t({ en: "Status", es: "Estado" })}</th>
              </tr>
            </thead>
            <tbody>
              {CLIENTS.map((c) => (
                <tr key={c.name} onClick={() => setClient(c)}>
                  <td className="font-medium">{c.name}</td>
                  <td className="pl-num">{fmtUSD(c.revenue)}</td>
                  <td className="pl-num" style={{ color: marginTone(c.marginPct) }}>
                    {fmtPct(c.marginPct)}
                  </td>
                  <td className="pl-num" style={{ color: scrapTone(c.scrapPct) }}>
                    {fmtPct(c.scrapPct)}
                  </td>
                  <td className="pl-num">{fmtNum(c.ops)}</td>
                  <td>
                    <Dot color={c.marginPct > 30 && c.scrapPct < 8 ? "var(--ok)" : c.marginPct < 20 || c.scrapPct > 15 ? "var(--danger)" : "var(--warn)"} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel title={t({ en: "Sales team performance", es: "Rendimiento del equipo comercial" })} bodyClassName="overflow-x-auto">
          <table className="pl-table">
            <thead>
              <tr>
                <th>{t({ en: "Rep", es: "Asesor" })}</th>
                <th className="pl-num">{t({ en: "Revenue", es: "Facturación" })}</th>
                <th className="pl-num">{t({ en: "Margin", es: "Margen" })}</th>
                <th className="pl-num">{t({ en: "WOs", es: "OPs" })}</th>
                <th className="pl-num">{t({ en: "Quota", es: "Cumplimiento" })}</th>
              </tr>
            </thead>
            <tbody>
              {VENDORS.map((v) => (
                <tr key={v.name} onClick={() => setVendor(v)}>
                  <td className="font-medium">{v.name}</td>
                  <td className="pl-num">{fmtUSD(v.revenue)}</td>
                  <td className="pl-num" style={{ color: marginTone(v.marginPct) }}>
                    {fmtPct(v.marginPct)}
                  </td>
                  <td className="pl-num">{fmtNum(v.ops)}</td>
                  <td
                    className="pl-num"
                    style={{ color: v.cumplimiento >= 95 && v.cumplimiento <= 110 ? "var(--ok)" : "var(--warn)" }}
                  >
                    {fmtPct(v.cumplimiento)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>

      {/* Client drill-down */}
      <Modal
        open={client !== null}
        onClose={() => setClient(null)}
        size="md"
        label={t({ en: "Client detail", es: "Detalle de cliente" })}
      >
        {client && (
          <div className="pl-panel demo-plant bg-canvas p-0">
            <header className="flex items-center justify-between border-b border-hairline px-5 py-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-mute">{t({ en: "Client", es: "Cliente" })}</p>
                <h3 className="mt-0.5 text-lg font-semibold tracking-tight">{client.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setClient(null)}
                className="rounded-full border border-hairline px-3 py-1 text-xs text-mute transition-colors hover:text-ink"
              >
                {t({ en: "Close", es: "Cerrar" })}
              </button>
            </header>
            <div className="grid grid-cols-2 gap-px bg-[var(--hairline)] md:grid-cols-4">
              {[
                { l: t({ en: "Revenue (12m)", es: "Facturación (12m)" }), v: fmtUSD(client.revenue) },
                { l: t({ en: "Margin", es: "Margen" }), v: fmtPct(client.marginPct), c: marginTone(client.marginPct) },
                { l: t({ en: "Scrap", es: "Merma" }), v: fmtPct(client.scrapPct), c: scrapTone(client.scrapPct) },
                { l: t({ en: "WOs", es: "OPs" }), v: fmtNum(client.ops) },
              ].map((s) => (
                <div key={s.l} className="bg-canvas px-4 py-3">
                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-mute">{s.l}</p>
                  <p className="mt-1 font-mono text-base font-semibold tabular-nums" style={{ color: s.c ?? "var(--ink)" }}>
                    {s.v}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-hairline px-5 py-4">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-mute">
                {t({ en: "Revenue, last 6 months", es: "Facturación últimos 6 meses" })}
              </p>
              <HBars
                data={MONTHS_6[locale].map((m, i) => ({
                  label: m,
                  value: client.monthly[i],
                }))}
                color="var(--st-ext)"
                rowHeight={26}
                labelWidth={64}
                format={(n) => `$${fmtCompact(n)}`}
                tipLabel={t({ en: "Revenue", es: "Facturación" })}
              />
            </div>
            <div className="border-t border-hairline px-5 py-4">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-mute">
                {t({ en: "Recent orders", es: "Órdenes recientes" })}
              </p>
              <table className="pl-table">
                <thead>
                  <tr>
                    <th>{t({ en: "WO", es: "OP" })}</th>
                    <th>{t({ en: "Date", es: "Fecha" })}</th>
                    <th>{t({ en: "Family", es: "Familia" })}</th>
                    <th className="pl-num">KG</th>
                    <th className="pl-num">{t({ en: "Margin", es: "Margen" })}</th>
                  </tr>
                </thead>
                <tbody>
                  {client.recent.map((r) => (
                    <tr key={r.op} className="!cursor-default">
                      <td className="font-mono text-xs">{r.op}</td>
                      <td>{t(r.fecha)}</td>
                      <td>{t(FAMILY_LABEL[r.familia])}</td>
                      <td className="pl-num">{fmtNum(r.kg)}</td>
                      <td className="pl-num" style={{ color: marginTone(r.margen) }}>
                        {fmtPct(r.margen)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Modal>

      {/* Vendor drill-down */}
      <Modal
        open={vendor !== null}
        onClose={() => setVendor(null)}
        size="sm"
        label={t({ en: "Sales rep detail", es: "Detalle de asesor" })}
      >
        {vendor && (
          <div className="pl-panel demo-plant bg-canvas p-0">
            <header className="flex items-center justify-between border-b border-hairline px-5 py-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-mute">
                  {t({ en: "Sales rep", es: "Asesor comercial" })}
                </p>
                <h3 className="mt-0.5 text-lg font-semibold tracking-tight">{vendor.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setVendor(null)}
                className="rounded-full border border-hairline px-3 py-1 text-xs text-mute transition-colors hover:text-ink"
              >
                {t({ en: "Close", es: "Cerrar" })}
              </button>
            </header>
            <div className="grid grid-cols-2 gap-px bg-[var(--hairline)]">
              {[
                { l: t({ en: "Revenue", es: "Facturación" }), v: fmtUSD(vendor.revenue) },
                { l: t({ en: "Margin", es: "Margen" }), v: fmtPct(vendor.marginPct), c: marginTone(vendor.marginPct) },
                { l: t({ en: "WOs", es: "OPs" }), v: fmtNum(vendor.ops) },
                { l: t({ en: "Quota", es: "Cumplimiento" }), v: fmtPct(vendor.cumplimiento) },
              ].map((s) => (
                <div key={s.l} className="bg-canvas px-4 py-3">
                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-mute">{s.l}</p>
                  <p className="mt-1 font-mono text-base font-semibold tabular-nums" style={{ color: s.c ?? "var(--ink)" }}>
                    {s.v}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-hairline px-5 py-4">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-mute">
                {t({ en: "Top clients", es: "Principales clientes" })}
              </p>
              <ul className="space-y-1.5">
                {vendor.topClients.map((c) => (
                  <li key={c.name} className="flex items-center justify-between text-[13px]">
                    <span>{c.name}</span>
                    <span className="pl-num font-mono text-xs">{fmtUSD(c.revenue)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
