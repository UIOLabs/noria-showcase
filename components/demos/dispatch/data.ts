/**
 * Noria Dispatch — demo data. Everything here is fictional: institutions,
 * people, phone numbers, amounts. Phone numbers use a reserved-looking
 * +52 55 5501-02xx block; names are invented.
 *
 * The calls themselves happen in Spanish, so transcripts, the voice script and
 * the variables sent to it stay Spanish in both locales; everything the
 * operator reads about a call is bilingual.
 */

import type { Locale, Text } from "@/lib/i18n";

export type Outcome =
  | "connected"
  | "voicemail"
  | "no_answer"
  | "busy"
  | "wrong_number"
  | "do_not_call"
  | "failed";

export type Tone = "ok" | "warn" | "danger" | "mute";

export const OUTCOMES: Outcome[] = [
  "connected",
  "voicemail",
  "no_answer",
  "busy",
  "wrong_number",
  "do_not_call",
  "failed",
];

export const OUTCOME_META: Record<Outcome, { label: Text; tone: Tone }> = {
  connected: { label: { en: "connected", es: "conectada" }, tone: "ok" },
  voicemail: { label: { en: "voicemail", es: "buzón" }, tone: "warn" },
  no_answer: { label: { en: "no answer", es: "sin respuesta" }, tone: "mute" },
  busy: { label: { en: "busy", es: "ocupado" }, tone: "mute" },
  wrong_number: { label: { en: "wrong number", es: "número equivocado" }, tone: "danger" },
  do_not_call: { label: { en: "do not call", es: "no llamar" }, tone: "danger" },
  failed: { label: { en: "failed", es: "fallida" }, tone: "danger" },
};

export const INSTITUTIONS = [
  "Banco Alcores",
  "Universidad Mirador",
  "Financiera Vela Norte",
] as const;

export const mxn = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 2,
});

/* ---------- Campaigns ---------- */

export type CampaignStatus = "running" | "paused" | "draft" | "completed";

export type Campaign = {
  id: string;
  name: Text;
  status: CampaignStatus;
  concurrency: number;
  dailyCap: number;
  hours: string;
  created: Text;
  institution: string;
  script: string;
};

const JUNE_ALCORES: Text = { en: "June — Alcores cards", es: "Junio — Alcores tarjetas" };
const TUITION_MIRADOR: Text = { en: "Q2 tuition — Mirador", es: "Colegiaturas Q2 — Mirador" };

export const CAMPAIGNS: Campaign[] = [
  {
    id: "cmp-014",
    name: JUNE_ALCORES,
    status: "running",
    concurrency: 6,
    dailyCap: 3,
    hours: "09:00–20:00",
    created: { en: "Jun 2, 2026", es: "2 jun 2026" },
    institution: "Banco Alcores",
    script: "negociacion_alcores · v3",
  },
  {
    id: "cmp-013",
    name: TUITION_MIRADOR,
    status: "running",
    concurrency: 4,
    dailyCap: 2,
    hours: "10:00–18:00",
    created: { en: "May 28, 2026", es: "28 may 2026" },
    institution: "Universidad Mirador",
    script: "recordatorio_colegiatura · v2",
  },
  {
    id: "cmp-011",
    name: { en: "Vela Norte — personal loans", es: "Vela Norte — préstamos personales" },
    status: "paused",
    concurrency: 8,
    dailyCap: 3,
    hours: "09:00–19:00",
    created: { en: "May 15, 2026", es: "15 may 2026" },
    institution: "Financiera Vela Norte",
    script: "negociacion_alcores · v3",
  },
  {
    id: "cmp-006",
    name: { en: "April pilot", es: "Piloto abril" },
    status: "completed",
    concurrency: 2,
    dailyCap: 1,
    hours: "10:00–17:00",
    created: { en: "Apr 3, 2026", es: "3 abr 2026" },
    institution: "Banco Alcores",
    script: "negociacion_alcores · v1",
  },
];

