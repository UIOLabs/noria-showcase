/**
 * Noria Plant OS — demo data. Everything is fictional: "Flexopack Andina" is
 * an invented flexible-packaging factory, "VETRA ERP" an invented ERP, and all
 * clients, salespeople, machines and figures are fabricated.
 * All data is static module constants so server/client renders match.
 * Display copy is { en, es }; the Spanish strings used as keys (machine and
 * order states, product families, materials) map to labels below.
 */

import type { Locale, Text } from "@/lib/i18n";
import { useLocale } from "@/components/i18n/LocaleProvider";

/* ---------- formatting ---------- */

function makeFormatters(tag: string) {
  const usd = new Intl.NumberFormat(tag, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  const num = new Intl.NumberFormat(tag, { maximumFractionDigits: 0 });
  const pct = new Intl.NumberFormat(tag, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  return {
    fmtUSD: (n: number) => usd.format(n),
    fmtNum: (n: number) => num.format(n),
    fmtPct: (n: number) => `${pct.format(n)}%`,
    /** One decimal, no unit (percentage-point deltas). */
    fmtDec: (n: number) => pct.format(n),
  };
}

const FORMATTERS: Record<Locale, ReturnType<typeof makeFormatters>> = {
  en: makeFormatters("en-US"),
  es: makeFormatters("es-EC"),
};

/** Number formatters for the active locale ($1,234 vs $1.234). */
export function useFmt() {
  return FORMATTERS[useLocale()];
}

/** Fixed demo "today" so every render is deterministic. */
export const DEMO_TODAY = new Date(2026, 5, 24); // 24 jun 2026

// Spelled out rather than toLocaleDateString so Node (build) and the browser
// always print the same thing.
const DOWS: Record<Locale, string[]> = {
  en: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  es: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"],
};
const MONTHS_SHORT: Record<Locale, string[]> = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  es: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
};

export function dayLabel(offset: number, locale: Locale): { dow: string; date: string; weekend: boolean } {
  const d = new Date(DEMO_TODAY);
  d.setDate(d.getDate() + offset);
  return {
    dow: DOWS[locale][d.getDay()],
    date: locale === "en" ? `${d.getMonth() + 1}/${d.getDate()}` : `${d.getDate()}/${d.getMonth() + 1}`,
    weekend: d.getDay() === 0 || d.getDay() === 6,
  };
}

/** "Jun 30" / "30 jun" for a day offset from the demo's today. */
export function dateOffset(offset: number, locale: Locale): string {
  const d = new Date(DEMO_TODAY);
  d.setDate(d.getDate() + offset);
  const month = MONTHS_SHORT[locale][d.getMonth()];
  return locale === "en" ? `${month} ${d.getDate()}` : `${d.getDate()} ${month}`;
}

/** The demo's fixed "today" in the top bar. */
export const TODAY_LABEL: Text = { en: "Wed, Jun 24, 2026", es: "mié, 24 jun 2026" };

/* ---------- stages & machines ---------- */

export type Stage = "EXT" | "IMP" | "LAM" | "COR" | "SEL";

export const STAGES: {
  key: Stage;
  name: Text;
  color: string;
  ink: string;
}[] = [
  { key: "EXT", name: { en: "Extrusion", es: "Extrusión" }, color: "var(--st-ext)", ink: "var(--st-ext-ink)" },
  { key: "IMP", name: { en: "Printing", es: "Impresión" }, color: "var(--st-imp)", ink: "var(--st-imp-ink)" },
  { key: "LAM", name: { en: "Lamination", es: "Laminación" }, color: "var(--st-lam)", ink: "var(--st-lam-ink)" },
  { key: "COR", name: { en: "Cutting", es: "Corte" }, color: "var(--st-cor)", ink: "var(--st-cor-ink)" },
  { key: "SEL", name: { en: "Sealing", es: "Sellado" }, color: "var(--st-sel)", ink: "var(--st-sel-ink)" },
];

export const stageByKey = (k: Stage) => STAGES.find((s) => s.key === k)!;

export type MachineState = "Operativa" | "En cambio" | "Mantenimiento";

/** Display labels for every state key (machines and orders). */
export const STATE_LABEL: Record<string, Text> = {
  "En producción": { en: "In production", es: "En producción" },
  "Pendiente OP": { en: "WO pending", es: "Pendiente OP" },
  "Por crear OP": { en: "WO not created", es: "Por crear OP" },
  Atrasada: { en: "Late", es: "Atrasada" },
  "En cola": { en: "Queued", es: "En cola" },
  Cotizado: { en: "Quoted", es: "Cotizado" },
  Operativa: { en: "Running", es: "Operativa" },
  "En cambio": { en: "Changeover", es: "En cambio" },
  Mantenimiento: { en: "Maintenance", es: "Mantenimiento" },
};

export const FAMILY_LABEL: Record<string, Text> = {
  FUNDA: { en: "POUCH", es: "FUNDA" },
  BOLSA: { en: "BAG", es: "BOLSA" },
  BOBINA: { en: "ROLL", es: "BOBINA" },
  LAMINADO: { en: "LAMINATE", es: "LAMINADO" },
};

export const MATERIAL_LABEL: Record<string, Text> = {
  PEBD: { en: "LDPE", es: "PEBD" },
  PEAD: { en: "HDPE", es: "PEAD" },
  POLIPROPILENO: { en: "POLYPROPYLENE", es: "POLIPROPILENO" },
  BOPP: { en: "BOPP", es: "BOPP" },
};

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

export const MONTHS_12: Record<Locale, string[]> = {
  en: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  es: ["Jul", "Ago", "Sep", "Oct", "Nov", "Dic", "Ene", "Feb", "Mar", "Abr", "May", "Jun"],
};

/** Last six months, for the client drill-down. */
export const MONTHS_6: Record<Locale, string[]> = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  es: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
};

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
  recent: { op: string; fecha: Text; familia: string; kg: number; margen: number }[];
};

