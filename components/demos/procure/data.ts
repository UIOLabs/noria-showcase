/* Noria Procure — demo data. Everything here is fictional: companies, people,
   prices, and codes are invented for the showcase. Display copy is { en, es };
   the Spanish strings used as keys (risk, authorization state) map to labels. */

import type { Locale, Text } from "@/lib/i18n";
import { useLocale } from "@/components/i18n/LocaleProvider";

export type Risk = "Bajo" | "Medio" | "Alto";

export const RISK_LABEL: Record<Risk, Text> = {
  Bajo: { en: "Low", es: "Bajo" },
  Medio: { en: "Medium", es: "Medio" },
  Alto: { en: "High", es: "Alto" },
};

/** SIGA authorization states. */
export const AUTH_STATE_LABEL: Record<string, Text> = {
  Vigente: { en: "Active", es: "Vigente" },
  Pendiente: { en: "Pending", es: "Pendiente" },
};
export type QueueId =
  | "cotizacion"
  | "aprobacion"
  | "repetitiva"
  | "alerta"
  | "sinhistorial";

export const QUEUE_LABELS: Record<QueueId, Text> = {
  cotizacion: { en: "Awaiting quotes", es: "Pendiente de cotización" },
  aprobacion: { en: "Ready for approval", es: "Lista para aprobación" },
  repetitiva: { en: "Repeat purchase", es: "Compra repetitiva" },
  alerta: { en: "Price alert", es: "Alerta de precio" },
  sinhistorial: { en: "Not enough history", es: "Sin historial suficiente" },
};

export type Quote = {
  id: string;
  supplier: string;
  unitPrice: number;
  deliveryDays: number;
  paymentTerms: Text;
  validUntil: string;
  badges: Text[];
};

export type PurchaseRequest = {
  id: string;
  scenario: Text;
  queue: QueueId;
  priority: number;
  material: { code: string; name: Text; unit: Text; category: string };
  request: {
    quantity: number;
    date: string;
    area: Text;
    requester: string;
    approver: string;
    observation: Text;
  };
  history: {
    lastSupplier: string | null;
    lastPrice: number | null;
    averagePrice: number | null;
    lastPurchaseDate: string | null;
    previousPurchases: number;
    confidence: "Alta" | "Media" | "Baja";
  };
  authorization: {
    number: string;
    state: string;
    maxValue: number;
    expires: string;
    requester: string;
    approver: string;
  };
  quotes: Quote[];
  recommendation: { supplier: string; summary: Text; risk: Risk; savings: Text | null };
  flags: Text[];
  audit: Text[];
};

export type Rule = {
  id: string;
  material: Text;
  supplier: string;
  maxAuto: number;
  tolerance: Text;
  maxQty: Text;
  expires: string;
  requester: string;
  approver: string;
  note: Text;
};

function makeFormatters(tag: string) {
  const usd = new Intl.NumberFormat(tag, { style: "currency", currency: "USD", minimumFractionDigits: 2 });
  const num = new Intl.NumberFormat(tag);
  return { fmtUSD: (n: number) => usd.format(n), fmtNum: (n: number) => num.format(n) };
}

export type Formatters = ReturnType<typeof makeFormatters>;

export const FORMATTERS: Record<Locale, Formatters> = {
  en: makeFormatters("en-US"),
  es: makeFormatters("es-EC"),
};

/** Number formatters for the active locale ($1,234.50 vs $1.234,50). */
export function useFmt() {
  return FORMATTERS[useLocale()];
}

/** Tolerance choices offered when creating a rule. */
export const TOLERANCES: Text[] = [
  { en: "±3% over last price", es: "±3 % sobre último precio" },
  { en: "±5% over last price", es: "±5 % sobre último precio" },
  { en: "±8% over last price", es: "±8 % sobre último precio" },
];

