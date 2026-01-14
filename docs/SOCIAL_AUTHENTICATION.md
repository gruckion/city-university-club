# Social Authentication Implementation Guide

**Date:** January 14, 2026
**Stack:** Better Auth + Convex + Expo (React Native)
**App Scheme:** `cityuniversityclub://`
**Bundle ID:** `com.cityuniversityclub.app`
**Convex Deployment:** `artful-cod-78`

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture & OAuth Flow](#architecture--oauth-flow)
3. [Environment Configuration](#environment-configuration)
4. [GitHub OAuth Setup](#github-oauth-setup)
5. [Google OAuth Setup](#google-oauth-setup)
6. [Apple Sign-In Setup](#apple-sign-in-setup)
7. [Code Implementation](#code-implementation)
8. [Testing Guide](#testing-guide)
9. [Troubleshooting](#troubleshooting)

---

## Overview

This document provides a complete guide for implementing social authentication (GitHub, Google, Apple) in the City University Club app using Better Auth with Convex backend and Expo/React Native frontend.

### Provider Complexity Matrix

| Provider | Setup Time | Requirements | Best For |
|----------|-----------|--------------|----------|
| **GitHub** | ~10 min | GitHub account | Quick demos, developer apps |
| **Google** | ~30 min | Google Cloud account | General consumer apps |
| **Apple** | 1-2 hours | Apple Developer ($99/year) | iOS apps (required for App Store if other social logins present) |

---

## Architecture & OAuth Flow

### Understanding the Convex + Better Auth OAuth Flow

Unlike traditional web apps where the OAuth callback goes to your app's domain, with Convex the callback **always** goes to the Convex site URL:

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
         │                       │                        │
         │                       │ 6. Convex exchanges    │
         │                       │    code for tokens,    │
         │                       │    creates session     │
         │                       │                        │
         │ 7. Convex returns     │                        │
         │    HTML with deep     │                        │
         │    link redirect      │                        │
         │ <──────────────────── │                        │
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

### Why This Architecture Works for All Environments

The OAuth callback URL is **always** the Convex site URL, regardless of where the app is running:

| Environment | App Running At | OAuth Callback | Final Redirect |
|------------|----------------|----------------|----------------|
| iOS Simulator | `exp://127.0.0.1:8081` | Convex site URL | `cityuniversityclub://` |
| Expo Go (Device) | `exp://192.168.x.x:8081` | Convex site URL | `cityuniversityclub://` |
| Dev Build | `cityuniversityclub://` | Convex site URL | `cityuniversityclub://` |
| TestFlight | `cityuniversityclub://` | Convex site URL | `cityuniversityclub://` |
| Production | `cityuniversityclub://` | Convex site URL | `cityuniversityclub://` |

**This means you only need to configure ONE callback URL per OAuth provider!**

---

## Environment Configuration

### Required Convex Environment Variables

```bash
# Set via: npx convex env set VARIABLE_NAME="value"

# Core URLs
SITE_URL="https://artful-cod-78.convex.site"
NATIVE_APP_URL="cityuniversityclub://"

# GitHub OAuth
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"

# Google OAuth
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# Apple Sign-In
APPLE_CLIENT_ID="your_apple_service_id"
APPLE_CLIENT_SECRET="your_apple_jwt_secret"
APPLE_APP_BUNDLE_IDENTIFIER="com.cityuniversityclub.app"
```

### Native App Environment Variables

Already configured in `apps/native/.env`:
```env
EXPO_PUBLIC_CONVEX_URL=https://artful-cod-78.convex.cloud
EXPO_PUBLIC_CONVEX_SITE_URL=https://artful-cod-78.convex.site
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
6. Click **"Generate a new client secret"** and copy it

### Step 2: Add Environment Variables

```bash
cd packages/backend
npx convex env set GITHUB_CLIENT_ID="your_client_id_here"
npx convex env set GITHUB_CLIENT_SECRET="your_client_secret_here"
```

### Step 3: Update Backend Auth Configuration

Add GitHub to `socialProviders` in `packages/backend/convex/auth.ts`:

```typescript
socialProviders: {
    github: {
        clientId: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
},
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
                callbackURL: "/", // Redirects to app root after auth
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

---

## Google OAuth Setup

### Step 1: Create Google Cloud Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **"Create Credentials"** → **"OAuth client ID"**
5. If prompted, configure the OAuth consent screen first:
   - User Type: External (or Internal for Google Workspace)
   - App name: City University Club
   - User support email: your email
   - Developer contact: your email
6. Create OAuth client ID:
   - Application type: **Web application**
   - Name: `City University Club - Convex`
   - Authorized JavaScript origins: `https://artful-cod-78.convex.site`
   - Authorized redirect URIs: `https://artful-cod-78.convex.site/api/auth/callback/google`
7. Copy **Client ID** and **Client Secret**

### Step 2: Add Environment Variables

```bash
cd packages/backend
npx convex env set GOOGLE_CLIENT_ID="your_client_id_here"
npx convex env set GOOGLE_CLIENT_SECRET="your_client_secret_here"
```

### Step 3: Update Backend Auth Configuration

Add Google to `socialProviders` in `packages/backend/convex/auth.ts`:

```typescript
socialProviders: {
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
},
```

### Step 4: Update Google Auth Hook

The existing `useGoogleAuth.ts` should work. Ensure it uses the redirect flow:

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
                callbackURL: "/",
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

### Alternative: ID Token Flow (for native Google Sign-In SDK)

If you want to use the native Google Sign-In experience (via `expo-auth-session`):

```typescript
import * as Google from "expo-auth-session/providers/google";

const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com",
    iosClientId: "YOUR_IOS_CLIENT_ID.apps.googleusercontent.com",
});

const signInWithIdToken = async () => {
    const result = await promptAsync();
    if (result.type === "success") {
        await authClient.signIn.social({
            provider: "google",
            idToken: {
                token: result.params.id_token,
            },
        });
    }
};
```

---

## Apple Sign-In Setup

### Prerequisites

- Active Apple Developer Account ($99/year)
- App ID with "Sign in with Apple" capability configured

### Step 1: Configure App ID

1. Go to [Apple Developer Portal](https://developer.apple.com/account/resources/identifiers/list)
2. Find your App ID (`com.cityuniversityclub.app`) or create one
3. Enable **"Sign in with Apple"** capability
4. Save

### Step 2: Create Service ID (for web/backend)

1. Go to **Identifiers** → Click **+**
2. Select **"Services IDs"** → Continue
3. Fill in:
   - Description: `City University Club Web`
   - Identifier: `com.cityuniversityclub.web` (or similar)
4. Enable **"Sign in with Apple"**
5. Click **Configure**:
   - Primary App ID: Select your app
   - Domains: `artful-cod-78.convex.site`
   - Return URLs: `https://artful-cod-78.convex.site/api/auth/callback/apple`
6. Save

### Step 3: Create Private Key

1. Go to **Keys** → Click **+**
2. Name: `City University Club Sign In`
3. Enable **"Sign in with Apple"**
4. Configure → Select your Primary App ID
5. Register and **download the `.p8` key file** (you can only download once!)
6. Note the **Key ID**

### Step 4: Generate Client Secret JWT

Apple requires a JWT as the client secret. You need to generate this using your private key.

**Option A: Use a script to generate (recommended for production)**

```javascript
// scripts/generate-apple-secret.js
const jwt = require("jsonwebtoken");
const fs = require("fs");

const privateKey = fs.readFileSync("path/to/AuthKey_XXXXXXXXXX.p8");
const teamId = "YOUR_TEAM_ID"; // Found in Apple Developer account
const clientId = "com.cityuniversityclub.web"; // Your Service ID
const keyId = "XXXXXXXXXX"; // Your Key ID

const token = jwt.sign({}, privateKey, {
    algorithm: "ES256",
    expiresIn: "180d", // Max 6 months
    audience: "https://appleid.apple.com",
    issuer: teamId,
    subject: clientId,
    keyid: keyId,
});

console.log("Apple Client Secret:", token);
```

**Option B: Use online generator**
Search for "Apple Sign In client secret generator" - several tools exist.

### Step 5: Add Environment Variables

```bash
cd packages/backend
npx convex env set APPLE_CLIENT_ID="com.cityuniversityclub.web"
npx convex env set APPLE_CLIENT_SECRET="eyJhbGciOiJFUzI1NiIs..."  # Your generated JWT
npx convex env set APPLE_APP_BUNDLE_IDENTIFIER="com.cityuniversityclub.app"
```

### Step 6: Update Backend Auth Configuration

Add Apple to `socialProviders` in `packages/backend/convex/auth.ts`:

```typescript
socialProviders: {
    apple: {
        clientId: process.env.APPLE_CLIENT_ID!,
        clientSecret: process.env.APPLE_CLIENT_SECRET!,
        appBundleIdentifier: process.env.APPLE_APP_BUNDLE_IDENTIFIER,
    },
},
trustedOrigins: [
    // ... other origins
    "https://appleid.apple.com", // REQUIRED for Apple Sign-In
],
```

### Step 7: Native iOS Implementation

The existing `useAppleAuth.ts` uses `expo-apple-authentication` with the ID Token flow, which is the recommended approach for native iOS:

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
                    // Note: nonce should be generated before signInAsync
                    // and passed to both the Apple request and Better Auth
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

1. **HTTPS Required**: Apple Sign-In does NOT support localhost or non-HTTPS URLs. The Convex site URL provides HTTPS automatically.

2. **Bundle ID vs Service ID**:
   - Native iOS apps use the **Bundle ID** (`com.cityuniversityclub.app`)
   - Web/backend uses the **Service ID** (`com.cityuniversityclub.web`)
   - Set `appBundleIdentifier` in Better Auth config for native support

3. **Client Secret Expiration**: Apple JWTs expire after max 6 months. Set a reminder to regenerate!

4. **App Store Requirement**: If your iOS app offers any social login (Google, Facebook, etc.), Apple **requires** you to also offer Apple Sign-In.

---

## Code Implementation

### Complete Backend Auth Configuration

Update `packages/backend/convex/auth.ts`:

```typescript
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
            "https://appleid.apple.com", // Required for Apple Sign-In
            // Expo development URLs
            "exp://",
            "exp://127.0.0.1:*/**",
            "exp://192.168.*.*:*/**",
            "exp://10.*.*.*:*/**",
            "exp://localhost:*/**",
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
            convex({
                authConfig,
                jwksRotateOnTokenGenerationError: true,
            }),
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

### OAuth Hooks Index

Update `apps/native/lib/oauth/index.ts`:

```typescript
export { useGoogleAuth } from "./useGoogleAuth";
export { useAppleAuth } from "./useAppleAuth";
export { useGitHubAuth } from "./useGitHubAuth";
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
   - After authorizing, briefly shows Convex site
   - Browser closes automatically
   - App shows authenticated state

### Testing Google OAuth

Same flow as GitHub, but:
- Ensure your Google OAuth consent screen is configured
- For testing, add your test email to test users if consent screen is in "Testing" mode

### Testing Apple Sign-In

**On iOS Simulator:**
- Apple Sign-In works in simulator with your Apple ID
- May require signing into simulator with Apple ID first

**On Physical Device:**
- Works with device's logged-in Apple ID
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

**Solution:** Ensure `trustedOrigins` includes Expo patterns:
```typescript
trustedOrigins: [
    "exp://",
    "exp://127.0.0.1:*/**",
    "exp://192.168.*.*:*/**",
]
```

### "redirect_uri_mismatch" Error

**Symptom:** OAuth provider shows redirect URI mismatch error

**Solution:**
1. Verify callback URL in provider matches exactly: `https://artful-cod-78.convex.site/api/auth/callback/{provider}`
2. Check for trailing slashes - they must match
3. Ensure SITE_URL env var is set correctly in Convex

### Apple Sign-In "aud claim" Error

**Symptom:** `JWTClaimValidationFailed: unexpected "aud" claim value`

**Solution:** Set `appBundleIdentifier` in Apple provider config:
```typescript
apple: {
    clientId: process.env.APPLE_CLIENT_ID!,
    clientSecret: process.env.APPLE_CLIENT_SECRET!,
    appBundleIdentifier: "com.cityuniversityclub.app",
}
```

### WebBrowser Doesn't Return to App

**Symptom:** After OAuth completes, browser stays open

**Solution:**
1. Verify `expo-web-browser` plugin is in app.config.ts
2. Check app scheme is correctly set: `scheme: "cityuniversityclub"`
3. Ensure NATIVE_APP_URL matches scheme: `cityuniversityclub://`
4. Rebuild the app: `npx expo prebuild --clean`

### Session Not Persisting

**Symptom:** User logged out after app restart

**Solution:**
1. Verify `expo-secure-store` plugin is in app.config.ts
2. Check expoClient is configured with storage:
   ```typescript
   expoClient({
       scheme: Constants.expoConfig?.scheme,
       storage: SecureStore,
   })
   ```
3. Rebuild the app after adding plugins

---

## Multi-Environment Setup (Future)

For separate staging/production environments:

### Option 1: Separate Convex Deployments

Each environment gets its own Convex deployment:
- Development: `artful-cod-78.convex.site`
- Staging: `staging-xyz.convex.site`
- Production: `prod-abc.convex.site`

Each needs its own OAuth app credentials with matching callback URLs.

### Option 2: Multiple Redirect URIs (GitHub/Google only)

Configure multiple redirect URIs in a single OAuth app:
```
https://artful-cod-78.convex.site/api/auth/callback/github
https://staging-xyz.convex.site/api/auth/callback/github
https://prod-abc.convex.site/api/auth/callback/github
```

**Note:** Apple does NOT support multiple redirect URIs per Service ID.

---

## Security Considerations

1. **Never commit secrets**: Use environment variables for all OAuth credentials
2. **Rotate Apple secrets**: Set calendar reminder for 6-month expiration
3. **Review OAuth scopes**: Only request necessary permissions
4. **Monitor OAuth apps**: Check for unauthorized access in provider dashboards
5. **Use HTTPS**: Convex provides this automatically

---

## References

- [Better Auth Documentation](https://www.better-auth.com/docs)
- [Better Auth GitHub Provider](https://www.better-auth.com/docs/authentication/github)
- [Better Auth Google Provider](https://www.better-auth.com/docs/authentication/google)
- [Better Auth Apple Provider](https://www.better-auth.com/docs/authentication/apple)
- [Better Auth Expo Integration](https://www.better-auth.com/docs/integrations/expo)
- [Convex Better Auth Guide](https://labs.convex.dev/better-auth)
- [Convex Better Auth Expo Guide](https://labs.convex.dev/better-auth/framework-guides/expo)
- [Expo Web Browser](https://docs.expo.dev/versions/latest/sdk/webbrowser/)
- [Expo Apple Authentication](https://docs.expo.dev/versions/latest/sdk/apple-authentication/)
