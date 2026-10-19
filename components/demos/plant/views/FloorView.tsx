"use client";

import { useMemo, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { Spotlight } from "@/components/annotations/Spotlight";
import { useLocale, useT } from "@/components/i18n/LocaleProvider";
import {
  LIVE_ORDERS,
  MACHINES,
  STAGES,
  stageByKey,
  dateOffset,
  useFmt,
  FAMILY_LABEL,
  MATERIAL_LABEL,
  STATE_LABEL,
  type LiveOrder,
  type LiveOrderState,
} from "../data";
import { Panel, StatChip, Dot, EstadoBadge, useLoaded, SkeletonView } from "../ui";

type Filter = "Todas" | LiveOrderState;

const FILTERS: Filter[] = ["En producción", "Pendiente OP", "Atrasada", "Todas"];

/** Small animated dashed connector between stage cards. */
function FlowConnector() {
  return (
    <svg width="26" height="12" viewBox="0 0 26 12" className="hidden shrink-0 xl:block" aria-hidden>
      <line
        x1="1"
        y1="6"
        x2="19"
        y2="6"
        stroke="var(--mute)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        className="animate-dash-drift"
      />
      <path d="M19 2 L25 6 L19 10 Z" fill="var(--mute)" />
    </svg>
  );
}

export function FloorView() {
  const loaded = useLoaded();
  const { toast } = useToast();
  const [filter, setFilter] = useState<Filter>("Todas");
  const [order, setOrder] = useState<LiveOrder | null>(null);
  const [syncing, setSyncing] = useState(false);
  const locale = useLocale();
  const t = useT();
  const { fmtNum, fmtPct } = useFmt();

  const filtered = useMemo(
    () => (filter === "Todas" ? LIVE_ORDERS : LIVE_ORDERS.filter((o) => o.estado === filter)),
    [filter]
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { Todas: LIVE_ORDERS.length };
    for (const f of FILTERS) if (f !== "Todas") c[f] = LIVE_ORDERS.filter((o) => o.estado === f).length;
    return c;
  }, []);

  const stageStats = useMemo(
    () =>
      STAGES.map((s) => {
        const machines = MACHINES.filter((m) => m.stage === s.key);
        const inProd = LIVE_ORDERS.filter((o) => o.estado !== "Pendiente OP" && o.avance.some((a) => a.stage === s.key && a.pct > 0 && a.pct < 1)).length;
        const queued = LIVE_ORDERS.filter((o) => o.avance.some((a) => a.stage === s.key && a.pct === 0)).length;
        const down = machines.some((m) => m.estado === "Mantenimiento");
        const busy = machines.filter((m) => m.carga > 0.85).length > 0;
        return {
          ...s,
          machines,
          inProd,
          queued,
          health: down ? "var(--danger)" : busy ? "var(--warn)" : "var(--ok)",
        };
      }),
    []
  );

  function sync() {
    if (syncing) return;
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      toast(
        t({ en: "VETRA ERP synced · 2,418 records updated", es: "VETRA ERP sincronizado · 2.418 registros actualizados" }),
        "ok"
      );
    }, 1200);
  }

  if (!loaded) return <SkeletonView />;

  const working = MACHINES.filter((m) => m.estado === "Operativa").length;

  return (
    <div className="space-y-4">
      {/* Live status strip */}
      <div
        className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl px-4 py-3 font-mono text-[11px]"
        style={{ background: "var(--pl-navy)", color: "var(--pl-navy-ink)" }}
      >
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full animate-dot-pulse" style={{ background: "var(--ok)" }} />
          VETRA ERP · Planta
        </span>
        <span style={{ color: "var(--pl-navy-mute)" }}>{t({ en: "synced 4 min ago", es: "sincronizado hace 4 min" })}</span>
        <span style={{ color: "var(--pl-navy-mute)" }}>{t({ en: "2,418 records", es: "2.418 registros" })}</span>
        <span style={{ color: "var(--pl-navy-mute)" }}>
          {t({
            en: `${working} of ${MACHINES.length} machines running`,
            es: `${working} de ${MACHINES.length} máquinas operativas`,
          })}
        </span>
        <button
          type="button"
          onClick={sync}
          className="ml-auto rounded-full border px-3 py-1 transition-opacity hover:opacity-80"
          style={{ borderColor: "color-mix(in oklab, var(--pl-navy-ink) 25%, transparent)" }}
        >
          {syncing ? t({ en: "Syncing…", es: "Sincronizando…" }) : t({ en: "⟳ Sync ERP", es: "⟳ Sincronizar ERP" })}
        </button>
      </div>

      {/* KPI chips */}
      <div className="flex flex-wrap gap-2">
        <StatChip label={t({ en: "Total orders", es: "Total pedidos" })} value={fmtNum(LIVE_ORDERS.length)} />
        <StatChip
          label={t(STATE_LABEL["En producción"])}
          value={String(counts["En producción"])}
          tone="ok"
          onClick={() => setFilter("En producción")}
          active={filter === "En producción"}
        />
        <StatChip
          label={t(STATE_LABEL["Pendiente OP"])}
          value={String(counts["Pendiente OP"])}
          tone="warn"
          onClick={() => setFilter("Pendiente OP")}
          active={filter === "Pendiente OP"}
        />
        <StatChip
          label={t({ en: "Late", es: "Atrasadas" })}
          value={String(counts["Atrasada"])}
          tone="danger"
          onClick={() => setFilter("Atrasada")}
          active={filter === "Atrasada"}
        />
        <StatChip label={t({ en: "Planned hours", es: "Horas plan" })} value="312 h" />
      </div>

      {/* Process flow band */}
      <div className="relative">
        <Spotlight
          align="right"
          note={t({
            en: "The five-stage flow mirrors the real production route. The health dots react to machine load and downtime.",
            es: "El flujo de cinco etapas refleja la ruta real de producción. Los indicadores responden a la carga y a las paradas de las máquinas.",
          })}
        />
        <div className="flex flex-col items-stretch gap-2 xl:flex-row xl:items-center">
          {stageStats.map((s, i) => (
            <div key={s.key} className="contents">
              <div className="pl-panel relative flex-1 overflow-hidden p-4">
                <span className="absolute inset-x-0 top-0 h-1" style={{ background: s.color }} />
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-mute">{t(s.name)}</span>
                  <Dot color={s.health} pulse />
                </div>
                <div className="mt-2 text-3xl font-semibold tabular-nums tracking-tight">{s.inProd + s.queued}</div>
                <div className="mt-2 grid grid-cols-2 gap-px bg-[var(--hairline)] text-[11px]">
                  <div className="bg-surface py-1.5 pr-2">
                    <span className="text-mute">{t({ en: "Running", es: "En curso" })}</span>{" "}
                    <span className="font-mono tabular-nums">{s.inProd}</span>
                  </div>
                  <div className="bg-surface py-1.5 pl-2">
                    <span className="text-mute">{t({ en: "Queued", es: "En cola" })}</span>{" "}
                    <span className="font-mono tabular-nums">{s.queued}</span>
                  </div>
                </div>
              </div>
              {i < stageStats.length - 1 && <FlowConnector />}
            </div>
          ))}
        </div>
      </div>

      {/* Machines by stage */}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {stageStats.map((s) => (
          <Panel
            key={s.key}
            title={`${t(s.name)} · ${s.machines.length} ${t({ en: "mach.", es: "máq." })}`}
            bodyClassName="p-3 space-y-2"
          >
            {s.machines.map((m) => (
              <div key={m.code} className="rounded-xl border border-hairline p-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold">{m.code}</span>
                  <EstadoBadge estado={m.estado} />
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-mute">
                  <span>{m.opActual ?? t({ en: "No WO assigned", es: "Sin OP asignada" })}</span>
                  <span className="font-mono tabular-nums">{m.rate} kg/h</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.round(m.carga * 100)}%`,
                      background: m.carga > 0.85 ? "var(--warn)" : s.color,
                      transition: "width 500ms cubic-bezier(0.22,1,0.36,1)",
                    }}
                  />
                </div>
              </div>
            ))}
          </Panel>
        ))}
      </div>

      {/* Live orders table */}
      <Panel
        title={t({ en: "Live orders · VETRA", es: "Órdenes en vivo · VETRA" })}
        accessory={
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => (
              <button key={f} type="button" className="pl-chip" data-active={filter === f} onClick={() => setFilter(f)}>
                {f === "Todas" ? t({ en: "All", es: "Todas" }) : t(STATE_LABEL[f])}
                <span className="count">{counts[f]}</span>
              </button>
            ))}
          </div>
        }
        bodyClassName="overflow-x-auto"
      >
        <table className="pl-table">
          <thead>
            <tr>
              <th>{t({ en: "WO", es: "OP" })}</th>
              <th>{t({ en: "Due", es: "Entrega" })}</th>
              <th>{t({ en: "Client", es: "Cliente" })}</th>
              <th>{t({ en: "Stage", es: "Etapa" })}</th>
              <th>{t({ en: "Machine", es: "Máquina" })}</th>
              <th className="pl-num">{t({ en: "KG ordered", es: "KG pedido" })}</th>
              <th className="pl-num">{t({ en: "KG produced", es: "KG producido" })}</th>
              <th className="pl-num">{t({ en: "Scrap", es: "Merma" })}</th>
              <th>{t({ en: "Status", es: "Estado" })}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.op} onClick={() => setOrder(o)} className="animate-row-enter">
                <td className="font-mono text-xs">{o.op}</td>
                <td>{dateOffset(o.entregaDay, locale)}</td>
                <td className="font-medium">{o.cliente}</td>
                <td>{o.etapa ? t(stageByKey(o.etapa).name) : t({ en: "Pending", es: "Pendiente" })}</td>
                <td className="font-mono text-xs">{o.maquina}</td>
                <td className="pl-num">{fmtNum(o.kgPedido)}</td>
                <td className="pl-num">{fmtNum(o.kgProducido)}</td>
                <td className="pl-num" style={{ color: o.mermaPct > 8 ? "var(--danger)" : "var(--mute)" }}>
                  {o.kgProducido > 0 ? fmtPct(o.mermaPct) : "—"}
                </td>
                <td>
                  <EstadoBadge estado={o.estado} />
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr className="!cursor-default">
                <td colSpan={9} className="py-8 text-center text-mute">
                  {t({ en: "No orders in this filter.", es: "Sin órdenes en este filtro." })}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Panel>

      {/* Order drill-down */}
      <Modal
        open={order !== null}
        onClose={() => setOrder(null)}
        size="md"
        label={t({ en: "Order detail", es: "Detalle de orden" })}
      >
        {order && (
          <div className="pl-panel demo-plant bg-canvas p-0">
            <header className="flex items-center justify-between border-b border-hairline px-5 py-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-mute">
                  {t({ en: "Work order", es: "Orden de producción" })}
                </p>
                <h3 className="mt-0.5 flex items-center gap-3 text-lg font-semibold tracking-tight">
                  {order.op}
                  <EstadoBadge estado={order.estado} />
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setOrder(null)}
                className="rounded-full border border-hairline px-3 py-1 text-xs text-mute transition-colors hover:text-ink"
              >
                {t({ en: "Close", es: "Cerrar" })}
              </button>
            </header>
            <div className="grid grid-cols-2 gap-px bg-[var(--hairline)] md:grid-cols-4">
              {[
                { l: t({ en: "Client", es: "Cliente" }), v: order.cliente },
                { l: t({ en: "Family", es: "Familia" }), v: t(FAMILY_LABEL[order.familia]) },
                { l: t({ en: "Material", es: "Material" }), v: t(MATERIAL_LABEL[order.material]) },
                { l: t({ en: "Due", es: "Entrega" }), v: dateOffset(order.entregaDay, locale) },
                { l: t({ en: "KG ordered", es: "KG pedido" }), v: fmtNum(order.kgPedido) },
                { l: t({ en: "KG produced", es: "KG producido" }), v: fmtNum(order.kgProducido) },
                { l: t({ en: "Scrap", es: "Merma" }), v: order.kgProducido > 0 ? fmtPct(order.mermaPct) : "—" },
                { l: t({ en: "Est. margin", es: "Margen est." }), v: fmtPct(order.margenPct) },
              ].map((s) => (
                <div key={s.l} className="bg-canvas px-4 py-3">
                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-mute">{s.l}</p>
                  <p className="mt-1 truncate text-[13px] font-medium">{s.v}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-hairline px-5 py-4">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-mute">
                {t({ en: "Progress by stage", es: "Avance por etapa" })}
              </p>
              <div className="space-y-2.5">
                {order.avance.map((a) => {
                  const st = stageByKey(a.stage);
                  return (
                    <div key={a.stage} className="flex items-center gap-3">
                      <span className="w-24 shrink-0 text-[12px] text-mute">{t(st.name)}</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.round(a.pct * 100)}%`,
                            background: st.color,
                            transition: "width 600ms cubic-bezier(0.22,1,0.36,1)",
                          }}
                        />
                      </div>
                      <span className="w-10 shrink-0 text-right font-mono text-[11px] tabular-nums text-mute">
                        {Math.round(a.pct * 100)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
