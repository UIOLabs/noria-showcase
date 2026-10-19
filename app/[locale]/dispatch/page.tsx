import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { DispatchDemo } from "@/components/demos/dispatch/DispatchDemo";

const META = {
  en: {
    title: "Dispatch — AI voice operations",
    description: "Working demo: AI voice agents place outbound calls and a person takes over on connect.",
  },
  es: {
    title: "Dispatch — Operaciones de voz con IA",
    description:
      "Demo funcional: agentes de voz con IA hacen llamadas salientes y una persona toma el control al conectar.",
  },
} satisfies Record<Locale, { title: string; description: string }>;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata({ locale, path: "/dispatch", ...META[locale] });
}

export default function DispatchPage() {
  return <DispatchDemo />;
}