/* ---------- Live board ---------- */

export type LiveCall = {
  id: number;
  name: string;
  phone: string;
  campaign: Text;
  duration: number; // predetermined total seconds
  outcome: Outcome; // predetermined result
  elapsed: number;
};

type SpawnSpec = Omit<LiveCall, "id" | "elapsed">;

/** Deterministic spawn cycle — no RNG anywhere near render. */
export const SPAWN: SpawnSpec[] = [
  { name: "María F. Ortiz", phone: "+52 55 5501 0214", campaign: JUNE_ALCORES, duration: 142, outcome: "connected" },
  { name: "Luis Delgado", phone: "+52 55 5501 0231", campaign: JUNE_ALCORES, duration: 31, outcome: "no_answer" },
  { name: "Carmen Ibarra", phone: "+52 33 5501 0272", campaign: TUITION_MIRADOR, duration: 27, outcome: "voicemail" },
  { name: "Jorge Anaya", phone: "+52 81 5501 0249", campaign: JUNE_ALCORES, duration: 30, outcome: "no_answer" },
  { name: "Paola Vidal", phone: "+52 55 5501 0287", campaign: TUITION_MIRADOR, duration: 96, outcome: "connected" },
  { name: "Ricardo Fuentes", phone: "+52 55 5501 0293", campaign: JUNE_ALCORES, duration: 13, outcome: "busy" },
  { name: "Ana S. Menchaca", phone: "+52 33 5501 0208", campaign: TUITION_MIRADOR, duration: 34, outcome: "voicemail" },
  { name: "Héctor Palacios", phone: "+52 81 5501 0266", campaign: JUNE_ALCORES, duration: 29, outcome: "no_answer" },
  { name: "Daniela Roldán", phone: "+52 55 5501 0221", campaign: JUNE_ALCORES, duration: 168, outcome: "connected" },
  { name: "Emilio Cervantes", phone: "+52 55 5501 0257", campaign: TUITION_MIRADOR, duration: 26, outcome: "voicemail" },
  { name: "Lucero Bautista", phone: "+52 33 5501 0284", campaign: JUNE_ALCORES, duration: 9, outcome: "failed" },
  { name: "Raúl Ochoa", phone: "+52 55 5501 0202", campaign: JUNE_ALCORES, duration: 32, outcome: "no_answer" },
  { name: "Silvia Cantú", phone: "+52 81 5501 0278", campaign: TUITION_MIRADOR, duration: 24, outcome: "voicemail" },
  { name: "Tomás Espino", phone: "+52 55 5501 0239", campaign: JUNE_ALCORES, duration: 118, outcome: "connected" },
  { name: "Beatriz Lozada", phone: "+52 55 5501 0261", campaign: JUNE_ALCORES, duration: 28, outcome: "no_answer" },
  { name: "Gustavo Perea", phone: "+52 33 5501 0295", campaign: TUITION_MIRADOR, duration: 15, outcome: "wrong_number" },
];

export type Board = {
  calls: LiveCall[];
  spawnIdx: number;
  attemptsToday: number;
  queued: number;
  outcomes: Record<Outcome, number>;
  buckets: number[];
  tickCount: number;
  connected: { name: string; phone: string; atTick: number }[];
};

export const INITIAL_BOARD: Board = {
  calls: [
    { id: 900, ...SPAWN[0], elapsed: 74 },
    { id: 901, ...SPAWN[2], elapsed: 12 },
    { id: 902, ...SPAWN[4], elapsed: 51 },
    { id: 903, ...SPAWN[7], elapsed: 21 },
    { id: 904, ...SPAWN[8], elapsed: 129 },
  ],
  spawnIdx: 9,
  attemptsToday: 403,
  queued: 512,
  outcomes: {
    connected: 34,
    voicemail: 118,
    no_answer: 210,
    busy: 22,
    wrong_number: 9,
    do_not_call: 4,
    failed: 6,
  },
  buckets: [3, 5, 4, 6, 2, 5, 7, 4, 3, 6, 5, 4, 7, 5, 3, 4, 6, 2, 4, 1],
  tickCount: 0,
  connected: [
    { name: "Rosa E. Palomares", phone: "+52 55 5501 0244", atTick: -160 },
    { name: "Iván Contreras", phone: "+52 81 5501 0219", atTick: -430 },
    { name: "Julieta Sandoval", phone: "+52 55 5501 0290", atTick: -760 },
  ],
};

