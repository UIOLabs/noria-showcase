import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { ProcureDemo } from "@/components/demos/procure/ProcureDemo";

const META = {
  en: {
    title: "Procure — Procurement copilot",
    description: "Working demo: ERP purchase requests turned into explained, auditable decisions.",
  },
  es: {
    title: "Procure — Copiloto de compras",
    description:
      "Demo funcional: solicitudes de compra del ERP convertidas en decisiones explicadas y auditables.",
  },
} satisfies Record<Locale, { title: string; description: string }>;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata({ locale, path: "/procure", ...META[locale] });
}

export default function ProcurePage() {
  return <ProcureDemo />;
}
