import type { Metadata } from "next";
import { PlantDemo } from "@/components/demos/plant/PlantDemo";

export const metadata: Metadata = {
  title: "Noria Plant OS — Control de manufactura",
  description:
    "Demo funcional: planta en vivo, planificación de capacidad finita y análisis de márgenes.",
};

export default function PlantPage() {
  return <PlantDemo />;
}
