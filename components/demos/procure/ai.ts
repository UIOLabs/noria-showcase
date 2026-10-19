/* Copiloto IA — deterministic text generation. No model calls: every output
   is computed from the request's own numbers, like the original demo. */

import type { Locale, Text } from "@/lib/i18n";
import { FORMATTERS, RISK_LABEL, AUTH_STATE_LABEL, type PurchaseRequest, type Quote } from "./data";

export type AiAction =
  | "resumen"
  | "recomendacion"
  | "riesgo"
  | "automatizacion"
  | "aprobacion"
  | "correo"
  | "faltantes";

export const AI_ACTIONS: { id: AiAction; label: Text }[] = [
  { id: "resumen", label: { en: "Executive summary", es: "Resumen ejecutivo" } },
  { id: "recomendacion", label: { en: "Explain the pick", es: "Explicar recomendación" } },
  { id: "riesgo", label: { en: "Spot the risk", es: "Detectar riesgo" } },
  { id: "automatizacion", label: { en: "Can it be automated?", es: "¿Puede automatizarse?" } },
  { id: "aprobacion", label: { en: "Prepare approval", es: "Preparar aprobación" } },
  { id: "correo", label: { en: "Draft email", es: "Redactar correo" } },
  { id: "faltantes", label: { en: "Missing data", es: "Datos faltantes" } },
];

