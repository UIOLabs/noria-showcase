"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { PRODUCTS } from "@/lib/products";

/**
 * Product index — deliberately not a landing page. One viewport: the three
 * product lines, each a door into a working demo.
 */
export default function IndexPage() {
  return (
    <div className="relative mx-auto flex min-h-[calc(100vh-9rem)] max-w-[1600px] flex-col justify-center px-4 py-16 md:px-8">
      {/* Ambient backdrop */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-grid mask-fade-edges opacity-60" />
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 z-0 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/2 animate-glow-drift rounded-full opacity-[0.07]"
        style={{ background: "radial-gradient(ellipse, var(--accent-glow), transparent 70%)" }}
      />

      <div className="relative z-10">
        <p className="tag mb-4">Noria · Product lines</p>
        <h1 className="max-w-3xl text-4xl tracking-[-0.035em] md:text-6xl">
          Three products.{" "}
          <em className="font-display italic text-accent">Working</em> demos.
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-mute">
          Everything below is clickable and runs entirely in your browser on
          demo data. Pick a product line — or use the switcher above.
        </p>

        <div className="mt-12 grid gap-px bg-[var(--hairline)] md:grid-cols-3">
          {PRODUCTS.map((p, i) => (
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={`/${p.slug}`}
                className="group flex h-full flex-col bg-canvas p-8 transition-colors hover:bg-surface md:p-9"
              >
                <span className="tag">{p.kicker}</span>
                <span className="mt-3 font-display text-2xl tracking-tight md:text-3xl">
                  {p.name}
                </span>
                <span className="mt-3 flex-1 text-[15px] leading-relaxed text-ink/65">
                  {p.tagline}
                </span>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-accent">
                  Open demo
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                    ▸
                  </span>
                </span>
                <span className="mt-4 tag !text-[10px]">UI · {p.demoLang === "ES" ? "Español" : "English"}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
