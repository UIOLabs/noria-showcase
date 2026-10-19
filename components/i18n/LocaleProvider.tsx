"use client";

import { createContext, useCallback, useContext } from "react";
import { DEFAULT_LOCALE, type Locale, type Text } from "@/lib/i18n";

const LocaleCtx = createContext<Locale>(DEFAULT_LOCALE);

export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleCtx.Provider value={locale}>{children}</LocaleCtx.Provider>;
}

export function useLocale(): Locale {
  return useContext(LocaleCtx);
}

/** Returns `t`, which picks the active language out of a { en, es } pair. */
export function useT() {
  const locale = useLocale();
  return useCallback((text: Text) => text[locale], [locale]);
}
