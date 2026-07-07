/* Noria Procure — demo data. Everything here is fictional: companies, people,
   prices, and codes are invented for the showcase. */

export type Risk = "Bajo" | "Medio" | "Alto";
export type QueueId =
  | "cotizacion"
  | "aprobacion"
  | "repetitiva"
  | "alerta"
  | "sinhistorial";

export const QUEUE_LABELS: Record<QueueId, string> = {
  cotizacion: "Pendiente de cotización",
  aprobacion: "Lista para aprobación",
  repetitiva: "Compra repetitiva",
  alerta: "Alerta de precio",
  sinhistorial: "Sin historial suficiente",
};

export type Quote = {
  id: string;
  supplier: string;
  unitPrice: number;
  deliveryDays: number;
  paymentTerms: string;
  validUntil: string;
  badges: string[];
};

export type PurchaseRequest = {
  id: string;
  scenario: string;
  queue: QueueId;
  priority: number;
  material: { code: string; name: string; unit: string; category: string };
  request: {
    quantity: number;
    date: string;
    area: string;
    requester: string;
    approver: string;
    observation: string;
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
  recommendation: { supplier: string; summary: string; risk: Risk; savings: string | null };
  flags: string[];
  audit: string[];
};

export type Rule = {
  id: string;
  material: string;
  supplier: string;
  maxAuto: number;
  tolerance: string;
  maxQty: string;
  expires: string;
  requester: string;
  approver: string;
  note: string;
};

export const fmtUSD = (n: number) =>
  new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(n);

export const fmtNum = (n: number) => new Intl.NumberFormat("es-EC").format(n);

export const REQUESTS: PurchaseRequest[] = [
  {
    id: "REQ-2026-0512",
    scenario: "Compra repetitiva de bajo riesgo",
    queue: "repetitiva",
    priority: 1,
    material: {
      code: "MP-GLP-045",
      name: "Gas GLP industrial · cilindro 45 kg",
      unit: "CIL",
      category: "Energía",
    },
    request: {
      quantity: 120,
      date: "2026-07-03",
      area: "Planta Espuma",
      requester: "M. Cárdenas",
      approver: "V. Salgado",
      observation:
        "Reposición quincenal para líneas de espumado. Consumo estable desde enero.",
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
        paymentTerms: "Crédito 30 días",
        validUntil: "2026-07-18",
        badges: ["Proveedor histórico", "Entrega 48 h"],
      },
      {
        id: "q2",
        supplier: "Petrogas Oriente",
        unitPrice: 60.1,
        deliveryDays: 3,
        paymentTerms: "Crédito 15 días",
        validUntil: "2026-07-15",
        badges: ["Nuevo proveedor"],
      },
      {
        id: "q3",
        supplier: "Andes Energía S.A.",
        unitPrice: 59.45,
        deliveryDays: 2,
        paymentTerms: "Contado",
        validUntil: "2026-07-20",
        badges: ["Descuento por volumen"],
      },
    ],
    recommendation: {
      supplier: "GasAndes Distribución",
      summary:
        "Precio dentro del rango histórico (+0,9 %), mejor plazo de entrega y 14 compras previas sin incidencias.",
      risk: "Bajo",
      savings: "US$ 144 vs. promedio de las otras ofertas",
    },
    flags: ["Candidata a automatización"],
    audit: [
      "08:41 · SIGA sincronizó la solicitud (maereq31)",
      "08:41 · Historial de 14 compras cargado",
      "08:42 · 3 cotizaciones vinculadas",
      "08:42 · Recomendación generada: riesgo bajo",
    ],
  },
  {
    id: "REQ-2026-0518",
    scenario: "Alza de precio del proveedor habitual",
    queue: "alerta",
    priority: 2,
    material: {
      code: "MP-CEM-050",
      name: "Cemento gris uso general · saco 50 kg",
      unit: "SACO",
      category: "Mantenimiento",
    },
    request: {
      quantity: 200,
      date: "2026-07-04",
      area: "Mantenimiento",
      requester: "J. Riofrío",
      approver: "V. Salgado",
      observation: "Obra civil bodega 4: losa de piso y bases de estanterías.",
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
        paymentTerms: "Crédito 30 días",
        validUntil: "2026-07-12",
        badges: ["Proveedor histórico", "+18,5 % vs. última compra"],
      },
      {
        id: "q2",
        supplier: "Cementos Sur Andina",
        unitPrice: 8.05,
        deliveryDays: 4,
        paymentTerms: "Crédito 30 días",
        validUntil: "2026-07-16",
        badges: ["Mejor precio"],
      },
      {
        id: "q3",
        supplier: "Distribuidora Ferrán",
        unitPrice: 8.4,
        deliveryDays: 3,
        paymentTerms: "Contado",
        validUntil: "2026-07-14",
        badges: [],
      },
    ],
    recommendation: {
      supplier: "Cementos Sur Andina",
      summary:
        "El proveedor habitual subió 18,5 % sin justificación registrada. Cambiar evita US$ 250 en esta orden; el plazo sube 2 días.",
      risk: "Alto",
      savings: "US$ 250 vs. proveedor habitual",
    },
    flags: ["Variación de precio sobre umbral", "Requiere aprobación de jefatura"],
    audit: [
      "08:43 · SIGA sincronizó la solicitud (maereq31)",
      "08:43 · Alerta: precio +18,5 % vs. última compra",
      "08:44 · Recomendación generada: cambio de proveedor",
    ],
  },
  {
    id: "REQ-2026-0521",
    scenario: "Recomendación con ofertas dispersas",
    queue: "aprobacion",
    priority: 3,
    material: {
      code: "EM-CAJ-604",
      name: "Caja de cartón corrugado 60×40×40",
      unit: "UNIDAD",
      category: "Empaque",
    },
    request: {
      quantity: 3500,
      date: "2026-07-04",
      area: "Empaque",
      requester: "P. Salazar",
      approver: "V. Salgado",
      observation: "Campaña de agosto: se duplica el volumen usual de despacho.",
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
        paymentTerms: "Crédito 30 días",
        validUntil: "2026-07-22",
        badges: ["Proveedor histórico"],
      },
      {
        id: "q2",
        supplier: "Empaques Nova Sur",
        unitPrice: 0.86,
        deliveryDays: 3,
        paymentTerms: "Crédito 45 días",
        validUntil: "2026-07-19",
        badges: ["Mejor plazo de pago"],
      },
      {
        id: "q3",
        supplier: "Corrupack Andina",
        unitPrice: 0.79,
        deliveryDays: 12,
        paymentTerms: "Anticipo 50 %",
        validUntil: "2026-07-25",
        badges: ["Mejor precio", "Entrega 12 días"],
      },
    ],
    recommendation: {
      supplier: "Cartonajes Sierra Norte",
      summary:
        "El precio más bajo exige 12 días de entrega y anticipo; no llega para la campaña. El histórico equilibra precio y plazo.",
      risk: "Medio",
      savings: null,
    },
    flags: ["Volumen atípico (+92 %)"],
    audit: [
      "08:45 · SIGA sincronizó la solicitud (maereq31)",
      "08:45 · 3 cotizaciones vinculadas",
      "08:46 · Recomendación generada: mantener proveedor",
    ],
  },
  {
    id: "REQ-2026-0525",
    scenario: "Falta tercera cotización",
    queue: "cotizacion",
    priority: 4,
    material: {
      code: "EM-CAJ-KNG",
      name: "Caja troquelada colchón King",
      unit: "UNIDAD",
      category: "Empaque",
    },
    request: {
      quantity: 900,
      date: "2026-07-05",
      area: "Empaque",
      requester: "P. Salazar",
      approver: "V. Salgado",
      observation: "Lanzamiento línea King reforzada; troquel nuevo aprobado por diseño.",
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
        paymentTerms: "Crédito 30 días",
        validUntil: "2026-07-20",
        badges: ["Proveedor histórico"],
      },
      {
        id: "q2",
        supplier: "Empaques Nova Sur",
        unitPrice: 2.05,
        deliveryDays: 5,
        paymentTerms: "Crédito 30 días",
        validUntil: "2026-07-21",
        badges: [],
      },
    ],
    recommendation: {
      supplier: "Cartonajes Sierra Norte",
      summary:
        "Solo hay 2 cotizaciones y la política exige 3. El copiloto ya redactó la solicitud para un tercer proveedor.",
      risk: "Medio",
      savings: null,
    },
    flags: ["Política: mínimo 3 cotizaciones"],
    audit: [
      "08:47 · SIGA sincronizó la solicitud (maereq31)",
      "08:47 · Solo 2 cotizaciones detectadas",
      "08:48 · Correo de solicitud redactado por IA",
    ],
  },
  {
    id: "REQ-2026-0530",
    scenario: "Variación de precio en insumo crítico",
    queue: "alerta",
    priority: 5,
    material: {
      code: "MP-HIL-402",
      name: "Hilo de acolchado poliéster 40/2 · cono 3 kg",
      unit: "CONO",
      category: "Textil",
    },
    request: {
      quantity: 90,
      date: "2026-07-05",
      area: "Planta Acolchado",
      requester: "L. Mena",
      approver: "V. Salgado",
      observation: "Stock crítico: quedan 6 días de producción al ritmo actual.",
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
        paymentTerms: "Crédito 30 días",
        validUntil: "2026-07-13",
        badges: ["Proveedor histórico", "+18,2 % vs. última compra"],
      },
      {
        id: "q2",
        supplier: "Hilandería Austral",
        unitPrice: 13.95,
        deliveryDays: 5,
        paymentTerms: "Crédito 15 días",
        validUntil: "2026-07-15",
        badges: [],
      },
      {
        id: "q3",
        supplier: "Fibratex Andina",
        unitPrice: 14.1,
        deliveryDays: 4,
        paymentTerms: "Contado",
        validUntil: "2026-07-14",
        badges: [],
      },
    ],
    recommendation: {
      supplier: "Textiles Rumiloma",
      summary:
        "Todo el mercado subió ~15 %: es alza de materia prima, no del proveedor. Con stock crítico pesa la entrega en 3 días.",
      risk: "Alto",
      savings: null,
    },
    flags: ["Variación de mercado generalizada", "Stock crítico"],
    audit: [
      "08:49 · SIGA sincronizó la solicitud (maereq31)",
      "08:49 · Alerta: variación +15 % en las 3 ofertas",
      "08:50 · Recomendación generada: mantener por plazo",
    ],
  },
  {
    id: "REQ-2026-0533",
    scenario: "Ítem nuevo sin historial",
    queue: "sinhistorial",
    priority: 6,
    material: {
      code: "MP-TEL-160",
      name: "Tela no tejida antifluido 160 g/m²",
      unit: "M",
      category: "Textil",
    },
    request: {
      quantity: 1800,
      date: "2026-07-06",
      area: "Desarrollo de producto",
      requester: "R. Guamán",
      approver: "V. Salgado",
      observation: "Prototipo línea hospitalaria; primera compra de este material.",
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
        paymentTerms: "Crédito 30 días",
        validUntil: "2026-07-24",
        badges: ["Proveedor conocido"],
      },
      {
        id: "q2",
        supplier: "NovaTejidos Cía. Ltda.",
        unitPrice: 2.18,
        deliveryDays: 8,
        paymentTerms: "Anticipo 30 %",
        validUntil: "2026-07-22",
        badges: ["Mejor precio", "Proveedor nuevo"],
      },
      {
        id: "q3",
        supplier: "Importadora Delta Sur",
        unitPrice: 2.5,
        deliveryDays: 4,
        paymentTerms: "Contado",
        validUntil: "2026-07-19",
        badges: ["Entrega más rápida"],
      },
    ],
    recommendation: {
      supplier: "NovaTejidos Cía. Ltda.",
      summary:
        "Sin historial de precios: la IA compara solo entre ofertas y sugiere revisión manual de calidad antes de adjudicar.",
      risk: "Alto",
      savings: null,
    },
    flags: ["Sin historial en SIGA", "Revisión manual sugerida"],
    audit: [
      "08:51 · SIGA sincronizó la solicitud (maereq31)",
      "08:51 · Sin compras previas del código MP-TEL-160",
      "08:52 · Recomendación con reserva: revisión manual",
    ],
  },
  // ---- Backlog (bandeja) ----
  {
    id: "REQ-2026-0536",
    scenario: "Reposición de inventario",
    queue: "repetitiva",
    priority: 7,
    material: {
      code: "MP-RES-220",
      name: "Resorte bonnell acero 2,2 mm",
      unit: "UNIDAD",
      category: "Estructura",
    },
    request: {
      quantity: 15000,
      date: "2026-07-06",
      area: "Ensamble",
      requester: "M. Cárdenas",
      approver: "V. Salgado",
      observation: "Reposición mensual programada.",
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
        paymentTerms: "Crédito 45 días",
        validUntil: "2026-07-26",
        badges: ["Proveedor histórico"],
      },
      {
        id: "q2",
        supplier: "Trefilados del Pacífico",
        unitPrice: 0.151,
        deliveryDays: 7,
        paymentTerms: "Crédito 30 días",
        validUntil: "2026-07-21",
        badges: [],
      },
      {
        id: "q3",
        supplier: "Metalmecánica Ibarra",
        unitPrice: 0.149,
        deliveryDays: 6,
        paymentTerms: "Contado",
        validUntil: "2026-07-23",
        badges: [],
      },
    ],
    recommendation: {
      supplier: "Aceros Cóndor S.A.",
      summary: "Precio estable (+0,7 %) y 18 compras sin incidencias.",
      risk: "Bajo",
      savings: "US$ 75 vs. promedio de mercado",
    },
    flags: ["Candidata a automatización"],
    audit: ["08:53 · SIGA sincronizó la solicitud", "08:53 · Recomendación generada"],
  },
  {
    id: "REQ-2026-0538",
    scenario: "Reposición de inventario",
    queue: "aprobacion",
    priority: 8,
    material: {
      code: "MP-ESP-D28",
      name: "Bloque de espuma HR densidad 28",
      unit: "BLOQUE",
      category: "Espuma",
    },
    request: {
      quantity: 60,
      date: "2026-07-06",
      area: "Planta Espuma",
      requester: "L. Mena",
      approver: "V. Salgado",
      observation: "Complemento para pedidos de línea premium.",
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
        paymentTerms: "Crédito 30 días",
        validUntil: "2026-07-18",
        badges: ["Proveedor histórico"],
      },
      {
        id: "q2",
        supplier: "Espumas del Litoral",
        unitPrice: 99.9,
        deliveryDays: 6,
        paymentTerms: "Crédito 30 días",
        validUntil: "2026-07-20",
        badges: [],
      },
    ],
    recommendation: {
      supplier: "Poliuretanos Quitumbe",
      summary: "Dentro de rango (+0,7 %); lista para aprobar.",
      risk: "Bajo",
      savings: null,
    },
    flags: [],
    audit: ["08:54 · SIGA sincronizó la solicitud", "08:54 · Recomendación generada"],
  },
  {
    id: "REQ-2026-0540",
    scenario: "Cotizaciones incompletas",
    queue: "cotizacion",
    priority: 9,
    material: {
      code: "IN-PEG-018",
      name: "Adhesivo industrial base agua · caneca 18 kg",
      unit: "CANECA",
      category: "Insumos",
    },
    request: {
      quantity: 24,
      date: "2026-07-06",
      area: "Ensamble",
      requester: "J. Riofrío",
      approver: "V. Salgado",
      observation: "Cambio de fórmula aprobado por calidad.",
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
        paymentTerms: "Crédito 30 días",
        validUntil: "2026-07-17",
        badges: ["Proveedor histórico"],
      },
    ],
    recommendation: {
      supplier: "Química Andina Norte",
      summary: "Falta cotización de 2 proveedores para cumplir política.",
      risk: "Medio",
      savings: null,
    },
    flags: ["Política: mínimo 3 cotizaciones"],
    audit: ["08:55 · SIGA sincronizó la solicitud", "08:55 · 1 cotización detectada"],
  },
  {
    id: "REQ-2026-0541",
    scenario: "Reposición de inventario",
    queue: "repetitiva",
    priority: 10,
    material: {
      code: "EM-ETI-TEJ",
      name: "Etiqueta tejida marca · rollo 1000 u.",
      unit: "ROLLO",
      category: "Empaque",
    },
    request: {
      quantity: 40,
      date: "2026-07-07",
      area: "Confección",
      requester: "P. Salazar",
      approver: "V. Salgado",
      observation: "Consumo estable.",
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
        paymentTerms: "Crédito 30 días",
        validUntil: "2026-07-25",
        badges: ["Proveedor histórico"],
      },
      {
        id: "q2",
        supplier: "Textiles Rumiloma",
        unitPrice: 19.4,
        deliveryDays: 6,
        paymentTerms: "Crédito 15 días",
        validUntil: "2026-07-22",
        badges: [],
      },
      {
        id: "q3",
        supplier: "Cintas y Ribetes SA",
        unitPrice: 19.1,
        deliveryDays: 4,
        paymentTerms: "Contado",
        validUntil: "2026-07-24",
        badges: [],
      },
    ],
    recommendation: {
      supplier: "Bordados Imbaya",
      summary: "Dentro de rango (+0,8 %); candidata a regla automática.",
      risk: "Bajo",
      savings: "US$ 26 vs. promedio de mercado",
    },
    flags: ["Candidata a automatización"],
    audit: ["08:56 · SIGA sincronizó la solicitud", "08:56 · Recomendación generada"],
  },
  {
    id: "REQ-2026-0543",
    scenario: "Alza de precio puntual",
    queue: "alerta",
    priority: 11,
    material: {
      code: "IN-ZIP-CNT",
      name: "Cierre continuo N.º 5 · rollo 200 m",
      unit: "ROLLO",
      category: "Insumos",
    },
    request: {
      quantity: 30,
      date: "2026-07-07",
      area: "Confección",
      requester: "L. Mena",
      approver: "V. Salgado",
      observation: "Pedido regular de confección.",
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
        paymentTerms: "Crédito 30 días",
        validUntil: "2026-07-15",
        badges: ["+11,2 % vs. última compra"],
      },
      {
        id: "q2",
        supplier: "Insumos Textiles Colibrí",
        unitPrice: 23.1,
        deliveryDays: 5,
        paymentTerms: "Contado",
        validUntil: "2026-07-16",
        badges: ["Mejor precio"],
      },
    ],
    recommendation: {
      supplier: "Insumos Textiles Colibrí",
      summary: "El histórico subió 11 %; la alternativa ahorra US$ 54 con 2 días más de plazo.",
      risk: "Medio",
      savings: "US$ 54 vs. proveedor habitual",
    },
    flags: ["Variación de precio sobre umbral"],
    audit: ["08:57 · SIGA sincronizó la solicitud", "08:57 · Alerta de precio generada"],
  },
  {
    id: "REQ-2026-0545",
    scenario: "Reposición de inventario",
    queue: "aprobacion",
    priority: 12,
    material: {
      code: "EM-STR-050",
      name: "Film stretch industrial 50 cm × 300 m",
      unit: "ROLLO",
      category: "Empaque",
    },
    request: {
      quantity: 120,
      date: "2026-07-07",
      area: "Despacho",
      requester: "R. Guamán",
      approver: "V. Salgado",
      observation: "Consumo de bodega y despachos.",
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
        paymentTerms: "Crédito 30 días",
        validUntil: "2026-07-21",
        badges: ["Proveedor histórico"],
      },
      {
        id: "q2",
        supplier: "Empaques Nova Sur",
        unitPrice: 7.2,
        deliveryDays: 4,
        paymentTerms: "Crédito 30 días",
        validUntil: "2026-07-19",
        badges: [],
      },
      {
        id: "q3",
        supplier: "Plásticos Cayambe",
        unitPrice: 7.05,
        deliveryDays: 5,
        paymentTerms: "Contado",
        validUntil: "2026-07-23",
        badges: [],
      },
    ],
    recommendation: {
      supplier: "Corrupack Andina",
      summary: "Dentro de rango (+0,7 %); lista para aprobar.",
      risk: "Bajo",
      savings: null,
    },
    flags: [],
    audit: ["08:58 · SIGA sincronizó la solicitud", "08:58 · Recomendación generada"],
  },
  {
    id: "REQ-2026-0547",
    scenario: "Ítem nuevo sin historial",
    queue: "sinhistorial",
    priority: 13,
    material: {
      code: "IN-TIN-FLX",
      name: "Tinta flexográfica negra · caneca 5 kg",
      unit: "CANECA",
      category: "Insumos",
    },
    request: {
      quantity: 10,
      date: "2026-07-07",
      area: "Empaque",
      requester: "P. Salazar",
      approver: "V. Salgado",
      observation: "Impresión de cajas en línea propia (proyecto piloto).",
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
        paymentTerms: "Crédito 15 días",
        validUntil: "2026-07-20",
        badges: ["Proveedor conocido"],
      },
      {
        id: "q2",
        supplier: "Tintas Pacífico",
        unitPrice: 58.9,
        deliveryDays: 8,
        paymentTerms: "Anticipo 50 %",
        validUntil: "2026-07-22",
        badges: ["Mejor precio", "Proveedor nuevo"],
      },
    ],
    recommendation: {
      supplier: "Química Andina Norte",
      summary: "Sin historial del código; pesa la relación previa con el proveedor en otras líneas.",
      risk: "Alto",
      savings: null,
    },
    flags: ["Sin historial en SIGA"],
    audit: ["08:59 · SIGA sincronizó la solicitud", "08:59 · Sin compras previas del código"],
  },
  {
    id: "REQ-2026-0548",
    scenario: "Reposición de inventario",
    queue: "repetitiva",
    priority: 14,
    material: {
      code: "MP-PAL-120",
      name: "Pallet de madera 120×100 reciclado",
      unit: "UNIDAD",
      category: "Logística",
    },
    request: {
      quantity: 80,
      date: "2026-07-07",
      area: "Despacho",
      requester: "R. Guamán",
      approver: "V. Salgado",
      observation: "Reposición trimestral de pallets.",
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
        paymentTerms: "Contado",
        validUntil: "2026-07-28",
        badges: ["Proveedor histórico"],
      },
      {
        id: "q2",
        supplier: "Pallets y Embalajes Sur",
        unitPrice: 7.9,
        deliveryDays: 3,
        paymentTerms: "Contado",
        validUntil: "2026-07-25",
        badges: [],
      },
    ],
    recommendation: {
      supplier: "Maderera San Isidro",
      summary: "Dentro de rango (+1,4 %).",
      risk: "Bajo",
      savings: null,
    },
    flags: [],
    audit: ["09:00 · SIGA sincronizó la solicitud", "09:00 · Recomendación generada"],
  },
];

