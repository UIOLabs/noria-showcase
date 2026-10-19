import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { PlantDemo } from "@/components/demos/plant/PlantDemo";

const META = {
  en: {
    title: "Plant OS — Manufacturing control",
    description: "Working demo: a live factory floor, finite-capacity scheduling, and margin analytics.",
  },
  es: {
    title: "Plant OS — Control de manufactura",
    description:
      "Demo funcional: planta en vivo, planificación de capacidad finita y análisis de márgenes.",
  },
} satisfies Record<Locale, { title: string; description: string }>;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata({ locale, path: "/plant", ...META[locale] });
}

export default function PlantPage() {
  return <PlantDemo />;
}