/** Signed percentage, "+18.5%" / "+18,5 %". */
export function pct(n: number, locale: Locale): string {
  const sign = n > 0 ? "+" : "";
  const v = (n * 100).toFixed(1);
  return locale === "en" ? `${sign}${v}%` : `${sign}${v.replace(".", ",")} %`;
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
  selected: Quote | undefined,
  locale: Locale
): string {
  const { fmtUSD } = FORMATTERS[locale];
  const en = locale === "en";
  const q = selected ?? r.quotes.find((x) => x.supplier === r.recommendation.supplier) ?? r.quotes[0];
  const total = q ? q.unitPrice * r.request.quantity : null;
  const v = variance(r, q);
  const missing = Math.max(0, 3 - r.quotes.length);
  const overLimit = total !== null && total > r.authorization.maxValue;
  const name = r.material.name[locale];
  const unit = r.material.unit[locale];
  const risk = RISK_LABEL[r.recommendation.risk][locale].toLowerCase();
  const summary = r.recommendation.summary[locale];

  switch (action) {
    case "resumen":
      return [
        en
          ? `${name}: ${r.request.quantity} ${unit} requested by ${r.request.requester} (${r.request.area.en}).`
          : `${name}: ${r.request.quantity} ${unit} solicitados por ${r.request.requester} (${r.request.area.es}).`,
        q
          ? en
            ? `Best current option: ${q.supplier} at ${fmtUSD(q.unitPrice)}/${unit} (total ${fmtUSD(total!)}).`
            : `Mejor opción actual: ${q.supplier} a ${fmtUSD(q.unitPrice)}/${unit} (total ${fmtUSD(total!)}).`
          : en
            ? "No quotes linked yet."
            : "Aún no hay cotizaciones vinculadas.",
        v !== null
          ? en
            ? `Change vs. last purchase: ${pct(v, locale)}.`
            : `Variación vs. última compra: ${pct(v, locale)}.`
          : en
            ? "No historical reference price."
            : "Sin precio histórico de referencia.",
        en ? `Assessed risk: ${risk}.` : `Riesgo evaluado: ${risk}.`,
      ].join(" ");

    case "recomendacion": {
      const savings = r.recommendation.savings?.[locale];
      if (!savings) return summary;
      return en ? `${summary} Estimated savings: ${savings}.` : `${summary} Ahorro estimado: ${savings}.`;
    }

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
        parts.push(
          en
            ? `the selected offer is ${pct(v, locale)} vs. the last purchase`
            : `la oferta seleccionada varía ${pct(v, locale)} frente a la última compra`
        );
      else if (worst && Math.abs(worst.v) > 0.08)
        parts.push(
          en
            ? `${worst.q.supplier} quotes ${pct(worst.v, locale)} vs. the last purchase; the selected offer avoids that markup`
            : `${worst.q.supplier} cotiza ${pct(worst.v, locale)} frente a la última compra; la oferta seleccionada evita ese sobreprecio`
        );
      if (missing > 0)
        parts.push(
          en
            ? `${missing} more quote(s) needed to meet policy`
            : `faltan ${missing} cotización(es) para cumplir la política`
        );
      if (overLimit)
        parts.push(
          en
            ? `the ${fmtUSD(total!)} total exceeds the ${fmtUSD(r.authorization.maxValue)} authorized maximum`
            : `el total ${fmtUSD(total!)} supera el máximo autorizado ${fmtUSD(r.authorization.maxValue)}`
        );
      if (r.history.previousPurchases === 0)
        parts.push(en ? "there is no history for this code in SIGA" : "no existe historial del código en SIGA");
      const head = en ? `${RISK_LABEL[r.recommendation.risk].en} risk` : `Riesgo ${risk}`;
      if (parts.length === 0) {
        if (r.recommendation.risk !== "Bajo") return `${head}: ${summary}`;
        return en
          ? "No material risks found: price within range, quote policy met, and the amount is under the authorized limit."
          : "No se detectan riesgos relevantes: precio dentro de rango, política de cotizaciones cumplida y monto bajo el límite autorizado.";
      }
      return `${head}: ${parts.join("; ")}.`;
    }

    case "automatizacion":
      if (isAutomatable(r))
        return en
          ? `Yes. It meets all 4 conditions: low risk, ${r.quotes.length} quotes, ${r.history.previousPurchases} previous purchases, and a ${fmtUSD(total!)} total under the ${fmtUSD(r.authorization.maxValue)} limit. A rule with ±3% tolerance can be created.`
          : `Sí. Cumple las 4 condiciones: riesgo bajo, ${r.quotes.length} cotizaciones, ${r.history.previousPurchases} compras previas y total ${fmtUSD(total!)} bajo el límite de ${fmtUSD(r.authorization.maxValue)}. Puede crearse una regla con tolerancia ±3 %.`;
      if (en)
        return `Not yet. ${r.recommendation.risk !== "Bajo" ? `Risk is ${risk}. ` : ""}${
          r.quotes.length < 3 ? `There are ${r.quotes.length}/3 quotes. ` : ""
        }${
          r.history.previousPurchases < 5
            ? `Only ${r.history.previousPurchases} previous purchases (minimum 5). `
            : ""
        }${overLimit ? "The total exceeds the authorized maximum. " : ""}`.trim();
      return `Todavía no. ${r.recommendation.risk !== "Bajo" ? `El riesgo es ${risk}. ` : ""}${
        r.quotes.length < 3 ? `Hay ${r.quotes.length}/3 cotizaciones. ` : ""
      }${
        r.history.previousPurchases < 5
          ? `Solo ${r.history.previousPurchases} compras previas (mínimo 5). `
          : ""
      }${overLimit ? `El total supera el máximo autorizado. ` : ""}`.trim();

    case "aprobacion": {
      const auth = AUTH_STATE_LABEL[r.authorization.state]?.[locale] ?? r.authorization.state;
      return (
        en
          ? [
              `Approval package · ${r.id}.`,
              `Material ${r.material.code} — ${name}.`,
              q
                ? `Award to ${q.supplier}: ${fmtUSD(q.unitPrice)}/${unit}, total ${fmtUSD(total!)}, ${q.deliveryDays}-day delivery, ${q.paymentTerms.en}.`
                : "",
              `Authorization ${r.authorization.number} (${auth.toLowerCase()}), cap ${fmtUSD(r.authorization.maxValue)}.`,
              `Evidence: ${r.quotes.length} quotes compared and a full trail in the Audit panel.`,
            ]
          : [
              `Paquete de aprobación · ${r.id}.`,
              `Material ${r.material.code} — ${name}.`,
              q
                ? `Adjudicar a ${q.supplier}: ${fmtUSD(q.unitPrice)}/${unit}, total ${fmtUSD(total!)}, entrega ${q.deliveryDays} días, ${q.paymentTerms.es.toLowerCase()}.`
                : "",
              `Autorización ${r.authorization.number} (${auth.toLowerCase()}), tope ${fmtUSD(r.authorization.maxValue)}.`,
              `Evidencia: ${r.quotes.length} cotizaciones comparadas y trazabilidad completa en la pestaña Auditoría.`,
            ]
      )
        .filter(Boolean)
        .join(" ");
    }

    case "correo":
      return en
        ? `Subject: Request for quotation — ${name}\n\nHello,\n\nOn behalf of our purchasing team, we'd like a quote for:\n\n· Material: ${name} (code ${r.material.code})\n· Quantity: ${r.request.quantity} ${unit}\n· Delivery to: main plant\n· Reply by: 3 business days\n\nPlease include unit price, lead time and payment terms.\n\nKind regards,\nPurchasing Team`
        : `Asunto: Solicitud de cotización — ${name}\n\nEstimados,\n\nPor encargo del área de compras solicitamos cotización para:\n\n· Material: ${name} (código ${r.material.code})\n· Cantidad: ${r.request.quantity} ${unit}\n· Lugar de entrega: planta principal\n· Fecha límite de respuesta: 3 días laborables\n\nAgradecemos indicar precio unitario, plazo de entrega y condiciones de pago.\n\nSaludos cordiales,\nEquipo de Compras`;

    case "faltantes": {
      const faltan: string[] = [];
      if (missing > 0) faltan.push(en ? `${missing} more quote(s)` : `${missing} cotización(es) adicionales`);
      if (r.history.lastPrice === null)
        faltan.push(en ? "a historical reference price" : "precio histórico de referencia");
      if (r.authorization.state !== "Vigente")
        faltan.push(en ? "an active authorization in SIGA" : "autorización vigente en SIGA");
      if (faltan.length === 0)
        return en
          ? "The case file is complete: quotes, history and an active authorization. Ready for a decision."
          : "El expediente está completo: cotizaciones, historial y autorización vigente. Listo para decisión.";
      return en
        ? `To close the case file, it still needs: ${faltan.join(", ")}.`
        : `Para cerrar el expediente faltan: ${faltan.join(", ")}.`;
    }
  }
}
