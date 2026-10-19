import {
  Archivo,
  Geist,
  Fraunces,
  JetBrains_Mono,
  Space_Grotesk,
} from "next/font/google";

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

/** CSS-variable classes for every font, applied on <html>. */
export const fontVariables = `${geist.variable} ${fraunces.variable} ${jetbrains.variable} ${spaceGrotesk.variable} ${archivo.variable}`;
