import type { Metadata } from "next";
import { DispatchDemo } from "@/components/demos/dispatch/DispatchDemo";

export const metadata: Metadata = {
  title: "Noria Dispatch — AI voice operations",
  description:
    "Working demo: AI voice agents place outbound calls; humans take over on connect.",
};

export default function DispatchPage() {
  return <DispatchDemo />;
}
