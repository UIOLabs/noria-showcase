"use client";

import { useEffect, useState } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Spotlight } from "@/components/annotations/Spotlight";
import {
  ATTEMPTS,
  mmss,
  OUTCOME_META,
  OUTCOMES,
  type Attempt,
  type Outcome,
} from "../data";
import { KV, PageHead, StatusChip } from "../components/bits";

export function Attempts() {
  const [filter, setFilter] = useState<Outcome | "all">("all");
  const [selected, setSelected] = useState<Attempt | null>(null);

  const rows = filter === "all" ? ATTEMPTS : ATTEMPTS.filter((a) => a.outcome === filter);

  return (
    <div>
      <PageHead
        eyebrow="Log"
        title="Attempts"
        desc="Every dial, classified. Open a row for the AI summary, transcript, and extracted fields."
      />

      {/* Filter pills */}
      <div className="mb-5 flex flex-wrap gap-1.5">
        {(["all", ...OUTCOMES] as const).map((o) => {
          const active = filter === o;
          const count = o === "all" ? ATTEMPTS.length : ATTEMPTS.filter((a) => a.outcome === o).length;
          return (
            <button
              key={o}
              type="button"
              onClick={() => setFilter(o)}
              className={`rounded-full border px-3 py-1 font-mono text-[11px] tracking-[0.06em] transition-colors ${
                active
                  ? "border-[color:var(--accent)] bg-accent text-[color:var(--bg)]"
                  : "border-hairline text-mute hover:border-ink/40 hover:text-ink"
              }`}
            >
              {o === "all" ? "all" : OUTCOME_META[o].label} · {count}
            </button>
          );
        })}
      </div>

      <div className="relative overflow-x-auto rounded-2xl border border-hairline">
        <Spotlight
          note="After every call the AI writes a summary, scores sentiment, and extracts seven structured fields — click a connected row."
          align="right"
        />
        <table>
          <thead>
            <tr>
              <th className="pt-3">Number</th>
              <th className="pt-3">Debtor</th>
              <th className="pt-3">Outcome</th>
              <th className="pt-3 text-right">Duration</th>
              <th className="pt-3">Placed</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => (
              <tr key={a.id} className="dd-row" onClick={() => setSelected(a)}>
                <td className="font-mono text-[12px]">{a.phone}</td>
                <td className="font-medium">{a.debtor}</td>
                <td>
                  <StatusChip tone={OUTCOME_META[a.outcome].tone} label={OUTCOME_META[a.outcome].label} />
                </td>
                <td className="text-right font-mono text-[12px] tabular-nums">{mmss(a.durationSec)}</td>
                <td className="font-mono text-[12px] text-mute">{a.placed}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="py-10 text-center text-mute">
                  No attempts with this outcome today.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AttemptDrawer attempt={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function AttemptDrawer({ attempt, onClose }: { attempt: Attempt | null; onClose: () => void }) {
  return (
    <Drawer open={attempt !== null} onClose={onClose} width={480} label="Attempt detail">
      {attempt && <DrawerBody attempt={attempt} onClose={onClose} />}
    </Drawer>
  );
}

function DrawerBody({ attempt, onClose }: { attempt: Attempt; onClose: () => void }) {
  const meta = OUTCOME_META[attempt.outcome];

  return (
    <div className="demo-dispatch flex flex-col gap-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="tag !text-[10px]">{attempt.id}</p>
          <h3 className="mt-1 text-xl font-light tracking-tight">{attempt.debtor}</h3>
          <p className="mt-0.5 font-mono text-[12px] text-mute">{attempt.phone}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="rounded-full p-1.5 text-mute transition-colors hover:text-ink"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-x-6">
        <KV k="Outcome" v={<StatusChip tone={meta.tone} label={meta.label} />} />
        <KV k="Duration" v={mmss(attempt.durationSec)} />
        <KV k="Placed" v={attempt.placed} />
        <KV k="Institution" v={attempt.institution} />
      </div>

      {attempt.summary && (
        <section>
          <div className="mb-2 flex items-center justify-between">
            <span className="tag !text-[10px]">AI call summary</span>
            {attempt.sentiment && (
              <StatusChip
                tone={attempt.sentiment === "positive" ? "ok" : attempt.sentiment === "negative" ? "danger" : "mute"}
                label={attempt.sentiment}
              />
            )}
          </div>
          <p className="rounded-xl border border-hairline bg-surface p-4 text-[13px] leading-relaxed text-ink/85">
            {attempt.summary}
          </p>
        </section>
      )}

      {attempt.transcript && (
        <>
          <FakePlayer duration={attempt.durationSec} />
          <section>
            <span className="tag mb-2 block !text-[10px]">Transcript</span>
            <pre className="max-h-72 overflow-y-auto rounded-xl border border-hairline p-4 text-mute">
              {attempt.transcript}
            </pre>
          </section>
        </>
      )}

      {attempt.postCall && (
        <section>
          <span className="tag mb-2 block !text-[10px]">Post-call data · extracted by the AI</span>
          <div className="flex flex-col">
            {attempt.postCall.map((f) => (
              <div key={f.label} className="flex items-baseline justify-between gap-4 border-t border-hairline py-2">
                <span className="text-[12px] text-mute">{f.label}</span>
                <span className="text-right font-mono text-[12px]">{f.value}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <span className="tag mb-2 block !text-[10px]">Variables sent</span>
        <pre className="rounded-xl border border-hairline p-4 text-mute">
          {JSON.stringify(attempt.variables, null, 2)}
        </pre>
      </section>
    </div>
  );
}

/** Styled playback UI — no real audio in the demo, the progress is simulated. */
function FakePlayer({ duration }: { duration: number }) {
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(0);

  useEffect(() => {
    if (!playing) return;
    const iv = setInterval(() => {
      setPos((p) => {
        if (p + 1 >= duration) {
          setPlaying(false);
          return duration;
        }
        return p + 1;
      });
    }, 250); // 4× speed so the demo doesn't drag
    return () => clearInterval(iv);
  }, [playing, duration]);

  return (
    <section>
      <span className="tag mb-2 block !text-[10px]">Recording</span>
      <div className="flex items-center gap-3 rounded-xl border border-hairline p-3">
        <button
          type="button"
          aria-label={playing ? "Pause" : "Play"}
          onClick={() => {
            if (pos >= duration) setPos(0);
            setPlaying((v) => !v);
          }}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-[color:var(--bg)] transition-opacity hover:opacity-90"
        >
          {playing ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <rect x="5" y="4" width="5" height="16" rx="1" />
              <rect x="14" y="4" width="5" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 4.5v15l13-7.5z" />
            </svg>
          )}
        </button>
        <div className="h-1 flex-1 overflow-hidden rounded-full" style={{ background: "var(--hairline)" }}>
          <div
            className="h-full rounded-full"
            style={{
              width: `${(pos / duration) * 100}%`,
              background: "var(--accent)",
              transition: "width 250ms linear",
            }}
          />
        </div>
        <span className="shrink-0 font-mono text-[11px] tabular-nums text-mute">
          {mmss(pos)} / {mmss(duration)}
        </span>
      </div>
      <p className="mt-1.5 text-[11px] text-mute">Simulated playback — demo builds ship no audio.</p>
    </section>
  );
}
