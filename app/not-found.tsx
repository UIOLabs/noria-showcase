import Link from "next/link";
import { fontVariables } from "@/lib/fonts";

// Unknown URLs never reach a [locale] layout (a static export serves this as
// 404.html for any path), so it renders its own <html> and speaks both
// languages.
export default function NotFound() {
  return (
    <html lang="en" className={fontVariables} data-theme="dark">
      <head>
        <title>404 — Noria</title>
      </head>
      <body className="bg-canvas text-ink font-sans">
        <div className="mx-auto flex min-h-screen max-w-[1600px] items-center px-4 py-16 md:px-8">
          <div className="max-w-xl">
            <p className="tag text-accent">Error 404</p>
            <h1 className="mt-3 text-4xl tracking-tight md:text-5xl">Page not found</h1>
            <p className="mt-1 text-2xl tracking-tight text-mute md:text-3xl" lang="es">
              Página no encontrada
            </p>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-accent">
              <Link href="/en">
                Back to the demos <span aria-hidden>▸</span>
              </Link>
              <Link href="/es" lang="es">
                Volver a los demos <span aria-hidden>▸</span>
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
