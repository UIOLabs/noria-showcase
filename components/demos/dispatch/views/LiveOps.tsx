"use client";

import { SparkBars } from "@/components/charts/Sparkline";
import { StackedBar } from "@/components/charts/StackedBar";
import { Spotlight } from "@/components/annotations/Spotlight";
import {
  agoLabel,
  mmss,
  OUTCOME_META,
  OUTCOMES,
  type Board,
  type Outcome,
} from "../data";
import { PageHead, SectionLabel, StatusChip } from "../components/bits";

const OUTCOME_BAR_COLOR: Record<Outcome, string> = {
  connected: "var(--ok)",
  voicemail: "var(--warn)",
  no_answer: "color-mix(in oklab, var(--ink) 35%, transparent)",
  busy: "color-mix(in oklab, var(--ink) 22%, transparent)",
  wrong_number: "var(--danger)",
  do_not_call: "color-mix(in oklab, var(--danger) 60%, var(--ink))",
  failed: "color-mix(in oklab, var(--danger) 40%, transparent)",
};

function sliverColor(elapsed: number): string {
  if (elapsed > 120) return "var(--danger)";
  if (elapsed > 60) return "var(--warn)";
  return "var(--ok)";
}

export function LiveOps({ board, runningCampaigns }: { board: Board; runningCampaigns: number }) {
  const totalOutcomes = OUTCOMES.reduce((a, o) => a + board.outcomes[o], 0);
  const ranked = [...OUTCOMES].sort((a, b) => board.outcomes[b] - board.outcomes[a]);

  return (
    <div>
      <PageHead
        eyebrow="Operations"
        title="Live ops"
        desc="Every in-flight call, as it happens. Dialing stops the instant a human connects."
        actions={
          <span className="inline-flex items-center gap-2 rounded-full border border-hairline px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/80">
            <span className="h-1.5 w-1.5 rounded-full animate-dot-pulse" style={{ background: "var(--ok)" }} />
            live
          </span>
        }
      />

      {/* Stat strip */}
      <div className="mb-8 grid grid-cols-2 divide-x divide-[var(--hairline)] rounded-2xl border border-hairline md:grid-cols-4">
        {[
          { label: "Running", value: String(runningCampaigns) },
          { label: "Queued", value: board.queued.toLocaleString("en-US") },
          { label: "In flight", value: String(board.calls.length) },
          { label: "Attempts today", value: board.attemptsToday.toLocaleString("en-US") },
        ].map((s) => (
          <div key={s.label} className="px-5 py-4">
            <p className="text-[11px] text-mute">{s.label}</p>
            <p className="mt-1 font-mono text-2xl tabular-nums">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_290px]">
        {/* In-flight table */}
        <div className="relative min-w-0">
          <Spotlight note="Each row is a live AI call — the sliver turns amber past 60s and rose past 120s. Calls end and new ones dial automatically." align="left" className="!-left-4 !-top-3" />
          <SectionLabel
            accessory={<span className="font-mono text-[10px] text-mute">{board.calls.length} active</span>}
          >
            In-flight calls
          </SectionLabel>
          <div className="overflow-x-auto rounded-2xl border border-hairline">
            <table>
              <thead>
                <tr>
                  <th className="pt-3">Debtor</th>
                  <th className="pt-3">Number</th>
                  <th className="pt-3">Campaign</th>
                  <th className="pt-3 text-right">Elapsed</th>
                </tr>
              </thead>
              <tbody>
                {board.calls.map((c) => (
                  <tr key={c.id} className="relative animate-row-enter">
                    <td className="font-medium">{c.name}</td>
                    <td className="font-mono text-[12px] text-mute">{c.phone}</td>
                    <td className="max-w-[180px] truncate text-mute">{c.campaign}</td>
                    <td className="text-right">
                      <span className="font-mono text-[13px] tabular-nums">{mmss(c.elapsed)}</span>
                      <span
                        className="dd-sliver"
                        style={{
                          width: `${Math.min((c.elapsed / 180) * 100, 100)}%`,
                          background: sliverColor(c.elapsed),
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[11px] text-mute">
            Rows churn on a simulated dispatcher tick — outcomes land in the breakdown on the right.
          </p>
        </div>

        {/* Right rail */}
        <div className="flex min-w-0 flex-col gap-7">
          <div>
            <SectionLabel accessory={<span className="font-mono text-[10px] text-mute">per 30s</span>}>
              Throughput
            </SectionLabel>
            <p className="mb-2 font-mono text-3xl tabular-nums">
              {board.attemptsToday.toLocaleString("en-US")}
              <span className="ml-2 text-[11px] text-mute">attempts today</span>
            </p>
            <SparkBars values={board.buckets} color="var(--accent)" height={44} flashKey={board.attemptsToday} />
          </div>

          <div>
            <SectionLabel>Outcomes today</SectionLabel>
            <StackedBar
              segments={OUTCOMES.map((o) => ({
                label: OUTCOME_META[o].label,
                value: board.outcomes[o],
                color: OUTCOME_BAR_COLOR[o],
              }))}
            />
            <ul className="mt-3 flex flex-col gap-1.5">
              {ranked.map((o) => (
                <li key={o} className="flex items-center gap-2 text-[12px]">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: OUTCOME_BAR_COLOR[o] }} />
                  <span className="text-mute">{OUTCOME_META[o].label}</span>
                  <span className="ml-auto font-mono tabular-nums">
                    {board.outcomes[o]}
                    <span className="ml-1.5 text-mute">
                      {Math.round((board.outcomes[o] / Math.max(totalOutcomes, 1)) * 100)}%
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <SectionLabel>Health</SectionLabel>
            <div className="flex flex-col gap-2.5 rounded-2xl border border-hairline p-4">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-mute">Dispatcher</span>
                <StatusChip tone="ok" label="healthy" pulse />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-mute">Voice provider</span>
                <span className="font-mono text-[12px] tabular-nums">
                  {board.calls.length} / 20 concurrency
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-mute">Webhooks</span>
                <StatusChip tone="ok" label="200 OK" />
              </div>
            </div>
          </div>

          <div>
            <SectionLabel>Connected · this session</SectionLabel>
            <ul className="flex flex-col">
              {board.connected.map((c) => (
                <li key={`${c.phone}-${c.atTick}`} className="flex items-center gap-2.5 border-t border-hairline py-2.5 first:border-t-0">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--ok)" }} />
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium">{c.name}</p>
                    <p className="font-mono text-[11px] text-mute">{c.phone}</p>
                  </div>
                  <span className="ml-auto shrink-0 font-mono text-[10px] uppercase tracking-[0.1em] text-mute">
                    {agoLabel(board.tickCount - c.atTick)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
