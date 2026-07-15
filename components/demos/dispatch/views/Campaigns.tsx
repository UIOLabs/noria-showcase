"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/Toast";
import type { Campaign, CampaignStatus } from "../data";
import { GhostButton, PageHead, SolidButton, StatusChip } from "../components/bits";
import { CampaignWizard } from "./CampaignWizard";

const STATUS_TONE: Record<CampaignStatus, { tone: "ok" | "warn" | "mute"; pulse: boolean }> = {
  running: { tone: "ok", pulse: true },
  paused: { tone: "warn", pulse: false },
  draft: { tone: "mute", pulse: false },
  completed: { tone: "mute", pulse: false },
};

const STATUS_LABEL: Record<CampaignStatus, string> = {
  running: "activa",
  paused: "pausada",
  draft: "borrador",
  completed: "completada",
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

  if (wizardOpen) {
    return (
      <div>
        <PageHead eyebrow="Biblioteca" title="Nueva campaña" desc="Cinco pasos desde el grupo hasta la marcación." />
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
        eyebrow="Biblioteca"
        title="Campañas"
        desc="Cada campaña define su grupo, guion, horario y límites de rendimiento."
        actions={<SolidButton onClick={() => setWizardOpen(true)}>Nueva campaña</SolidButton>}
      />

      <div className="overflow-x-auto rounded-2xl border border-hairline">
        <table>
          <thead>
            <tr>
              <th className="pt-3">Nombre</th>
              <th className="pt-3">Estado</th>
              <th className="pt-3 text-right">Simultáneas</th>
              <th className="pt-3 text-right">Límite diario</th>
              <th className="pt-3">Horario</th>
              <th className="pt-3">Creada</th>
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
                    <span className="font-medium">{c.name}</span>
                    <span className="mt-0.5 block font-mono text-[11px] text-mute">{c.script}</span>
                  </td>
                  <td>
                    <StatusChip tone={s.tone} label={STATUS_LABEL[c.status]} pulse={s.pulse} />
                  </td>
                  <td className="text-right font-mono text-[12px] tabular-nums">{c.concurrency}</td>
                  <td className="text-right font-mono text-[12px] tabular-nums">{c.dailyCap}/día</td>
                  <td className="font-mono text-[12px] tabular-nums text-mute">{c.hours}</td>
                  <td className="text-mute">{c.created}</td>
                  <td className="text-right">
                    {toggleable && (
                      <GhostButton
                        onClick={() => {
                          onToggle(c.id);
                          toast(
                            c.status === "running"
                              ? `“${c.name}” pausada: las llamadas en curso terminan y no se inician otras.`
                              : `“${c.name}” reanudada: la marcación continúa dentro de su horario.`,
                            c.status === "running" ? "info" : "ok"
                          );
                        }}
                      >
                        {c.status === "running" ? "Pausar" : "Reanudar"}
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
