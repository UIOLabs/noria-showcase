import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from "@/lib/i18n";

/**
 * Unprefixed URLs (/, and the pre-i18n /procure, /plant, /dispatch links) are
 * static pages that forward to the right locale before anything paints: the
 * visitor's saved choice, else their browser language, else English. A static
 * export has no middleware, so this is the redirect.
 */
export function LocaleRedirect({ path }: { path: string }) {
  const target = JSON.stringify(path);
  const script = `(function(){var l;try{l=localStorage.getItem(${JSON.stringify(LOCALE_STORAGE_KEY)})}catch(e){}if(l!=="en"&&l!=="es"){var n=(navigator.languages&&navigator.languages[0])||navigator.language||"";l=/^es\\b/i.test(n)?"es":"en"}location.replace("/"+l+${target}+location.search+location.hash)})()`;
  const fallback = `/${DEFAULT_LOCALE}${path}`;

  return (
    <html lang="en">
      <head>
        <meta name="robots" content="noindex" />
        <script dangerouslySetInnerHTML={{ __html: script }} />
        <noscript>
          <meta httpEquiv="refresh" content={`0; url=${fallback}`} />
        </noscript>
      </head>
      <body style={{ background: "#0a0a0a" }}>
        <noscript>
          <a href={fallback} style={{ color: "#27e0a2" }}>
            Continue
          </a>
        </noscript>
      </body>
    </html>
  );
}
