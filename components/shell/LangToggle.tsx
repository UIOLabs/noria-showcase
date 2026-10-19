"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALE_STORAGE_KEY, LOCALES } from "@/lib/i18n";
import { useLocale, useT } from "@/components/i18n/LocaleProvider";

/**
 * EN / ES switch. Swaps the locale prefix on the current path and remembers
 * the choice, so the unprefixed redirect pages honour it next visit.
 */
export function LangToggle() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useT();

  return (
    <div
      role="group"
      aria-label={t({ en: "Language", es: "Idioma" })}
      className="flex h-8 items-center rounded-full border border-hairline p-0.5 font-mono text-[10px] uppercase tracking-[0.12em]"
    >
      {LOCALES.map((l) => {
        const active = l === locale;
        return (
          <Link
            key={l}
            href={pathname.replace(/^\/(en|es)(?=\/|$)/, `/${l}`)}
            hrefLang={l}
            aria-current={active ? "true" : undefined}
            onClick={() => {
              try {
                localStorage.setItem(LOCALE_STORAGE_KEY, l);
              } catch {
                // private mode — the choice just won't persist
              }
            }}
            className={`flex h-full items-center rounded-full px-2 transition-colors ${
              active ? "bg-ink/10 text-ink" : "text-mute hover:text-ink"
            }`}
          >
            {l}
          </Link>
        );
      })}
    </div>
  );
}
