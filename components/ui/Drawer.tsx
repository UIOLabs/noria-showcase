"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";

/** Right slide-in sheet (job details, call attempts, drill-downs). */
export function Drawer({
  open,
  onClose,
  children,
  width = 440,
  label,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: number;
  label?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[80]"
          role="dialog"
          aria-modal="true"
          aria-label={label}
        >
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <motion.div
            initial={{ x: width }}
            animate={{ x: 0 }}
            exit={{ x: width }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-y-0 right-0 w-full overflow-y-auto border-l border-hairline bg-canvas"
            style={{ maxWidth: width }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
