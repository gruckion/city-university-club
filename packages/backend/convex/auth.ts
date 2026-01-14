import {
  createClient,
  type GenericCtx,
  type AuthFunctions,
} from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { expo } from "@better-auth/expo";
import { components, internal } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import { betterAuth } from "better-auth";
import { lastLoginMethod } from "better-auth/plugins";
import authConfig from "./auth.config";

const siteUrl = process.env.SITE_URL!;
const nativeAppUrl =
  process.env.NATIVE_APP_URL || "convoexpo-and-nextjs-web-bun-better-auth://";

// Wire up internal auth functions for the component
const authFunctions: AuthFunctions = internal.auth;

/**
 * Auth component with triggers for user lifecycle events
 */
export const authComponent = createClient<DataModel>(components.betterAuth, {
  authFunctions,
  verbose: process.env.NODE_ENV === "development",
  triggers: {
    user: {
      onCreate: async (ctx, authUser) => {
        // Called when a new user is created
        // You can create related records here (e.g., profile, settings)
        console.log("User created:", authUser.email);
      },
      onUpdate: async (ctx, newUser, oldUser) => {
        // Called when user data is updated
        // Both old and new documents are available for comparison
      },
      onDelete: async (ctx, authUser) => {
        // Called when a user is deleted
        // Clean up related records here
        console.log("User deleted:", authUser.email);
      },
    },
  },
});

/**
 * Export trigger handlers required by the component
 */
export const { onCreate, onUpdate, onDelete } = authComponent.triggersApi();

/**
 * Create Better Auth instance with Convex and Expo plugins
 */
function createAuth(ctx: GenericCtx<DataModel>) {
  return betterAuth({
    baseURL: siteUrl,
    trustedOrigins: [
      siteUrl,
      nativeAppUrl,
      // Expo Go development URLs - use proper wildcard patterns
      // exp://** matches all Expo URLs (prefix matching)
      // exp://192.168.*.*:*/** matches local network IPs with any port and path
      ...(process.env.NODE_ENV === "development"
        ? ["exp://"]
        : []),
    ],
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
      // Password reset email handler
      // TODO: Replace console.log with actual email service (e.g., Resend, SendGrid)
      sendResetPassword: async ({ user, url }) => {
        // For development: log the reset URL to the console
        console.log(`[Password Reset] User: ${user.email}`);
        console.log(`[Password Reset] URL: ${url}`);
        // In production, send an actual email:
        // await sendEmail({
        //   to: user.email,
        //   subject: "Reset your password",
        //   text: `Click the link to reset your password: ${url}`,
        // });
      },
    },
    plugins: [
      expo(),
      convex({
        authConfig,
        jwksRotateOnTokenGenerationError: true,
      }),
      lastLoginMethod(),
    ],
  });
}

export { createAuth };

/**
 * Query to get the current authenticated user
 */
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return await authComponent.safeGetAuthUser(ctx);
  },
});
