"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { PRODUCTS } from "@/lib/products";
import { mainSite } from "@/lib/i18n";
import { useLocale, useT } from "@/components/i18n/LocaleProvider";
import { BrandLogo } from "./BrandLogo";
import { LangToggle } from "./LangToggle";
import { ThemeToggle } from "./ThemeToggle";

export function Nav() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useT();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-hairline bg-canvas/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-3 px-4 md:gap-4 md:px-8">
        <Link
          href={`/${locale}`}
          aria-label={t({ en: "Noria — client work", es: "Noria — proyectos para clientes" })}
          className="shrink-0"
        >
          {/* Full wordmark from md up; on phones the product switcher needs the room. */}
          <BrandLogo size="sm" className="hidden md:block" />
          <span className="font-wordmark text-[15px] font-semibold tracking-[0.2em] md:hidden">
            <span className="text-accent">[</span>N<span className="text-accent">]</span>
          </span>
        </Link>

        {/* Product switcher */}
        <nav
          aria-label={t({ en: "Demos", es: "Demos" })}
          className="flex min-w-0 items-center gap-0.5 rounded-full border border-hairline p-1 md:gap-1"
        >
          {PRODUCTS.map((p) => {
            const active = pathname.startsWith(`/${locale}/${p.slug}`);
            return (
              <Link
                key={p.slug}
                href={`/${locale}/${p.slug}`}
                aria-current={active ? "page" : undefined}
                className={`relative whitespace-nowrap rounded-full px-2 py-1.5 text-[11.5px] font-medium sm:px-2.5 sm:text-[12px] tracking-tight transition-colors md:px-4 md:text-[13px] ${
                  active ? "text-[color:var(--bg)]" : "text-ink/70 hover:text-ink"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="product-tab"
                    className="absolute inset-0 rounded-full bg-accent"
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  />
                )}
                <span className="relative">{p.tab}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2 md:gap-3">
          <a
            href={mainSite(locale, "/book-demo")}
            className="tag hidden transition-colors hover:text-ink lg:inline"
          >
            {t({ en: "Book a call ↗", es: "Agenda una llamada ↗" })}
          </a>
          <LangToggle />
          {/* On phones the switcher needs the room; the footer carries it there. */}
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
