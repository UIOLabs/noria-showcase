"use client";

import { useEffect, useMemo, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { useLocale, useT } from "@/components/i18n/LocaleProvider";
import { aiText } from "./ai";
import { recommendedQuote, REQUESTS, TOLERANCES, useFmt, type Rule } from "./data";
import { BrandButton, KV } from "./bits";
import { useProcure } from "./state";

export function ProcureModals() {
  const { modal, setModal } = useProcure();

  return (
    <>
      <ApprovalModal open={modal?.kind === "approval"} requestId={modal?.kind === "approval" ? modal.requestId : null} onClose={() => setModal(null)} />
      <EmailModal open={modal?.kind === "email"} requestId={modal?.kind === "email" ? modal.requestId : null} onClose={() => setModal(null)} />
      <RuleModal open={modal?.kind === "rule"} requestId={modal?.kind === "rule" ? (modal.requestId ?? null) : null} onClose={() => setModal(null)} />
    </>
  );
}

function Frame({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="demo-procure overflow-hidden rounded-2xl border border-hairline bg-canvas">
      <header className="border-b border-hairline bg-surface px-6 py-4">
        <h3 className="text-[16px] font-semibold tracking-tight">{title}</h3>
        <p className="mt-0.5 text-[12px] text-mute">{sub}</p>
      </header>
      {children}
    </div>
  );
}

function ApprovalModal({
  open,
  requestId,
  onClose,
}: {
  open: boolean;
  requestId: string | null;
  onClose: () => void;
}) {
  const { decide, selectedQuotes, setModal } = useProcure();
  const locale = useLocale();
  const t = useT();
  const { fmtUSD } = useFmt();
  const r = REQUESTS.find((x) => x.id === requestId);
  const q = r ? r.quotes.find((x) => x.id === selectedQuotes[r.id]) ?? recommendedQuote(r) : undefined;

  return (
    <Modal open={open && !!r} onClose={onClose} size="lg" label={t({ en: "Approval package", es: "Paquete de aprobación" })}>
      {r && (
        <Frame
          title={`${t({ en: "Approval package", es: "Paquete de aprobación" })} · ${r.id}`}
          sub={t({
            en: "Executive summary from the copilot + SIGA form",
            es: "Resumen ejecutivo generado por el copiloto + formulario SIGA",
          })}
        >
          <div className="space-y-5 p-6">
            <p className="pr-ai-output rounded-xl p-4 text-[13px] leading-relaxed text-ink/85">
              {aiText("aprobacion", r, q, locale)}
            </p>

            <div>
              <p className="tag mb-2 !text-[10px]">
                {t({ en: "SIGA form · enhanced authorization", es: "Formulario SIGA · autorización mejorada" })}
              </p>
              <dl className="grid grid-cols-2 gap-2 md:grid-cols-3">
                <KV k="Material" v={r.material.code} mono />
                <KV k={t({ en: "Quantity", es: "Cantidad" })} v={`${r.request.quantity} ${t(r.material.unit)}`} mono />
                <KV k={t({ en: "Supplier", es: "Proveedor" })} v={q?.supplier ?? "—"} />
                <KV k={t({ en: "Unit price", es: "Unitario" })} v={q ? fmtUSD(q.unitPrice) : "—"} mono />
                <KV k="Total" v={q ? fmtUSD(q.unitPrice * r.request.quantity) : "—"} mono />
                <KV k={t({ en: "Authorized cap", es: "Tope autorizado" })} v={fmtUSD(r.authorization.maxValue)} mono />
                <KV k={t({ en: "Authorization", es: "Autorización" })} v={r.authorization.number} mono />
                <KV k={t({ en: "Requested by", es: "Solicita" })} v={r.authorization.requester} mono />
                <KV k={t({ en: "Approved by", es: "Autoriza" })} v={r.authorization.approver} mono />
              </dl>
            </div>

            <div className="flex flex-wrap justify-end gap-2 border-t border-hairline pt-4">
              <BrandButton
                variant="ghost"
                onClick={() => {
                  decide(r.id, "devuelta");
                  onClose();
                }}
              >
                {t({ en: "Return", es: "Devolver" })}
              </BrandButton>
              <BrandButton
                variant="soft"
                onClick={() => setModal({ kind: "email", requestId: r.id })}
              >
                {t({ en: "Request a quote", es: "Pedir cotización" })}
              </BrandButton>
              <BrandButton
                onClick={() => {
                  decide(r.id, "aprobada");
                  onClose();
                }}
              >
                {t({ en: "✓ Approve and log in SIGA", es: "✓ Aprobar y registrar en SIGA" })}
              </BrandButton>
            </div>
          </div>
        </Frame>
      )}
    </Modal>
  );
}

function EmailModal({
  open,
  requestId,
  onClose,
}: {
  open: boolean;
  requestId: string | null;
  onClose: () => void;
}) {
  const { toast } = useToast();
  const { addAudit } = useProcure();
  const locale = useLocale();
  const t = useT();
  const r = REQUESTS.find((x) => x.id === requestId);
  const draft = useMemo(() => (r ? aiText("correo", r, undefined, locale) : ""), [r, locale]);
  const [text, setText] = useState<string | null>(null);

  // A fresh request gets a fresh draft, not the previous case's edits.
  useEffect(() => setText(null), [requestId]);

  return (
    <Modal open={open && !!r} onClose={onClose} size="sm" label={t({ en: "Email draft", es: "Borrador de correo" })}>
      {r && (
        <Frame
          title={t({ en: "Email drafted by AI", es: "Correo redactado por IA" })}
          sub={`${t({ en: "Request for quotation", es: "Solicitud de cotización" })} · ${t(r.material.name)}`}
        >
          <div className="space-y-4 p-6">
            <textarea
              value={text ?? draft}
              onChange={(e) => setText(e.target.value)}
              rows={12}
              className="w-full resize-none rounded-xl border border-hairline bg-surface p-3.5 font-mono text-[12px] leading-relaxed text-ink focus:border-[var(--pr-brand)] focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <BrandButton variant="ghost" onClick={onClose}>
                {t({ en: "Discard", es: "Descartar" })}
              </BrandButton>
              <BrandButton
                onClick={() => {
                  addAudit(r.id, {
                    en: "09:03 · Quote request email sent (demo)",
                    es: "09:03 · Correo de cotización enviado (demo)",
                  });
                  toast(t({ en: "Email sent to suppliers (demo)", es: "Correo enviado a proveedores (demo)" }), "ok");
                  setText(null);
                  onClose();
                }}
              >
                {t({ en: "Send (demo) ▸", es: "Enviar (demo) ▸" })}
              </BrandButton>
            </div>
          </div>
        </Frame>
      )}
    </Modal>
  );
}

function RuleModal({
  open,
  requestId,
  onClose,
}: {
  open: boolean;
  requestId: string | null;
  onClose: () => void;
}) {
  const { addRule, rules, addAudit } = useProcure();
  const t = useT();
  const { fmtUSD } = useFmt();
  const r = REQUESTS.find((x) => x.id === requestId) ?? REQUESTS[0];
  const [toleranceIdx, setToleranceIdx] = useState(0);
  const [maxAuto, setMaxAuto] = useState("7500");

  const q = recommendedQuote(r);

  return (
    <Modal open={open} onClose={onClose} size="md" label={t({ en: "New automatic rule", es: "Nueva regla automática" })}>
      <Frame
        title={t({ en: "New auto-approval rule", es: "Nueva regla de auto-aprobación" })}
        sub={t({
          en: "The AI proposes the limits from the history; you decide",
          es: "La IA propone los límites a partir del historial; tú decides",
        })}
      >
        <div className="space-y-4 p-6">
          <dl className="grid grid-cols-2 gap-2">
            <KV k="Material" v={t(r.material.name)} />
            <KV k={t({ en: "Fixed supplier", es: "Proveedor fijo" })} v={r.recommendation.supplier} />
          </dl>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="block">
              <span className="text-[12px] font-medium text-ink/80">
                {t({ en: "Price tolerance", es: "Tolerancia de precio" })}
              </span>
              <select
                value={toleranceIdx}
                onChange={(e) => setToleranceIdx(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-hairline bg-surface px-3 py-2.5 text-[13px] focus:border-[var(--pr-brand)] focus:outline-none"
              >
                {TOLERANCES.map((tol, i) => (
                  <option key={tol.en} value={i}>
                    {t(tol)}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-[12px] font-medium text-ink/80">
                {t({ en: "Max automatic amount (US$)", es: "Monto máximo automático (US$)" })}
              </span>
              <input
                value={maxAuto}
                onChange={(e) => setMaxAuto(e.target.value.replace(/[^\d]/g, ""))}
                inputMode="numeric"
                className="mt-1 w-full rounded-xl border border-hairline bg-surface px-3 py-2.5 font-mono text-[13px] tabular-nums focus:border-[var(--pr-brand)] focus:outline-none"
              />
            </label>
          </div>

          <p className="pr-ai-output rounded-xl p-3.5 text-[12.5px] leading-relaxed text-ink/85">
            <strong className="font-semibold">{t({ en: "AI note:", es: "Nota IA:" })}</strong>{" "}
            {t({
              en: `${r.history.previousPurchases} previous purchases with under 2% cumulative price change. Last bought at ${q ? fmtUSD(q.unitPrice) : "—"}/${r.material.unit.en}. Estimated risk if automated: low.`,
              es: `${r.history.previousPurchases} compras previas con variación acumulada menor al 2 %. Última compra a ${q ? fmtUSD(q.unitPrice) : "—"}/${r.material.unit.es}. Riesgo estimado si se automatiza: bajo.`,
            })}
          </p>

          <div className="flex justify-end gap-2 border-t border-hairline pt-4">
            <BrandButton variant="ghost" onClick={onClose}>
              {t({ en: "Cancel", es: "Cancelar" })}
            </BrandButton>
            <BrandButton
              onClick={() => {
                const rule: Rule = {
                  id: `RG-${String(22 + rules.length)}`,
                  material: r.material.name,
                  supplier: r.recommendation.supplier,
                  maxAuto: Number(maxAuto) || 1000,
                  tolerance: TOLERANCES[toleranceIdx],
                  maxQty: {
                    en: `Up to ${r.request.quantity} ${r.material.unit.en}`,
                    es: `Hasta ${r.request.quantity} ${r.material.unit.es}`,
                  },
                  expires: "2026-12-31",
                  requester: r.authorization.requester,
                  approver: r.authorization.approver,
                  note: {
                    en: `Created from ${r.id}; ${r.history.previousPurchases} stable previous purchases.`,
                    es: `Creada desde ${r.id}; ${r.history.previousPurchases} compras previas estables.`,
                  },
                };
                addRule(rule);
                addAudit(r.id, {
                  en: `09:04 · Rule ${rule.id} created from this case`,
                  es: `09:04 · Regla ${rule.id} creada desde este caso`,
                });
                onClose();
              }}
            >
              ◈ {t({ en: "Create rule", es: "Crear regla" })}
            </BrandButton>
          </div>
        </div>
      </Frame>
    </Modal>
  );
}
