/**
 * Noria Plant OS — demo data. Everything is fictional: "Flexopack Andina" is
 * an invented flexible-packaging factory, "VETRA ERP" an invented ERP, and all
 * clients, salespeople, machines and figures are fabricated.
 * All data is static module constants so server/client renders match.
 */

/* ---------- formatting ---------- */

const usdFmt = new Intl.NumberFormat("es-EC", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const numFmt = new Intl.NumberFormat("es-EC", { maximumFractionDigits: 0 });
const pctFmt = new Intl.NumberFormat("es-EC", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export const fmtUSD = (n: number) => usdFmt.format(n);
export const fmtNum = (n: number) => numFmt.format(n);
export const fmtPct = (n: number) => `${pctFmt.format(n)}%`;

/** Fixed demo "today" so every render is deterministic. */
export const DEMO_TODAY = new Date(2026, 5, 24); // 24 jun 2026

export function dayLabel(offset: number): { dow: string; date: string; weekend: boolean } {
  const d = new Date(DEMO_TODAY);
  d.setDate(d.getDate() + offset);
  const dows = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"];
  return {
    dow: dows[d.getDay()],
    date: `${d.getDate()}/${d.getMonth() + 1}`,
    weekend: d.getDay() === 0 || d.getDay() === 6,
  };
}

export function dateOffset(offset: number): string {
  const d = new Date(DEMO_TODAY);
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString("es-EC", { day: "numeric", month: "short" });
}

/* ---------- stages & machines ---------- */

export type Stage = "EXT" | "IMP" | "LAM" | "COR" | "SEL";

export const STAGES: {
  key: Stage;
  name: string;
  color: string;
  ink: string;
}[] = [
  { key: "EXT", name: "Extrusión", color: "var(--st-ext)", ink: "var(--st-ext-ink)" },
  { key: "IMP", name: "Impresión", color: "var(--st-imp)", ink: "var(--st-imp-ink)" },
  { key: "LAM", name: "Laminación", color: "var(--st-lam)", ink: "var(--st-lam-ink)" },
  { key: "COR", name: "Corte", color: "var(--st-cor)", ink: "var(--st-cor-ink)" },
  { key: "SEL", name: "Sellado", color: "var(--st-sel)", ink: "var(--st-sel-ink)" },
];

export const stageByKey = (k: Stage) => STAGES.find((s) => s.key === k)!;

export type MachineState = "Operativa" | "En cambio" | "Mantenimiento";

export type Machine = {
  code: string;
  stage: Stage;
  rate: number; // kg/h observado
  estado: MachineState;
  opActual?: string;
  carga: number; // 0..1 backlog del turno
};

export const MACHINES: Machine[] = [
  { code: "EX-01", stage: "EXT", rate: 142, estado: "Operativa", opActual: "OP-18310", carga: 0.82 },
  { code: "EX-02", stage: "EXT", rate: 128, estado: "Operativa", opActual: "OP-18312", carga: 0.74 },
  { code: "EX-03", stage: "EXT", rate: 110, estado: "En cambio", opActual: "OP-18318", carga: 0.51 },
  { code: "IM-01", stage: "IMP", rate: 96, estado: "Operativa", opActual: "OP-18310", carga: 0.93 },
  { code: "IM-02", stage: "IMP", rate: 88, estado: "Operativa", carga: 0.38 },
  { code: "LA-01", stage: "LAM", rate: 105, estado: "Operativa", opActual: "OP-18324", carga: 0.66 },
  { code: "LA-02", stage: "LAM", rate: 98, estado: "Operativa", carga: 0.44 },
  { code: "CO-01", stage: "COR", rate: 150, estado: "Operativa", opActual: "OP-18341", carga: 0.58 },
  { code: "CO-02", stage: "COR", rate: 140, estado: "Operativa", carga: 0.31 },
  { code: "CO-03", stage: "COR", rate: 132, estado: "Mantenimiento", carga: 0 },
  { code: "SE-01", stage: "SEL", rate: 76, estado: "Operativa", opActual: "OP-18341", carga: 0.71 },
  { code: "SE-02", stage: "SEL", rate: 82, estado: "Operativa", carga: 0.47 },
];

/* ---------- dashboard (Panel) ---------- */

export const MONTHS_12 = ["Jul", "Ago", "Sep", "Oct", "Nov", "Dic", "Ene", "Feb", "Mar", "Abr", "May", "Jun"];

export const REVENUE_MONTHLY = [412000, 438000, 395000, 461000, 448000, 472000, 430000, 455000, 483000, 466000, 491000, 508000];
export const MARGIN_MONTHLY = [26.1, 27.4, 25.2, 28.9, 27.8, 29.4, 26.8, 28.1, 30.2, 29.0, 30.8, 31.5];
export const SCRAP_MONTHLY = [11.2, 10.6, 10.9, 9.8, 10.1, 9.4, 9.7, 9.1, 8.8, 9.0, 8.4, 8.1];
export const SCRAP_TARGET = 8;

export const KPIS = {
  revenue: 5459000,
  revenueOps: 6214,
  revenueYoY: 12.4,
  marginMedian: 28.6,
  marginTotal: 1561000,
  scrapRate: 8.9,
  scrapKg: 41230,
  scrapDeltaPp: -1.3,
  negOps: 214,
  negLoss: -182400,
};

export type Client = {
  name: string;
  revenue: number;
  marginPct: number;
  scrapPct: number;
  ops: number;
  monthly: number[]; // últimos 6 meses
  recent: { op: string; fecha: string; familia: string; kg: number; margen: number }[];
};

export const CLIENTS: Client[] = [
  {
    name: "Alimentos Páramo",
    revenue: 812400, marginPct: 33.8, scrapPct: 6.9, ops: 642,
    monthly: [118000, 124000, 131000, 127000, 138000, 142000],
    recent: [
      { op: "OP-18310", fecha: "22 jun", familia: "FUNDA", kg: 1850, margen: 34.2 },
      { op: "OP-18244", fecha: "15 jun", familia: "LAMINADO", kg: 2400, margen: 31.7 },
      { op: "OP-18187", fecha: "6 jun", familia: "FUNDA", kg: 1600, margen: 35.1 },
      { op: "OP-18102", fecha: "28 may", familia: "BOLSA", kg: 980, margen: 29.4 },
    ],
  },
  {
    name: "Frutandes S.A.",
    revenue: 694100, marginPct: 29.2, scrapPct: 8.4, ops: 518,
    monthly: [102000, 98000, 111000, 108000, 116000, 121000],
    recent: [
      { op: "OP-18312", fecha: "23 jun", familia: "BOLSA", kg: 2400, margen: 28.8 },
      { op: "OP-18220", fecha: "12 jun", familia: "BOBINA", kg: 3800, margen: 27.2 },
      { op: "OP-18155", fecha: "3 jun", familia: "BOLSA", kg: 1450, margen: 30.6 },
      { op: "OP-18071", fecha: "24 may", familia: "FUNDA", kg: 760, margen: 24.1 },
    ],
  },
  {
    name: "Pesquera del Golfo",
    revenue: 561800, marginPct: 24.6, scrapPct: 11.2, ops: 447,
    monthly: [88000, 92000, 84000, 96000, 91000, 99000],
    recent: [
      { op: "OP-18319", fecha: "23 jun", familia: "FUNDA", kg: 1200, margen: 22.4 },
      { op: "OP-18201", fecha: "10 jun", familia: "LAMINADO", kg: 2900, margen: 25.8 },
      { op: "OP-18134", fecha: "1 jun", familia: "FUNDA", kg: 1750, margen: 23.9 },
      { op: "OP-18043", fecha: "21 may", familia: "BOBINA", kg: 4100, margen: 26.3 },
    ],
  },
  {
    name: "Lácteos Cumbre",
    revenue: 488900, marginPct: 31.4, scrapPct: 7.6, ops: 396,
    monthly: [74000, 79000, 82000, 78000, 86000, 89000],
    recent: [
      { op: "OP-18318", fecha: "22 jun", familia: "BOBINA", kg: 3100, margen: 32.0 },
      { op: "OP-18232", fecha: "13 jun", familia: "FUNDA", kg: 1400, margen: 30.8 },
      { op: "OP-18166", fecha: "4 jun", familia: "LAMINADO", kg: 2050, margen: 33.5 },
      { op: "OP-18089", fecha: "26 may", familia: "FUNDA", kg: 890, margen: 28.7 },
    ],
  },
  {
    name: "Café Altiplano",
    revenue: 402300, marginPct: 35.1, scrapPct: 6.2, ops: 312,
    monthly: [61000, 64000, 69000, 66000, 72000, 70000],
    recent: [
      { op: "OP-18324", fecha: "23 jun", familia: "LAMINADO", kg: 2750, margen: 36.4 },
      { op: "OP-18248", fecha: "16 jun", familia: "LAMINADO", kg: 1900, margen: 34.9 },
      { op: "OP-18172", fecha: "5 jun", familia: "BOLSA", kg: 620, margen: 33.2 },
      { op: "COT-2214", fecha: "20 jun", familia: "LAMINADO", kg: 2200, margen: 35.5 },
    ],
  },
  {
    name: "Molinos del Sur",
    revenue: 377600, marginPct: 22.1, scrapPct: 13.8, ops: 358,
    monthly: [58000, 62000, 55000, 66000, 63000, 68000],
    recent: [
      { op: "OP-18330", fecha: "24 jun", familia: "BOBINA", kg: 4200, margen: 21.6 },
      { op: "OP-18261", fecha: "17 jun", familia: "BOBINA", kg: 3600, margen: 20.4 },
      { op: "OP-18190", fecha: "8 jun", familia: "FUNDA", kg: 1150, margen: 24.8 },
      { op: "OP-18104", fecha: "29 may", familia: "BOLSA", kg: 840, margen: 19.2 },
    ],
  },
  {
    name: "Snacks Kantu",
    revenue: 341200, marginPct: 30.6, scrapPct: 9.1, ops: 287,
    monthly: [51000, 54000, 58000, 55000, 61000, 62000],
    recent: [
      { op: "OP-18336", fecha: "24 jun", familia: "FUNDA", kg: 950, margen: 31.2 },
      { op: "OP-18269", fecha: "18 jun", familia: "FUNDA", kg: 1200, margen: 29.8 },
      { op: "OP-18198", fecha: "9 jun", familia: "LAMINADO", kg: 1850, margen: 32.4 },
      { op: "OP-18110", fecha: "30 may", familia: "BOLSA", kg: 540, margen: 27.6 },
    ],
  },
  {
    name: "AgroVerde Cía. Ltda.",
    revenue: 298700, marginPct: 18.9, scrapPct: 15.4, ops: 341,
    monthly: [47000, 44000, 51000, 48000, 53000, 55000],
    recent: [
      { op: "OP-18341", fecha: "24 jun", familia: "BOLSA", kg: 1600, margen: 17.8 },
      { op: "OP-18275", fecha: "19 jun", familia: "BOLSA", kg: 2100, margen: 16.9 },
      { op: "OP-18205", fecha: "11 jun", familia: "FUNDA", kg: 720, margen: 21.3 },
      { op: "OP-18118", fecha: "31 may", familia: "BOBINA", kg: 3300, margen: 20.1 },
    ],
  },
];

export type Vendor = {
  name: string;
  revenue: number;
  marginPct: number;
  scrapPct: number;
  ops: number;
  cumplimiento: number;
  topClients: { name: string; revenue: number }[];
};

export const VENDORS: Vendor[] = [
  {
    name: "María Anchundia", revenue: 1284000, marginPct: 31.2, scrapPct: 7.8, ops: 1418, cumplimiento: 103.2,
    topClients: [{ name: "Alimentos Páramo", revenue: 812400 }, { name: "Lácteos Cumbre", revenue: 288900 }],
  },
  {
    name: "Jorge Sandoval", revenue: 1092000, marginPct: 27.4, scrapPct: 9.2, ops: 1236, cumplimiento: 98.6,
    topClients: [{ name: "Frutandes S.A.", revenue: 694100 }, { name: "Snacks Kantu", revenue: 241200 }],
  },
  {
    name: "Lucía Terán", revenue: 941000, marginPct: 29.8, scrapPct: 8.1, ops: 1054, cumplimiento: 101.4,
    topClients: [{ name: "Café Altiplano", revenue: 402300 }, { name: "Lácteos Cumbre", revenue: 200000 }],
  },
  {
    name: "Andrés Peñafiel", revenue: 872000, marginPct: 24.9, scrapPct: 10.6, ops: 989, cumplimiento: 94.1,
    topClients: [{ name: "Pesquera del Golfo", revenue: 561800 }, { name: "AgroVerde Cía. Ltda.", revenue: 152700 }],
  },
  {
    name: "Carla Mideros", revenue: 703000, marginPct: 26.3, scrapPct: 9.8, ops: 812, cumplimiento: 97.2,
    topClients: [{ name: "Molinos del Sur", revenue: 377600 }, { name: "Frutandes S.A.", revenue: 118000 }],
  },
  {
    name: "Diego Rueda", revenue: 567000, marginPct: 21.7, scrapPct: 12.4, ops: 705, cumplimiento: 89.8,
    topClients: [{ name: "AgroVerde Cía. Ltda.", revenue: 146000 }, { name: "Molinos del Sur", revenue: 132000 }],
  },
];

/* ---------- floor: live orders ---------- */

export type LiveOrderState = "En producción" | "Pendiente OP" | "Atrasada" | "En cola";

export type LiveOrder = {
  op: string;
  entrega: string;
  cliente: string;
  etapa: string;
  maquina: string;
  kgPedido: number;
  kgProducido: number;
  mermaPct: number;
  estado: LiveOrderState;
  familia: string;
  material: string;
  margenPct: number;
  /** avance por etapa 0..1 para el modal */
  avance: { stage: Stage; pct: number }[];
};

export const LIVE_ORDERS: LiveOrder[] = [
  {
    op: "OP-18310", entrega: dateOffset(7), cliente: "Alimentos Páramo", etapa: "Impresión", maquina: "IM-01",
    kgPedido: 1850, kgProducido: 1130, mermaPct: 5.8, estado: "En producción", familia: "FUNDA", material: "PEBD", margenPct: 34.2,
    avance: [{ stage: "EXT", pct: 1 }, { stage: "IMP", pct: 0.55 }, { stage: "LAM", pct: 0 }, { stage: "COR", pct: 0 }],
  },
  {
    op: "OP-18312", entrega: dateOffset(8), cliente: "Frutandes S.A.", etapa: "Extrusión", maquina: "EX-02",
    kgPedido: 2400, kgProducido: 1680, mermaPct: 7.1, estado: "En producción", familia: "BOLSA", material: "PEAD", margenPct: 28.8,
    avance: [{ stage: "EXT", pct: 0.7 }, { stage: "IMP", pct: 0 }, { stage: "LAM", pct: 0 }, { stage: "COR", pct: 0 }],
  },
  {
    op: "OP-18318", entrega: dateOffset(6), cliente: "Lácteos Cumbre", etapa: "Extrusión", maquina: "EX-03",
    kgPedido: 3100, kgProducido: 940, mermaPct: 6.4, estado: "En producción", familia: "BOBINA", material: "PEBD", margenPct: 32.0,
    avance: [{ stage: "EXT", pct: 0.3 }, { stage: "COR", pct: 0 }, { stage: "SEL", pct: 0 }],
  },
  {
    op: "OP-18319", entrega: dateOffset(5), cliente: "Pesquera del Golfo", etapa: "Impresión", maquina: "IM-02",
    kgPedido: 1200, kgProducido: 610, mermaPct: 12.6, estado: "Atrasada", familia: "FUNDA", material: "POLIPROPILENO", margenPct: 22.4,
    avance: [{ stage: "EXT", pct: 1 }, { stage: "IMP", pct: 0.5 }, { stage: "SEL", pct: 0 }],
  },
  {
    op: "OP-18324", entrega: dateOffset(10), cliente: "Café Altiplano", etapa: "Laminación", maquina: "LA-01",
    kgPedido: 2750, kgProducido: 2010, mermaPct: 4.9, estado: "En producción", familia: "LAMINADO", material: "BOPP", margenPct: 36.4,
    avance: [{ stage: "EXT", pct: 1 }, { stage: "IMP", pct: 1 }, { stage: "LAM", pct: 0.4 }, { stage: "COR", pct: 0 }],
  },
  {
    op: "OP-18330", entrega: dateOffset(9), cliente: "Molinos del Sur", etapa: "Pendiente", maquina: "—",
    kgPedido: 4200, kgProducido: 0, mermaPct: 0, estado: "Pendiente OP", familia: "BOBINA", material: "PEBD", margenPct: 21.6,
    avance: [{ stage: "EXT", pct: 0 }, { stage: "IMP", pct: 0 }, { stage: "LAM", pct: 0 }],
  },
  {
    op: "OP-18336", entrega: dateOffset(11), cliente: "Snacks Kantu", etapa: "Pendiente", maquina: "—",
    kgPedido: 950, kgProducido: 0, mermaPct: 0, estado: "Pendiente OP", familia: "FUNDA", material: "BOPP", margenPct: 31.2,
    avance: [{ stage: "EXT", pct: 0 }, { stage: "IMP", pct: 0 }, { stage: "COR", pct: 0 }],
  },
  {
    op: "OP-18341", entrega: dateOffset(4), cliente: "AgroVerde Cía. Ltda.", etapa: "Sellado", maquina: "SE-01",
    kgPedido: 1600, kgProducido: 1490, mermaPct: 9.3, estado: "En producción", familia: "BOLSA", material: "PEAD", margenPct: 17.8,
    avance: [{ stage: "COR", pct: 1 }, { stage: "SEL", pct: 0.8 }],
  },
  {
    op: "OP-18344", entrega: dateOffset(9), cliente: "Lácteos Cumbre", etapa: "Pendiente", maquina: "—",
    kgPedido: 2050, kgProducido: 0, mermaPct: 0, estado: "En cola", familia: "FUNDA", material: "PEBD", margenPct: 33.5,
    avance: [{ stage: "EXT", pct: 0 }, { stage: "LAM", pct: 0 }, { stage: "SEL", pct: 0 }],
  },
  {
    op: "OP-18305", entrega: dateOffset(2), cliente: "Frutandes S.A.", etapa: "Corte", maquina: "CO-02",
    kgPedido: 1450, kgProducido: 1398, mermaPct: 8.2, estado: "Atrasada", familia: "BOLSA", material: "PEAD", margenPct: 26.1,
    avance: [{ stage: "EXT", pct: 1 }, { stage: "IMP", pct: 1 }, { stage: "COR", pct: 0.9 }],
  },
];

/* ---------- scheduler ---------- */

export const HORIZON_DAYS = 14;

export type Segment = { stage: Stage; machine: string; start: number; dur: number };

export type PlanOrder = {
  id: string;
  cliente: string;
  producto: string;
  kg: number;
  entregaDay: number;
  estado: "En producción" | "Por crear OP" | "Cotizado";
  ruta: Stage[];
  /** plan visible desde el inicio */
  segments: Segment[];
  /** plan tras "Planificar todo" (⊇ segments para órdenes ya planificadas) */
  plannedSegments: Segment[];
};

export const PLAN_ORDERS: PlanOrder[] = [
  {
    id: "OP-18310", cliente: "Alimentos Páramo", producto: "Funda laminada 30×45", kg: 1850, entregaDay: 7,
    estado: "En producción", ruta: ["EXT", "IMP", "LAM", "COR"],
    segments: [
      { stage: "EXT", machine: "EX-01", start: 0, dur: 2 },
      { stage: "IMP", machine: "IM-01", start: 2, dur: 2 },
      { stage: "LAM", machine: "LA-01", start: 4, dur: 2 },
      { stage: "COR", machine: "CO-01", start: 6, dur: 1 },
    ],
    plannedSegments: [],
  },
  {
    id: "OP-18312", cliente: "Frutandes S.A.", producto: "Bolsa impresa 25×35", kg: 2400, entregaDay: 8,
    estado: "En producción", ruta: ["EXT", "IMP", "LAM", "COR"],
    segments: [
      { stage: "EXT", machine: "EX-02", start: 0, dur: 3 },
      { stage: "IMP", machine: "IM-01", start: 4, dur: 2 },
      { stage: "LAM", machine: "LA-02", start: 6, dur: 2 },
      { stage: "COR", machine: "CO-03", start: 8, dur: 1 },
    ],
    plannedSegments: [],
  },
  {
    id: "OP-18318", cliente: "Lácteos Cumbre", producto: "Bobina PEBD 60cm", kg: 3100, entregaDay: 6,
    estado: "En producción", ruta: ["EXT", "COR", "SEL"],
    segments: [
      { stage: "EXT", machine: "EX-03", start: 1, dur: 3 },
      { stage: "COR", machine: "CO-01", start: 4, dur: 1 },
      { stage: "SEL", machine: "SE-02", start: 5, dur: 2 },
    ],
    plannedSegments: [],
  },
  {
    id: "OP-18319", cliente: "Pesquera del Golfo", producto: "Funda sellada 40×60", kg: 1200, entregaDay: 5,
    estado: "En producción", ruta: ["EXT", "IMP", "SEL"],
    segments: [
      { stage: "EXT", machine: "EX-03", start: 0, dur: 1 },
      { stage: "IMP", machine: "IM-02", start: 1, dur: 2 },
      { stage: "SEL", machine: "SE-01", start: 5, dur: 2 },
    ],
    plannedSegments: [],
  },
  {
    id: "OP-18324", cliente: "Café Altiplano", producto: "Laminado BOPP metalizado", kg: 2750, entregaDay: 10,
    estado: "Por crear OP", ruta: ["EXT", "IMP", "LAM", "COR"],
    segments: [
      { stage: "EXT", machine: "EX-01", start: 2, dur: 2 },
      { stage: "IMP", machine: "IM-02", start: 4, dur: 2 },
      { stage: "LAM", machine: "LA-01", start: 6, dur: 2 },
      { stage: "COR", machine: "CO-02", start: 8, dur: 1 },
    ],
    plannedSegments: [],
  },
  {
    id: "OP-18330", cliente: "Molinos del Sur", producto: "Bobina impresa 80cm", kg: 4200, entregaDay: 9,
    estado: "Por crear OP", ruta: ["EXT", "IMP", "LAM"],
    segments: [
      { stage: "EXT", machine: "EX-02", start: 3, dur: 3 },
      { stage: "IMP", machine: "IM-01", start: 6, dur: 2 },
      { stage: "LAM", machine: "LA-02", start: 8, dur: 2 },
    ],
    plannedSegments: [],
  },
  {
    id: "OP-18336", cliente: "Snacks Kantu", producto: "Funda troquelada 20×30", kg: 950, entregaDay: 11,
    estado: "Por crear OP", ruta: ["EXT", "IMP", "COR"],
    segments: [
      { stage: "EXT", machine: "EX-01", start: 5, dur: 2 },
      { stage: "IMP", machine: "IM-02", start: 7, dur: 2 },
      { stage: "COR", machine: "CO-01", start: 9, dur: 1 },
    ],
    plannedSegments: [],
  },
  {
    id: "OP-18341", cliente: "AgroVerde Cía. Ltda.", producto: "Bolsa PEAD industrial", kg: 1600, entregaDay: 4,
    estado: "En producción", ruta: ["COR", "SEL"],
    segments: [
      { stage: "COR", machine: "CO-02", start: 0, dur: 2 },
      { stage: "SEL", machine: "SE-01", start: 2, dur: 2 },
    ],
    plannedSegments: [],
  },
  {
    id: "OP-18344", cliente: "Lácteos Cumbre", producto: "Funda laminada 35×50", kg: 2050, entregaDay: 9,
    estado: "Por crear OP", ruta: ["EXT", "LAM", "SEL"],
    segments: [
      { stage: "EXT", machine: "EX-03", start: 4, dur: 2 },
      { stage: "LAM", machine: "LA-02", start: 6, dur: 2 },
      { stage: "SEL", machine: "SE-02", start: 8, dur: 2 },
    ],
    plannedSegments: [],
  },
  /* ---- sin plan hasta "Planificar todo" ---- */
  {
    id: "OP-18347", cliente: "Alimentos Páramo", producto: "Funda impresa 28×40", kg: 1300, entregaDay: 12,
    estado: "Por crear OP", ruta: ["EXT", "IMP", "COR"],
    segments: [],
    plannedSegments: [
      { stage: "EXT", machine: "EX-01", start: 7, dur: 2 },
      { stage: "IMP", machine: "IM-01", start: 9, dur: 2 },
      { stage: "COR", machine: "CO-01", start: 11, dur: 1 },
    ],
  },
  {
    id: "OP-18350", cliente: "Frutandes S.A.", producto: "Bobina laminada 70cm", kg: 3600, entregaDay: 13,
    estado: "Por crear OP", ruta: ["EXT", "IMP", "LAM"],
    segments: [],
    plannedSegments: [
      { stage: "EXT", machine: "EX-02", start: 7, dur: 3 },
      { stage: "IMP", machine: "IM-02", start: 10, dur: 2 },
      { stage: "LAM", machine: "LA-01", start: 12, dur: 2 },
    ],
  },
  {
    id: "OP-18352", cliente: "Pesquera del Golfo", producto: "Funda congelados 45×65", kg: 1750, entregaDay: 12,
    estado: "Por crear OP", ruta: ["EXT", "IMP"],
    segments: [],
    plannedSegments: [
      { stage: "EXT", machine: "EX-01", start: 9, dur: 2 },
      { stage: "IMP", machine: "IM-01", start: 11, dur: 2 },
    ],
  },
  {
    id: "COT-2214", cliente: "Café Altiplano", producto: "Laminado BOPP mate", kg: 2200, entregaDay: 13,
    estado: "Cotizado", ruta: ["EXT", "LAM", "SEL"],
    segments: [],
    plannedSegments: [
      { stage: "EXT", machine: "EX-03", start: 7, dur: 2 },
      { stage: "LAM", machine: "LA-02", start: 10, dur: 2 },
      { stage: "SEL", machine: "SE-02", start: 12, dur: 1 },
    ],
  },
];

/* ---------- vs Realidad (backtest) ---------- */

export const BACKTEST = {
  realOnTime: 71.4,
  algoOnTime: 89.2,
  ceilingOnTime: 94.6,
  opsSaved: 986,
  lateDaysAvoided: 2914,
  kgSaved: 418000,
  evaluated: 5486,
  monthlyReal: [64, 66, 63, 68, 70, 67, 71, 69, 72, 74, 73, 75],
  monthlyAlgo: [83, 85, 84, 87, 88, 86, 89, 88, 90, 91, 90, 92],
  monthlyCeiling: [90, 91, 90, 92, 93, 92, 94, 93, 95, 95, 94, 96],
  outcomes: [
    { label: "A tiempo en ambos", value: 3410, colorVar: "var(--st-ext)" },
    { label: "Salvadas por el algoritmo", value: 986, colorVar: "var(--st-cor)" },
    { label: "Tarde en ambos", value: 748, colorVar: "var(--danger)" },
    { label: "Sin margen de mejora", value: 342, colorVar: "var(--mute)" },
  ],
  topSaved: [
    { op: "OP-17204", cliente: "Alimentos Páramo", producto: "Funda laminada 30×45", kg: 2100, ruta: "EXT → IMP → LAM", entrega: "14 abr", realLate: 6, algoLate: 0, saved: 6 },
    { op: "OP-17311", cliente: "Molinos del Sur", producto: "Bobina impresa 80cm", kg: 3900, ruta: "EXT → IMP", entrega: "29 abr", realLate: 5, algoLate: 0, saved: 5 },
    { op: "OP-17186", cliente: "Pesquera del Golfo", producto: "Funda congelados 45×65", kg: 1680, ruta: "EXT → IMP → SEL", entrega: "8 abr", realLate: 5, algoLate: 1, saved: 4 },
    { op: "OP-17402", cliente: "Frutandes S.A.", producto: "Bolsa impresa 25×35", kg: 1240, ruta: "EXT → IMP → COR", entrega: "12 may", realLate: 4, algoLate: 0, saved: 4 },
    { op: "OP-17458", cliente: "Lácteos Cumbre", producto: "Bobina PEBD 60cm", kg: 2860, ruta: "EXT → COR → SEL", entrega: "20 may", realLate: 4, algoLate: 1, saved: 3 },
    { op: "OP-17529", cliente: "Snacks Kantu", producto: "Funda troquelada 20×30", kg: 720, ruta: "EXT → IMP → COR", entrega: "2 jun", realLate: 3, algoLate: 0, saved: 3 },
  ],
};
