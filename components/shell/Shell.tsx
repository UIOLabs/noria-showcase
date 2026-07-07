"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Nav } from "./Nav";
import { Footer } from "./Footer";

/**
 * Noria chrome around the product demos: fixed nav with the product switcher,
 * the demo viewport, and a slim footer. Route changes cross-fade the viewport
 * so flipping between products feels like switching apps, not loading pages.
 */
export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1 pt-16">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