export const REQUESTS: PurchaseRequest[] = [
  {
    id: "REQ-2026-0512",
    scenario: { en: "Low-risk repeat purchase", es: "Compra repetitiva de bajo riesgo" },
    queue: "repetitiva",
    priority: 1,
    material: {
      code: "MP-GLP-045",
      name: { en: "Industrial LPG · 45 kg cylinder", es: "Gas GLP industrial · cilindro 45 kg" },
      unit: { en: "CYL", es: "CIL" },
      category: "Energía",
    },
    request: {
      quantity: 120,
      date: "2026-07-03",
      area: { en: "Foam plant", es: "Planta Espuma" },
      requester: "M. Cárdenas",
      approver: "V. Salgado",
      observation: {
        en: "Fortnightly restock for the foaming lines. Consumption steady since January.",
        es: "Reposición quincenal para líneas de espumado. Consumo estable desde enero.",
      },
    },
    history: {
      lastSupplier: "GasAndes Distribución",
      lastPrice: 58.4,
      averagePrice: 58.1,
      lastPurchaseDate: "2026-06-19",
      previousPurchases: 14,
      confidence: "Alta",
    },
    authorization: {
      number: "AUT-8841",
      state: "Vigente",
      maxValue: 7500,
      expires: "2026-12-31",
      requester: "mcardenas",
      approver: "vsalgado",
    },
    quotes: [
      {
        id: "q1",
        supplier: "GasAndes Distribución",
        unitPrice: 58.9,
        deliveryDays: 2,
        paymentTerms: { en: "Net 30", es: "Crédito 30 días" },
        validUntil: "2026-07-18",
        badges: [{ en: "Incumbent supplier", es: "Proveedor histórico" }, { en: "48 h delivery", es: "Entrega 48 h" }],
      },
      {
        id: "q2",
        supplier: "Petrogas Oriente",
        unitPrice: 60.1,
        deliveryDays: 3,
        paymentTerms: { en: "Net 15", es: "Crédito 15 días" },
        validUntil: "2026-07-15",
        badges: [{ en: "New supplier", es: "Nuevo proveedor" }],
      },
      {
        id: "q3",
        supplier: "Andes Energía S.A.",
        unitPrice: 59.45,
        deliveryDays: 2,
        paymentTerms: { en: "Cash on delivery", es: "Contado" },
        validUntil: "2026-07-20",
        badges: [{ en: "Volume discount", es: "Descuento por volumen" }],
      },
    ],
    recommendation: {
      supplier: "GasAndes Distribución",
      summary: {
        en: "Price within the historical range (+0.9%), the best lead time, and 14 previous purchases without incident.",
        es: "Precio dentro del rango histórico (+0,9 %), mejor plazo de entrega y 14 compras previas sin incidencias.",
      },
      risk: "Bajo",
      savings: {
        en: "US$144 vs. the other offers' average",
        es: "US$ 144 vs. promedio de las otras ofertas",
      },
    },
    flags: [{ en: "Automation candidate", es: "Candidata a automatización" }],
    audit: [
      { en: "08:41 · SIGA synced the request (maereq31)", es: "08:41 · SIGA sincronizó la solicitud (maereq31)" },
      { en: "08:41 · History of 14 purchases loaded", es: "08:41 · Historial de 14 compras cargado" },
      { en: "08:42 · 3 quotes linked", es: "08:42 · 3 cotizaciones vinculadas" },
      { en: "08:42 · Recommendation generated: low risk", es: "08:42 · Recomendación generada: riesgo bajo" },
    ],
  },
  {
    id: "REQ-2026-0518",
    scenario: { en: "Usual supplier raised its price", es: "Alza de precio del proveedor habitual" },
    queue: "alerta",
    priority: 2,
    material: {
      code: "MP-CEM-050",
      name: { en: "General-purpose grey cement · 50 kg bag", es: "Cemento gris uso general · saco 50 kg" },
      unit: { en: "BAG", es: "SACO" },
      category: "Mantenimiento",
    },
    request: {
      quantity: 200,
      date: "2026-07-04",
      area: { en: "Maintenance", es: "Mantenimiento" },
      requester: "J. Riofrío",
      approver: "V. Salgado",
      observation: {
        en: "Civil works in warehouse 4: floor slab and shelving bases.",
        es: "Obra civil bodega 4: losa de piso y bases de estanterías.",
      },
    },
    history: {
      lastSupplier: "Cementera Valle Azul",
      lastPrice: 7.85,
      averagePrice: 7.9,
      lastPurchaseDate: "2026-04-28",
      previousPurchases: 6,
      confidence: "Alta",
    },
    authorization: {
      number: "AUT-8867",
      state: "Vigente",
      maxValue: 2000,
      expires: "2026-09-30",
      requester: "jriofrio",
      approver: "vsalgado",
    },
    quotes: [
      {
        id: "q1",
        supplier: "Cementera Valle Azul",
        unitPrice: 9.3,
        deliveryDays: 2,
        paymentTerms: { en: "Net 30", es: "Crédito 30 días" },
        validUntil: "2026-07-12",
        badges: [{ en: "Incumbent supplier", es: "Proveedor histórico" }, { en: "+18.5% vs. last purchase", es: "+18,5 % vs. última compra" }],
      },
      {
        id: "q2",
        supplier: "Cementos Sur Andina",
        unitPrice: 8.05,
        deliveryDays: 4,
        paymentTerms: { en: "Net 30", es: "Crédito 30 días" },
        validUntil: "2026-07-16",
        badges: [{ en: "Best price", es: "Mejor precio" }],
      },
      {
        id: "q3",
        supplier: "Distribuidora Ferrán",
        unitPrice: 8.4,
        deliveryDays: 3,
        paymentTerms: { en: "Cash on delivery", es: "Contado" },
        validUntil: "2026-07-14",
        badges: [],
      },
    ],
    recommendation: {
      supplier: "Cementos Sur Andina",
      summary: {
        en: "The usual supplier raised its price 18.5% with no recorded justification. Switching saves US$250 on this order; lead time grows by 2 days.",
        es: "El proveedor habitual subió 18,5 % sin justificación registrada. Cambiar evita US$ 250 en esta orden; el plazo sube 2 días.",
      },
      risk: "Alto",
      savings: { en: "US$250 vs. the usual supplier", es: "US$ 250 vs. proveedor habitual" },
    },
    flags: [{ en: "Price change above threshold", es: "Variación de precio sobre umbral" }, { en: "Needs manager approval", es: "Requiere aprobación de jefatura" }],
    audit: [
      { en: "08:43 · SIGA synced the request (maereq31)", es: "08:43 · SIGA sincronizó la solicitud (maereq31)" },
      { en: "08:43 · Alert: price +18.5% vs. last purchase", es: "08:43 · Alerta: precio +18,5 % vs. última compra" },
      { en: "08:44 · Recommendation generated: switch supplier", es: "08:44 · Recomendación generada: cambio de proveedor" },
    ],
  },
  {
    id: "REQ-2026-0521",
    scenario: { en: "Recommendation across scattered offers", es: "Recomendación con ofertas dispersas" },
    queue: "aprobacion",
    priority: 3,
    material: {
      code: "EM-CAJ-604",
      name: { en: "Corrugated cardboard box 60×40×40", es: "Caja de cartón corrugado 60×40×40" },
      unit: { en: "UNIT", es: "UNIDAD" },
      category: "Empaque",
    },
    request: {
      quantity: 3500,
      date: "2026-07-04",
      area: { en: "Packaging", es: "Empaque" },
      requester: "P. Salazar",
      approver: "V. Salgado",
      observation: {
        en: "August campaign: shipping volume doubles.",
        es: "Campaña de agosto: se duplica el volumen usual de despacho.",
      },
    },
    history: {
      lastSupplier: "Cartonajes Sierra Norte",
      lastPrice: 0.84,
      averagePrice: 0.83,
      lastPurchaseDate: "2026-06-02",
      previousPurchases: 9,
      confidence: "Alta",
    },
    authorization: {
      number: "AUT-8872",
      state: "Vigente",
      maxValue: 3200,
      expires: "2026-10-31",
      requester: "psalazar",
      approver: "vsalgado",
    },
    quotes: [
      {
        id: "q1",
        supplier: "Cartonajes Sierra Norte",
        unitPrice: 0.82,
        deliveryDays: 4,
        paymentTerms: { en: "Net 30", es: "Crédito 30 días" },
        validUntil: "2026-07-22",
        badges: [{ en: "Incumbent supplier", es: "Proveedor histórico" }],
      },
      {
        id: "q2",
        supplier: "Empaques Nova Sur",
        unitPrice: 0.86,
        deliveryDays: 3,
        paymentTerms: { en: "Net 45", es: "Crédito 45 días" },
        validUntil: "2026-07-19",
        badges: [{ en: "Best payment terms", es: "Mejor plazo de pago" }],
      },
      {
        id: "q3",
        supplier: "Corrupack Andina",
        unitPrice: 0.79,
        deliveryDays: 12,
        paymentTerms: { en: "50% upfront", es: "Anticipo 50 %" },
        validUntil: "2026-07-25",
        badges: [{ en: "Best price", es: "Mejor precio" }, { en: "12-day delivery", es: "Entrega 12 días" }],
      },
    ],
    recommendation: {
      supplier: "Cartonajes Sierra Norte",
      summary: {
        en: "The lowest price needs 12-day delivery and a deposit — too late for the campaign. The incumbent balances price and lead time.",
        es: "El precio más bajo exige 12 días de entrega y anticipo; no llega para la campaña. El histórico equilibra precio y plazo.",
      },
      risk: "Medio",
      savings: null,
    },
    flags: [{ en: "Unusual volume (+92%)", es: "Volumen atípico (+92 %)" }],
    audit: [
      { en: "08:45 · SIGA synced the request (maereq31)", es: "08:45 · SIGA sincronizó la solicitud (maereq31)" },
      { en: "08:45 · 3 quotes linked", es: "08:45 · 3 cotizaciones vinculadas" },
      { en: "08:46 · Recommendation generated: keep supplier", es: "08:46 · Recomendación generada: mantener proveedor" },
    ],
  },
  {
    id: "REQ-2026-0525",
    scenario: { en: "Third quote missing", es: "Falta tercera cotización" },
    queue: "cotizacion",
    priority: 4,
    material: {
      code: "EM-CAJ-KNG",
      name: { en: "Die-cut box, King mattress", es: "Caja troquelada colchón King" },
      unit: { en: "UNIT", es: "UNIDAD" },
      category: "Empaque",
    },
    request: {
      quantity: 900,
      date: "2026-07-05",
      area: { en: "Packaging", es: "Empaque" },
      requester: "P. Salazar",
      approver: "V. Salgado",
      observation: {
        en: "Reinforced King line launch; new die approved by design.",
        es: "Lanzamiento línea King reforzada; troquel nuevo aprobado por diseño.",
      },
    },
    history: {
      lastSupplier: "Cartonajes Sierra Norte",
      lastPrice: 1.88,
      averagePrice: 1.9,
      lastPurchaseDate: "2026-03-11",
      previousPurchases: 4,
      confidence: "Media",
    },
    authorization: {
      number: "AUT-8880",
      state: "Pendiente",
      maxValue: 2200,
      expires: "2026-08-31",
      requester: "psalazar",
      approver: "vsalgado",
    },
    quotes: [
      {
        id: "q1",
        supplier: "Cartonajes Sierra Norte",
        unitPrice: 1.94,
        deliveryDays: 6,
        paymentTerms: { en: "Net 30", es: "Crédito 30 días" },
        validUntil: "2026-07-20",
        badges: [{ en: "Incumbent supplier", es: "Proveedor histórico" }],
      },
      {
        id: "q2",
        supplier: "Empaques Nova Sur",
        unitPrice: 2.05,
        deliveryDays: 5,
        paymentTerms: { en: "Net 30", es: "Crédito 30 días" },
        validUntil: "2026-07-21",
        badges: [],
      },
    ],
    recommendation: {
      supplier: "Cartonajes Sierra Norte",
      summary: {
        en: "There are only 2 quotes and policy requires 3. The copilot has already drafted the request to a third supplier.",
        es: "Solo hay 2 cotizaciones y la política exige 3. El copiloto ya redactó la solicitud para un tercer proveedor.",
      },
      risk: "Medio",
      savings: null,
    },
    flags: [{ en: "Policy: 3 quotes minimum", es: "Política: mínimo 3 cotizaciones" }],
    audit: [
      { en: "08:47 · SIGA synced the request (maereq31)", es: "08:47 · SIGA sincronizó la solicitud (maereq31)" },
      { en: "08:47 · Only 2 quotes found", es: "08:47 · Solo 2 cotizaciones detectadas" },
      { en: "08:48 · Quote request email drafted by AI", es: "08:48 · Correo de solicitud redactado por IA" },
    ],
  },
  {
    id: "REQ-2026-0530",
    scenario: { en: "Price swing on a critical input", es: "Variación de precio en insumo crítico" },
    queue: "alerta",
    priority: 5,
    material: {
      code: "MP-HIL-402",
      name: {
        en: "Polyester quilting thread 40/2 · 3 kg cone",
        es: "Hilo de acolchado poliéster 40/2 · cono 3 kg",
      },
      unit: { en: "CONE", es: "CONO" },
      category: "Textil",
    },
    request: {
      quantity: 90,
      date: "2026-07-05",
      area: { en: "Quilting plant", es: "Planta Acolchado" },
      requester: "L. Mena",
      approver: "V. Salgado",
      observation: {
        en: "Critical stock: 6 days of production left at the current rate.",
        es: "Stock crítico: quedan 6 días de producción al ritmo actual.",
      },
    },
    history: {
      lastSupplier: "Textiles Rumiloma",
      lastPrice: 12.1,
      averagePrice: 12.35,
      lastPurchaseDate: "2026-05-30",
      previousPurchases: 11,
      confidence: "Alta",
    },
    authorization: {
      number: "AUT-8893",
      state: "Vigente",
      maxValue: 1500,
      expires: "2026-11-30",
      requester: "lmena",
      approver: "vsalgado",
    },
    quotes: [
      {
        id: "q1",
        supplier: "Textiles Rumiloma",
        unitPrice: 14.3,
        deliveryDays: 3,
        paymentTerms: { en: "Net 30", es: "Crédito 30 días" },
        validUntil: "2026-07-13",
        badges: [{ en: "Incumbent supplier", es: "Proveedor histórico" }, { en: "+18.2% vs. last purchase", es: "+18,2 % vs. última compra" }],
      },
      {
        id: "q2",
        supplier: "Hilandería Austral",
        unitPrice: 13.95,
        deliveryDays: 5,
        paymentTerms: { en: "Net 15", es: "Crédito 15 días" },
        validUntil: "2026-07-15",
        badges: [],
      },
      {
        id: "q3",
        supplier: "Fibratex Andina",
        unitPrice: 14.1,
        deliveryDays: 4,
        paymentTerms: { en: "Cash on delivery", es: "Contado" },
        validUntil: "2026-07-14",
        badges: [],
      },
    ],
    recommendation: {
      supplier: "Textiles Rumiloma",
      summary: {
        en: "The whole market rose ~15%: it's a raw-material increase, not the supplier. With stock this low, 3-day delivery wins.",
        es: "Todo el mercado subió ~15 %: es alza de materia prima, no del proveedor. Con stock crítico pesa la entrega en 3 días.",
      },
      risk: "Alto",
      savings: null,
    },
    flags: [{ en: "Market-wide price move", es: "Variación de mercado generalizada" }, { en: "Critical stock", es: "Stock crítico" }],
    audit: [
      { en: "08:49 · SIGA synced the request (maereq31)", es: "08:49 · SIGA sincronizó la solicitud (maereq31)" },
      { en: "08:49 · Alert: +15% across all 3 offers", es: "08:49 · Alerta: variación +15 % en las 3 ofertas" },
      { en: "08:50 · Recommendation generated: keep for lead time", es: "08:50 · Recomendación generada: mantener por plazo" },
    ],
  },
  {
    id: "REQ-2026-0533",
    scenario: { en: "New item with no history", es: "Ítem nuevo sin historial" },
    queue: "sinhistorial",
    priority: 6,
    material: {
      code: "MP-TEL-160",
      name: { en: "Fluid-resistant non-woven fabric 160 g/m²", es: "Tela no tejida antifluido 160 g/m²" },
      unit: { en: "M", es: "M" },
      category: "Textil",
    },
    request: {
      quantity: 1800,
      date: "2026-07-06",
      area: { en: "Product development", es: "Desarrollo de producto" },
      requester: "R. Guamán",
      approver: "V. Salgado",
      observation: {
        en: "Hospital-line prototype; first purchase of this material.",
        es: "Prototipo línea hospitalaria; primera compra de este material.",
      },
    },
    history: {
      lastSupplier: null,
      lastPrice: null,
      averagePrice: null,
      lastPurchaseDate: null,
      previousPurchases: 0,
      confidence: "Baja",
    },
    authorization: {
      number: "AUT-8901",
      state: "Pendiente",
      maxValue: 5000,
      expires: "2026-08-15",
      requester: "rguaman",
      approver: "vsalgado",
    },
    quotes: [
      {
        id: "q1",
        supplier: "Textiles Rumiloma",
        unitPrice: 2.35,
        deliveryDays: 6,
        paymentTerms: { en: "Net 30", es: "Crédito 30 días" },
        validUntil: "2026-07-24",
        badges: [{ en: "Known supplier", es: "Proveedor conocido" }],
      },
      {
        id: "q2",
        supplier: "NovaTejidos Cía. Ltda.",
        unitPrice: 2.18,
        deliveryDays: 8,
        paymentTerms: { en: "30% upfront", es: "Anticipo 30 %" },
        validUntil: "2026-07-22",
        badges: [{ en: "Best price", es: "Mejor precio" }, { en: "New supplier", es: "Proveedor nuevo" }],
      },
      {
        id: "q3",
        supplier: "Importadora Delta Sur",
        unitPrice: 2.5,
        deliveryDays: 4,
        paymentTerms: { en: "Cash on delivery", es: "Contado" },
        validUntil: "2026-07-19",
        badges: [{ en: "Fastest delivery", es: "Entrega más rápida" }],
      },
    ],
    recommendation: {
      supplier: "NovaTejidos Cía. Ltda.",
      summary: {
        en: "No price history: the AI compares the offers against each other only and suggests a manual quality review before awarding.",
        es: "Sin historial de precios: la IA compara solo entre ofertas y sugiere revisión manual de calidad antes de adjudicar.",
      },
      risk: "Alto",
      savings: null,
    },
    flags: [{ en: "No history in SIGA", es: "Sin historial en SIGA" }, { en: "Manual review suggested", es: "Revisión manual sugerida" }],
    audit: [
      { en: "08:51 · SIGA synced the request (maereq31)", es: "08:51 · SIGA sincronizó la solicitud (maereq31)" },
      { en: "08:51 · No previous purchases of code MP-TEL-160", es: "08:51 · Sin compras previas del código MP-TEL-160" },
      { en: "08:52 · Qualified recommendation: manual review", es: "08:52 · Recomendación con reserva: revisión manual" },
    ],
  },
  // ---- Backlog (bandeja) ----
  {
    id: "REQ-2026-0536",
    scenario: { en: "Inventory restock", es: "Reposición de inventario" },
    queue: "repetitiva",
    priority: 7,
    material: {
      code: "MP-RES-220",
      name: { en: "Bonnell steel spring 2.2 mm", es: "Resorte bonnell acero 2,2 mm" },
      unit: { en: "UNIT", es: "UNIDAD" },
      category: "Estructura",
    },
    request: {
      quantity: 15000,
      date: "2026-07-06",
      area: { en: "Assembly", es: "Ensamble" },
      requester: "M. Cárdenas",
      approver: "V. Salgado",
      observation: { en: "Scheduled monthly restock.", es: "Reposición mensual programada." },
    },
    history: {
      lastSupplier: "Aceros Cóndor S.A.",
      lastPrice: 0.145,
      averagePrice: 0.144,
      lastPurchaseDate: "2026-06-06",
      previousPurchases: 18,
      confidence: "Alta",
    },
    authorization: {
      number: "AUT-8905",
      state: "Vigente",
      maxValue: 2500,
      expires: "2026-12-31",
      requester: "mcardenas",
      approver: "vsalgado",
    },
    quotes: [
      {
        id: "q1",
        supplier: "Aceros Cóndor S.A.",
        unitPrice: 0.146,
        deliveryDays: 5,
        paymentTerms: { en: "Net 45", es: "Crédito 45 días" },
        validUntil: "2026-07-26",
        badges: [{ en: "Incumbent supplier", es: "Proveedor histórico" }],
      },
      {
        id: "q2",
        supplier: "Trefilados del Pacífico",
        unitPrice: 0.151,
        deliveryDays: 7,
        paymentTerms: { en: "Net 30", es: "Crédito 30 días" },
        validUntil: "2026-07-21",
        badges: [],
      },
      {
        id: "q3",
        supplier: "Metalmecánica Ibarra",
        unitPrice: 0.149,
        deliveryDays: 6,
        paymentTerms: { en: "Cash on delivery", es: "Contado" },
        validUntil: "2026-07-23",
        badges: [],
      },
    ],
    recommendation: {
      supplier: "Aceros Cóndor S.A.",
      summary: {
        en: "Stable price (+0.7%) and 18 purchases without incident.",
        es: "Precio estable (+0,7 %) y 18 compras sin incidencias.",
      },
      risk: "Bajo",
      savings: { en: "US$75 vs. the market average", es: "US$ 75 vs. promedio de mercado" },
    },
    flags: [{ en: "Automation candidate", es: "Candidata a automatización" }],
    audit: [
      { en: "08:53 · SIGA synced the request", es: "08:53 · SIGA sincronizó la solicitud" },
      { en: "08:53 · Recommendation generated", es: "08:53 · Recomendación generada" },
    ],
  },
  {
    id: "REQ-2026-0538",
    scenario: { en: "Inventory restock", es: "Reposición de inventario" },
    queue: "aprobacion",
    priority: 8,
    material: {
      code: "MP-ESP-D28",
      name: { en: "HR foam block, density 28", es: "Bloque de espuma HR densidad 28" },
      unit: { en: "BLOCK", es: "BLOQUE" },
      category: "Espuma",
    },
    request: {
      quantity: 60,
      date: "2026-07-06",
      area: { en: "Foam plant", es: "Planta Espuma" },
      requester: "L. Mena",
      approver: "V. Salgado",
      observation: {
        en: "Top-up for premium-line orders.",
        es: "Complemento para pedidos de línea premium.",
      },
    },
    history: {
      lastSupplier: "Poliuretanos Quitumbe",
      lastPrice: 96.5,
      averagePrice: 95.8,
      lastPurchaseDate: "2026-06-12",
      previousPurchases: 7,
      confidence: "Alta",
    },
    authorization: {
      number: "AUT-8910",
      state: "Vigente",
      maxValue: 6500,
      expires: "2026-10-31",
      requester: "lmena",
      approver: "vsalgado",
    },
    quotes: [
      {
        id: "q1",
        supplier: "Poliuretanos Quitumbe",
        unitPrice: 97.2,
        deliveryDays: 3,
        paymentTerms: { en: "Net 30", es: "Crédito 30 días" },
        validUntil: "2026-07-18",
        badges: [{ en: "Incumbent supplier", es: "Proveedor histórico" }],
      },
      {
        id: "q2",
        supplier: "Espumas del Litoral",
        unitPrice: 99.9,
        deliveryDays: 6,
        paymentTerms: { en: "Net 30", es: "Crédito 30 días" },
        validUntil: "2026-07-20",
        badges: [],
      },
    ],
    recommendation: {
      supplier: "Poliuretanos Quitumbe",
      summary: {
        en: "Within range (+0.7%); ready to approve.",
        es: "Dentro de rango (+0,7 %); lista para aprobar.",
      },
      risk: "Bajo",
      savings: null,
    },
    flags: [],
    audit: [
      { en: "08:54 · SIGA synced the request", es: "08:54 · SIGA sincronizó la solicitud" },
      { en: "08:54 · Recommendation generated", es: "08:54 · Recomendación generada" },
    ],
  },
  {
    id: "REQ-2026-0540",
    scenario: { en: "Incomplete quotes", es: "Cotizaciones incompletas" },
    queue: "cotizacion",
    priority: 9,
    material: {
      code: "IN-PEG-018",
      name: {
        en: "Water-based industrial adhesive · 18 kg pail",
        es: "Adhesivo industrial base agua · caneca 18 kg",
      },
      unit: { en: "PAIL", es: "CANECA" },
      category: "Insumos",
    },
    request: {
      quantity: 24,
      date: "2026-07-06",
      area: { en: "Assembly", es: "Ensamble" },
      requester: "J. Riofrío",
      approver: "V. Salgado",
      observation: {
        en: "Formula change approved by quality.",
        es: "Cambio de fórmula aprobado por calidad.",
      },
    },
    history: {
      lastSupplier: "Química Andina Norte",
      lastPrice: 41.2,
      averagePrice: 40.9,
      lastPurchaseDate: "2026-05-15",
      previousPurchases: 5,
      confidence: "Media",
    },
    authorization: {
      number: "AUT-8914",
      state: "Pendiente",
      maxValue: 1200,
      expires: "2026-09-15",
      requester: "jriofrio",
      approver: "vsalgado",
    },
    quotes: [
      {
        id: "q1",
        supplier: "Química Andina Norte",
        unitPrice: 42.0,
        deliveryDays: 4,
        paymentTerms: { en: "Net 30", es: "Crédito 30 días" },
        validUntil: "2026-07-17",
        badges: [{ en: "Incumbent supplier", es: "Proveedor histórico" }],
      },
    ],
    recommendation: {
      supplier: "Química Andina Norte",
      summary: {
        en: "Quotes from 2 more suppliers are needed to meet policy.",
        es: "Falta cotización de 2 proveedores para cumplir política.",
      },
      risk: "Medio",
      savings: null,
    },
    flags: [{ en: "Policy: 3 quotes minimum", es: "Política: mínimo 3 cotizaciones" }],
    audit: [
      { en: "08:55 · SIGA synced the request", es: "08:55 · SIGA sincronizó la solicitud" },
      { en: "08:55 · 1 quote found", es: "08:55 · 1 cotización detectada" },
    ],
  },
  {
    id: "REQ-2026-0541",
    scenario: { en: "Inventory restock", es: "Reposición de inventario" },
    queue: "repetitiva",
    priority: 10,
    material: {
      code: "EM-ETI-TEJ",
      name: { en: "Woven brand label · roll of 1,000", es: "Etiqueta tejida marca · rollo 1000 u." },
      unit: { en: "ROLL", es: "ROLLO" },
      category: "Empaque",
    },
    request: {
      quantity: 40,
      date: "2026-07-07",
      area: { en: "Sewing", es: "Confección" },
      requester: "P. Salazar",
      approver: "V. Salgado",
      observation: { en: "Steady consumption.", es: "Consumo estable." },
    },
    history: {
      lastSupplier: "Bordados Imbaya",
      lastPrice: 18.6,
      averagePrice: 18.5,
      lastPurchaseDate: "2026-06-07",
      previousPurchases: 12,
      confidence: "Alta",
    },
    authorization: {
      number: "AUT-8918",
      state: "Vigente",
      maxValue: 900,
      expires: "2026-12-31",
      requester: "psalazar",
      approver: "vsalgado",
    },
    quotes: [
      {
        id: "q1",
        supplier: "Bordados Imbaya",
        unitPrice: 18.75,
        deliveryDays: 5,
        paymentTerms: { en: "Net 30", es: "Crédito 30 días" },
        validUntil: "2026-07-25",
        badges: [{ en: "Incumbent supplier", es: "Proveedor histórico" }],
      },
      {
        id: "q2",
        supplier: "Textiles Rumiloma",
        unitPrice: 19.4,
        deliveryDays: 6,
        paymentTerms: { en: "Net 15", es: "Crédito 15 días" },
        validUntil: "2026-07-22",
        badges: [],
      },
      {
        id: "q3",
        supplier: "Cintas y Ribetes SA",
        unitPrice: 19.1,
        deliveryDays: 4,
        paymentTerms: { en: "Cash on delivery", es: "Contado" },
        validUntil: "2026-07-24",
        badges: [],
      },
    ],
    recommendation: {
      supplier: "Bordados Imbaya",
      summary: {
        en: "Within range (+0.8%); a candidate for an automatic rule.",
        es: "Dentro de rango (+0,8 %); candidata a regla automática.",
      },
      risk: "Bajo",
      savings: { en: "US$26 vs. the market average", es: "US$ 26 vs. promedio de mercado" },
    },
    flags: [{ en: "Automation candidate", es: "Candidata a automatización" }],
    audit: [
      { en: "08:56 · SIGA synced the request", es: "08:56 · SIGA sincronizó la solicitud" },
      { en: "08:56 · Recommendation generated", es: "08:56 · Recomendación generada" },
    ],
  },
  {
    id: "REQ-2026-0543",
    scenario: { en: "One-off price increase", es: "Alza de precio puntual" },
    queue: "alerta",
    priority: 11,
    material: {
      code: "IN-ZIP-CNT",
      name: { en: "Continuous zipper No. 5 · 200 m roll", es: "Cierre continuo N.º 5 · rollo 200 m" },
      unit: { en: "ROLL", es: "ROLLO" },
      category: "Insumos",
    },
    request: {
      quantity: 30,
      date: "2026-07-07",
      area: { en: "Sewing", es: "Confección" },
      requester: "L. Mena",
      approver: "V. Salgado",
      observation: { en: "Regular sewing order.", es: "Pedido regular de confección." },
    },
    history: {
      lastSupplier: "Cintas y Ribetes SA",
      lastPrice: 22.4,
      averagePrice: 22.1,
      lastPurchaseDate: "2026-06-01",
      previousPurchases: 8,
      confidence: "Alta",
    },
    authorization: {
      number: "AUT-8922",
      state: "Vigente",
      maxValue: 800,
      expires: "2026-11-30",
      requester: "lmena",
      approver: "vsalgado",
    },
    quotes: [
      {
        id: "q1",
        supplier: "Cintas y Ribetes SA",
        unitPrice: 24.9,
        deliveryDays: 3,
        paymentTerms: { en: "Net 30", es: "Crédito 30 días" },
        validUntil: "2026-07-15",
        badges: [{ en: "+11.2% vs. last purchase", es: "+11,2 % vs. última compra" }],
      },
      {
        id: "q2",
        supplier: "Insumos Textiles Colibrí",
        unitPrice: 23.1,
        deliveryDays: 5,
        paymentTerms: { en: "Cash on delivery", es: "Contado" },
        validUntil: "2026-07-16",
        badges: [{ en: "Best price", es: "Mejor precio" }],
      },
    ],
    recommendation: {
      supplier: "Insumos Textiles Colibrí",
      summary: {
        en: "The incumbent rose 11%; the alternative saves US$54 for 2 more days of lead time.",
        es: "El histórico subió 11 %; la alternativa ahorra US$ 54 con 2 días más de plazo.",
      },
      risk: "Medio",
      savings: { en: "US$54 vs. the usual supplier", es: "US$ 54 vs. proveedor habitual" },
    },
    flags: [{ en: "Price change above threshold", es: "Variación de precio sobre umbral" }],
    audit: [
      { en: "08:57 · SIGA synced the request", es: "08:57 · SIGA sincronizó la solicitud" },
      { en: "08:57 · Price alert generated", es: "08:57 · Alerta de precio generada" },
    ],
  },
  {
    id: "REQ-2026-0545",
    scenario: { en: "Inventory restock", es: "Reposición de inventario" },
    queue: "aprobacion",
    priority: 12,
    material: {
      code: "EM-STR-050",
      name: { en: "Industrial stretch film 50 cm × 300 m", es: "Film stretch industrial 50 cm × 300 m" },
      unit: { en: "ROLL", es: "ROLLO" },
      category: "Empaque",
    },
    request: {
      quantity: 120,
      date: "2026-07-07",
      area: { en: "Shipping", es: "Despacho" },
      requester: "R. Guamán",
      approver: "V. Salgado",
      observation: { en: "Warehouse and shipping consumption.", es: "Consumo de bodega y despachos." },
    },
    history: {
      lastSupplier: "Corrupack Andina",
      lastPrice: 6.9,
      averagePrice: 6.85,
      lastPurchaseDate: "2026-06-10",
      previousPurchases: 10,
      confidence: "Alta",
    },
    authorization: {
      number: "AUT-8926",
      state: "Vigente",
      maxValue: 1000,
      expires: "2026-12-31",
      requester: "rguaman",
      approver: "vsalgado",
    },
    quotes: [
      {
        id: "q1",
        supplier: "Corrupack Andina",
        unitPrice: 6.95,
        deliveryDays: 3,
        paymentTerms: { en: "Net 30", es: "Crédito 30 días" },
        validUntil: "2026-07-21",
        badges: [{ en: "Incumbent supplier", es: "Proveedor histórico" }],
      },
      {
        id: "q2",
        supplier: "Empaques Nova Sur",
        unitPrice: 7.2,
        deliveryDays: 4,
        paymentTerms: { en: "Net 30", es: "Crédito 30 días" },
        validUntil: "2026-07-19",
        badges: [],
      },
      {
        id: "q3",
        supplier: "Plásticos Cayambe",
        unitPrice: 7.05,
        deliveryDays: 5,
        paymentTerms: { en: "Cash on delivery", es: "Contado" },
        validUntil: "2026-07-23",
        badges: [],
      },
    ],
    recommendation: {
      supplier: "Corrupack Andina",
      summary: {
        en: "Within range (+0.7%); ready to approve.",
        es: "Dentro de rango (+0,7 %); lista para aprobar.",
      },
      risk: "Bajo",
      savings: null,
    },
    flags: [],
    audit: [
      { en: "08:58 · SIGA synced the request", es: "08:58 · SIGA sincronizó la solicitud" },
      { en: "08:58 · Recommendation generated", es: "08:58 · Recomendación generada" },
    ],
  },
  {
    id: "REQ-2026-0547",
    scenario: { en: "New item with no history", es: "Ítem nuevo sin historial" },
    queue: "sinhistorial",
    priority: 13,
    material: {
      code: "IN-TIN-FLX",
      name: { en: "Black flexographic ink · 5 kg pail", es: "Tinta flexográfica negra · caneca 5 kg" },
      unit: { en: "PAIL", es: "CANECA" },
      category: "Insumos",
    },
    request: {
      quantity: 10,
      date: "2026-07-07",
      area: { en: "Packaging", es: "Empaque" },
      requester: "P. Salazar",
      approver: "V. Salgado",
      observation: {
        en: "In-house box printing (pilot project).",
        es: "Impresión de cajas en línea propia (proyecto piloto).",
      },
    },
    history: {
      lastSupplier: null,
      lastPrice: null,
      averagePrice: null,
      lastPurchaseDate: null,
      previousPurchases: 0,
      confidence: "Baja",
    },
    authorization: {
      number: "AUT-8931",
      state: "Pendiente",
      maxValue: 900,
      expires: "2026-08-31",
      requester: "psalazar",
      approver: "vsalgado",
    },
    quotes: [
      {
        id: "q1",
        supplier: "Química Andina Norte",
        unitPrice: 61.5,
        deliveryDays: 6,
        paymentTerms: { en: "Net 15", es: "Crédito 15 días" },
        validUntil: "2026-07-20",
        badges: [{ en: "Known supplier", es: "Proveedor conocido" }],
      },
      {
        id: "q2",
        supplier: "Tintas Pacífico",
        unitPrice: 58.9,
        deliveryDays: 8,
        paymentTerms: { en: "50% upfront", es: "Anticipo 50 %" },
        validUntil: "2026-07-22",
        badges: [{ en: "Best price", es: "Mejor precio" }, { en: "New supplier", es: "Proveedor nuevo" }],
      },
    ],
    recommendation: {
      supplier: "Química Andina Norte",
      summary: {
        en: "No history for this code; the existing relationship with the supplier on other lines tips it.",
        es: "Sin historial del código; pesa la relación previa con el proveedor en otras líneas.",
      },
      risk: "Alto",
      savings: null,
    },
    flags: [{ en: "No history in SIGA", es: "Sin historial en SIGA" }],
    audit: [
      { en: "08:59 · SIGA synced the request", es: "08:59 · SIGA sincronizó la solicitud" },
      { en: "08:59 · No previous purchases of this code", es: "08:59 · Sin compras previas del código" },
    ],
  },
  {
    id: "REQ-2026-0548",
    scenario: { en: "Inventory restock", es: "Reposición de inventario" },
    queue: "repetitiva",
    priority: 14,
    material: {
      code: "MP-PAL-120",
      name: { en: "Recycled wooden pallet 120×100", es: "Pallet de madera 120×100 reciclado" },
      unit: { en: "UNIT", es: "UNIDAD" },
      category: "Logística",
    },
    request: {
      quantity: 80,
      date: "2026-07-07",
      area: { en: "Shipping", es: "Despacho" },
      requester: "R. Guamán",
      approver: "V. Salgado",
      observation: { en: "Quarterly pallet restock.", es: "Reposición trimestral de pallets." },
    },
    history: {
      lastSupplier: "Maderera San Isidro",
      lastPrice: 7.4,
      averagePrice: 7.35,
      lastPurchaseDate: "2026-04-07",
      previousPurchases: 6,
      confidence: "Alta",
    },
    authorization: {
      number: "AUT-8935",
      state: "Vigente",
      maxValue: 700,
      expires: "2026-12-31",
      requester: "rguaman",
      approver: "vsalgado",
    },
    quotes: [
      {
        id: "q1",
        supplier: "Maderera San Isidro",
        unitPrice: 7.5,
        deliveryDays: 4,
        paymentTerms: { en: "Cash on delivery", es: "Contado" },
        validUntil: "2026-07-28",
        badges: [{ en: "Incumbent supplier", es: "Proveedor histórico" }],
      },
      {
        id: "q2",
        supplier: "Pallets y Embalajes Sur",
        unitPrice: 7.9,
        deliveryDays: 3,
        paymentTerms: { en: "Cash on delivery", es: "Contado" },
        validUntil: "2026-07-25",
        badges: [],
      },
    ],
    recommendation: {
      supplier: "Maderera San Isidro",
      summary: { en: "Within range (+1.4%).", es: "Dentro de rango (+1,4 %)." },
      risk: "Bajo",
      savings: null,
    },
    flags: [],
    audit: [
      { en: "09:00 · SIGA synced the request", es: "09:00 · SIGA sincronizó la solicitud" },
      { en: "09:00 · Recommendation generated", es: "09:00 · Recomendación generada" },
    ],
  },
];

