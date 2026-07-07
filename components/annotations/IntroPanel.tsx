"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

/**
 * Slim Noria-branded explainer that sits above each product demo. One idea per
 * chip, no marketing copy. Dismissible; reappears on reload (session-scoped by
 * design — it's the demo's caption, not a cookie banner).
 */
export function IntroPanel({
  kicker,
  title,
  points,
}: {
  kicker: string;
  title: string;
  /** 2–4 short declarative statements about what's real in this demo */
  points: string[];
}) {
  const [open, setOpen] = useState(true);

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial={false}
          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
        >
          <div className="relative mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl border border-hairline bg-surface py-3.5 pl-5 pr-12">
            <div className="flex items-center gap-3">
              <span className="relative flex h-2 w-2">
                <span className="h-2 w-2 rounded-full bg-[var(--accent-glow)] animate-dot-pulse" />
              </span>
              <span className="tag !text-accent">{kicker}</span>
              <span className="text-sm font-medium tracking-tight">{title}</span>
            </div>
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-1">
              {points.map((pt) => (
                <li key={pt} className="text-[13px] text-mute">
                  {pt}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Dismiss explainer"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-mute transition-colors hover:text-ink"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
