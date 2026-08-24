import type { Metadata } from "next";
import {
  Archivo,
  Geist,
  Fraunces,
  JetBrains_Mono,
  Space_Grotesk,
} from "next/font/google";
import "./globals.css";
import { Shell } from "@/components/shell/Shell";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

// Techy geometric face for the "Noria" logotype.
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-wordmark",
  display: "swap",
});

// Heavy grotesque (900) for the liquid-chrome brand logo.
const archivo = Archivo({
  subsets: ["latin"],
  weight: "900",
  variable: "--font-archivo",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://showcase.noria-tech.com"),
  title: "Noria — Líneas de producto",
  description:
    "Demos funcionales de tres productos creados por Noria: copiloto de compras, control de manufactura y operaciones de voz con IA.",
  // Anonymised client demos that only make sense alongside the context on
  // noria-tech.com: reachable in one click from the site, never a cold search
  // result. follow:true so the link equity still flows back to the site.
  robots: { index: false, follow: true },
};

// Runs before paint: restore the persisted theme (or system preference) so
// there is never a flash of the wrong theme.
const themeInit = `(function(){try{var t=localStorage.getItem("noria-theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}document.documentElement.dataset.theme=t}catch(e){}})()`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${geist.variable} ${fraunces.variable} ${jetbrains.variable} ${spaceGrotesk.variable} ${archivo.variable}`}
      data-theme="dark"
      suppressHydrationWarning
    >
      <body className="bg-canvas text-ink font-sans">
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