export const INITIAL_RULES: Rule[] = [
  {
    id: "RG-014",
    material: { en: "Industrial detergent · 20 L pail", es: "Detergente industrial · caneca 20 L" },
    supplier: "Química Andina Norte",
    maxAuto: 1200,
    tolerance: { en: "±3% over last price", es: "±3 % sobre último precio" },
    maxQty: { en: "Up to 30 pails", es: "Hasta 30 canecas" },
    expires: "2026-12-31",
    requester: "jriofrio",
    approver: "vsalgado",
    note: {
      en: "12 previous purchases with no price changes; consistently low risk.",
      es: "12 compras previas sin variaciones; riesgo bajo sostenido.",
    },
  },
  {
    id: "RG-021",
    material: { en: "Packaging strap 12 mm · roll", es: "Fleje de embalaje 12 mm · rollo" },
    supplier: "Corrupack Andina",
    maxAuto: 800,
    tolerance: { en: "±5% over last price", es: "±5 % sobre último precio" },
    maxQty: { en: "Up to 60 rolls", es: "Hasta 60 rollos" },
    expires: "2026-10-31",
    requester: "rguaman",
    approver: "vsalgado",
    note: {
      en: "Steady consumption since 2025; the only qualified supplier.",
      es: "Consumo estable desde 2025; proveedor único calificado.",
    },
  },
];

