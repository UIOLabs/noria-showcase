import { LocaleRedirect } from "@/components/i18n/LocaleRedirect";

// Pre-i18n link (still shared around); forwards to /en/procure or /es/procure.
export default function ProcureRedirect() {
  return <LocaleRedirect path="/procure" />;
}
