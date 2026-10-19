import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fontVariables } from "@/lib/fonts";
import { isLocale, LOCALES, SITE_URL } from "@/lib/i18n";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { Shell } from "@/components/shell/Shell";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Anonymised client demos that only make sense alongside the context on
  // noria-tech.com: reachable in one click from the site, never a cold search
  // result. follow:true so the link equity still flows back to the site.
  robots: { index: false, follow: true },
};

// Runs before paint: restore the persisted theme (or system preference) so
// there is never a flash of the wrong theme.
const themeInit = `(function(){try{var t=localStorage.getItem("noria-theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}document.documentElement.dataset.theme=t}catch(e){}})()`;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={locale} className={fontVariables} data-theme="dark" suppressHydrationWarning>
      <body className="bg-canvas text-ink font-sans">
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <LocaleProvider locale={locale}>
          <Shell>{children}</Shell>
        </LocaleProvider>
      </body>
    </html>
  );
}
