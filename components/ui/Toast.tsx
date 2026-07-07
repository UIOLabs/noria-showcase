"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

type Toast = { id: number; text: string; tone: "ok" | "info" | "danger" };
type ToastCtx = { toast: (text: string, tone?: Toast["tone"]) => void };

const Ctx = createContext<ToastCtx>({ toast: () => {} });

export function useToast() {
  return useContext(Ctx);
}

/** Bottom-right auto-dismissing toasts. Wrap each demo root once. */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const toast = useCallback((text: string, tone: Toast["tone"] = "ok") => {
    const id = nextId.current++;
    setToasts((t) => [...t, { id, text, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  }, []);

  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed bottom-6 right-6 z-[90] flex flex-col items-end gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-2.5 rounded-full border border-hairline bg-surface py-2 pl-3 pr-4 text-[13px] text-ink"
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{
                  background:
                    t.tone === "ok" ? "var(--ok)" : t.tone === "danger" ? "var(--danger)" : "var(--info)",
                }}
              />
              {t.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  );
}
