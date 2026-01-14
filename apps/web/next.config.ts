import "@convoexpo-and-nextjs-web-bun-better-auth/env/web";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactCompiler: true,
  transpilePackages: ["shiki"],
};

export default nextConfig;

initOpenNextCloudflareForDev();
