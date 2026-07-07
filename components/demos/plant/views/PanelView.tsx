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
  fmtUSD,
  fmtNum,
  fmtPct,
  type Client,
  type Vendor,
} from "../data";
import { Panel, KpiCard, Dot, useLoaded, SkeletonView } from "../ui";

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

  if (!loaded) return <SkeletonView />;

  return (
    <div className="space-y-4">
      {/* Data strip */}
      <div className="pl-panel px-4 py-2.5 font-mono text-[11px] tracking-wide text-mute">
        Datos: Ene 2024 – Jun 2026 · {fmtNum(14860)} órdenes de producción · 30 meses · 312 clientes ·
        Empaque flexible · Flexopack Andina
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <KpiCard
          label="Facturación total (12m)"
          value={fmtUSD(KPIS.revenue)}
          sub={`${fmtNum(KPIS.revenueOps)} OPs facturadas`}
          pill={`+${fmtPct(KPIS.revenueYoY)} a/a`}
          pillTone="ok"
        />
        <KpiCard
          label="Margen bruto mediano"
          value={fmtPct(KPIS.marginMedian)}
          sub={`${fmtUSD(KPIS.marginTotal)} de margen total`}
          tone="warn"
        />
        <KpiCard
          label="Tasa de merma"
          value={fmtPct(KPIS.scrapRate)}
          sub={`${fmtNum(KPIS.scrapKg)} kg · objetivo ${SCRAP_TARGET}%`}
          tone="warn"
          pill={`${fmtPct(KPIS.scrapDeltaPp)} pp a/a`}
          pillTone="ok"
        />
        <KpiCard
          label="OPs con margen negativo"
          value={fmtNum(KPIS.negOps)}
          sub={`${fmtUSD(KPIS.negLoss)} de pérdida acumulada`}
          tone="danger"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-3 xl:grid-cols-5">
        <Panel title="Facturación y margen mensual" className="xl:col-span-3">
          {/* Dos paneles alineados, un eje cada uno — nunca doble eje. */}
          <BarChart
            data={MONTHS_12.map((m, i) => ({ label: m, value: REVENUE_MONTHLY[i] }))}
            height={190}
            color="var(--st-ext)"
            yFormat={(n) => `$${fmtCompact(n)}`}
            tipLabel="Facturación"
          />
          <div className="mt-1 border-t border-hairline pt-2">
            <LineChart
              series={[{ name: "Margen bruto", color: "var(--st-cor)", values: MARGIN_MONTHLY, area: true }]}
              labels={MONTHS_12}
              height={110}
              yFormat={(n) => `${n}%`}
              yMax={40}
            />
          </div>
        </Panel>

        <Panel title="Tendencia de tasa de merma" className="xl:col-span-2">
          <LineChart
            series={[{ name: "Tasa de merma", color: "var(--warn)", values: SCRAP_MONTHLY, area: true }]}
            labels={MONTHS_12}
            height={316}
            yFormat={(n) => `${n}%`}
            yMax={14}
            refLine={{ value: SCRAP_TARGET, label: `objetivo ${SCRAP_TARGET}%` }}
          />
        </Panel>
      </div>

      {/* Tables */}
      <div className="grid gap-3 xl:grid-cols-2">
        <Panel title="Principales clientes por facturación" bodyClassName="overflow-x-auto">
          <table className="pl-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th className="pl-num">Facturación</th>
                <th className="pl-num">Margen</th>
                <th className="pl-num">Merma</th>
                <th className="pl-num">OPs</th>
                <th>Estado</th>
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

        <Panel title="Rendimiento del equipo comercial" bodyClassName="overflow-x-auto">
          <table className="pl-table">
            <thead>
              <tr>
                <th>Asesor</th>
                <th className="pl-num">Facturación</th>
                <th className="pl-num">Margen</th>
                <th className="pl-num">OPs</th>
                <th className="pl-num">Cumplimiento</th>
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
      <Modal open={client !== null} onClose={() => setClient(null)} size="md" label="Detalle de cliente">
        {client && (
          <div className="pl-panel demo-plant bg-canvas p-0">
            <header className="flex items-center justify-between border-b border-hairline px-5 py-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-mute">Cliente</p>
                <h3 className="mt-0.5 text-lg font-semibold tracking-tight">{client.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setClient(null)}
                className="rounded-full border border-hairline px-3 py-1 text-xs text-mute transition-colors hover:text-ink"
              >
                Cerrar
              </button>
            </header>
            <div className="grid grid-cols-2 gap-px bg-[var(--hairline)] md:grid-cols-4">
              {[
                { l: "Facturación (12m)", v: fmtUSD(client.revenue) },
                { l: "Margen", v: fmtPct(client.marginPct), c: marginTone(client.marginPct) },
                { l: "Merma", v: fmtPct(client.scrapPct), c: scrapTone(client.scrapPct) },
                { l: "OPs", v: fmtNum(client.ops) },
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
                Facturación últimos 6 meses
              </p>
              <HBars
                data={["Ene", "Feb", "Mar", "Abr", "May", "Jun"].map((m, i) => ({
                  label: m,
                  value: client.monthly[i],
                }))}
                color="var(--st-ext)"
                rowHeight={26}
                labelWidth={64}
                format={(n) => `$${fmtCompact(n)}`}
                tipLabel="Facturación"
              />
            </div>
            <div className="border-t border-hairline px-5 py-4">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-mute">Órdenes recientes</p>
              <table className="pl-table">
                <thead>
                  <tr>
                    <th>OP</th>
                    <th>Fecha</th>
                    <th>Familia</th>
                    <th className="pl-num">KG</th>
                    <th className="pl-num">Margen</th>
                  </tr>
                </thead>
                <tbody>
                  {client.recent.map((r) => (
                    <tr key={r.op} className="!cursor-default">
                      <td className="font-mono text-xs">{r.op}</td>
                      <td>{r.fecha}</td>
                      <td>{r.familia}</td>
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
      <Modal open={vendor !== null} onClose={() => setVendor(null)} size="sm" label="Detalle de asesor">
        {vendor && (
          <div className="pl-panel demo-plant bg-canvas p-0">
            <header className="flex items-center justify-between border-b border-hairline px-5 py-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-mute">Asesor comercial</p>
                <h3 className="mt-0.5 text-lg font-semibold tracking-tight">{vendor.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setVendor(null)}
                className="rounded-full border border-hairline px-3 py-1 text-xs text-mute transition-colors hover:text-ink"
              >
                Cerrar
              </button>
            </header>
            <div className="grid grid-cols-2 gap-px bg-[var(--hairline)]">
              {[
                { l: "Facturación", v: fmtUSD(vendor.revenue) },
                { l: "Margen", v: fmtPct(vendor.marginPct), c: marginTone(vendor.marginPct) },
                { l: "OPs", v: fmtNum(vendor.ops) },
                { l: "Cumplimiento", v: fmtPct(vendor.cumplimiento) },
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
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-mute">Principales clientes</p>
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