export const SYNC_EVENTS: Text[] = [
  { en: "08:41:02 · connected to SIGA ERP", es: "08:41:02 · conexión establecida con SIGA ERP" },
  { en: "08:41:04 · reading purchase requests (maereq31)…", es: "08:41:04 · leyendo solicitudes de compra (maereq31)…" },
  { en: "08:41:09 · 14 active requests synced", es: "08:41:09 · 14 solicitudes activas sincronizadas" },
  { en: "08:41:12 · material history updated (36 months)", es: "08:41:12 · historial de materiales actualizado (36 meses)" },
  { en: "08:41:18 · active authorizations verified (9)", es: "08:41:18 · autorizaciones vigentes verificadas (9)" },
  { en: "08:41:23 · quotes linked: 34 documents", es: "08:41:23 · cotizaciones vinculadas: 34 documentos" },
  { en: "08:41:30 · recommendation engine: 14/14 cases evaluated", es: "08:41:30 · motor de recomendación: 14/14 casos evaluados" },
  { en: "08:41:34 · 2 price alerts raised", es: "08:41:34 · 2 alertas de precio emitidas" },
  { en: "08:41:37 · 3 automation candidates found", es: "08:41:37 · 3 candidatas a automatización detectadas" },
  { en: "08:41:41 · audit written to SIGA (log 2026-07-07)", es: "08:41:41 · auditoría escrita en SIGA (log 2026-07-07)" },
  { en: "08:42:06 · listening for changes · nothing new", es: "08:42:06 · escucha de cambios activa · sin novedades" },
  { en: "08:43:12 · no changes in SIGA · next read in 60 s", es: "08:43:12 · sin cambios en SIGA · próxima lectura en 60 s" },
];

export function requestTotal(r: PurchaseRequest, quoteId?: string): number | null {
  const q = quoteId
    ? r.quotes.find((x) => x.id === quoteId)
    : r.quotes.find((x) => x.supplier === r.recommendation.supplier) ?? r.quotes[0];
  if (!q) return null;
  return q.unitPrice * r.request.quantity;
}

export function recommendedQuote(r: PurchaseRequest): Quote | undefined {
  return r.quotes.find((x) => x.supplier === r.recommendation.supplier) ?? r.quotes[0];
}