export const CLIENTS: Client[] = [
  {
    name: "Alimentos Páramo",
    revenue: 812400, marginPct: 33.8, scrapPct: 6.9, ops: 642,
    monthly: [118000, 124000, 131000, 127000, 138000, 142000],
    recent: [
      { op: "OP-18310", fecha: { en: "Jun 22", es: "22 jun" }, familia: "FUNDA", kg: 1850, margen: 34.2 },
      { op: "OP-18244", fecha: { en: "Jun 15", es: "15 jun" }, familia: "LAMINADO", kg: 2400, margen: 31.7 },
      { op: "OP-18187", fecha: { en: "Jun 6", es: "6 jun" }, familia: "FUNDA", kg: 1600, margen: 35.1 },
      { op: "OP-18102", fecha: { en: "May 28", es: "28 may" }, familia: "BOLSA", kg: 980, margen: 29.4 },
    ],
  },
  {
    name: "Frutandes S.A.",
    revenue: 694100, marginPct: 29.2, scrapPct: 8.4, ops: 518,
    monthly: [102000, 98000, 111000, 108000, 116000, 121000],
    recent: [
      { op: "OP-18312", fecha: { en: "Jun 23", es: "23 jun" }, familia: "BOLSA", kg: 2400, margen: 28.8 },
      { op: "OP-18220", fecha: { en: "Jun 12", es: "12 jun" }, familia: "BOBINA", kg: 3800, margen: 27.2 },
      { op: "OP-18155", fecha: { en: "Jun 3", es: "3 jun" }, familia: "BOLSA", kg: 1450, margen: 30.6 },
      { op: "OP-18071", fecha: { en: "May 24", es: "24 may" }, familia: "FUNDA", kg: 760, margen: 24.1 },
    ],
  },
  {
    name: "Pesquera del Golfo",
    revenue: 561800, marginPct: 24.6, scrapPct: 11.2, ops: 447,
    monthly: [88000, 92000, 84000, 96000, 91000, 99000],
    recent: [
      { op: "OP-18319", fecha: { en: "Jun 23", es: "23 jun" }, familia: "FUNDA", kg: 1200, margen: 22.4 },
      { op: "OP-18201", fecha: { en: "Jun 10", es: "10 jun" }, familia: "LAMINADO", kg: 2900, margen: 25.8 },
      { op: "OP-18134", fecha: { en: "Jun 1", es: "1 jun" }, familia: "FUNDA", kg: 1750, margen: 23.9 },
      { op: "OP-18043", fecha: { en: "May 21", es: "21 may" }, familia: "BOBINA", kg: 4100, margen: 26.3 },
    ],
  },
  {
    name: "Lácteos Cumbre",
    revenue: 488900, marginPct: 31.4, scrapPct: 7.6, ops: 396,
    monthly: [74000, 79000, 82000, 78000, 86000, 89000],
    recent: [
      { op: "OP-18318", fecha: { en: "Jun 22", es: "22 jun" }, familia: "BOBINA", kg: 3100, margen: 32.0 },
      { op: "OP-18232", fecha: { en: "Jun 13", es: "13 jun" }, familia: "FUNDA", kg: 1400, margen: 30.8 },
      { op: "OP-18166", fecha: { en: "Jun 4", es: "4 jun" }, familia: "LAMINADO", kg: 2050, margen: 33.5 },
      { op: "OP-18089", fecha: { en: "May 26", es: "26 may" }, familia: "FUNDA", kg: 890, margen: 28.7 },
    ],
  },
  {
    name: "Café Altiplano",
    revenue: 402300, marginPct: 35.1, scrapPct: 6.2, ops: 312,
    monthly: [61000, 64000, 69000, 66000, 72000, 70000],
    recent: [
      { op: "OP-18324", fecha: { en: "Jun 23", es: "23 jun" }, familia: "LAMINADO", kg: 2750, margen: 36.4 },
      { op: "OP-18248", fecha: { en: "Jun 16", es: "16 jun" }, familia: "LAMINADO", kg: 1900, margen: 34.9 },
      { op: "OP-18172", fecha: { en: "Jun 5", es: "5 jun" }, familia: "BOLSA", kg: 620, margen: 33.2 },
      { op: "COT-2214", fecha: { en: "Jun 20", es: "20 jun" }, familia: "LAMINADO", kg: 2200, margen: 35.5 },
    ],
  },
  {
    name: "Molinos del Sur",
    revenue: 377600, marginPct: 22.1, scrapPct: 13.8, ops: 358,
    monthly: [58000, 62000, 55000, 66000, 63000, 68000],
    recent: [
      { op: "OP-18330", fecha: { en: "Jun 24", es: "24 jun" }, familia: "BOBINA", kg: 4200, margen: 21.6 },
      { op: "OP-18261", fecha: { en: "Jun 17", es: "17 jun" }, familia: "BOBINA", kg: 3600, margen: 20.4 },
      { op: "OP-18190", fecha: { en: "Jun 8", es: "8 jun" }, familia: "FUNDA", kg: 1150, margen: 24.8 },
      { op: "OP-18104", fecha: { en: "May 29", es: "29 may" }, familia: "BOLSA", kg: 840, margen: 19.2 },
    ],
  },
  {
    name: "Snacks Kantu",
    revenue: 341200, marginPct: 30.6, scrapPct: 9.1, ops: 287,
    monthly: [51000, 54000, 58000, 55000, 61000, 62000],
    recent: [
      { op: "OP-18336", fecha: { en: "Jun 24", es: "24 jun" }, familia: "FUNDA", kg: 950, margen: 31.2 },
      { op: "OP-18269", fecha: { en: "Jun 18", es: "18 jun" }, familia: "FUNDA", kg: 1200, margen: 29.8 },
      { op: "OP-18198", fecha: { en: "Jun 9", es: "9 jun" }, familia: "LAMINADO", kg: 1850, margen: 32.4 },
      { op: "OP-18110", fecha: { en: "May 30", es: "30 may" }, familia: "BOLSA", kg: 540, margen: 27.6 },
    ],
  },
  {
    name: "AgroVerde Cía. Ltda.",
    revenue: 298700, marginPct: 18.9, scrapPct: 15.4, ops: 341,
    monthly: [47000, 44000, 51000, 48000, 53000, 55000],
    recent: [
      { op: "OP-18341", fecha: { en: "Jun 24", es: "24 jun" }, familia: "BOLSA", kg: 1600, margen: 17.8 },
      { op: "OP-18275", fecha: { en: "Jun 19", es: "19 jun" }, familia: "BOLSA", kg: 2100, margen: 16.9 },
      { op: "OP-18205", fecha: { en: "Jun 11", es: "11 jun" }, familia: "FUNDA", kg: 720, margen: 21.3 },
      { op: "OP-18118", fecha: { en: "May 31", es: "31 may" }, familia: "BOBINA", kg: 3300, margen: 20.1 },
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
  /** delivery, as a day offset from today */
  entregaDay: number;
  cliente: string;
  /** current stage; null until the WO is released */
  etapa: Stage | null;
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
    op: "OP-18310", entregaDay: 7, cliente: "Alimentos Páramo", etapa: "IMP", maquina: "IM-01",
    kgPedido: 1850, kgProducido: 1130, mermaPct: 5.8, estado: "En producción", familia: "FUNDA", material: "PEBD", margenPct: 34.2,
    avance: [{ stage: "EXT", pct: 1 }, { stage: "IMP", pct: 0.55 }, { stage: "LAM", pct: 0 }, { stage: "COR", pct: 0 }],
  },
  {
    op: "OP-18312", entregaDay: 8, cliente: "Frutandes S.A.", etapa: "EXT", maquina: "EX-02",
    kgPedido: 2400, kgProducido: 1680, mermaPct: 7.1, estado: "En producción", familia: "BOLSA", material: "PEAD", margenPct: 28.8,
    avance: [{ stage: "EXT", pct: 0.7 }, { stage: "IMP", pct: 0 }, { stage: "LAM", pct: 0 }, { stage: "COR", pct: 0 }],
  },
  {
    op: "OP-18318", entregaDay: 6, cliente: "Lácteos Cumbre", etapa: "EXT", maquina: "EX-03",
    kgPedido: 3100, kgProducido: 940, mermaPct: 6.4, estado: "En producción", familia: "BOBINA", material: "PEBD", margenPct: 32.0,
    avance: [{ stage: "EXT", pct: 0.3 }, { stage: "COR", pct: 0 }, { stage: "SEL", pct: 0 }],
  },
  {
    op: "OP-18319", entregaDay: 5, cliente: "Pesquera del Golfo", etapa: "IMP", maquina: "IM-02",
    kgPedido: 1200, kgProducido: 610, mermaPct: 12.6, estado: "Atrasada", familia: "FUNDA", material: "POLIPROPILENO", margenPct: 22.4,
    avance: [{ stage: "EXT", pct: 1 }, { stage: "IMP", pct: 0.5 }, { stage: "SEL", pct: 0 }],
  },
  {
    op: "OP-18324", entregaDay: 10, cliente: "Café Altiplano", etapa: "LAM", maquina: "LA-01",
    kgPedido: 2750, kgProducido: 2010, mermaPct: 4.9, estado: "En producción", familia: "LAMINADO", material: "BOPP", margenPct: 36.4,
    avance: [{ stage: "EXT", pct: 1 }, { stage: "IMP", pct: 1 }, { stage: "LAM", pct: 0.4 }, { stage: "COR", pct: 0 }],
  },
  {
    op: "OP-18330", entregaDay: 9, cliente: "Molinos del Sur", etapa: null, maquina: "—",
    kgPedido: 4200, kgProducido: 0, mermaPct: 0, estado: "Pendiente OP", familia: "BOBINA", material: "PEBD", margenPct: 21.6,
    avance: [{ stage: "EXT", pct: 0 }, { stage: "IMP", pct: 0 }, { stage: "LAM", pct: 0 }],
  },
  {
    op: "OP-18336", entregaDay: 11, cliente: "Snacks Kantu", etapa: null, maquina: "—",
    kgPedido: 950, kgProducido: 0, mermaPct: 0, estado: "Pendiente OP", familia: "FUNDA", material: "BOPP", margenPct: 31.2,
    avance: [{ stage: "EXT", pct: 0 }, { stage: "IMP", pct: 0 }, { stage: "COR", pct: 0 }],
  },
  {
    op: "OP-18341", entregaDay: 4, cliente: "AgroVerde Cía. Ltda.", etapa: "SEL", maquina: "SE-01",
    kgPedido: 1600, kgProducido: 1490, mermaPct: 9.3, estado: "En producción", familia: "BOLSA", material: "PEAD", margenPct: 17.8,
    avance: [{ stage: "COR", pct: 1 }, { stage: "SEL", pct: 0.8 }],
  },
  {
    op: "OP-18344", entregaDay: 9, cliente: "Lácteos Cumbre", etapa: null, maquina: "—",
    kgPedido: 2050, kgProducido: 0, mermaPct: 0, estado: "En cola", familia: "FUNDA", material: "PEBD", margenPct: 33.5,
    avance: [{ stage: "EXT", pct: 0 }, { stage: "LAM", pct: 0 }, { stage: "SEL", pct: 0 }],
  },
  {
    op: "OP-18305", entregaDay: 2, cliente: "Frutandes S.A.", etapa: "COR", maquina: "CO-02",
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
  producto: Text;
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
    id: "OP-18310", cliente: "Alimentos Páramo", producto: { en: "Laminated pouch 30×45", es: "Funda laminada 30×45" }, kg: 1850, entregaDay: 7,
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
    id: "OP-18312", cliente: "Frutandes S.A.", producto: { en: "Printed bag 25×35", es: "Bolsa impresa 25×35" }, kg: 2400, entregaDay: 8,
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
    id: "OP-18318", cliente: "Lácteos Cumbre", producto: { en: "LDPE roll 60 cm", es: "Bobina PEBD 60cm" }, kg: 3100, entregaDay: 6,
    estado: "En producción", ruta: ["EXT", "COR", "SEL"],
    segments: [
      { stage: "EXT", machine: "EX-03", start: 1, dur: 3 },
      { stage: "COR", machine: "CO-01", start: 4, dur: 1 },
      { stage: "SEL", machine: "SE-02", start: 5, dur: 2 },
    ],
    plannedSegments: [],
  },
  {
    id: "OP-18319", cliente: "Pesquera del Golfo", producto: { en: "Sealed pouch 40×60", es: "Funda sellada 40×60" }, kg: 1200, entregaDay: 5,
    estado: "En producción", ruta: ["EXT", "IMP", "SEL"],
    segments: [
      { stage: "EXT", machine: "EX-03", start: 0, dur: 1 },
      { stage: "IMP", machine: "IM-02", start: 1, dur: 2 },
      { stage: "SEL", machine: "SE-01", start: 5, dur: 2 },
    ],
    plannedSegments: [],
  },
  {
    id: "OP-18324", cliente: "Café Altiplano", producto: { en: "Metallized BOPP laminate", es: "Laminado BOPP metalizado" }, kg: 2750, entregaDay: 10,
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
    id: "OP-18330", cliente: "Molinos del Sur", producto: { en: "Printed roll 80 cm", es: "Bobina impresa 80cm" }, kg: 4200, entregaDay: 9,
    estado: "Por crear OP", ruta: ["EXT", "IMP", "LAM"],
    segments: [
      { stage: "EXT", machine: "EX-02", start: 3, dur: 3 },
      { stage: "IMP", machine: "IM-01", start: 6, dur: 2 },
      { stage: "LAM", machine: "LA-02", start: 8, dur: 2 },
    ],
    plannedSegments: [],
  },
  {
    id: "OP-18336", cliente: "Snacks Kantu", producto: { en: "Die-cut pouch 20×30", es: "Funda troquelada 20×30" }, kg: 950, entregaDay: 11,
    estado: "Por crear OP", ruta: ["EXT", "IMP", "COR"],
    segments: [
      { stage: "EXT", machine: "EX-01", start: 5, dur: 2 },
      { stage: "IMP", machine: "IM-02", start: 7, dur: 2 },
      { stage: "COR", machine: "CO-01", start: 9, dur: 1 },
    ],
    plannedSegments: [],
  },
  {
    id: "OP-18341", cliente: "AgroVerde Cía. Ltda.", producto: { en: "Industrial HDPE bag", es: "Bolsa PEAD industrial" }, kg: 1600, entregaDay: 4,
    estado: "En producción", ruta: ["COR", "SEL"],
    segments: [
      { stage: "COR", machine: "CO-02", start: 0, dur: 2 },
      { stage: "SEL", machine: "SE-01", start: 2, dur: 2 },
    ],
    plannedSegments: [],
  },
  {
    id: "OP-18344", cliente: "Lácteos Cumbre", producto: { en: "Laminated pouch 35×50", es: "Funda laminada 35×50" }, kg: 2050, entregaDay: 9,
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
    id: "OP-18347", cliente: "Alimentos Páramo", producto: { en: "Printed pouch 28×40", es: "Funda impresa 28×40" }, kg: 1300, entregaDay: 12,
    estado: "Por crear OP", ruta: ["EXT", "IMP", "COR"],
    segments: [],
    plannedSegments: [
      { stage: "EXT", machine: "EX-01", start: 7, dur: 2 },
      { stage: "IMP", machine: "IM-01", start: 9, dur: 2 },
      { stage: "COR", machine: "CO-01", start: 11, dur: 1 },
    ],
  },
  {
    id: "OP-18350", cliente: "Frutandes S.A.", producto: { en: "Laminated roll 70 cm", es: "Bobina laminada 70cm" }, kg: 3600, entregaDay: 13,
    estado: "Por crear OP", ruta: ["EXT", "IMP", "LAM"],
    segments: [],
    plannedSegments: [
      { stage: "EXT", machine: "EX-02", start: 7, dur: 3 },
      { stage: "IMP", machine: "IM-02", start: 10, dur: 2 },
      { stage: "LAM", machine: "LA-01", start: 12, dur: 2 },
    ],
  },
  {
    id: "OP-18352", cliente: "Pesquera del Golfo", producto: { en: "Frozen-food pouch 45×65", es: "Funda congelados 45×65" }, kg: 1750, entregaDay: 12,
    estado: "Por crear OP", ruta: ["EXT", "IMP"],
    segments: [],
    plannedSegments: [
      { stage: "EXT", machine: "EX-01", start: 9, dur: 2 },
      { stage: "IMP", machine: "IM-01", start: 11, dur: 2 },
    ],
  },
  {
    id: "COT-2214", cliente: "Café Altiplano", producto: { en: "Matte BOPP laminate", es: "Laminado BOPP mate" }, kg: 2200, entregaDay: 13,
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
    { label: { en: "On time in both", es: "A tiempo en ambos" } as Text, value: 3410, colorVar: "var(--st-ext)" },
    { label: { en: "Saved by the algorithm", es: "Salvadas por el algoritmo" } as Text, value: 986, colorVar: "var(--st-cor)" },
    { label: { en: "Late in both", es: "Tarde en ambos" } as Text, value: 748, colorVar: "var(--danger)" },
    { label: { en: "No room to improve", es: "Sin margen de mejora" } as Text, value: 342, colorVar: "var(--mute)" },
  ],
  topSaved: [
    { op: "OP-17204", cliente: "Alimentos Páramo", producto: { en: "Laminated pouch 30×45", es: "Funda laminada 30×45" }, kg: 2100, ruta: "EXT → IMP → LAM", entrega: { en: "Apr 14", es: "14 abr" }, realLate: 6, algoLate: 0, saved: 6 },
    { op: "OP-17311", cliente: "Molinos del Sur", producto: { en: "Printed roll 80 cm", es: "Bobina impresa 80cm" }, kg: 3900, ruta: "EXT → IMP", entrega: { en: "Apr 29", es: "29 abr" }, realLate: 5, algoLate: 0, saved: 5 },
    { op: "OP-17186", cliente: "Pesquera del Golfo", producto: { en: "Frozen-food pouch 45×65", es: "Funda congelados 45×65" }, kg: 1680, ruta: "EXT → IMP → SEL", entrega: { en: "Apr 8", es: "8 abr" }, realLate: 5, algoLate: 1, saved: 4 },
    { op: "OP-17402", cliente: "Frutandes S.A.", producto: { en: "Printed bag 25×35", es: "Bolsa impresa 25×35" }, kg: 1240, ruta: "EXT → IMP → COR", entrega: { en: "May 12", es: "12 may" }, realLate: 4, algoLate: 0, saved: 4 },
    { op: "OP-17458", cliente: "Lácteos Cumbre", producto: { en: "LDPE roll 60 cm", es: "Bobina PEBD 60cm" }, kg: 2860, ruta: "EXT → COR → SEL", entrega: { en: "May 20", es: "20 may" }, realLate: 4, algoLate: 1, saved: 3 },
    { op: "OP-17529", cliente: "Snacks Kantu", producto: { en: "Die-cut pouch 20×30", es: "Funda troquelada 20×30" }, kg: 720, ruta: "EXT → IMP → COR", entrega: { en: "Jun 2", es: "2 jun" }, realLate: 3, algoLate: 0, saved: 3 },
  ],
};
