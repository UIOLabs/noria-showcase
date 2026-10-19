"use client";

import { mainSite } from "@/lib/i18n";
import { useLocale, useT } from "@/components/i18n/LocaleProvider";
import { BrandLogo } from "./BrandLogo";
import { ThemeToggle } from "./ThemeToggle";

export function Footer() {
  const locale = useLocale();
  const t = useT();

  return (
    <footer className="border-t border-hairline">
      <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-4 px-4 py-8 text-center md:h-20 md:flex-row md:gap-6 md:px-8 md:py-0 md:text-left">
        <div className="flex items-center gap-4">
          <BrandLogo size="md" className="opacity-90" />
          <span className="tag">{t({ en: "Built for operators", es: "Creado para operadores" })}</span>
        </div>
        <p className="text-[13px] text-mute">
          {t({
            en: "Every screen runs on fictional data: no backend, no real records.",
            es: "Todas las pantallas usan datos ficticios: sin backend ni registros reales.",
          })}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-5">
          <a href={mainSite(locale, "/book-demo")} className="tag !text-accent transition-opacity hover:opacity-80">
            {t({ en: "Book a call ↗", es: "Agenda una llamada ↗" })}
          </a>
          {/* Way back to the marketing site. Most visitors arrive from there in
              a new tab, but anyone landing here directly needs the door. */}
          <a href={mainSite(locale)} className="tag transition-colors hover:text-ink">
            noria-tech.com ↗
          </a>
          <span className="tag">© {new Date().getFullYear()} Noria Technologies LLC</span>
          <div className="sm:hidden">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
