import type { AuthConfig } from "convex/server";

/**
 * Auth configuration for Convex with Better Auth
 * Uses explicit domain and applicationID for reliable JWT validation
 */
export default {
  providers: [
    {
      domain: process.env.CONVEX_SITE_URL || process.env.SITE_URL,
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig;
