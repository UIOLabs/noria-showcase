"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

/**
 * Spotlight callout — a small pulsing emerald marker that explains one
 * standout feature on hover/focus. Wrap it around the feature's corner:
 *
 *   <div className="relative">
 *     <Spotlight note="Prices re-rank live as you pick a quote." align="right" />
 *     ...feature...
 *   </div>
 */
export function Spotlight({
  note,
  align = "left",
  className = "",
}: {
  note: string;
  align?: "left" | "right";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <div
      className={`absolute -top-2 z-30 ${align === "right" ? "-right-2" : "-left-2"} ${className}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-describedby={open ? id : undefined}
        aria-label="Feature note"
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((v) => !v)}
        className="flex h-5 w-5 items-center justify-center"
      >
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent-glow)] animate-dot-pulse ring-2 ring-[color:var(--bg)]" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            id={id}
            role="tooltip"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute top-6 w-56 rounded-xl border border-hairline bg-surface p-3 shadow-none ${
              align === "right" ? "right-0" : "left-0"
            }`}
          >
            <span className="tag !text-[9px] !text-accent">Noria note</span>
            <p className="mt-1 text-[13px] leading-snug text-ink/85">{note}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
