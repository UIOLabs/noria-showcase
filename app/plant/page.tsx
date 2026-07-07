import type { Metadata } from "next";
import { PlantDemo } from "@/components/demos/plant/PlantDemo";

export const metadata: Metadata = {
  title: "Noria Plant OS — Manufacturing control",
  description:
    "Working demo: live factory floor, finite-capacity scheduling, and margin analytics.",
};

export default function PlantPage() {
  return <PlantDemo />;
}
