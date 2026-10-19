import type { Text } from "./i18n";

export type ProductSlug = "procure" | "plant" | "dispatch";

export type Product = {
  slug: ProductSlug;
  /** Short tab label (the build's working name — same in both languages) */
  tab: string;
  /** Who it was built for — matches the case-study label on noria-tech.com */
  sector: Text;
  /** Mono kicker: what the system is */
  kicker: Text;
  /** Case-study title on noria-tech.com/work */
  title: Text;
  /** One-line declarative description (no marketing waffle) */
  tagline: Text;
  shipped: Text;
  /** Anchor of the matching case study on noria-tech.com/work */
  study: string;
};

export const PRODUCTS: Product[] = [
  {
    slug: "procure",
    tab: "Procure",
    sector: { en: "Manufacturing", es: "Manufactura" },
    kicker: { en: "Procurement copilot", es: "Copiloto de compras" },
    title: {
      en: "Purchase requests, turned into auditable decisions",
      es: "Solicitudes de compra convertidas en decisiones auditables",
    },
    tagline: {
      en: "Reads purchase requests straight from the ERP, compares quotes, recommends a vendor with the reasoning attached, and logs every decision.",
      es: "Lee las solicitudes de compra directamente del ERP, compara cotizaciones, recomienda un proveedor con el razonamiento a la vista y registra cada decisión.",
    },
    shipped: { en: "Shipped in 12 weeks", es: "Entregado en 12 semanas" },
    study: "purchasing",
  },
  {
    slug: "plant",
    tab: "Plant OS",
    sector: { en: "Manufacturing", es: "Manufactura" },
    kicker: { en: "Manufacturing control", es: "Control de manufactura" },
    title: {
      en: "Production planning across the factory floor",
      es: "Planificación de producción en toda la planta",
    },
    tagline: {
      en: "A live view of the plant, finite-capacity scheduling tested against what really happened, and margin analytics in one place.",
      es: "La planta en vivo, planificación con capacidad finita validada contra lo que realmente pasó y análisis de márgenes en un solo lugar.",
    },
    shipped: { en: "Shipped in 8 weeks", es: "Entregado en 8 semanas" },
    study: "planning",
  },
  {
    slug: "dispatch",
    tab: "Dispatch",
    sector: { en: "Financial services", es: "Servicios financieros" },
    kicker: { en: "AI voice operations", es: "Operaciones de voz con IA" },
    title: {
      en: "An AI voice agent for collections at scale",
      es: "Un agente de voz con IA para cobranza a escala",
    },
    tagline: {
      en: "AI voice agents place the outbound calls; a person takes over the moment someone answers.",
      es: "Agentes de voz con IA hacen las llamadas salientes; una persona toma el control en cuanto alguien responde.",
    },
    shipped: { en: "Delivered across 2 milestones", es: "Entregado en 2 etapas" },
    study: "collections",
  },
];

export function productBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
