# Social Authentication Implementation Guide

**Last Updated:** January 14, 2026
**Stack:** Better Auth + Convex + Expo (React Native)
**App Scheme:** `cityuniversityclub://`
**Bundle ID:** `com.cityuniversityclub.app`
**Convex Deployment:** `artful-cod-78`
**Convex Site URL:** `https://artful-cod-78.convex.site`

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture & OAuth Flow](#architecture--oauth-flow)
3. [Multi-Environment Support](#multi-environment-support)
4. [Current Configuration Status](#current-configuration-status)
5. [GitHub OAuth Setup](#github-oauth-setup)
6. [Google OAuth Setup](#google-oauth-setup)
7. [Apple Sign-In Setup](#apple-sign-in-setup)
8. [Code Implementation](#code-implementation)
9. [Testing Guide](#testing-guide)
10. [Troubleshooting](#troubleshooting)
11. [Security Considerations](#security-considerations)

---

## Overview

This document provides a complete, fact-based guide for implementing social authentication (GitHub, Google, Apple) in the City University Club app. The guide is grounded in 2025/2026 documentation for Better Auth and Convex Better Auth.

### Provider Complexity Matrix

| Provider | Setup Time | Requirements | Best For | Notes |
|----------|-----------|--------------|----------|-------|
| **GitHub** | ~10 min | GitHub account | Quick demos, developer apps | Simplest to configure |
| **Google** | ~30 min | Google Cloud account | General consumer apps | Requires OAuth consent screen |
| **Apple** | 1-2 hours | Apple Developer ($99/year) | iOS apps | **Required** if offering other social logins in App Store |

### Key Insight: Single Callback URL Architecture

With Convex + Better Auth, OAuth callbacks **always** go to the Convex site URL, not directly to the mobile app. This means:

- **One callback URL per provider works for ALL environments**
- No need for separate development/staging/production OAuth apps
- The app scheme handles the final redirect back to the app

---

## Architecture & OAuth Flow

### Understanding the Convex + Better Auth OAuth Flow

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Mobile App    │     │   Convex Site    │     │  OAuth Provider │
│  (Expo/Native)  │     │ (artful-cod-78)  │     │ (GitHub/Google) │
└────────┬────────┘     └────────┬─────────┘     └────────┬────────┘
         │                       │                        │
         │ 1. User taps          │                        │
         │    "Sign in with X"   │                        │
         │                       │                        │
         │ 2. Opens WebBrowser   │                        │
         │    to Convex site     │                        │
         │────────────────────>  │                        │
         │                       │ 3. Redirects to        │
         │                       │    OAuth provider      │
         │                       │ ─────────────────────> │
         │                       │                        │
         │                       │ 4. User authenticates  │
         │                       │    & authorizes        │
         │                       │                        │
         │                       │ 5. Provider redirects  │
         │                       │    to Convex callback  │
         │                       │ <───────────────────── │
         │                       │    /api/auth/callback/ │
         │                       │                        │
         │                       │ 6. Convex exchanges    │
         │                       │    code for tokens,    │
         │                       │    creates session     │
         │                       │                        │
         │ 7. Convex returns     │                        │
         │    HTML with deep     │                        │
         │    link redirect      │                        │
         │ <──────────────────── │                        │
         │ cityuniversityclub:// │                        │
         │                       │                        │
         │ 8. WebBrowser detects │                        │
         │    custom scheme,     │                        │
         │    returns to app     │                        │
         │                       │                        │
         │ 9. expoClient plugin  │                        │
         │    handles session    │                        │
         └───────────────────────┴────────────────────────┘
```

### Key URLs

| URL Type | Value |
|----------|-------|
| **Convex Site URL** | `https://artful-cod-78.convex.site` |
| **OAuth Callback Base** | `https://artful-cod-78.convex.site/api/auth/callback/` |
| **GitHub Callback** | `https://artful-cod-78.convex.site/api/auth/callback/github` |
| **Google Callback** | `https://artful-cod-78.convex.site/api/auth/callback/google` |
| **Apple Callback** | `https://artful-cod-78.convex.site/api/auth/callback/apple` |
| **App Deep Link** | `cityuniversityclub://` |

---

## Multi-Environment Support

### How It Works Across All Environments

The OAuth callback URL is **always** the Convex site URL, regardless of where the app runs:

| Environment | App Running At | Origin Sent | OAuth Callback | Final Redirect |
|------------|----------------|-------------|----------------|----------------|
| iOS Simulator | `exp://127.0.0.1:8081` | `exp://127.0.0.1:8081` | Convex site URL | `cityuniversityclub://` |
| Expo Go (Device) | `exp://192.168.x.x:8081` | `exp://192.168.x.x:8081` | Convex site URL | `cityuniversityclub://` |
| Dev Build | `cityuniversityclub://` | `cityuniversityclub://` | Convex site URL | `cityuniversityclub://` |
| TestFlight | `cityuniversityclub://` | `cityuniversityclub://` | Convex site URL | `cityuniversityclub://` |
| Production | `cityuniversityclub://` | `cityuniversityclub://` | Convex site URL | `cityuniversityclub://` |

### Required trustedOrigins Configuration

To support all development environments, the `trustedOrigins` array in `auth.ts` must include:

```typescript
trustedOrigins: [
    siteUrl,                          // Convex site URL
    nativeAppUrl,                     // cityuniversityclub://
    "https://appleid.apple.com",      // Required for Apple Sign-In
    // Expo development URLs
    "exp://127.0.0.1:*/**",           // iOS Simulator
    "exp://192.168.*.*:*/**",         // Local network devices (192.168.x.x)
    "exp://10.*.*.*:*/**",            // Alternative local network (10.x.x.x)
    "exp://localhost:*/**",           // Localhost variant
    "http://localhost:8081",          // Expo web development
],
```

### Pattern Syntax (from Better Auth docs)

| Pattern | Description |
|---------|-------------|
| `?` | Matches exactly one character (except `/`) |
| `*` | Matches zero or more characters that don't cross `/` |
| `**` | Matches zero or more characters including `/` |
| `myapp://` | Prefix matching - matches all URLs starting with `myapp://` |

---

## Current Configuration Status

### Environment Variables (Current)

```bash
# Via: npx convex env list
BETTER_AUTH_SECRET=wdh0RLepFOAuSkdlRpWDwnT3dLOINPgTJC8xV9N1+d0
NATIVE_APP_URL=cityuniversityclub://
SITE_URL=http://localhost:3001  # ⚠️ NEEDS UPDATE for OAuth to work
```

### Issues Identified

| Issue | Current State | Required State | Priority |
|-------|---------------|----------------|----------|
| SITE_URL | `http://localhost:3001` | `https://artful-cod-78.convex.site` | **CRITICAL** |
| socialProviders | Not configured | GitHub/Google/Apple config | **CRITICAL** |
| useGitHubAuth hook | Does not exist | Create hook | HIGH |
| useGoogleAuth callbackURL | Uses `Linking.createURL("")` | Should use `"/"` | MEDIUM |

### Required Environment Variable Update

```bash
# Fix SITE_URL for OAuth callbacks
npx convex env set SITE_URL="https://artful-cod-78.convex.site"
```

---

## GitHub OAuth Setup

### Step 1: Create GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **"OAuth Apps"** → **"New OAuth App"**
3. Fill in the form:
   - **Application name:** `City University Club`
   - **Homepage URL:** `https://artful-cod-78.convex.site`
   - **Authorization callback URL:** `https://artful-cod-78.convex.site/api/auth/callback/github`
4. Click **"Register application"**
5. Copy the **Client ID**
6. Click **"Generate a new client secret"** and copy it immediately (shown only once)

### Step 2: Set Environment Variables

```bash
cd packages/backend
npx convex env set GITHUB_CLIENT_ID="your_client_id_here"
npx convex env set GITHUB_CLIENT_SECRET="your_client_secret_here"
npx convex env set SITE_URL="https://artful-cod-78.convex.site"
```

### Step 3: Update Backend Auth Configuration

Add GitHub to `socialProviders` in `packages/backend/convex/auth.ts`:

```typescript
function createAuth(ctx: GenericCtx<DataModel>) {
  return betterAuth({
    baseURL: siteUrl,
    trustedOrigins: [
      siteUrl,
      nativeAppUrl,
      "https://appleid.apple.com",
      "exp://127.0.0.1:*/**",
      "exp://192.168.*.*:*/**",
      "exp://10.*.*.*:*/**",
      "exp://localhost:*/**",
      "http://localhost:8081",
    ],
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    socialProviders: {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      },
    },
    plugins: [
      expo(),
      convex({ authConfig, jwksRotateOnTokenGenerationError: true }),
      lastLoginMethod(),
      crossDomain({ siteUrl }),
    ],
  });
}
```

### Step 4: Create Client Hook

Create `apps/native/lib/oauth/useGitHubAuth.ts`:

```typescript
import { useState } from "react";
import { authClient } from "../auth-client";

export const useGitHubAuth = () => {
    const [isLoading, setIsLoading] = useState(false);

    const signIn = async () => {
        setIsLoading(true);
        try {
            await authClient.signIn.social({
                provider: "github",
                callbackURL: "/", // Converts to deep link automatically
            });
        } catch (error) {
            console.error("GitHub sign in error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        signIn,
        isLoading,
    };
};
```

### Step 5: Export from Index

Update `apps/native/lib/oauth/index.ts`:

```typescript
export { useGoogleAuth } from "./useGoogleAuth";
export { useAppleAuth } from "./useAppleAuth";
export { useGitHubAuth } from "./useGitHubAuth";
```

### Step 6: Add Button to UI

In `apps/native/app/(auth)/landing.tsx`, add the GitHub button and hook usage.

---

## Google OAuth Setup

### Step 1: Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to **APIs & Services** → **Credentials**
4. If prompted, configure OAuth consent screen:
   - User Type: External (or Internal for Google Workspace)
   - App name: City University Club
   - User support email: your email
   - Developer contact: your email
   - Add scopes: `email`, `profile`, `openid`
   - Add test users if in "Testing" mode

### Step 2: Create OAuth Client ID

1. Click **"Create Credentials"** → **"OAuth client ID"**
2. Application type: **Web application**
3. Name: `City University Club - Convex`
4. Authorized JavaScript origins: `https://artful-cod-78.convex.site`
5. Authorized redirect URIs: `https://artful-cod-78.convex.site/api/auth/callback/google`
6. Copy **Client ID** and **Client Secret**

### Step 3: Set Environment Variables

```bash
cd packages/backend
npx convex env set GOOGLE_CLIENT_ID="your_client_id_here"
npx convex env set GOOGLE_CLIENT_SECRET="your_client_secret_here"
```

### Step 4: Add to Backend Configuration

```typescript
socialProviders: {
    github: {
        clientId: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
},
```

### Step 5: Fix useGoogleAuth Hook

The current hook has an issue. Update `apps/native/lib/oauth/useGoogleAuth.ts`:

```typescript
import { useState } from "react";
import { authClient } from "../auth-client";

export const useGoogleAuth = () => {
    const [isLoading, setIsLoading] = useState(false);

    const signIn = async () => {
        setIsLoading(true);
        try {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: "/", // ✅ Correct - converts to deep link
            });
        } catch (error) {
            console.error("Google sign in error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        signIn,
        isLoading,
    };
};
```

**Note:** The previous implementation used `Linking.createURL("")` which is incorrect. Better Auth's expoClient plugin automatically converts `"/"` to the app's deep link scheme (`cityuniversityclub://`).

---

## Apple Sign-In Setup

### Prerequisites

- Active Apple Developer Program membership ($99/year)
- App ID with "Sign in with Apple" capability

### Step 1: Configure App ID

1. Go to [Apple Developer Portal - Identifiers](https://developer.apple.com/account/resources/identifiers/list)
2. Find `com.cityuniversityclub.app` or create it
3. Enable **"Sign in with Apple"** capability
4. Save

### Step 2: Create Service ID (for web/backend OAuth flow)

1. Go to **Identifiers** → Click **+**
2. Select **"Services IDs"** → Continue
3. Fill in:
   - Description: `City University Club Web`
   - Identifier: `com.cityuniversityclub.web`
4. Enable **"Sign in with Apple"**
5. Click **Configure**:
   - Primary App ID: `com.cityuniversityclub.app`
   - Domains: `artful-cod-78.convex.site`
   - Return URLs: `https://artful-cod-78.convex.site/api/auth/callback/apple`
6. Save

### Step 3: Create Private Key

1. Go to **Keys** → Click **+**
2. Name: `City University Club Sign In`
3. Enable **"Sign in with Apple"**
4. Configure → Select your Primary App ID
5. Register and **download the `.p8` key file**
   - ⚠️ **You can only download once!** Store securely.
6. Note the **Key ID**

### Step 4: Generate Client Secret JWT

Apple requires a JWT as the client secret. This JWT must be:
- Signed with ES256 algorithm
- Max expiration: 6 months
- Contains: Team ID, Key ID, Service ID

**Script to generate (save as `scripts/generate-apple-secret.js`):**

```javascript
const jwt = require("jsonwebtoken");
const fs = require("fs");

const privateKey = fs.readFileSync("path/to/AuthKey_XXXXXXXXXX.p8");
const teamId = "YOUR_TEAM_ID"; // Found in Apple Developer account membership
const clientId = "com.cityuniversityclub.web"; // Your Service ID
const keyId = "XXXXXXXXXX"; // Your Key ID from step 3

const token = jwt.sign({}, privateKey, {
    algorithm: "ES256",
    expiresIn: "180d", // Max 6 months
    audience: "https://appleid.apple.com",
    issuer: teamId,
    subject: clientId,
    keyid: keyId,
});

console.log("Apple Client Secret:", token);
console.log("\nExpires in 180 days. Set a reminder to regenerate!");
```

### Step 5: Set Environment Variables

```bash
cd packages/backend
npx convex env set APPLE_CLIENT_ID="com.cityuniversityclub.web"
npx convex env set APPLE_CLIENT_SECRET="eyJhbGciOiJFUzI1NiIs..."
npx convex env set APPLE_APP_BUNDLE_IDENTIFIER="com.cityuniversityclub.app"
```

### Step 6: Add to Backend Configuration

```typescript
socialProviders: {
    github: { /* ... */ },
    google: { /* ... */ },
    apple: {
        clientId: process.env.APPLE_CLIENT_ID!,
        clientSecret: process.env.APPLE_CLIENT_SECRET!,
        appBundleIdentifier: process.env.APPLE_APP_BUNDLE_IDENTIFIER,
    },
},
trustedOrigins: [
    // ... existing origins
    "https://appleid.apple.com", // REQUIRED for Apple Sign-In
],
```

### Step 7: Native iOS Implementation

The existing `useAppleAuth.ts` uses `expo-apple-authentication` with ID token flow:

```typescript
import * as AppleAuthentication from "expo-apple-authentication";
import { useState } from "react";
import { authClient } from "../auth-client";

export const useAppleAuth = () => {
    const [isLoading, setIsLoading] = useState(false);

    const signIn = async () => {
        setIsLoading(true);
        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
            });

            if (!credential.identityToken) {
                throw new Error("Failed to get Apple identity token");
            }

            await authClient.signIn.social({
                provider: "apple",
                idToken: {
                    token: credential.identityToken,
                },
            });
        } catch (error) {
            console.error("Apple sign in error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        signIn,
        isLoading,
    };
};
```

### Important Notes for Apple Sign-In

1. **HTTPS Required**: Apple Sign-In only works with HTTPS. Convex provides this.

2. **Bundle ID vs Service ID**:
   - Native iOS apps validate against **Bundle ID** (`com.cityuniversityclub.app`)
   - Web/backend OAuth uses **Service ID** (`com.cityuniversityclub.web`)
   - Set `appBundleIdentifier` in config for native support

3. **Client Secret Expiration**: Apple JWTs expire after 6 months max. **Set a calendar reminder to regenerate!**

4. **App Store Requirement**: If your iOS app offers any social login (Google, GitHub, etc.), Apple **requires** you to also offer Apple Sign-In.

---

## Code Implementation

### Complete Backend Auth Configuration

`packages/backend/convex/auth.ts`:

```typescript
import {
  createClient,
  type GenericCtx,
  type AuthFunctions,
} from "@convex-dev/better-auth";
import { convex, crossDomain } from "@convex-dev/better-auth/plugins";
import { expo } from "@better-auth/expo";
import { components, internal } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import { betterAuth } from "better-auth";
import { lastLoginMethod } from "better-auth/plugins";
import authConfig from "./auth.config";

const siteUrl = process.env.SITE_URL!;
const nativeAppUrl = process.env.NATIVE_APP_URL || "cityuniversityclub://";

const authFunctions: AuthFunctions = internal.auth;

export const authComponent = createClient<DataModel>(components.betterAuth, {
  authFunctions,
  verbose: process.env.NODE_ENV === "development",
  triggers: {
    user: {
      onCreate: async (ctx, authUser) => {
        console.log("User created:", authUser.email);
      },
      onUpdate: async (ctx, newUser, oldUser) => {},
      onDelete: async (ctx, authUser) => {
        console.log("User deleted:", authUser.email);
      },
    },
  },
});

export const { onCreate, onUpdate, onDelete } = authComponent.triggersApi();

function createAuth(ctx: GenericCtx<DataModel>) {
  return betterAuth({
    baseURL: siteUrl,
    trustedOrigins: [
      siteUrl,
      nativeAppUrl,
      "https://appleid.apple.com",
      "exp://127.0.0.1:*/**",
      "exp://192.168.*.*:*/**",
      "exp://10.*.*.*:*/**",
      "exp://localhost:*/**",
      "http://localhost:8081",
    ],
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
      sendResetPassword: async ({ user, url }) => {
        console.log(`[Password Reset] User: ${user.email}`);
        console.log(`[Password Reset] URL: ${url}`);
      },
    },
    socialProviders: {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      },
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      },
      apple: {
        clientId: process.env.APPLE_CLIENT_ID!,
        clientSecret: process.env.APPLE_CLIENT_SECRET!,
        appBundleIdentifier: process.env.APPLE_APP_BUNDLE_IDENTIFIER,
      },
    },
    plugins: [
      expo(),
      convex({ authConfig, jwksRotateOnTokenGenerationError: true }),
      lastLoginMethod(),
      crossDomain({ siteUrl }),
    ],
  });
}

export { createAuth };

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return await authComponent.safeGetAuthUser(ctx);
  },
});
```

---

## Testing Guide

### Testing GitHub OAuth

1. Start the development servers:
   ```bash
   bun run dev
   ```

2. Open iOS Simulator or physical device with Expo Go

3. Navigate to the login screen

4. Tap "Sign in with GitHub"

5. Expected flow:
   - WebBrowser opens to GitHub authorization page
   - User logs in and authorizes
   - Browser briefly shows Convex site
   - Browser closes automatically
   - App shows authenticated state

### Testing Google OAuth

Same flow as GitHub. Additional notes:
- If OAuth consent screen is in "Testing" mode, add your test email to test users
- First-time consent will show Google's permission dialog

### Testing Apple Sign-In

**On iOS Simulator:**
- Works with your Apple ID signed into the simulator
- Settings → Sign in with your Apple ID first

**On Physical Device:**
- Uses device's logged-in Apple ID
- Full native experience with Face ID/Touch ID

### Common Test Scenarios

| Scenario | Expected Behavior |
|----------|------------------|
| First-time sign-in | New user created, redirected to app |
| Returning user | Existing user signed in |
| Cancel during OAuth | Returns to app, no error shown |
| Network error | Error message displayed |
| Session persistence | User stays signed in after app restart |

---

## Troubleshooting

### "Invalid origin" Error

**Symptom:** `ERROR [Better Auth]: Invalid origin: exp://...`

**Cause:** The origin sent by the Expo app is not in `trustedOrigins`.

**Solution:** Ensure `trustedOrigins` includes all Expo development patterns:
```typescript
trustedOrigins: [
    "exp://127.0.0.1:*/**",
    "exp://192.168.*.*:*/**",
    "exp://10.*.*.*:*/**",
    "exp://localhost:*/**",
]
```

### "redirect_uri_mismatch" Error

**Symptom:** OAuth provider shows redirect URI mismatch error.

**Cause:** The callback URL configured in the provider doesn't match what Better Auth sends.

**Solution:**
1. Verify callback URL matches exactly: `https://artful-cod-78.convex.site/api/auth/callback/{provider}`
2. Check for trailing slashes - must match exactly
3. Verify `SITE_URL` env var is set to `https://artful-cod-78.convex.site`

### Apple Sign-In "aud claim" Error

**Symptom:** `JWTClaimValidationFailed: unexpected "aud" claim value`

**Cause:** Native iOS sends the Bundle ID as audience, but config only has Service ID.

**Solution:** Set `appBundleIdentifier` in Apple provider config:
```typescript
apple: {
    clientId: process.env.APPLE_CLIENT_ID!,
    clientSecret: process.env.APPLE_CLIENT_SECRET!,
    appBundleIdentifier: "com.cityuniversityclub.app",
}
```

### WebBrowser Doesn't Return to App

**Symptom:** After OAuth completes, browser stays open.

**Causes & Solutions:**
1. Verify `expo-web-browser` plugin is in `app.config.ts` plugins array
2. Check app scheme: `scheme: "cityuniversityclub"`
3. Verify `NATIVE_APP_URL` matches: `cityuniversityclub://`
4. Rebuild the app: `npx expo prebuild --clean`

### Session Not Persisting

**Symptom:** User logged out after app restart.

**Solution:**
1. Verify `expo-secure-store` plugin is in app.config.ts
2. Check expoClient configuration:
   ```typescript
   expoClient({
       scheme: Constants.expoConfig?.scheme,
       storage: SecureStore,
   })
   ```
3. Rebuild after adding plugins

### CORS Errors (Web)

**Symptom:** CORS errors in browser console when using Expo Web.

**Cause:** CORS not enabled or `crossDomain` plugin missing.

**Solution:**
1. Verify `http.ts` has `cors: true`:
   ```typescript
   authComponent.registerRoutes(http, createAuth, { cors: true });
   ```
2. Add `crossDomain` plugin to auth config:
   ```typescript
   plugins: [
       // ... other plugins
       crossDomain({ siteUrl }),
   ]
   ```
3. Use `crossDomainClient()` on web, `expoClient()` on native

---

## Security Considerations

1. **Environment Variables**: Never commit OAuth secrets to version control. Use Convex env vars.

2. **Apple Secret Rotation**: Apple client secrets expire in max 6 months. Set calendar reminders.

3. **OAuth Scope Minimization**: Only request necessary scopes (email, profile).

4. **HTTPS Only**: All OAuth callbacks use HTTPS via Convex site URL.

5. **Token Storage**: Expo SecureStore encrypts tokens on device.

6. **Monitor OAuth Apps**: Regularly review authorized apps in provider dashboards.

---

## References

- [Better Auth Documentation](https://www.better-auth.com/docs)
- [Better Auth Expo Integration](https://www.better-auth.com/docs/integrations/expo)
- [Better Auth GitHub Provider](https://www.better-auth.com/docs/authentication/github)
- [Better Auth Google Provider](https://www.better-auth.com/docs/authentication/google)
- [Better Auth Apple Provider](https://www.better-auth.com/docs/authentication/apple)
- [Convex Better Auth](https://labs.convex.dev/better-auth)
- [Convex Better Auth Expo Guide](https://labs.convex.dev/better-auth/framework-guides/expo)
- [Expo Web Browser](https://docs.expo.dev/versions/latest/sdk/webbrowser/)
- [Expo Apple Authentication](https://docs.expo.dev/versions/latest/sdk/apple-authentication/)
