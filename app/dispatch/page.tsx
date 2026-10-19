import { LocaleRedirect } from "@/components/i18n/LocaleRedirect";

// Pre-i18n link (still shared around); forwards to /en/dispatch or /es/dispatch.
export default function DispatchRedirect() {
  return <LocaleRedirect path="/dispatch" />;
}