export function tickBoard(b: Board): Board {
  const tickCount = b.tickCount + 1;
  let calls = b.calls.map((c) => ({ ...c, elapsed: c.elapsed + 1 }));
  const done = calls.filter((c) => c.elapsed >= c.duration);
  calls = calls.filter((c) => c.elapsed < c.duration);

  let { attemptsToday, spawnIdx, queued } = b;
  const outcomes = { ...b.outcomes };
  let connected = b.connected;
  let buckets = b.buckets;

  for (const c of done) {
    attemptsToday += 1;
    outcomes[c.outcome] += 1;
    buckets = [...buckets.slice(0, -1), buckets[buckets.length - 1] + 1];
    if (c.outcome === "connected") {
      connected = [{ name: c.name, phone: c.phone, atTick: tickCount }, ...connected].slice(0, 5);
    }
  }

  if (tickCount % 8 === 0) buckets = [...buckets.slice(1), 0];

  while (calls.length < 5) {
    const spec = SPAWN[spawnIdx % SPAWN.length];
    calls = [...calls, { id: 1000 + spawnIdx, elapsed: 0, ...spec }];
    spawnIdx += 1;
    queued = Math.max(queued - 1, 0);
  }

  return { ...b, calls, spawnIdx, attemptsToday, queued, outcomes, buckets, tickCount, connected };
}

export function agoLabel(seconds: number, locale: Locale): string {
  const es = locale === "es";
  if (seconds < 60) return es ? "ahora" : "just now";
  const m = Math.floor(seconds / 60);
  if (m < 60) return es ? `hace ${m} min` : `${m} min ago`;
  return es ? `hace ${Math.floor(m / 60)} h` : `${Math.floor(m / 60)} h ago`;
}

