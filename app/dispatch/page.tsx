import type { Metadata } from "next";
import { DispatchDemo } from "@/components/demos/dispatch/DispatchDemo";

export const metadata: Metadata = {
  title: "Noria Dispatch — Operaciones de voz con IA",
  description:
    "Demo funcional: agentes de voz con IA realizan llamadas salientes y una persona toma el control al conectar.",
};

export default function DispatchPage() {
  return <DispatchDemo />;
}
