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
        <PageHead eyebrow="Library" title="New campaign" desc="Five steps from cohort to dial tone." />
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
        eyebrow="Library"
        title="Campaigns"
        desc="Each campaign owns its cohort, script, schedule, and throughput caps."
        actions={<SolidButton onClick={() => setWizardOpen(true)}>New campaign</SolidButton>}
      />

      <div className="overflow-x-auto rounded-2xl border border-hairline">
        <table>
          <thead>
            <tr>
              <th className="pt-3">Name</th>
              <th className="pt-3">Status</th>
              <th className="pt-3 text-right">Concurrency</th>
              <th className="pt-3 text-right">Daily cap</th>
              <th className="pt-3">Hours</th>
              <th className="pt-3">Created</th>
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
                    <StatusChip tone={s.tone} label={c.status} pulse={s.pulse} />
                  </td>
                  <td className="text-right font-mono text-[12px] tabular-nums">{c.concurrency}</td>
                  <td className="text-right font-mono text-[12px] tabular-nums">{c.dailyCap}/day</td>
                  <td className="font-mono text-[12px] tabular-nums text-mute">{c.hours}</td>
                  <td className="text-mute">{c.created}</td>
                  <td className="text-right">
                    {toggleable && (
                      <GhostButton
                        onClick={() => {
                          onToggle(c.id);
                          toast(
                            c.status === "running"
                              ? `Paused “${c.name}” — in-flight calls finish, no new dials.`
                              : `Resumed “${c.name}” — dialing continues inside its window.`,
                            c.status === "running" ? "info" : "ok"
                          );
                        }}
                      >
                        {c.status === "running" ? "Pause" : "Resume"}
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
