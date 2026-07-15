export type ProductSlug = "procure" | "plant" | "dispatch";

export type Product = {
  slug: ProductSlug;
  /** Short tab label */
  tab: string;
  /** Full product-line name */
  name: string;
  /** Mono kicker shown above the name */
  kicker: string;
  /** One-line declarative description (no marketing waffle) */
  tagline: string;
  /** UI language of the demo itself */
  demoLang: "ES" | "EN";
};

export const PRODUCTS: Product[] = [
  {
    slug: "procure",
    tab: "Procure",
    name: "Noria Procure",
    kicker: "Copiloto de compras",
    tagline:
      "Convierte solicitudes de compra del ERP en decisiones explicadas y auditables.",
    demoLang: "ES",
  },
  {
    slug: "plant",
    tab: "Plant OS",
    name: "Noria Plant OS",
    kicker: "Control de manufactura",
    tagline:
      "Planta en vivo, planificación de capacidad finita y análisis de márgenes en un solo lugar.",
    demoLang: "ES",
  },
  {
    slug: "dispatch",
    tab: "Dispatch",
    name: "Noria Dispatch",
    kicker: "Operaciones de voz con IA",
    tagline:
      "Agentes de voz con IA realizan llamadas salientes; una persona toma el control en cuanto alguien responde.",
    demoLang: "ES",
  },
];

export function productBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
