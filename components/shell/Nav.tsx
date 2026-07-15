"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { PRODUCTS } from "@/lib/products";
import { BrandLogo } from "./BrandLogo";
import { ThemeToggle } from "./ThemeToggle";

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-hairline bg-canvas/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-4 px-4 md:px-8">
        <Link href="/" aria-label="Noria — índice de productos" className="shrink-0">
          <BrandLogo size="sm" />
        </Link>

        {/* Product switcher */}
        <nav
          aria-label="Productos"
          className="flex items-center gap-1 rounded-full border border-hairline p-1"
        >
          {PRODUCTS.map((p) => {
            const active = pathname.startsWith(`/${p.slug}`);
            return (
              <Link
                key={p.slug}
                href={`/${p.slug}`}
                aria-current={active ? "page" : undefined}
                className={`relative rounded-full px-3 py-1.5 text-[13px] font-medium tracking-tight transition-colors md:px-4 ${
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

        <div className="flex shrink-0 items-center gap-3">
          <span className="tag hidden lg:inline">Demos de producto</span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
