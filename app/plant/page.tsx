import { LocaleRedirect } from "@/components/i18n/LocaleRedirect";

// Pre-i18n link (still shared around); forwards to /en/plant or /es/plant.
export default function PlantRedirect() {
  return <LocaleRedirect path="/plant" />;
}
