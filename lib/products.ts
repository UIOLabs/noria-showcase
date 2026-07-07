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
    kicker: "Procurement copilot",
    tagline:
      "Turns ERP purchase requests into explained, auditable decisions.",
    demoLang: "ES",
  },
  {
    slug: "plant",
    tab: "Plant OS",
    name: "Noria Plant OS",
    kicker: "Manufacturing control",
    tagline:
      "Live factory floor, finite-capacity scheduling, and margin analytics in one place.",
    demoLang: "ES",
  },
  {
    slug: "dispatch",
    tab: "Dispatch",
    name: "Noria Dispatch",
    kicker: "AI voice operations",
    tagline:
      "AI voice agents place outbound calls; humans take over the moment someone answers.",
    demoLang: "EN",
  },
];

export function productBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
