"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { PRODUCTS } from "@/lib/products";
import { mainSite } from "@/lib/i18n";
import { useLocale, useT } from "@/components/i18n/LocaleProvider";

/**
 * Index — deliberately not a landing page. One viewport: the three client
 * builds, each a door into a working demo, and a way to start your own.
 */
export function ClientWorkIndex() {
  const locale = useLocale();
  const t = useT();

  return (
    <div className="relative mx-auto flex min-h-[calc(100vh-9rem)] max-w-[1600px] flex-col justify-center px-4 py-16 md:px-8">
      {/* Ambient backdrop */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-grid mask-fade-edges opacity-60" />
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 z-0 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/2 animate-glow-drift rounded-full opacity-[0.07]"
        style={{ background: "radial-gradient(ellipse, var(--accent-glow), transparent 70%)" }}
      />

      <div className="relative z-10">
        <p className="tag mb-4">{t({ en: "Noria · Client work", es: "Noria · Proyectos para clientes" })}</p>
        <h1 className="max-w-3xl text-4xl tracking-[-0.035em] md:text-6xl">
          {t({ en: "Built for our clients. Demos that ", es: "Hecho para nuestros clientes. Demos que " })}
          <em className="font-display italic text-accent">{t({ en: "work", es: "funcionan" })}</em>.
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-mute">
          {t({
            en: "Three systems we built for real operations, rebuilt here with fictional data so you can click through all of it. Everything runs in your browser.",
            es: "Tres sistemas que construimos para operaciones reales, recreados aquí con datos ficticios para que puedas recorrerlos de punta a punta. Todo funciona en tu navegador.",
          })}
        </p>

        <div className="mt-12 grid gap-px bg-[var(--hairline)] md:grid-cols-3">
          {PRODUCTS.map((p, i) => (
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col bg-canvas"
            >
              <Link
                href={`/${locale}/${p.slug}`}
                className="group flex flex-1 flex-col p-8 transition-colors hover:bg-surface md:p-9"
              >
                <span className="tag">
                  {t(p.sector)} · {t(p.kicker)}
                </span>
                <span className="mt-3 font-display text-2xl tracking-tight md:text-3xl">{p.tab}</span>
                <span className="mt-2 text-[15px] font-medium leading-snug text-ink/85">{t(p.title)}</span>
                <span className="mt-3 flex-1 text-[14px] leading-relaxed text-ink/60">{t(p.tagline)}</span>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-accent">
                  {t({ en: "Open demo", es: "Abrir demo" })}
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">▸</span>
                </span>
              </Link>
              <div className="flex items-center justify-between gap-3 border-t border-hairline px-8 py-3 md:px-9">
                <span className="tag !text-[10px]">{t(p.shipped)}</span>
                <a
                  href={mainSite(locale, `/work#${p.study}`)}
                  className="tag !text-[10px] transition-colors hover:text-ink"
                >
                  {t({ en: "Case study ↗", es: "Caso de estudio ↗" })}
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* The point of the page: start a build of your own. */}
        <div className="mt-px flex flex-col items-start justify-between gap-5 bg-surface px-8 py-7 md:flex-row md:items-center md:px-9">
          <div>
            <p className="text-lg font-medium tracking-tight">
              {t({
                en: "Need something like this — or nothing like it?",
                es: "¿Necesitas algo así, o algo completamente distinto?",
              })}
            </p>
            <p className="mt-1 text-[14px] text-mute">
              {t({
                en: "We build custom software around how your operation actually works.",
                es: "Construimos software a la medida de cómo funciona tu operación.",
              })}
            </p>
          </div>
          <a
            href={mainSite(locale, "/book-demo")}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-[color:var(--bg)] transition-opacity hover:opacity-90"
          >
            {t({ en: "Book a free 30-minute call", es: "Agenda una llamada gratis de 30 min" })}
            <span aria-hidden>↗</span>
          </a>
        </div>
      </div>
    </div>
  );
}
