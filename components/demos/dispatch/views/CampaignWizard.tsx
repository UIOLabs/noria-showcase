"use client";

import { useMemo, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { Spotlight } from "@/components/annotations/Spotlight";
import { useLocale, useT } from "@/components/i18n/LocaleProvider";
import type { Text } from "@/lib/i18n";
import { COHORTS, INSTITUTIONS, mxn, WIZARD_SCRIPTS, type Campaign } from "../data";
import { GhostButton, KV, SolidButton } from "../components/bits";

const STEPS: Text[] = [
  { en: "Setup", es: "Configuración" },
  { en: "Preview", es: "Vista previa" },
  { en: "Schedule", es: "Horario" },
  { en: "Throughput", es: "Rendimiento" },
  { en: "Review", es: "Revisión" },
];

type Form = {
  name: string;
  scriptId: string;
  institution: string;
  fromNumber: string;
  hoursStart: string;
  hoursEnd: string;
  retryNoAnswer: string;
  retryBusy: string;
  retryVoicemail: string;
  concurrency: number;
  dailyCap: number;
};

const INITIAL: Form = {
  name: "",
  scriptId: "s1",
  institution: INSTITUTIONS[0],
  fromNumber: "+52 55 5501 0100",
  hoursStart: "09:00",
  hoursEnd: "20:00",
  retryNoAnswer: "4 h",
  retryBusy: "30 min",
  retryVoicemail: "24 h",
  concurrency: 6,
  dailyCap: 3,
};

export function CampaignWizard({
  onLaunch,
  onCancel,
}: {
  onLaunch: (c: Campaign) => void;
  onCancel: () => void;
}) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(INITIAL);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { toast } = useToast();
  const locale = useLocale();
  const t = useT();

  const cohort = COHORTS[form.institution];
  const scriptLabel = WIZARD_SCRIPTS.find((s) => s.id === form.scriptId)?.label ?? "";
  const callsPerHour = form.concurrency * 6;

  const stepError = useMemo(() => {
    if (step === 0 && form.name.trim().length < 3)
      return t({ en: "Give the campaign a name (3+ characters).", es: "Asigna un nombre a la campaña (3 caracteres o más)." });
    if (step === 2 && form.hoursEnd <= form.hoursStart)
      return t({ en: "The window must end after it starts.", es: "El fin del horario debe ser posterior al inicio." });
    return null;
  }, [step, form, t]);

  const plan = useMemo(() => {
    if (locale === "en") {
      const name = form.name.trim() || "This campaign";
      return `${name} will dial ${cohort.count} debtors from ${form.institution} using ${scriptLabel}, between ${form.hoursStart} and ${form.hoursEnd} local time, at up to ${form.concurrency} concurrent calls (~${callsPerHour} calls/hour) and at most ${form.dailyCap} attempts per debtor per day. No-answer retries after ${form.retryNoAnswer}, busy after ${form.retryBusy}, voicemail after ${form.retryVoicemail}. Dialing stops for a debtor the moment a person answers.`;
    }
    const name = form.name.trim() || "Esta campaña";
    return `${name} llamará a ${cohort.count} deudores de ${form.institution} con ${scriptLabel}, entre las ${form.hoursStart} y las ${form.hoursEnd} en hora local, con hasta ${form.concurrency} llamadas simultáneas (~${callsPerHour} llamadas/hora) y un máximo de ${form.dailyCap} intentos por deudor al día. Se reintentará después de ${form.retryNoAnswer} si no hay respuesta, ${form.retryBusy} si está ocupado y ${form.retryVoicemail} si contesta el buzón. La marcación para un deudor se detiene cuando una persona responde.`;
  }, [form, cohort, scriptLabel, callsPerHour, locale]);

  function set<K extends keyof Form>(k: K, v: Form[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function launch() {
    setConfirmOpen(false);
    onLaunch({
      id: `cmp-0${15 + (form.name.length % 7)}`,
      // Typed by the operator, so it reads the same in both languages.
      name: { en: form.name.trim(), es: form.name.trim() },
      status: "running",
      concurrency: form.concurrency,
      dailyCap: form.dailyCap,
      hours: `${form.hoursStart}–${form.hoursEnd}`,
      created: { en: "Today", es: "Hoy" },
      institution: form.institution,
      script: scriptLabel,
    });
    toast(
      t({
        en: "Campaign launched: dialing starts inside the configured window.",
        es: "Campaña iniciada: la marcación comenzará dentro del horario configurado.",
      })
    );
  }

  const field = (label: string, node: React.ReactNode, hint?: string) => (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-mute">{label}</span>
      {node}
      {hint && <span className="text-[11px] text-mute">{hint}</span>}
    </label>
  );

  return (
    <div>
      {/* Stepper */}
      <div className="mb-7 flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em]">
        {STEPS.map((s, i) => (
          <span key={s.en} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => i < step && setStep(i)}
              className={`flex items-center gap-1.5 transition-colors ${
                i === step ? "text-accent" : i < step ? "text-ink hover:text-accent" : "text-mute"
              }`}
            >
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full border text-[9px] ${
                  i <= step ? "border-[color:var(--accent)]" : "border-hairline"
                }`}
              >
                {i < step ? "✓" : i + 1}
              </span>
              {t(s)}
            </button>
            {i < STEPS.length - 1 && <span className="text-mute">→</span>}
          </span>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 rounded-2xl border border-hairline p-6">
          {step === 0 && (
            <div className="flex flex-col gap-5">
              {field(
                t({ en: "Campaign name", es: "Nombre de la campaña" }),
                <input
                  type="text"
                  value={form.name}
                  placeholder={t({ en: "July — Alcores cards", es: "Julio — Alcores tarjetas" })}
                  onChange={(e) => set("name", e.target.value)}
                />
              )}
              {field(
                t({ en: "Script", es: "Guion" }),
                <select value={form.scriptId} onChange={(e) => set("scriptId", e.target.value)}>
                  {WIZARD_SCRIPTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              )}
              {field(
                t({ en: "Cohort — client institution", es: "Grupo — institución cliente" }),
                <select value={form.institution} onChange={(e) => set("institution", e.target.value)}>
                  {INSTITUTIONS.map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>,
                t({
                  en: `${cohort.count} debtors queued for this institution`,
                  es: `${cohort.count} deudores en cola para esta institución`,
                })
              )}
              {field(
                t({ en: "From number", es: "Número de origen" }),
                <select value={form.fromNumber} onChange={(e) => set("fromNumber", e.target.value)}>
                  <option>+52 55 5501 0100</option>
                  <option>+52 55 5501 0101</option>
                </select>
              )}
            </div>
          )}

          {step === 1 && (
            <div>
              <p className="mb-4 text-[13px] text-mute">
                <span className="font-mono text-lg text-ink">{cohort.count}</span>{" "}
                {t({ en: "debtors match this cohort. Sample:", es: "deudores coinciden con este grupo. Muestra:" })}
              </p>
              <div className="overflow-x-auto rounded-xl border border-hairline">
                <table>
                  <thead>
                    <tr>
                      <th className="pt-3">{t({ en: "Name", es: "Nombre" })}</th>
                      <th className="pt-3">{t({ en: "Phone", es: "Teléfono" })}</th>
                      <th className="pt-3 text-right">{t({ en: "Balance", es: "Saldo" })}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cohort.sample.map((d) => (
                      <tr key={d.phone}>
                        <td>{d.name}</td>
                        <td className="font-mono text-[12px] text-mute">{d.phone}</td>
                        <td className="text-right font-mono text-[12px] tabular-nums">{mxn.format(d.owed)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="tag mt-6 mb-2 !text-[10px]">{t({ en: "Time-zone split", es: "Distribución por zona horaria" })}</p>
              <div className="flex flex-wrap gap-2">
                {cohort.tz.map((zone) => (
                  <span
                    key={zone.label.en}
                    className="rounded-full border border-hairline px-3 py-1 font-mono text-[11px] tabular-nums"
                  >
                    {t(zone.label)} · {zone.n}
                  </span>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-5 sm:grid-cols-2">
              {field(
                t({ en: "Window start (local)", es: "Inicio del horario (local)" }),
                <input type="time" value={form.hoursStart} onChange={(e) => set("hoursStart", e.target.value)} />
              )}
              {field(
                t({ en: "Window end (local)", es: "Fin del horario (local)" }),
                <input type="time" value={form.hoursEnd} onChange={(e) => set("hoursEnd", e.target.value)} />
              )}
              {field(
                t({ en: "Retry after no answer", es: "Reintento sin respuesta" }),
                <select value={form.retryNoAnswer} onChange={(e) => set("retryNoAnswer", e.target.value)}>
                  <option>2 h</option>
                  <option>4 h</option>
                  <option>8 h</option>
                </select>
              )}
              {field(
                t({ en: "Retry after busy", es: "Reintento si está ocupado" }),
                <select value={form.retryBusy} onChange={(e) => set("retryBusy", e.target.value)}>
                  <option>15 min</option>
                  <option>30 min</option>
                  <option>60 min</option>
                </select>
              )}
              {field(
                t({ en: "Retry after voicemail", es: "Reintento después del buzón" }),
                <select value={form.retryVoicemail} onChange={(e) => set("retryVoicemail", e.target.value)}>
                  <option>12 h</option>
                  <option>24 h</option>
                  <option>48 h</option>
                </select>
              )}
              <p className="self-end pb-1 text-[11px] text-mute sm:col-span-1">
                {t({
                  en: "Calls respect each debtor's time zone: the window is theirs, not yours.",
                  es: "Las llamadas respetan la zona horaria de cada deudor: el horario es el suyo, no el tuyo.",
                })}
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-6">
              {field(
                t({
                  en: `Concurrency — ${form.concurrency} calls at once`,
                  es: `Simultaneidad — ${form.concurrency} llamadas a la vez`,
                }),
                <input
                  type="range"
                  min={1}
                  max={12}
                  value={form.concurrency}
                  onChange={(e) => set("concurrency", Number(e.target.value))}
                />,
                t({
                  en: `~${callsPerHour} calls/hour at this setting`,
                  es: `~${callsPerHour} llamadas/hora con esta configuración`,
                })
              )}
              {field(
                t({ en: "Daily attempt cap per debtor", es: "Límite diario de intentos por deudor" }),
                <select value={form.dailyCap} onChange={(e) => set("dailyCap", Number(e.target.value))}>
                  {[1, 2, 3, 4].map((n) => (
                    <option key={n} value={n}>
                      {n} / {t({ en: "day", es: "día" })}
                    </option>
                  ))}
                </select>,
                t({
                  en: "Compliance guardrail: the dispatcher enforces it across every retry",
                  es: "Control de cumplimiento: el despachador lo aplica en todos los reintentos",
                })
              )}
            </div>
          )}

          {step === 4 && (
            <div>
              <p className="tag mb-4 !text-[10px]">{t({ en: "Review", es: "Revisión" })}</p>
              <div className="grid gap-x-8 sm:grid-cols-2">
                <KV k={t({ en: "Name", es: "Nombre" })} v={form.name.trim() || "—"} />
                <KV k={t({ en: "Script", es: "Guion" })} v={scriptLabel} />
                <KV
                  k={t({ en: "Cohort", es: "Grupo" })}
                  v={`${form.institution} · ${cohort.count} ${t({ en: "debtors", es: "deudores" })}`}
                />
                <KV k={t({ en: "From", es: "Origen" })} v={form.fromNumber} />
                <KV k={t({ en: "Hours", es: "Horario" })} v={`${form.hoursStart}–${form.hoursEnd}`} />
                <KV
                  k={t({ en: "Throughput", es: "Rendimiento" })}
                  v={t({
                    en: `${form.concurrency} concurrent · cap ${form.dailyCap}/day`,
                    es: `${form.concurrency} simultáneas · límite ${form.dailyCap}/día`,
                  })}
                />
              </div>
            </div>
          )}

          {stepError && <p className="mt-4 text-[12px]" style={{ color: "var(--danger)" }}>{stepError}</p>}

          <div className="mt-7 flex items-center justify-between border-t border-hairline pt-5">
            <GhostButton onClick={() => (step === 0 ? onCancel() : setStep(step - 1))}>
              {step === 0 ? t({ en: "Cancel", es: "Cancelar" }) : t({ en: "Back", es: "Atrás" })}
            </GhostButton>
            {step < STEPS.length - 1 ? (
              <SolidButton disabled={!!stepError} onClick={() => setStep(step + 1)}>
                {t({ en: "Continue", es: "Continuar" })} ▸
              </SolidButton>
            ) : (
              <SolidButton onClick={() => setConfirmOpen(true)}>{t({ en: "Launch campaign", es: "Iniciar campaña" })}</SolidButton>
            )}
          </div>
        </div>

        {/* Live plan summary */}
        <div className="relative self-start rounded-2xl border border-hairline bg-surface p-5">
          <Spotlight
            note={t({
              en: "The plan recomputes as you edit, in plain language, so an operator can sanity-check it before launch.",
              es: "El plan se recalcula mientras editas y se explica con claridad para que un operador pueda validarlo antes de iniciar.",
            })}
            align="right"
          />
          <p className="tag mb-3 !text-[10px] !text-accent">{t({ en: "What will happen", es: "Qué sucederá" })}</p>
          <p className="text-[13px] leading-relaxed text-ink/85">{plan}</p>
        </div>
      </div>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        size="sm"
        label={t({ en: "Launch campaign", es: "Iniciar campaña" })}
      >
        <div className="rounded-2xl border border-hairline bg-canvas p-6">
          <p className="tag !text-[10px]">{t({ en: "Confirm launch", es: "Confirmar inicio" })}</p>
          <h3 className="mt-2 text-xl font-light tracking-tight">
            {t({
              en: `Launch “${form.name.trim() || "campaign"}”?`,
              es: `¿Iniciar “${form.name.trim() || "campaña"}”?`,
            })}
          </h3>
          <p className="mt-2 text-[13px] text-mute">
            {t({
              en: `Launching dials real numbers. ${cohort.count} debtors join the queue and calls start inside the configured window.`,
              es: `Al iniciar se marcarán números reales. ${cohort.count} deudores entrarán en la cola y las llamadas comenzarán dentro del horario configurado.`,
            })}
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <GhostButton onClick={() => setConfirmOpen(false)}>{t({ en: "Keep editing", es: "Seguir editando" })}</GhostButton>
            <SolidButton onClick={launch}>{t({ en: "Launch", es: "Iniciar" })}</SolidButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}
