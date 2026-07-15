import type { Metadata } from "next";
import { ProcureDemo } from "@/components/demos/procure/ProcureDemo";

export const metadata: Metadata = {
  title: "Noria Procure — Copiloto de compras",
  description:
    "Demo funcional: solicitudes de compra del ERP convertidas en decisiones explicadas y auditables.",
};

export default function ProcurePage() {
  return <ProcureDemo />;
}
