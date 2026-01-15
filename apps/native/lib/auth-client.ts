import { expoClient } from "@better-auth/expo/client";
import { lastLoginMethodClient as lastLoginMethodClientExpo } from "@better-auth/expo/plugins";
import {
  convexClient,
  crossDomainClient,
} from "@convex-dev/better-auth/client/plugins";
import { env } from "@convoexpo-and-nextjs-web-bun-better-auth/env/native";
// Platform-specific lastLoginMethodClient imports:
// - Web version uses document.cookie
// - Expo version uses SecureStore
import {
  emailOTPClient,
  lastLoginMethodClient as lastLoginMethodClientWeb,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const scheme = Constants.expoConfig?.scheme as string;

export const authClient = createAuthClient({
  baseURL: env.EXPO_PUBLIC_CONVEX_SITE_URL,
  plugins: [
    convexClient(),
    emailOTPClient(), // For OTP-based password reset flow
    // CRITICAL: expoClient and crossDomainClient CANNOT coexist
    // Use crossDomainClient for web, expoClient for native platforms
    // Similarly, lastLoginMethodClient must use the correct storage per platform
    ...(Platform.OS === "web"
      ? [crossDomainClient(), lastLoginMethodClientWeb()]
      : [
          expoClient({
            scheme,
            storagePrefix: scheme,
            storage: SecureStore,
          }),
          lastLoginMethodClientExpo({
            storage: SecureStore,
            storagePrefix: scheme,
          }),
        ]),
  ],
});
