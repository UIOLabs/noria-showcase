import type { Metadata } from "next";
import { LOCALES, type Locale } from "./i18n";

const OG_LOCALE: Record<Locale, string> = { en: "en_US", es: "es_ES" };

/**
 * Title, description, language alternates and link-preview tags for one page.
 * Next replaces `openGraph` wholesale per segment, so every page goes through
 * this rather than relying on the layout's.
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
}: {
  locale: Locale;
  /** "" for the index, "/procure" etc. */
  path: string;
  title: string;
  description: string;
}): Metadata {
  const url = `/${locale}${path}`;
  const image = { url: `/og-${locale}.png`, width: 1200, height: 630, alt: title };
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `/${l}${path}`])),
    },
    openGraph: {
      type: "website",
      siteName: "Noria Technologies",
      url,
      title,
      description,
      locale: OG_LOCALE[locale],
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}
