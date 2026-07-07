"use client";

import { useEffect, useRef, useState } from "react";
import { Spotlight } from "@/components/annotations/Spotlight";
import { fmtUSD } from "../data";
import { BrandButton, KV, Panel, PanelHead } from "../bits";
import { useProcure } from "../state";

export function Automatizaciones() {
  const { rules, setModal } = useProcure();

  return (
    <div className="grid items-start gap-5 xl:grid-cols-[1.5fr_1fr]">
      {/* Rules */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Autorizaciones inteligentes</h2>
            <p className="mt-0.5 text-[12.5px] text-mute">
              Reglas que aprueban compras repetitivas dentro de tolerancias definidas — con auditoría.
            </p>
          </div>
          <BrandButton onClick={() => setModal({ kind: "rule" })}>＋ Nueva regla</BrandButton>
        </div>

        <div className="grid gap-3.5 md:grid-cols-2">
          {rules.map((rule, i) => (
            <Panel key={rule.id} className={i === 0 ? "animate-row-enter" : undefined}>
              <PanelHead
                title={rule.material}
                sub={rule.supplier}
                right={
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
                    style={{ background: "var(--pr-ok-soft)", color: "var(--ok)" }}
                  >
                    Activa
                  </span>
                }
              />
              <div className="space-y-3 p-4">
                <dl className="grid grid-cols-2 gap-2">
                  <KV k="Regla" v={rule.id} mono />
                  <KV k="Monto máx. auto" v={fmtUSD(rule.maxAuto)} mono />
                  <KV k="Tolerancia" v={rule.tolerance} />
                  <KV k="Cantidad" v={rule.maxQty} />
                  <KV k="Vence" v={rule.expires} mono />
                  <KV k="Solicita / autoriza" v={`${rule.requester} · ${rule.approver}`} mono />
                </dl>
                <p className="pr-ai-output rounded-xl p-3 text-[12px] leading-relaxed text-ink/80">
                  <strong className="font-semibold">Nota IA:</strong> {rule.note}
                </p>
              </div>
            </Panel>
          ))}
        </div>
      </div>

      {/* Simulator */}
      <Simulator />
    </div>
  );
}

function Simulator() {
  const { rules, ruleJustCreated } = useProcure();
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const run = () => {
    setPhase("running");
    timer.current = setTimeout(() => setPhase("done"), 1400);
  };

  const newest = rules[0];

  return (
    <div className="relative xl:sticky xl:top-24">
      <Spotlight
        align="right"
        note="Create a rule, then simulate the same purchase arriving again — it approves itself."
      />
      <div
        className="overflow-hidden rounded-2xl p-6 transition-colors duration-500"
        style={{
          background:
            phase === "done"
              ? "color-mix(in oklab, var(--ok) 16%, var(--pr-dark-panel))"
              : "var(--pr-dark-panel)",
        }}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--pr-dark-mute)]">
          Simulador
        </span>
        <h3 className="mt-2 text-lg font-semibold tracking-tight text-[var(--pr-dark-ink)]">
          ¿Qué pasa si llega la misma compra otra vez?
        </h3>

        {phase === "idle" && (
          <>
            <p className="mt-2.5 text-[13px] leading-relaxed text-[var(--pr-dark-mute)]">
              Con la regla <span className="font-mono text-[var(--pr-dark-ink)]">{newest.id}</span>{" "}
              activa ({newest.material.toLowerCase()}), una solicitud idéntica ya no espera a nadie.
            </p>
            <button
              type="button"
              onClick={run}
              className="mt-5 w-full rounded-full py-2.5 text-[13px] font-semibold transition-transform active:scale-[0.98]"
              style={{ background: "var(--pr-brand-strong)", color: "#fff" }}
            >
              Simular compra futura ▸
            </button>
            {ruleJustCreated && (
              <p className="mt-2.5 text-center text-[11.5px] text-[var(--pr-dark-mute)]">
                Tu regla recién creada participa en la simulación.
              </p>
            )}
          </>
        )}

        {phase === "running" && (
          <div className="mt-4 space-y-2.5 font-mono text-[12px] text-[var(--pr-dark-mute)]">
            {[
              "recibiendo solicitud desde SIGA…",
              "regla aplicable encontrada…",
              "verificando tolerancia de precio…",
            ].map((l, i) => (
              <p key={l} className="animate-row-enter" style={{ animationDelay: `${i * 380}ms` }}>
                <span style={{ color: "var(--ok)" }}>▸</span> {l}
              </p>
            ))}
          </div>
        )}

        {phase === "done" && (
          <div className="animate-row-enter mt-4">
            <div className="flex items-center gap-3">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full text-lg"
                style={{ background: "var(--ok)", color: "#08130d" }}
              >
                ✓
              </span>
              <div>
                <p className="text-[15px] font-semibold text-[var(--pr-dark-ink)]">
                  Auto-aprobada en 0,8 s
                </p>
                <p className="text-[11.5px] text-[var(--pr-dark-mute)]">
                  Sin intervención humana · evidencia escrita en SIGA
                </p>
              </div>
            </div>
            <ul className="mt-4 space-y-1.5 font-mono text-[11.5px] text-[var(--pr-dark-mute)]">
              <li>✓ precio dentro de {newest.tolerance.toLowerCase()}</li>
              <li>✓ total bajo el tope de {fmtUSD(newest.maxAuto)}</li>
              <li>✓ proveedor autorizado: {newest.supplier}</li>
              <li>✓ asiento de auditoría #A-2210 generado</li>
            </ul>
            <button
              type="button"
              onClick={() => setPhase("idle")}
              className="mt-5 w-full rounded-full border border-white/25 py-2 text-[12px] font-medium text-[var(--pr-dark-ink)] transition-colors hover:border-white/50"
            >
              Reiniciar simulación
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
