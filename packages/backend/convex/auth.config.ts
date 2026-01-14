import { getAuthConfigProvider } from "@convex-dev/better-auth/auth-config";
import type { AuthConfig } from "convex/server";

/**
 * Auth configuration for Convex with Better Auth
 * Uses customJwt provider for optimized JWT validation
 */
export default {
  providers: [getAuthConfigProvider()],
} satisfies AuthConfig;
