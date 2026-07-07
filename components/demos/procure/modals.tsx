"use client";

import { useEffect, useMemo, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { aiText } from "./ai";
import { fmtUSD, recommendedQuote, REQUESTS, type Rule } from "./data";
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
    <div className="demo-procure overflow-hidden rounded-2xl border border-hairline bg-canvas" lang="es">
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
  const r = REQUESTS.find((x) => x.id === requestId);
  const q = r ? r.quotes.find((x) => x.id === selectedQuotes[r.id]) ?? recommendedQuote(r) : undefined;

  return (
    <Modal open={open && !!r} onClose={onClose} size="lg" label="Paquete de aprobación">
      {r && (
        <Frame title={`Paquete de aprobación · ${r.id}`} sub="Resumen ejecutivo generado por el copiloto + formulario SIGA">
          <div className="space-y-5 p-6">
            <p className="pr-ai-output rounded-xl p-4 text-[13px] leading-relaxed text-ink/85">
              {aiText("aprobacion", r, q)}
            </p>

            <div>
              <p className="tag mb-2 !text-[10px]">Formulario SIGA · autorización mejorada</p>
              <dl className="grid grid-cols-2 gap-2 md:grid-cols-3">
                <KV k="Material" v={r.material.code} mono />
                <KV k="Cantidad" v={`${r.request.quantity} ${r.material.unit}`} mono />
                <KV k="Proveedor" v={q?.supplier ?? "—"} />
                <KV k="Unitario" v={q ? fmtUSD(q.unitPrice) : "—"} mono />
                <KV k="Total" v={q ? fmtUSD(q.unitPrice * r.request.quantity) : "—"} mono />
                <KV k="Tope autorizado" v={fmtUSD(r.authorization.maxValue)} mono />
                <KV k="Autorización" v={r.authorization.number} mono />
                <KV k="Solicita" v={r.authorization.requester} mono />
                <KV k="Autoriza" v={r.authorization.approver} mono />
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
                Devolver
              </BrandButton>
              <BrandButton
                variant="soft"
                onClick={() => setModal({ kind: "email", requestId: r.id })}
              >
                Pedir cotización
              </BrandButton>
              <BrandButton
                onClick={() => {
                  decide(r.id, "aprobada");
                  onClose();
                }}
              >
                ✓ Aprobar y registrar en SIGA
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
  const r = REQUESTS.find((x) => x.id === requestId);
  const draft = useMemo(() => (r ? aiText("correo", r, undefined) : ""), [r]);
  const [text, setText] = useState<string | null>(null);

  // A fresh request gets a fresh draft, not the previous case's edits.
  useEffect(() => setText(null), [requestId]);

  return (
    <Modal open={open && !!r} onClose={onClose} size="sm" label="Borrador de correo">
      {r && (
        <Frame title="Correo redactado por IA" sub={`Solicitud de cotización · ${r.material.name}`}>
          <div className="space-y-4 p-6">
            <textarea
              value={text ?? draft}
              onChange={(e) => setText(e.target.value)}
              rows={12}
              className="w-full resize-none rounded-xl border border-hairline bg-surface p-3.5 font-mono text-[12px] leading-relaxed text-ink focus:border-[var(--pr-brand)] focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <BrandButton variant="ghost" onClick={onClose}>
                Descartar
              </BrandButton>
              <BrandButton
                onClick={() => {
                  addAudit(r.id, "09:03 · Correo de cotización enviado (demo)");
                  toast("Correo enviado a proveedores (demo)", "ok");
                  setText(null);
                  onClose();
                }}
              >
                Enviar (demo) ▸
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
  const r = REQUESTS.find((x) => x.id === requestId) ?? REQUESTS[0];
  const [tolerance, setTolerance] = useState("±3 % sobre último precio");
  const [maxAuto, setMaxAuto] = useState("7500");

  const q = recommendedQuote(r);

  return (
    <Modal open={open} onClose={onClose} size="md" label="Nueva regla automática">
      <Frame title="Nueva regla de auto-aprobación" sub="La IA propone los límites a partir del historial; tú decides">
        <div className="space-y-4 p-6">
          <dl className="grid grid-cols-2 gap-2">
            <KV k="Material" v={r.material.name} />
            <KV k="Proveedor fijo" v={r.recommendation.supplier} />
          </dl>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="block">
              <span className="text-[12px] font-medium text-ink/80">Tolerancia de precio</span>
              <select
                value={tolerance}
                onChange={(e) => setTolerance(e.target.value)}
                className="mt-1 w-full rounded-xl border border-hairline bg-surface px-3 py-2.5 text-[13px] focus:border-[var(--pr-brand)] focus:outline-none"
              >
                <option>±3 % sobre último precio</option>
                <option>±5 % sobre último precio</option>
                <option>±8 % sobre último precio</option>
              </select>
            </label>
            <label className="block">
              <span className="text-[12px] font-medium text-ink/80">Monto máximo automático (US$)</span>
              <input
                value={maxAuto}
                onChange={(e) => setMaxAuto(e.target.value.replace(/[^\d]/g, ""))}
                inputMode="numeric"
                className="mt-1 w-full rounded-xl border border-hairline bg-surface px-3 py-2.5 font-mono text-[13px] tabular-nums focus:border-[var(--pr-brand)] focus:outline-none"
              />
            </label>
          </div>

          <p className="pr-ai-output rounded-xl p-3.5 text-[12.5px] leading-relaxed text-ink/85">
            <strong className="font-semibold">Nota IA:</strong> {r.history.previousPurchases} compras
            previas con variación acumulada menor al 2 %. Última compra a{" "}
            {q ? fmtUSD(q.unitPrice) : "—"}/{r.material.unit}. Riesgo estimado si se automatiza:
            bajo.
          </p>

          <div className="flex justify-end gap-2 border-t border-hairline pt-4">
            <BrandButton variant="ghost" onClick={onClose}>
              Cancelar
            </BrandButton>
            <BrandButton
              onClick={() => {
                const rule: Rule = {
                  id: `RG-${String(22 + rules.length)}`,
                  material: r.material.name,
                  supplier: r.recommendation.supplier,
                  maxAuto: Number(maxAuto) || 1000,
                  tolerance,
                  maxQty: `Hasta ${r.request.quantity} ${r.material.unit}`,
                  expires: "2026-12-31",
                  requester: r.authorization.requester,
                  approver: r.authorization.approver,
                  note: `Creada desde ${r.id}; ${r.history.previousPurchases} compras previas estables.`,
                };
                addRule(rule);
                addAudit(r.id, `09:04 · Regla ${rule.id} creada desde este caso`);
                onClose();
              }}
            >
              ◈ Crear regla
            </BrandButton>
          </div>
        </div>
      </Frame>
    </Modal>
  );
}
