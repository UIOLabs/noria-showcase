"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { useT } from "@/components/i18n/LocaleProvider";
import type { Text } from "@/lib/i18n";
import type { Campaign, CampaignStatus } from "../data";
import { GhostButton, PageHead, SolidButton, StatusChip } from "../components/bits";
import { CampaignWizard } from "./CampaignWizard";

const STATUS_TONE: Record<CampaignStatus, { tone: "ok" | "warn" | "mute"; pulse: boolean }> = {
  running: { tone: "ok", pulse: true },
  paused: { tone: "warn", pulse: false },
  draft: { tone: "mute", pulse: false },
  completed: { tone: "mute", pulse: false },
};

const STATUS_LABEL: Record<CampaignStatus, Text> = {
  running: { en: "running", es: "activa" },
  paused: { en: "paused", es: "pausada" },
  draft: { en: "draft", es: "borrador" },
  completed: { en: "completed", es: "completada" },
};

export function Campaigns({
  campaigns,
  onToggle,
  onCreate,
}: {
  campaigns: Campaign[];
  onToggle: (id: string) => void;
  onCreate: (c: Campaign) => void;
}) {
  const [wizardOpen, setWizardOpen] = useState(false);
  const { toast } = useToast();
  const t = useT();

  if (wizardOpen) {
    return (
      <div>
        <PageHead
          eyebrow={t({ en: "Library", es: "Biblioteca" })}
          title={t({ en: "New campaign", es: "Nueva campaña" })}
          desc={t({ en: "Five steps from cohort to dialing.", es: "Cinco pasos desde el grupo hasta la marcación." })}
        />
        <CampaignWizard
          onCancel={() => setWizardOpen(false)}
          onLaunch={(c) => {
            onCreate(c);
            setWizardOpen(false);
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <PageHead
        eyebrow={t({ en: "Library", es: "Biblioteca" })}
        title={t({ en: "Campaigns", es: "Campañas" })}
        desc={t({
          en: "Each campaign sets its cohort, script, calling hours and throughput limits.",
          es: "Cada campaña define su grupo, guion, horario y límites de rendimiento.",
        })}
        actions={
          <SolidButton onClick={() => setWizardOpen(true)}>{t({ en: "New campaign", es: "Nueva campaña" })}</SolidButton>
        }
      />

      <div className="overflow-x-auto rounded-2xl border border-hairline">
        <table>
          <thead>
            <tr>
              <th className="pt-3">{t({ en: "Name", es: "Nombre" })}</th>
              <th className="pt-3">{t({ en: "Status", es: "Estado" })}</th>
              <th className="pt-3 text-right">{t({ en: "Concurrency", es: "Simultáneas" })}</th>
              <th className="pt-3 text-right">{t({ en: "Daily cap", es: "Límite diario" })}</th>
              <th className="pt-3">{t({ en: "Hours", es: "Horario" })}</th>
              <th className="pt-3">{t({ en: "Created", es: "Creada" })}</th>
              <th className="pt-3" />
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => {
              const s = STATUS_TONE[c.status];
              const toggleable = c.status === "running" || c.status === "paused";
              return (
                <tr key={c.id} className="dd-row">
                  <td>
                    <span className="font-medium">{t(c.name)}</span>
                    <span className="mt-0.5 block font-mono text-[11px] text-mute">{c.script}</span>
                  </td>
                  <td>
                    <StatusChip tone={s.tone} label={t(STATUS_LABEL[c.status])} pulse={s.pulse} />
                  </td>
                  <td className="text-right font-mono text-[12px] tabular-nums">{c.concurrency}</td>
                  <td className="text-right font-mono text-[12px] tabular-nums">{c.dailyCap}/{t({ en: "day", es: "día" })}</td>
                  <td className="font-mono text-[12px] tabular-nums text-mute">{c.hours}</td>
                  <td className="text-mute">{t(c.created)}</td>
                  <td className="text-right">
                    {toggleable && (
                      <GhostButton
                        onClick={() => {
                          onToggle(c.id);
                          toast(
                            c.status === "running"
                              ? t({
                                  en: `“${c.name.en}” paused: calls in flight finish and no new ones start.`,
                                  es: `“${c.name.es}” pausada: las llamadas en curso terminan y no se inician otras.`,
                                })
                              : t({
                                  en: `“${c.name.en}” resumed: dialing continues within its hours.`,
                                  es: `“${c.name.es}” reanudada: la marcación continúa dentro de su horario.`,
                                }),
                            c.status === "running" ? "info" : "ok"
                          );
                        }}
                      >
                        {c.status === "running" ? t({ en: "Pause", es: "Pausar" }) : t({ en: "Resume", es: "Reanudar" })}
                      </GhostButton>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
