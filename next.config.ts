import type { NextConfig } from "next";

// Front-end-only showcase: everything renders client-side off mocked state,
// so the whole app exports to static HTML deployable on any static host.
const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
};

export default nextConfig;
