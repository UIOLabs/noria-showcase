import "./globals.css";

// <html> is rendered by app/[locale]/layout.tsx so its lang matches the page;
// the unprefixed redirect pages and the 404 render their own.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
