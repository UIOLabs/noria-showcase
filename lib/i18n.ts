/**
 * Bilingual plumbing. Every route lives under /en or /es; copy is written as
 * { en, es } pairs next to where it's used (demo data included), and the
 * active locale picks one side. Kept dependency-free so it works in the
 * static export with no middleware.
 */

export const LOCALES = ["en", "es"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

/** One piece of copy in both languages. */
export type Text = Record<Locale, string>;

export function isLocale(v: string): v is Locale {
  return (LOCALES as readonly string[]).includes(v);
}

/** localStorage key for the visitor's explicit language choice. */
export const LOCALE_STORAGE_KEY = "noria-locale";

export const SITE_URL = "https://showcase.noria-tech.com";

/** The marketing site. Its routes are locale-prefixed the same way. */
export const MAIN_SITE = "https://www.noria-tech.com";
export const mainSite = (locale: Locale, path = "") => `${MAIN_SITE}/${locale}${path}`;