export const INITIAL_RULES: Rule[] = [
  {
    id: "RG-014",
    material: "Detergente industrial · caneca 20 L",
    supplier: "Química Andina Norte",
    maxAuto: 1200,
    tolerance: "±3 % sobre último precio",
    maxQty: "Hasta 30 canecas",
    expires: "2026-12-31",
    requester: "jriofrio",
    approver: "vsalgado",
    note: "12 compras previas sin variaciones; riesgo bajo sostenido.",
  },
  {
    id: "RG-021",
    material: "Fleje de embalaje 12 mm · rollo",
    supplier: "Corrupack Andina",
    maxAuto: 800,
    tolerance: "±5 % sobre último precio",
    maxQty: "Hasta 60 rollos",
    expires: "2026-10-31",
    requester: "rguaman",
    approver: "vsalgado",
    note: "Consumo estable desde 2025; proveedor único calificado.",
  },
];

export const SYNC_EVENTS: string[] = [
  "08:41:02 · conexión establecida con SIGA ERP",
  "08:41:04 · leyendo solicitudes de compra (maereq31)…",
  "08:41:09 · 14 solicitudes activas sincronizadas",
  "08:41:12 · historial de materiales actualizado (36 meses)",
  "08:41:18 · autorizaciones vigentes verificadas (9)",
  "08:41:23 · cotizaciones vinculadas: 34 documentos",
  "08:41:30 · motor de recomendación: 14/14 casos evaluados",
  "08:41:34 · 2 alertas de precio emitidas",
  "08:41:37 · 3 candidatas a automatización detectadas",
  "08:41:41 · auditoría escrita en SIGA (log 2026-07-07)",
  "08:42:06 · escucha de cambios activa · sin novedades",
  "08:43:12 · sin cambios en SIGA · próxima lectura en 60 s",
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
