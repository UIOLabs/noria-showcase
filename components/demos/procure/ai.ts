/* Copiloto IA — deterministic text generation. No model calls: every output
   is computed from the request's own numbers, like the original demo. */

import { fmtUSD, type PurchaseRequest, type Quote } from "./data";

export type AiAction =
  | "resumen"
  | "recomendacion"
  | "riesgo"
  | "automatizacion"
  | "aprobacion"
  | "correo"
  | "faltantes";

export const AI_ACTIONS: { id: AiAction; label: string }[] = [
  { id: "resumen", label: "Resumen ejecutivo" },
  { id: "recomendacion", label: "Explicar recomendación" },
  { id: "riesgo", label: "Detectar riesgo" },
  { id: "automatizacion", label: "¿Puede automatizarse?" },
  { id: "aprobacion", label: "Preparar aprobación" },
  { id: "correo", label: "Redactar correo" },
  { id: "faltantes", label: "Datos faltantes" },
];

function pct(n: number): string {
  return `${n > 0 ? "+" : ""}${(n * 100).toFixed(1).replace(".", ",")} %`;
}

export function variance(r: PurchaseRequest, q: Quote | undefined): number | null {
  if (!q || r.history.lastPrice === null) return null;
  return (q.unitPrice - r.history.lastPrice) / r.history.lastPrice;
}

export function isAutomatable(r: PurchaseRequest): boolean {
  const q = r.quotes.find((x) => x.supplier === r.recommendation.supplier);
  const total = q ? q.unitPrice * r.request.quantity : Infinity;
  return (
    r.recommendation.risk === "Bajo" &&
    r.quotes.length >= 3 &&
    r.history.previousPurchases >= 5 &&
    total <= r.authorization.maxValue
  );
}

export function aiText(
  action: AiAction,
  r: PurchaseRequest,
  selected: Quote | undefined
): string {
  const q = selected ?? r.quotes.find((x) => x.supplier === r.recommendation.supplier) ?? r.quotes[0];
  const total = q ? q.unitPrice * r.request.quantity : null;
  const v = variance(r, q);
  const missing = Math.max(0, 3 - r.quotes.length);
  const overLimit = total !== null && total > r.authorization.maxValue;

  switch (action) {
    case "resumen":
      return [
        `${r.material.name}: ${r.request.quantity} ${r.material.unit} solicitados por ${r.request.requester} (${r.request.area}).`,
        q
          ? `Mejor opción actual: ${q.supplier} a ${fmtUSD(q.unitPrice)}/${r.material.unit} (total ${fmtUSD(total!)}).`
          : "Aún no hay cotizaciones vinculadas.",
        v !== null ? `Variación vs. última compra: ${pct(v)}.` : "Sin precio histórico de referencia.",
        `Riesgo evaluado: ${r.recommendation.risk.toLowerCase()}.`,
      ].join(" ");

    case "recomendacion":
      return `${r.recommendation.summary}${
        r.recommendation.savings ? ` Ahorro estimado: ${r.recommendation.savings}.` : ""
      }`;

    case "riesgo": {
      const parts: string[] = [];
      // Worst variance across ALL linked quotes: an incumbent's price jump is a
      // risk even when the selected offer itself is within range.
      let worst: { q: Quote; v: number } | null = null;
      for (const qq of r.quotes) {
        const vv = variance(r, qq);
        if (vv !== null && (worst === null || Math.abs(vv) > Math.abs(worst.v)))
          worst = { q: qq, v: vv };
      }
      if (v !== null && Math.abs(v) > 0.08)
        parts.push(`la oferta seleccionada varía ${pct(v)} frente a la última compra`);
      else if (worst && Math.abs(worst.v) > 0.08)
        parts.push(
          `${worst.q.supplier} cotiza ${pct(worst.v)} frente a la última compra; la oferta seleccionada evita ese sobreprecio`
        );
      if (missing > 0) parts.push(`faltan ${missing} cotización(es) para cumplir la política`);
      if (overLimit)
        parts.push(
          `el total ${fmtUSD(total!)} supera el máximo autorizado ${fmtUSD(r.authorization.maxValue)}`
        );
      if (r.history.previousPurchases === 0) parts.push("no existe historial del código en SIGA");
      if (parts.length === 0) {
        if (r.recommendation.risk !== "Bajo")
          return `Riesgo ${r.recommendation.risk.toLowerCase()}: ${r.recommendation.summary}`;
        return "No se detectan riesgos relevantes: precio dentro de rango, política de cotizaciones cumplida y monto bajo el límite autorizado.";
      }
      return `Riesgo ${r.recommendation.risk.toLowerCase()}: ${parts.join("; ")}.`;
    }

    case "automatizacion":
      if (isAutomatable(r))
        return `Sí. Cumple las 4 condiciones: riesgo bajo, ${r.quotes.length} cotizaciones, ${r.history.previousPurchases} compras previas y total ${fmtUSD(total!)} bajo el límite de ${fmtUSD(r.authorization.maxValue)}. Puede crearse una regla con tolerancia ±3 %.`;
      return `Todavía no. ${
        r.recommendation.risk !== "Bajo"
          ? `El riesgo es ${r.recommendation.risk.toLowerCase()}. `
          : ""
      }${r.quotes.length < 3 ? `Hay ${r.quotes.length}/3 cotizaciones. ` : ""}${
        r.history.previousPurchases < 5
          ? `Solo ${r.history.previousPurchases} compras previas (mínimo 5). `
          : ""
      }${overLimit ? `El total supera el máximo autorizado. ` : ""}`.trim();

    case "aprobacion":
      return [
        `Paquete de aprobación · ${r.id}.`,
        `Material ${r.material.code} — ${r.material.name}.`,
        q ? `Adjudicar a ${q.supplier}: ${fmtUSD(q.unitPrice)}/${r.material.unit}, total ${fmtUSD(total!)}, entrega ${q.deliveryDays} días, ${q.paymentTerms.toLowerCase()}.` : "",
        `Autorización ${r.authorization.number} (${r.authorization.state.toLowerCase()}), tope ${fmtUSD(r.authorization.maxValue)}.`,
        `Evidencia: ${r.quotes.length} cotizaciones comparadas y trazabilidad completa en la pestaña Auditoría.`,
      ]
        .filter(Boolean)
        .join(" ");

    case "correo":
      return `Asunto: Solicitud de cotización — ${r.material.name}\n\nEstimados,\n\nPor encargo del área de compras solicitamos cotización para:\n\n· Material: ${r.material.name} (código ${r.material.code})\n· Cantidad: ${r.request.quantity} ${r.material.unit}\n· Lugar de entrega: planta principal\n· Fecha límite de respuesta: 3 días laborables\n\nAgradecemos indicar precio unitario, plazo de entrega y condiciones de pago.\n\nSaludos cordiales,\nEquipo de Compras`;

    case "faltantes": {
      const faltan: string[] = [];
      if (missing > 0) faltan.push(`${missing} cotización(es) adicionales`);
      if (r.history.lastPrice === null) faltan.push("precio histórico de referencia");
      if (r.authorization.state !== "Vigente") faltan.push("autorización vigente en SIGA");
      if (faltan.length === 0)
        return "El expediente está completo: cotizaciones, historial y autorización vigente. Listo para decisión.";
      return `Para cerrar el expediente faltan: ${faltan.join(", ")}.`;
    }
  }
}
