"use client";

import { useMemo, useState } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { useToast } from "@/components/ui/Toast";
import { LineChart } from "@/components/charts/LineChart";
import { Donut } from "@/components/charts/Donut";
import { Legend } from "@/components/charts/Legend";
import { Spotlight } from "@/components/annotations/Spotlight";
import {
  PLAN_ORDERS,
  MACHINES,
  STAGES,
  HORIZON_DAYS,
  MONTHS_12,
  BACKTEST,
  dayLabel,
  dateOffset,
  stageByKey,
  fmtNum,
  fmtPct,
  type PlanOrder,
  type Stage,
} from "../data";
import { Panel, StatChip, EstadoBadge, useLoaded, SkeletonView } from "../ui";

type PlazoFilter = "Todas" | "≤ 7 días" | "Atrasadas";
type EstadoFilter = "Todas" | "En producción" | "Por crear OP" | "Cotizado";

const ZOOMS = [26, 40, 56];

type Placed = PlanOrder & {
  activeSegments: { stage: Stage; machine: string; start: number; dur: number }[];
  endDay: number;
  late: boolean;
  urgent: boolean;
};

export function SchedulerView() {
  const loaded = useLoaded();
  const { toast } = useToast();

  const [tab, setTab] = useState<"plan" | "real">("plan");
  const [planned, setPlanned] = useState(false);
  const [planning, setPlanning] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [search, setSearch] = useState("");
  const [plazo, setPlazo] = useState<PlazoFilter>("Todas");
  const [estado, setEstado] = useState<EstadoFilter>("Todas");
  const [stageFilter, setStageFilter] = useState<"ALL" | Stage>("ALL");
  const [zoom, setZoom] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [shifts, setShifts] = useState<Record<string, number>>({});
  const [urgent, setUrgent] = useState<Record<string, boolean>>({});

  const dayW = ZOOMS[zoom];

  const orders: Placed[] = useMemo(() => {
    return PLAN_ORDERS.map((o) => {
      const base = o.segments.length > 0 ? o.segments : planned ? o.plannedSegments : [];
      const shift = shifts[o.id] ?? 0;
      const activeSegments = base.map((s) => ({ ...s, start: Math.max(0, s.start + shift) }));
      const endDay = activeSegments.length ? Math.max(...activeSegments.map((s) => s.start + s.dur - 1)) : -1;
      return {
        ...o,
        activeSegments,
        endDay,
        late: endDay >= 0 && endDay > o.entregaDay,
        urgent: !!urgent[o.id],
      };
    });
  }, [planned, shifts, urgent]);

  const queue = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      if (q && !`${o.id} ${o.cliente} ${o.producto}`.toLowerCase().includes(q)) return false;
      if (plazo === "≤ 7 días" && o.entregaDay > 7) return false;
      if (plazo === "Atrasadas" && !o.late) return false;
      if (estado !== "Todas" && o.estado !== estado) return false;
      return true;
    });
  }, [orders, search, plazo, estado]);

  const stats = useMemo(() => {
    const withPlan = orders.filter((o) => o.activeSegments.length > 0);
    const busy = new Map<string, number>();
    for (const o of withPlan)
      for (const s of o.activeSegments) busy.set(s.machine, (busy.get(s.machine) ?? 0) + s.dur);
    let bottleneck = "—";
    let maxDur = 0;
    for (const [m, d] of busy) if (d > maxDur) ((maxDur = d), (bottleneck = m));
    const totalDur = [...busy.values()].reduce((a, b) => a + b, 0);
    const util = Math.round((totalDur / (MACHINES.filter((m) => m.estado !== "Mantenimiento").length * HORIZON_DAYS)) * 100);
    return {
      pendiente: orders.filter((o) => o.estado === "Por crear OP").length,
      enProd: orders.filter((o) => o.estado === "En producción").length,
      conPlan: withPlan.length,
      tarde: orders.filter((o) => o.late).length,
      util,
      bottleneck,
    };
  }, [orders]);

  const selected = orders.find((o) => o.id === selectedId) ?? null;

  function planAll() {
    if (planning) return;
    setPlanning(true);
    toast("Planificando órdenes pendientes…", "info");
    setTimeout(() => {
      setPlanning(false);
      setPlanned(true);
      setAnimKey((k) => k + 1);
      toast(`Plan generado: ${PLAN_ORDERS.length} órdenes en ${MACHINES.length} máquinas`, "ok");
    }, 900);
  }

  function applyShift(id: string, delta: number, msg: string) {
    setShifts((s) => ({ ...s, [id]: (s[id] ?? 0) + delta }));
    setAnimKey((k) => k + 1);
    toast(msg, "ok");
  }

  const visibleStages = STAGES.filter((s) => stageFilter === "ALL" || s.key === stageFilter);

  if (!loaded) return <SkeletonView />;

  return (
    <div className="space-y-4">
      {/* Action bar */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => toast("VETRA ERP sincronizado · cola actualizada", "ok")}
          className="pl-chip"
        >
          ⟳ Sincronizar ERP
        </button>
        <button
          type="button"
          onClick={planAll}
          className="rounded-full px-4 py-1.5 text-[13px] font-medium transition-opacity hover:opacity-90"
          style={{ background: "var(--pl-accent)", color: "var(--pl-accent-ink)" }}
        >
          {planning ? "Planificando…" : planned ? "Replanificar todo" : "Planificar todo"}
        </button>

        <div className="ml-auto flex items-center gap-1 rounded-full border border-hairline p-1">
          {(
            [
              ["plan", "Planificador"],
              ["real", "vs Realidad"],
            ] as const
          ).map(([k, label]) => (
            <button
              key={k}
              type="button"
              onClick={() => setTab(k)}
              className="rounded-full px-3.5 py-1 text-[12px] font-medium transition-colors"
              style={
                tab === k
                  ? { background: "var(--pl-navy)", color: "var(--pl-navy-ink)" }
                  : { color: "var(--mute)" }
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI chips */}
      <div className="flex flex-wrap gap-2">
        <StatChip label="Pendiente OP" value={String(stats.pendiente)} tone="warn" />
        <StatChip label="En producción" value={String(stats.enProd)} tone="ok" />
        <StatChip label="Con plan" value={`${stats.conPlan}/${PLAN_ORDERS.length}`} />
        <StatChip label="Proy. tarde" value={String(stats.tarde)} tone={stats.tarde > 0 ? "danger" : "ok"} />
        <StatChip label="Utilización" value={`${stats.util}%`} />
        <StatChip label="Cuello de botella" value={stats.bottleneck} tone="warn" />
      </div>

      {tab === "plan" ? (
        <div className="grid gap-3 xl:grid-cols-[320px_1fr]">
          {/* Queue */}
          <Panel title="Cola VETRA" bodyClassName="p-3 space-y-3">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar OP, cliente o producto…"
              className="w-full rounded-xl border border-hairline bg-transparent px-3 py-2 text-[13px] outline-none transition-colors placeholder:text-mute/60 focus:border-[color:var(--pl-accent)]"
            />
            <div className="flex flex-wrap gap-1.5">
              {(["Todas", "≤ 7 días", "Atrasadas"] as PlazoFilter[]).map((f) => (
                <button key={f} type="button" className="pl-chip" data-active={plazo === f} onClick={() => setPlazo(f)}>
                  {f}
                  <span className="count">
                    {f === "Todas" ? orders.length : f === "≤ 7 días" ? orders.filter((o) => o.entregaDay <= 7).length : orders.filter((o) => o.late).length}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(["Todas", "En producción", "Por crear OP", "Cotizado"] as EstadoFilter[]).map((f) => (
                <button key={f} type="button" className="pl-chip" data-active={estado === f} onClick={() => setEstado(f)}>
                  {f}
                  <span className="count">
                    {f === "Todas" ? orders.length : orders.filter((o) => o.estado === f).length}
                  </span>
                </button>
              ))}
            </div>
            <div className="space-y-2">
              {queue.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setSelectedId(o.id)}
                  className="w-full rounded-xl border border-hairline p-3 text-left transition-colors hover:border-ink/30"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-semibold">{o.id}</span>
                    <EstadoBadge estado={o.late ? "Atrasada" : o.estado} />
                  </div>
                  <p className="mt-1 truncate text-[13px] font-medium">{o.cliente}</p>
                  <p className="truncate text-[12px] text-mute">{o.producto}</p>
                  <div className="mt-1.5 flex items-center justify-between font-mono text-[10px] text-mute">
                    <span>{fmtNum(o.kg)} kg</span>
                    <span>entrega {dateOffset(o.entregaDay)}</span>
                  </div>
                  {o.activeSegments.length === 0 && (
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-wide" style={{ color: "var(--warn)" }}>
                      Sin plan — usa “Planificar todo”
                    </p>
                  )}
                </button>
              ))}
              {queue.length === 0 && (
                <div className="rounded-xl border border-dashed border-hairline p-6 text-center text-[13px] text-mute">
                  Sin órdenes con estos filtros.
                </div>
              )}
            </div>
          </Panel>

          {/* Gantt */}
          <div className="relative min-w-0">
            <Spotlight note="A finite-capacity plan: every bar respects real machine speed and availability. Drag-free — click any bar to act on it." />
            <Panel
              title="Plan de producción · 14 días"
              accessory={
                <div className="flex items-center gap-2">
                  <div className="hidden items-center gap-1.5 md:flex">
                    {STAGES.map((s) => (
                      <button
                        key={s.key}
                        type="button"
                        onClick={() => setStageFilter(stageFilter === s.key ? "ALL" : s.key)}
                        className="pl-chip !px-2.5 !py-1"
                        data-active={stageFilter === s.key}
                      >
                        <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                        <span className="hidden xl:inline">{s.name}</span>
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-1">
                    <button type="button" className="pl-chip !px-2.5 !py-1" onClick={() => setZoom((z) => Math.max(0, z - 1))} aria-label="Alejar">
                      －
                    </button>
                    <button type="button" className="pl-chip !px-2.5 !py-1" onClick={() => setZoom((z) => Math.min(ZOOMS.length - 1, z + 1))} aria-label="Acercar">
                      ＋
                    </button>
                  </div>
                </div>
              }
              bodyClassName="p-0"
            >
              {/* Freshness bar */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-hairline px-4 py-2 font-mono text-[10px] text-mute">
                <span>Plan #P-2606-14</span>
                <span>generado hace 12 min</span>
                <span>sync hace 4 min</span>
                <span style={{ color: stats.tarde > 0 ? "var(--warn)" : "var(--ok)" }}>
                  {Math.round(((stats.conPlan - stats.tarde) / Math.max(stats.conPlan, 1)) * 100)}% a tiempo
                </span>
                {stats.tarde > 0 && (
                  <button type="button" onClick={planAll} className="ml-auto rounded-full border border-hairline px-2.5 py-0.5 transition-colors hover:text-ink">
                    ⚠ Replanificar
                  </button>
                )}
              </div>

              <div className="flex">
                {/* Machine labels */}
                <div className="w-28 shrink-0 border-r border-hairline md:w-36">
                  <div className="h-9 border-b border-hairline" />
                  {visibleStages.map((s) => (
                    <div key={s.key}>
                      <div className="flex h-7 items-center gap-2 border-b border-hairline bg-surface-2 px-3">
                        <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-mute">{s.name}</span>
                      </div>
                      {MACHINES.filter((m) => m.stage === s.key).map((m) => (
                        <div key={m.code} className="flex h-9 items-center justify-between border-b border-hairline px-3">
                          <span className="font-mono text-[11px]">{m.code}</span>
                          {m.estado !== "Operativa" && (
                            <span className="font-mono text-[8px] uppercase" style={{ color: m.estado === "Mantenimiento" ? "var(--mute)" : "var(--warn)" }}>
                              {m.estado === "Mantenimiento" ? "MTTO" : "CAMBIO"}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Timeline */}
                <div className="min-w-0 flex-1 overflow-x-auto">
                  <div style={{ width: HORIZON_DAYS * dayW }}>
                    {/* Day headers */}
                    <div className="relative flex h-9 border-b border-hairline">
                      {Array.from({ length: HORIZON_DAYS }, (_, d) => {
                        const dl = dayLabel(d);
                        return (
                          <div
                            key={d}
                            className="flex shrink-0 flex-col items-center justify-center border-r border-hairline font-mono text-[9px] leading-tight text-mute"
                            style={{ width: dayW, background: dl.weekend ? "color-mix(in oklab, var(--ink) 4%, transparent)" : undefined }}
                          >
                            <span>{dl.dow}</span>
                            <span>{dl.date}</span>
                          </div>
                        );
                      })}
                    </div>

                    {visibleStages.map((s) => (
                      <div key={s.key}>
                        <div className="h-7 border-b border-hairline bg-surface-2" />
                        {MACHINES.filter((m) => m.stage === s.key).map((m) => (
                          <div key={m.code} className="pl-gantt-row h-9">
                            {/* weekend shading */}
                            {Array.from({ length: HORIZON_DAYS }, (_, d) =>
                              dayLabel(d).weekend ? (
                                <span
                                  key={d}
                                  className="absolute inset-y-0"
                                  style={{ left: d * dayW, width: dayW, background: "color-mix(in oklab, var(--ink) 4%, transparent)" }}
                                />
                              ) : null
                            )}
                            {m.estado === "Mantenimiento" && (
                              <span className="absolute inset-0 bg-dots opacity-60" />
                            )}
                            {orders.flatMap((o) =>
                              o.activeSegments
                                .filter((seg) => seg.machine === m.code)
                                .map((seg) => (
                                  <button
                                    key={`${o.id}-${seg.stage}-${animKey}`}
                                    type="button"
                                    onClick={() => setSelectedId(o.id)}
                                    className="pl-gantt-seg pl-seg-animate"
                                    data-late={o.late}
                                    data-urgent={o.urgent}
                                    style={{
                                      left: seg.start * dayW + 1,
                                      width: seg.dur * dayW - 3,
                                      background: stageByKey(seg.stage).color,
                                      color: stageByKey(seg.stage).ink,
                                    }}
                                    title={`${o.id} · ${o.cliente}`}
                                  >
                                    {o.id.replace("OP-", "")}
                                  </button>
                                ))
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-hairline px-4 py-2.5">
                <Legend items={STAGES.map((s) => ({ label: s.name, color: `${s.color}` }))} />
                <span className="flex items-center gap-1.5 text-[12px] text-mute">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ boxShadow: "inset 0 0 0 2px var(--danger)" }} />
                  Tarde / en riesgo
                </span>
              </div>
            </Panel>
          </div>
        </div>
      ) : (
        <VsRealidad />
      )}

      {/* Job drawer */}
      <Drawer open={selected !== null} onClose={() => setSelectedId(null)} width={420} label="Detalle de orden">
        {selected && (
          <div className="demo-plant flex h-full flex-col">
            <header className="border-b border-hairline px-5 py-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-mute">Orden planificada</p>
              <div className="mt-1 flex items-center gap-3">
                <h3 className="text-lg font-semibold tracking-tight">{selected.id}</h3>
                <EstadoBadge estado={selected.late ? "Atrasada" : selected.estado} />
                {selected.urgent && (
                  <span className="rounded-full border border-hairline px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide">
                    Urgente
                  </span>
                )}
              </div>
              <p className="mt-1 text-[13px] text-mute">
                {selected.cliente} · {selected.producto}
              </p>
            </header>

            <div className="grid grid-cols-2 gap-px border-b border-hairline bg-[var(--hairline)]">
              {[
                { l: "KG", v: fmtNum(selected.kg) },
                { l: "Entrega", v: dateOffset(selected.entregaDay) },
                { l: "Ruta", v: selected.ruta.map((r) => stageByKey(r).name.slice(0, 3)).join(" → ") },
                {
                  l: "Fin proyectado",
                  v: selected.endDay >= 0 ? dateOffset(selected.endDay) : "Sin plan",
                },
              ].map((s) => (
                <div key={s.l} className="bg-canvas px-4 py-3">
                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-mute">{s.l}</p>
                  <p className="mt-1 text-[13px] font-medium">{s.v}</p>
                </div>
              ))}
            </div>

            {selected.late && (
              <div className="mx-5 mt-4 rounded-xl border px-3.5 py-2.5 text-[13px]" style={{ borderColor: "var(--danger)", color: "var(--danger)", background: "color-mix(in oklab, var(--danger) 8%, transparent)" }}>
                Proyectada {selected.endDay - selected.entregaDay} día(s) tarde. Márcala urgente o replanifica.
              </div>
            )}

            <div className="px-5 py-4">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-mute">Etapas planificadas</p>
              {selected.activeSegments.length > 0 ? (
                <ul className="space-y-2">
                  {selected.activeSegments.map((seg) => {
                    const st = stageByKey(seg.stage);
                    return (
                      <li key={`${seg.stage}-${seg.machine}`} className="flex items-center gap-3 rounded-xl border border-hairline px-3 py-2.5 text-[13px]">
                        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: st.color }} />
                        <span className="w-24">{st.name}</span>
                        <span className="font-mono text-xs text-mute">{seg.machine}</span>
                        <span className="ml-auto font-mono text-[11px] tabular-nums text-mute">
                          {dateOffset(seg.start)} → {dateOffset(seg.start + seg.dur - 1)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="rounded-xl border border-dashed border-hairline p-5 text-center text-[13px] text-mute">
                  Aún sin plan. Pulsa “Planificar todo” en la barra superior.
                </div>
              )}
            </div>

            <div className="mt-auto space-y-2 border-t border-hairline px-5 py-4">
              <button
                type="button"
                disabled={selected.activeSegments.length === 0}
                onClick={() => {
                  setUrgent((u) => ({ ...u, [selected.id]: true }));
                  applyShift(selected.id, -1, `${selected.id} marcada urgente · plan adelantado 1 día`);
                }}
                className="w-full rounded-xl px-4 py-2.5 text-[13px] font-medium transition-opacity hover:opacity-90 disabled:opacity-40"
                style={{ background: "var(--pl-accent)", color: "var(--pl-accent-ink)" }}
              >
                ⚡ Marcar urgente (adelanta 1 día)
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={selected.activeSegments.length === 0}
                  onClick={() => applyShift(selected.id, 1, `${selected.id} aplazada 1 día`)}
                  className="rounded-xl border border-hairline px-4 py-2.5 text-[13px] transition-colors hover:border-ink/30 disabled:opacity-40"
                >
                  Aplazar 1 día
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShifts((s) => ({ ...s, [selected.id]: 0 }));
                    setUrgent((u) => ({ ...u, [selected.id]: false }));
                    setAnimKey((k) => k + 1);
                    toast(`${selected.id}: ajustes revertidos`, "info");
                  }}
                  className="rounded-xl border border-hairline px-4 py-2.5 text-[13px] transition-colors hover:border-ink/30"
                >
                  Quitar ajustes
                </button>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}

/* ---------------- vs Realidad ---------------- */

function VsRealidad() {
  const totalOutcomes = BACKTEST.outcomes.reduce((a, o) => a + o.value, 0);

  return (
    <div className="space-y-4">
      {/* Hero band */}
      <div className="relative">
        <Spotlight
          align="right"
          note="A 90-day backtest: the same order book replayed with the scheduler's plan vs what actually happened."
        />
        <div className="pl-panel grid gap-px overflow-hidden bg-[var(--hairline)] md:grid-cols-3">
          {[
            { l: "Real (VETRA)", v: BACKTEST.realOnTime, sub: "entregas a tiempo", tone: "var(--mute)" },
            { l: "Con Noria Plant OS", v: BACKTEST.algoOnTime, sub: `+${(BACKTEST.algoOnTime - BACKTEST.realOnTime).toFixed(1)} pp sobre lo real`, tone: "var(--pl-accent)", arrow: true },
            { l: "Techo teórico", v: BACKTEST.ceilingOnTime, sub: "capacidad ilimitada", tone: "var(--mute)", arrow: true },
          ].map((s) => (
            <div key={s.l} className="relative bg-surface px-6 py-7 text-center">
              {s.arrow && (
                <span className="absolute -left-2.5 top-1/2 hidden -translate-y-1/2 text-xl text-mute md:block">›</span>
              )}
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-mute">{s.l}</p>
              <p className="mt-2 text-5xl font-semibold tabular-nums tracking-tight" style={{ color: s.tone }}>
                {fmtPct(s.v)}
              </p>
              <p className="mt-2 text-[12px] text-mute">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Impact strip */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { l: "OPs salvadas", v: fmtNum(BACKTEST.opsSaved) },
          { l: "Días tarde evitados", v: fmtNum(BACKTEST.lateDaysAvoided) },
          { l: "KG salvados", v: `${fmtNum(BACKTEST.kgSaved / 1000)} t` },
          { l: "Órdenes evaluadas", v: fmtNum(BACKTEST.evaluated) },
        ].map((s) => (
          <div key={s.l} className="pl-panel px-4 py-3.5">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-mute">{s.l}</p>
            <p className="mt-1.5 font-mono text-2xl font-semibold tabular-nums">{s.v}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-3 xl:grid-cols-5">
        <Panel
          title="Tendencia mensual · % de entregas a tiempo"
          className="xl:col-span-3"
          accessory={
            <Legend
              items={[
                { label: "Real", color: "var(--mute)" },
                { label: "Algoritmo", color: "var(--pl-accent)" },
                { label: "Techo", color: "var(--st-lam)", dashed: true },
              ]}
            />
          }
        >
          <LineChart
            series={[
              { name: "Real", color: "var(--mute)", values: BACKTEST.monthlyReal },
              { name: "Algoritmo", color: "var(--pl-accent)", values: BACKTEST.monthlyAlgo, area: true },
              { name: "Techo", color: "var(--st-lam)", values: BACKTEST.monthlyCeiling, dashed: true },
            ]}
            labels={MONTHS_12}
            height={240}
            yFormat={(n) => `${n}%`}
            yMax={100}
          />
        </Panel>

        <Panel title="Distribución de resultados" className="xl:col-span-2">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Donut
              data={BACKTEST.outcomes.map((o) => ({ label: o.label, value: o.value, color: o.colorVar }))}
              size={180}
              thickness={24}
              centerValue={fmtNum(totalOutcomes)}
              centerLabel="órdenes"
            />
            <ul className="space-y-2">
              {BACKTEST.outcomes.map((o) => (
                <li key={o.label} className="flex items-center gap-2.5 text-[13px]">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: o.colorVar }} />
                  <span className="text-ink/80">{o.label}</span>
                  <span className="ml-auto pl-4 font-mono text-xs tabular-nums text-mute">
                    {fmtNum(o.value)} · {Math.round((o.value / totalOutcomes) * 100)}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Panel>
      </div>

      {/* Top saved */}
      <Panel title="Top órdenes salvadas por el algoritmo" bodyClassName="overflow-x-auto">
        <table className="pl-table">
          <thead>
            <tr>
              <th>OP</th>
              <th>Cliente</th>
              <th>Producto</th>
              <th className="pl-num">KG</th>
              <th>Ruta</th>
              <th>Entrega</th>
              <th className="pl-num">Real (días tarde)</th>
              <th className="pl-num">Algoritmo</th>
              <th className="pl-num">Salvados</th>
            </tr>
          </thead>
          <tbody>
            {BACKTEST.topSaved.map((r) => (
              <tr key={r.op} className="!cursor-default">
                <td className="font-mono text-xs">{r.op}</td>
                <td className="font-medium">{r.cliente}</td>
                <td>{r.producto}</td>
                <td className="pl-num">{fmtNum(r.kg)}</td>
                <td className="font-mono text-[11px] text-mute">{r.ruta}</td>
                <td>{r.entrega}</td>
                <td className="pl-num" style={{ color: "var(--danger)" }}>
                  {r.realLate}
                </td>
                <td className="pl-num" style={{ color: r.algoLate === 0 ? "var(--ok)" : "var(--warn)" }}>
                  {r.algoLate}
                </td>
                <td className="pl-num font-semibold" style={{ color: "var(--pl-accent)" }}>
                  +{r.saved}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      {/* Methodology */}
      <div className="pl-panel px-5 py-4 text-[13px] leading-relaxed text-mute">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em]">Metodología · </span>
        Se replantificaron las {fmtNum(BACKTEST.evaluated)} órdenes cerradas de los últimos 90 días usando las
        velocidades observadas de cada máquina (kg/h reales, no nominales) y la disponibilidad registrada en VETRA.
        “Techo teórico” asume capacidad ilimitada y sirve como cota superior: mide cuánto del atraso es estructural y
        cuánto es planificable.
      </div>
    </div>
  );
}
