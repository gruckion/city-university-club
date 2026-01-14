import {
  createClient,
  type GenericCtx,
  type AuthFunctions,
} from "@convex-dev/better-auth";
import { requireActionCtx } from "@convex-dev/better-auth/utils";
import { convex, crossDomain } from "@convex-dev/better-auth/plugins";
import { expo } from "@better-auth/expo";
import { Resend } from "@convex-dev/resend";
import { components, internal } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import { betterAuth } from "better-auth";
import { lastLoginMethod } from "better-auth/plugins";
import authConfig from "./auth.config";

/**
 * Resend email client for sending transactional emails
 * Set testMode: false to send to real email addresses
 */
export const resend = new Resend(components.resend, {
  testMode: false, // Set to true to only allow test addresses (delivered@resend.dev)
});

const siteUrl = process.env.SITE_URL!;
const nativeAppUrl =
  process.env.NATIVE_APP_URL || "convoexpo-and-nextjs-web-bun-better-auth://";
const emailFromAddress =
  process.env.EMAIL_FROM_ADDRESS || "Password Reset <onboarding@resend.dev>";

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
      // Expo Go development URLs - always included for development flexibility
      // Using explicit patterns since NODE_ENV may not be reliable in Convex runtime
      "exp://127.0.0.1:*/**",      // iOS Simulator
      "exp://192.168.*.*:*/**",    // Local network devices (common home/office range)
      "exp://10.*.*.*:*/**",       // Alternative local network range
      "exp://localhost:*/**",      // Localhost
      "http://localhost:8081",     // Expo web development
    ],
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
      // Password reset email handler using Resend
      sendResetPassword: async ({ user, url }) => {
        console.log(`[Password Reset] Sending email to: ${user.email}`);
        console.log(`[Password Reset] URL: ${url}`);

        // Send password reset email via Resend
        await resend.sendEmail(requireActionCtx(ctx), {
          from: emailFromAddress,
          to: user.email,
          subject: "Reset your password",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Reset Your Password</h2>
              <p>You requested a password reset for your account.</p>
              <p>Click the button below to reset your password:</p>
              <a href="${url}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">
                Reset Password
              </a>
              <p style="color: #666; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
              <p style="color: #666; font-size: 14px;">This link will expire in 1 hour.</p>
            </div>
          `,
        });
      },
    },
    plugins: [
      expo(),
      convex({
        authConfig,
        jwksRotateOnTokenGenerationError: true,
      }),
      lastLoginMethod(),
      crossDomain({ siteUrl }),  // Required for Expo web support
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