export function mmss(s: number): string {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/* ---------- Attempts ---------- */

export type Attempt = {
  id: string;
  phone: string;
  debtor: string;
  institution: string;
  outcome: Outcome;
  durationSec: number;
  placed: Text; // fixed demo-clock string
  sentiment?: "positive" | "neutral" | "negative";
  summary?: Text;
  /** As spoken — Spanish in both locales */
  transcript?: string;
  postCall?: { label: Text; value: Text }[];
  variables: Record<string, string>;
};

// Sent to the (Spanish-speaking) voice agent, so due_date stays Spanish.
const VARS = (name: string, amount: number, inst: string): Record<string, string> => ({
  first_name: name.split(" ")[0],
  amount: mxn.format(amount),
  institution: inst,
  due_date: "30 de junio",
});

export const ATTEMPTS: Attempt[] = [
  {
    id: "att-1042",
    phone: "+52 55 5501 0214",
    debtor: "María F. Ortiz",
    institution: "Banco Alcores",
    outcome: "connected",
    durationSec: 142,
    placed: { en: "Today · 11:42", es: "Hoy · 11:42" },
    sentiment: "positive",
    summary: {
      en: "The debtor confirmed her identity and acknowledged the outstanding balance. She agreed to three monthly payments starting June 15 and asked for the terms by email.",
      es: "La deudora confirmó su identidad y reconoció el saldo pendiente. Acordó un plan de tres pagos mensuales desde el 15 de junio y pidió confirmación por correo de los términos.",
    },
    transcript: `Agente: Buenos días, ¿tengo el gusto con María Fernanda Ortiz?
Cliente: Sí, ella habla. ¿De parte de quién?
Agente: Le llamo de parte de Banco Alcores, sobre su tarjeta con terminación 0214. ¿Tiene un minuto para revisar su saldo pendiente?
Cliente: Sí, dígame.
Agente: Su saldo actual es de $18,360.52 con fecha límite el 30 de junio. Hoy podemos ofrecerle un convenio en tres mensualidades sin recargos adicionales. ¿Le interesa?
Cliente: Sí, me conviene más en tres pagos.
Agente: Perfecto. La primera mensualidad quedaría programada para el 15 de junio. ¿Me confirma su correo para enviarle el convenio?
Cliente: Claro, es m.ortiz@correo-demo.mx.
Agente: Registrado. Recibirá el convenio hoy mismo. Gracias por su tiempo y excelente día.`,
    postCall: [
      { label: { en: "Intent to pay", es: "Intención de pago" }, value: { en: "Yes — plan agreed", es: "Sí — plan acordado" } },
      { label: { en: "Already paid", es: "Ya pagó" }, value: { en: "No", es: "No" } },
      { label: { en: "Wrong number", es: "Número equivocado" }, value: { en: "No", es: "No" } },
      { label: { en: "Alt. phone", es: "Teléfono alterno" }, value: { en: "—", es: "—" } },
      { label: { en: "Email", es: "Correo" }, value: { en: "m.ortiz@correo-demo.mx", es: "m.ortiz@correo-demo.mx" } },
      { label: { en: "Payment plan", es: "Plan de pago" }, value: { en: "3 monthly payments from Jun 15", es: "3 mensualidades desde el 15 jun" } },
      { label: { en: "Do not contact", es: "No contactar" }, value: { en: "No", es: "No" } },
    ],
    variables: VARS("María Fernanda", 18360.52, "Banco Alcores"),
  },
  {
    id: "att-1041",
    phone: "+52 33 5501 0272",
    debtor: "Carmen Ibarra",
    institution: "Universidad Mirador",
    outcome: "voicemail",
    durationSec: 27,
    placed: { en: "Today · 11:38", es: "Hoy · 11:38" },
    summary: {
      en: "Voicemail detected; left the approved reminder with a callback number.",
      es: "Se detectó el buzón de voz y se dejó el recordatorio aprobado con un número para devolver la llamada.",
    },
    variables: VARS("Carmen", 7250, "Universidad Mirador"),
  },
  {
    id: "att-1040",
    phone: "+52 81 5501 0249",
    debtor: "Jorge Anaya",
    institution: "Banco Alcores",
    outcome: "no_answer",
    durationSec: 30,
    placed: { en: "Today · 11:36", es: "Hoy · 11:36" },
    variables: VARS("Jorge", 12900, "Banco Alcores"),
  },
  {
    id: "att-1039",
    phone: "+52 55 5501 0287",
    debtor: "Paola Vidal",
    institution: "Universidad Mirador",
    outcome: "connected",
    durationSec: 96,
    placed: { en: "Today · 11:31", es: "Hoy · 11:31" },
    sentiment: "neutral",
    summary: {
      en: "The debtor says she paid the tuition at a branch on June 3. She asked for the payment to be verified; the case was flagged for manual review with receipt folio MD-88214.",
      es: "La deudora afirma que pagó la colegiatura en una sucursal el 3 de junio. Solicitó verificar el pago y el caso quedó marcado para revisión manual con el folio MD-88214.",
    },
    transcript: `Agente: Buenas tardes, ¿hablo con Paola Vidal?
Cliente: Sí, soy yo.
Agente: Le llamo de parte de Universidad Mirador sobre la colegiatura de junio, con saldo de $7,250.00.
Cliente: Eso ya lo pagué el 3 de junio en ventanilla.
Agente: Gracias por la aclaración. ¿Cuenta con el folio de su comprobante?
Cliente: Sí, es el MD-88214.
Agente: Registrado. Enviaremos la verificación a su correo y no recibirá más llamadas sobre este cargo. Gracias por su tiempo.`,
    postCall: [
      { label: { en: "Intent to pay", es: "Intención de pago" }, value: { en: "N/A", es: "No aplica" } },
      { label: { en: "Already paid", es: "Ya pagó" }, value: { en: "Yes — folio MD-88214", es: "Sí — folio MD-88214" } },
      { label: { en: "Wrong number", es: "Número equivocado" }, value: { en: "No", es: "No" } },
      { label: { en: "Alt. phone", es: "Teléfono alterno" }, value: { en: "—", es: "—" } },
      { label: { en: "Email", es: "Correo" }, value: { en: "—", es: "—" } },
      { label: { en: "Payment plan", es: "Plan de pago" }, value: { en: "—", es: "—" } },
      { label: { en: "Do not contact", es: "No contactar" }, value: { en: "No", es: "No" } },
    ],
    variables: VARS("Paola", 7250, "Universidad Mirador"),
  },
  {
    id: "att-1038",
    phone: "+52 55 5501 0293",
    debtor: "Ricardo Fuentes",
    institution: "Banco Alcores",
    outcome: "busy",
    durationSec: 13,
    placed: { en: "Today · 11:28", es: "Hoy · 11:28" },
    variables: VARS("Ricardo", 5420, "Banco Alcores"),
  },
  {
    id: "att-1037",
    phone: "+52 33 5501 0295",
    debtor: "Gustavo Perea",
    institution: "Universidad Mirador",
    outcome: "wrong_number",
    durationSec: 15,
    placed: { en: "Today · 11:24", es: "Hoy · 11:24" },
    summary: {
      en: "The person reached is not the account holder; the number was flagged and removed from the cohort.",
      es: "La persona contactada no es titular de la cuenta; el número se marcó y se retiró del grupo.",
    },
    variables: VARS("Gustavo", 9100, "Universidad Mirador"),
  },
  {
    id: "att-1036",
    phone: "+52 55 5501 0221",
    debtor: "Daniela Roldán",
    institution: "Banco Alcores",
    outcome: "connected",
    durationSec: 168,
    placed: { en: "Today · 11:17", es: "Hoy · 11:17" },
    sentiment: "negative",
    summary: {
      en: "The debtor disputes the balance and asked not to be called again. The do-not-call flag was applied across every campaign and the case went to a human agent for email follow-up.",
      es: "La deudora disputa el saldo y pidió no recibir más llamadas. Se activó la restricción en todas las campañas y el caso se envió a un agente humano para seguimiento por correo.",
    },
    transcript: `Agente: Buenas tardes, ¿hablo con Daniela Roldán?
Cliente: Sí, pero ya les dije que ese cargo no es mío.
Agente: Lamento la molestia. Con gusto registro su aclaración para que un asesor revise su caso.
Cliente: Por favor, y no me llamen otra vez.
Agente: Entendido. Queda registrada su solicitud de no recibir más llamadas. Un asesor le contactará por correo únicamente. Gracias por su tiempo.`,
    postCall: [
      { label: { en: "Intent to pay", es: "Intención de pago" }, value: { en: "Disputed", es: "En disputa" } },
      { label: { en: "Already paid", es: "Ya pagó" }, value: { en: "Unclear", es: "Sin aclarar" } },
      { label: { en: "Wrong number", es: "Número equivocado" }, value: { en: "No", es: "No" } },
      { label: { en: "Alt. phone", es: "Teléfono alterno" }, value: { en: "—", es: "—" } },
      { label: { en: "Email", es: "Correo" }, value: { en: "—", es: "—" } },
      { label: { en: "Payment plan", es: "Plan de pago" }, value: { en: "—", es: "—" } },
      { label: { en: "Do not contact", es: "No contactar" }, value: { en: "Yes — restriction applied", es: "Sí — restricción activada" } },
    ],
    variables: VARS("Daniela", 22480, "Banco Alcores"),
  },
  {
    id: "att-1035",
    phone: "+52 55 5501 0202",
    debtor: "Raúl Ochoa",
    institution: "Banco Alcores",
    outcome: "no_answer",
    durationSec: 32,
    placed: { en: "Today · 11:12", es: "Hoy · 11:12" },
    variables: VARS("Raúl", 3150, "Banco Alcores"),
  },
  {
    id: "att-1034",
    phone: "+52 81 5501 0266",
    debtor: "Héctor Palacios",
    institution: "Banco Alcores",
    outcome: "voicemail",
    durationSec: 29,
    placed: { en: "Today · 11:05", es: "Hoy · 11:05" },
    variables: VARS("Héctor", 15840, "Banco Alcores"),
  },
  {
    id: "att-1033",
    phone: "+52 33 5501 0284",
    debtor: "Lucero Bautista",
    institution: "Financiera Vela Norte",
    outcome: "failed",
    durationSec: 9,
    placed: { en: "Today · 10:58", es: "Hoy · 10:58" },
    summary: {
      en: "Carrier error before the first ring; the retry is queued for the afternoon window.",
      es: "Error del operador antes del timbrado; el reintento quedó en cola para el horario de la tarde.",
    },
    variables: VARS("Lucero", 6720, "Financiera Vela Norte"),
  },
  {
    id: "att-1032",
    phone: "+52 55 5501 0257",
    debtor: "Emilio Cervantes",
    institution: "Universidad Mirador",
    outcome: "voicemail",
    durationSec: 26,
    placed: { en: "Today · 10:51", es: "Hoy · 10:51" },
    variables: VARS("Emilio", 7250, "Universidad Mirador"),
  },
  {
    id: "att-1031",
    phone: "+52 55 5501 0239",
    debtor: "Tomás Espino",
    institution: "Banco Alcores",
    outcome: "connected",
    durationSec: 118,
    placed: { en: "Today · 10:44", es: "Hoy · 10:44" },
    sentiment: "positive",
    summary: {
      en: "The debtor asked for the full payoff amount and committed to a single payment before June 20. He gave an alternate phone for the confirmation.",
      es: "El deudor pidió el monto total para liquidar y se comprometió a realizar un solo pago antes del 20 de junio. Proporcionó un teléfono alterno para confirmar.",
    },
    transcript: `Agente: Buenos días, ¿me comunico con Tomás Espino?
Cliente: Sí, dígame.
Agente: Le llamo de parte de Banco Alcores. Su saldo pendiente es de $9,980.00. ¿Le gustaría liquidarlo en un solo pago o en mensualidades?
Cliente: En un solo pago, antes del 20 de junio.
Agente: Excelente. ¿Algún teléfono alterno para confirmarle la referencia de pago?
Cliente: Sí, el +52 55 5501 0298.
Agente: Registrado. Recibirá la referencia hoy. Gracias y buen día.`,
    postCall: [
      { label: { en: "Intent to pay", es: "Intención de pago" }, value: { en: "Yes — full payment before Jun 20", es: "Sí — pago total antes del 20 jun" } },
      { label: { en: "Already paid", es: "Ya pagó" }, value: { en: "No", es: "No" } },
      { label: { en: "Wrong number", es: "Número equivocado" }, value: { en: "No", es: "No" } },
      { label: { en: "Alt. phone", es: "Teléfono alterno" }, value: { en: "+52 55 5501 0298", es: "+52 55 5501 0298" } },
      { label: { en: "Email", es: "Correo" }, value: { en: "—", es: "—" } },
      { label: { en: "Payment plan", es: "Plan de pago" }, value: { en: "Single payment", es: "Pago único" } },
      { label: { en: "Do not contact", es: "No contactar" }, value: { en: "No", es: "No" } },
    ],
    variables: VARS("Tomás", 9980, "Banco Alcores"),
  },
  {
    id: "att-1030",
    phone: "+52 81 5501 0278",
    debtor: "Silvia Cantú",
    institution: "Financiera Vela Norte",
    outcome: "do_not_call",
    durationSec: 41,
    placed: { en: "Today · 10:36", es: "Hoy · 10:36" },
    summary: {
      en: "The debtor asked not to be contacted again; the restriction was applied across every campaign.",
      es: "La deudora pidió no recibir más contactos y la restricción se aplicó en todas las campañas.",
    },
    variables: VARS("Silvia", 11200, "Financiera Vela Norte"),
  },
  {
    id: "att-1029",
    phone: "+52 55 5501 0231",
    debtor: "Luis Delgado",
    institution: "Banco Alcores",
    outcome: "no_answer",
    durationSec: 31,
    placed: { en: "Today · 10:29", es: "Hoy · 10:29" },
    variables: VARS("Luis", 4380, "Banco Alcores"),
  },
];

/* ---------- Script ---------- */

export const SCRIPT = {
  name: "negociacion_alcores",
  version: 3,
  status: { en: "published", es: "publicado" } as Text,
  voice: "es-MX · Lucía",
  language: "es-419",
  body: `Hola {{first_name}}, le hablo de parte de {{institution}}.

Le llamo respecto a su saldo pendiente de {{amount}}, con fecha límite el {{due_date}}. ¿Tiene un momento para revisar opciones de pago?

Si la persona confirma:
— Ofrecer liquidación en un solo pago o convenio en hasta tres mensualidades sin recargos.
— Confirmar correo electrónico para enviar el convenio.

Si la persona indica que ya pagó:
— Agradecer, solicitar folio del comprobante y registrar aclaración.

Si la persona pide no ser contactada:
— Confirmar el registro de no-llamar y despedirse cordialmente.

Cierre: "Gracias por su tiempo. Que tenga excelente día."`,
  variables: ["first_name", "amount", "institution", "due_date"],
  timing: [
    { label: { en: "Max call duration", es: "Duración máxima" }, value: { en: "4 min", es: "4 min" } },
    { label: { en: "Silence timeout", es: "Espera de silencio" }, value: { en: "12 s", es: "12 s" } },
    { label: { en: "Voicemail detection", es: "Detección de buzón" }, value: { en: "On", es: "Activa" } },
    { label: { en: "Backchannel", es: "Confirmación verbal" }, value: { en: "Medium", es: "Media" } },
  ],
  tuning: [
    { label: { en: "Temperature", es: "Temperatura" }, value: 0.4 },
    { label: { en: "Speed", es: "Velocidad" }, value: 0.55 },
    { label: { en: "Interruption sensitivity", es: "Sensibilidad a interrupciones" }, value: 0.7 },
  ],
  keywords: ["Alcores", "mensualidad", "convenio", "aclaración", "folio"],
  pronunciation: [
    { word: "Alcores", ipa: "/alˈko.ɾes/" },
    { word: "Mirador", ipa: "/mi.ɾaˈðoɾ/" },
    { word: "folio", ipa: "/ˈfo.ljo/" },
  ],
  schema: [
    { field: "intent_to_pay", desc: { en: "Willingness to pay and the committed date", es: "Disposición de pago y fecha comprometida" } },
    { field: "already_paid", desc: { en: "Claim of a prior payment, with folio", es: "Declaración de pago previo y folio" } },
    { field: "wrong_number", desc: { en: "The person reached is not the account holder", es: "La persona contactada no es titular" } },
    { field: "alt_phone", desc: { en: "Alternate phone offered", es: "Teléfono alterno proporcionado" } },
    { field: "email", desc: { en: "Email confirmed for follow-up", es: "Correo confirmado para seguimiento" } },
    { field: "payment_plan", desc: { en: "Plan requested: installments and dates", es: "Plan solicitado: cuotas y fechas" } },
    { field: "opt_out", desc: { en: "Do-not-call request", es: "Solicitud de no recibir llamadas" } },
  ],
  versions: [
    {
      v: "v3",
      date: { en: "Jun 20, 2026", es: "20 jun 2026" },
      note: { en: "Published — softer opening, folio capture", es: "Publicada — apertura más amable y captura de folio" },
    },
    {
      v: "v2",
      date: { en: "Jun 5, 2026", es: "5 jun 2026" },
      note: { en: "Added the already-paid branch", es: "Se añadió la rama de pago ya realizado" },
    },
    {
      v: "v1",
      date: { en: "May 22, 2026", es: "22 may 2026" },
      note: { en: "Initial negotiation script", es: "Guion inicial de negociación" },
    },
  ],
};

export const WIZARD_SCRIPTS = [
  { id: "s1", label: "negociacion_alcores · v3" },
  { id: "s2", label: "recordatorio_colegiatura · v2" },
];

export const COHORTS: Record<string, { count: number; sample: { name: string; phone: string; owed: number }[]; tz: { label: Text; n: number }[] }> = {
  "Banco Alcores": {
    count: 248,
    sample: [
      { name: "María F. Ortiz", phone: "+52 55 5501 0214", owed: 18360.52 },
      { name: "Jorge Anaya", phone: "+52 81 5501 0249", owed: 12900 },
      { name: "Raúl Ochoa", phone: "+52 55 5501 0202", owed: 3150 },
      { name: "Beatriz Lozada", phone: "+52 55 5501 0261", owed: 8425 },
      { name: "Tomás Espino", phone: "+52 55 5501 0239", owed: 9980 },
    ],
    tz: [
      { label: { en: "Central", es: "Centro" }, n: 196 },
      { label: { en: "Pacific", es: "Pacífico" }, n: 28 },
      { label: { en: "Mountain", es: "Montaña" }, n: 17 },
      { label: { en: "Southeast", es: "Sureste" }, n: 5 },
      { label: { en: "Unknown", es: "Desconocida" }, n: 2 },
    ],
  },
  "Universidad Mirador": {
    count: 131,
    sample: [
      { name: "Carmen Ibarra", phone: "+52 33 5501 0272", owed: 7250 },
      { name: "Paola Vidal", phone: "+52 55 5501 0287", owed: 7250 },
      { name: "Emilio Cervantes", phone: "+52 55 5501 0257", owed: 7250 },
      { name: "Ana S. Menchaca", phone: "+52 33 5501 0208", owed: 14500 },
      { name: "Gustavo Perea", phone: "+52 33 5501 0295", owed: 9100 },
    ],
    tz: [
      { label: { en: "Central", es: "Centro" }, n: 118 },
      { label: { en: "Pacific", es: "Pacífico" }, n: 9 },
      { label: { en: "Mountain", es: "Montaña" }, n: 3 },
      { label: { en: "Southeast", es: "Sureste" }, n: 1 },
      { label: { en: "Unknown", es: "Desconocida" }, n: 0 },
    ],
  },
  "Financiera Vela Norte": {
    count: 87,
    sample: [
      { name: "Lucero Bautista", phone: "+52 33 5501 0284", owed: 6720 },
      { name: "Silvia Cantú", phone: "+52 81 5501 0278", owed: 11200 },
      { name: "Iván Contreras", phone: "+52 81 5501 0219", owed: 4890 },
      { name: "Julieta Sandoval", phone: "+52 55 5501 0290", owed: 15300 },
      { name: "Rosa E. Palomares", phone: "+52 55 5501 0244", owed: 7040 },
    ],
    tz: [
      { label: { en: "Central", es: "Centro" }, n: 54 },
      { label: { en: "Mountain", es: "Montaña" }, n: 21 },
      { label: { en: "Pacific", es: "Pacífico" }, n: 10 },
      { label: { en: "Southeast", es: "Sureste" }, n: 2 },
      { label: { en: "Unknown", es: "Desconocida" }, n: 0 },
    ],
  },
};
