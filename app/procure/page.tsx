import type { Metadata } from "next";
import { ProcureDemo } from "@/components/demos/procure/ProcureDemo";

export const metadata: Metadata = {
  title: "Noria Procure — Procurement copilot",
  description:
    "Working demo: ERP purchase requests turned into explained, auditable decisions.",
};

export default function ProcurePage() {
  return <ProcureDemo />;
}
