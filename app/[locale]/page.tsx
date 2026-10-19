import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { ClientWorkIndex } from "@/components/shell/ClientWorkIndex";

const META = {
  en: {
    title: "Noria — Built for our clients",
    description:
      "Working demos of three systems Noria Technologies built for real operations: a procurement copilot, manufacturing control, and AI voice operations.",
  },
  es: {
    title: "Noria — Hecho para nuestros clientes",
    description:
      "Demos funcionales de tres sistemas que Noria Technologies construyó para operaciones reales: copiloto de compras, control de manufactura y operaciones de voz con IA.",
  },
} satisfies Record<Locale, { title: string; description: string }>;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata({ locale, path: "", ...META[locale] });
}

export default function IndexPage() {
  return <ClientWorkIndex />;
}
