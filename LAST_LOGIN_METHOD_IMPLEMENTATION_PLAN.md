# Last Login Method Implementation Plan

## Cross-Platform Authentication for Expo (Native + Web)

This document outlines the complete implementation plan for adding the `lastLoginMethod` feature to work correctly on both native (iOS/Android) and web platforms when running an Expo application with Better Auth via Convex.

---

## Table of Contents

1. [Problem Statement](#problem-statement)
2. [Research Findings](#research-findings)
3. [Architecture Overview](#architecture-overview)
4. [Implementation Details](#implementation-details)
5. [Files to Modify](#files-to-modify)
6. [Step-by-Step Implementation](#step-by-step-implementation)
7. [Testing Plan](#testing-plan)
8. [Sources](#sources)

---

## Problem Statement

### Current Issue

The `lastLoginMethodClient` plugin was imported from `better-auth/client/plugins`, which is the **web version** that uses browser cookies. In React Native, `document.cookie` doesn't exist, causing `authClient.getLastUsedLoginMethod()` to always return `null`.

### Requirements

1. **Native apps (iOS/Android)**: Must use `expo-secure-store` for persistent storage
2. **Web apps**: Must use cookies for storage (standard web approach)
3. **Both platforms**: Must support the `lastLoginMethod` feature with the same API
4. **Constraint**: `expoClient` and `crossDomainClient` plugins **cannot coexist** in the same client instance

---

## Research Findings

### Key Documentation Sources

| Source | Key Finding |
|--------|-------------|
| [Better Auth Expo Docs](https://www.better-auth.com/docs/integrations/expo) | Expo supports both native and web apps |
| [Convex Better Auth Expo Guide](https://labs.convex.dev/better-auth/framework-guides/expo) | Platform-specific plugin loading required |
| [GitHub Issue #6409](https://github.com/better-auth/better-auth/issues/6409) | lastLoginMethod incompatible with Expo native (fixed in PR #6413) |
| [@better-auth/expo npm](https://www.npmjs.com/package/@better-auth/expo) | Dedicated Expo plugins available |

### Critical Constraints

1. **Plugin Exclusivity**: From the Convex docs:
   > "Note that the expoClient and crossDomainClient plugins cannot both be included in the client instance at the same time."

2. **Platform Detection**: Must use `Platform.OS` from `react-native` to conditionally load plugins

3. **CORS Requirement**: Web apps require `{ cors: true }` on the server route registration

4. **Import Paths**:
   - Native: `@better-auth/expo/plugins` for `lastLoginMethodClient`
   - Web: `better-auth/client/plugins` for `lastLoginMethodClient`

---

## Architecture Overview

### Plugin Matrix

| Plugin | Native (iOS/Android) | Web | Import Path |
|--------|---------------------|-----|-------------|
| `convexClient` | ✅ | ✅ | `@convex-dev/better-auth/client/plugins` |
| `expoClient` | ✅ | ❌ | `@better-auth/expo/client` |
| `crossDomainClient` | ❌ | ✅ | `@convex-dev/better-auth/client/plugins` |
| `lastLoginMethodClient` (Expo) | ✅ | ❌ | `@better-auth/expo/plugins` |
| `lastLoginMethodClient` (Web) | ❌ | ✅ | `better-auth/client/plugins` |

### Server Plugin Matrix

| Plugin | Purpose | Import Path |
|--------|---------|-------------|
| `expo()` | Native OAuth/deep links | `@better-auth/expo` |
| `convex()` | Convex database adapter | `@convex-dev/better-auth/plugins` |
| `crossDomain()` | Web cross-origin support | `@convex-dev/better-auth/plugins` |
| `lastLoginMethod()` | Track auth method (cookies) | `better-auth/plugins` |

---

## Implementation Details

### Server-Side Changes

#### 1. `packages/backend/convex/auth.ts`

**Current state:**
```typescript
plugins: [
  expo(),
  convex({
    authConfig,
    jwksRotateOnTokenGenerationError: true,
  }),
  lastLoginMethod(),
],
```

**Required changes:**
```typescript
import { crossDomain } from "@convex-dev/better-auth/plugins";

// ...

plugins: [
  expo(),
  convex({
    authConfig,
    jwksRotateOnTokenGenerationError: true,
  }),
  crossDomain({ siteUrl }),  // ADD: For web support
  lastLoginMethod(),
],
```

**Rationale**: The `crossDomain` plugin enables the server to handle web clients that make cross-origin requests and manages one-time tokens for secure session establishment.

#### 2. `packages/backend/convex/http.ts`

**Current state:**
```typescript
authComponent.registerRoutes(http, createAuth, { cors: false });
```

**Required change:**
```typescript
authComponent.registerRoutes(http, createAuth, { cors: true });
```

**Rationale**: CORS must be enabled for web browsers to communicate with the Convex backend from a different origin.

### Client-Side Changes

#### 3. `apps/native/lib/auth-client.ts`

**Current state (broken):**
```typescript
import { lastLoginMethodClient } from "better-auth/client/plugins"; // WRONG for native

export const authClient = createAuthClient({
  baseURL: env.EXPO_PUBLIC_CONVEX_SITE_URL,
  plugins: [
    expoClient({ ... }),
    convexClient(),
    lastLoginMethodClient(), // Uses cookies - fails on native
  ],
});
```

**Required change (complete rewrite):**
```typescript
import { Platform } from "react-native";
import { createAuthClient } from "better-auth/react";
import { convexClient } from "@convex-dev/better-auth/client/plugins";
import Constants from "expo-constants";
import { env } from "@convoexpo-and-nextjs-web-bun-better-auth/env/native";

// Platform-specific imports are handled conditionally to avoid
// bundling native modules in web builds
function getPlugins() {
  const isWeb = Platform.OS === "web";
  const scheme = Constants.expoConfig?.scheme as string;

  if (isWeb) {
    // Web: Use crossDomainClient and cookie-based lastLoginMethod
    const { crossDomainClient } = require("@convex-dev/better-auth/client/plugins");
    const { lastLoginMethodClient } = require("better-auth/client/plugins");

    return [
      convexClient(),
      crossDomainClient(),
      lastLoginMethodClient(),
    ];
  } else {
    // Native: Use expoClient and SecureStore-based lastLoginMethod
    const { expoClient } = require("@better-auth/expo/client");
    const { lastLoginMethodClient } = require("@better-auth/expo/plugins");
    const SecureStore = require("expo-secure-store");

    return [
      convexClient(),
      expoClient({
        scheme,
        storagePrefix: scheme,
        storage: SecureStore,
      }),
      lastLoginMethodClient({
        storage: SecureStore,
        storagePrefix: scheme,
      }),
    ];
  }
}

export const authClient = createAuthClient({
  baseURL: env.EXPO_PUBLIC_CONVEX_SITE_URL,
  plugins: getPlugins(),
});
```

**Rationale**:
1. Uses `require()` instead of top-level imports to prevent webpack from bundling native modules in web builds
2. Conditionally loads the appropriate plugins based on platform
3. Uses consistent `storagePrefix` across expoClient and lastLoginMethodClient
4. The `convexClient()` is always included as it works on both platforms

### UI Changes

#### 4. `apps/native/app/(auth)/landing.tsx`

**Current state:**
```typescript
{authClient.isLastUsedLoginMethod("google") && (
  <LastUsedIndicator />
)}
```

**Recommended enhancement:**
```typescript
import { useState, useEffect } from "react";

export default function Landing() {
  const [lastMethod, setLastMethod] = useState<string | null>(null);

  useEffect(() => {
    // Read after mount to avoid hydration issues on web
    setLastMethod(authClient.getLastUsedLoginMethod());
  }, []);

  // ... rest of component

  {lastMethod === "google" && <LastUsedIndicator />}
}
```

**Rationale**: Using `useEffect` ensures the value is read after the component mounts, preventing potential hydration mismatches on web and ensuring the cookie/SecureStore has been read.

---

## Files to Modify

| File | Change Type | Priority |
|------|-------------|----------|
| `packages/backend/convex/auth.ts` | Add crossDomain plugin | 1 (Server) |
| `packages/backend/convex/http.ts` | Enable CORS | 1 (Server) |
| `apps/native/lib/auth-client.ts` | Complete rewrite with platform detection | 2 (Client) |
| `apps/native/app/(auth)/landing.tsx` | Add useEffect for lastMethod | 3 (UI) |

---

## Step-by-Step Implementation

### Phase 1: Server Changes (Enable Web Support)

#### Step 1.1: Update `auth.ts`

```typescript
// Add import
import { crossDomain } from "@convex-dev/better-auth/plugins";

// Add to plugins array (inside createAuth function)
plugins: [
  expo(),
  convex({
    authConfig,
    jwksRotateOnTokenGenerationError: true,
  }),
  crossDomain({ siteUrl }), // NEW
  lastLoginMethod(),
],
```

#### Step 1.2: Update `http.ts`

```typescript
// Change cors: false to cors: true
authComponent.registerRoutes(http, createAuth, { cors: true });
```

### Phase 2: Client Changes (Platform-Specific Plugins)

#### Step 2.1: Rewrite `auth-client.ts`

Replace the entire file with the platform-aware implementation shown above.

Key points:
- Use `Platform.OS === "web"` for detection
- Use `require()` for conditional imports
- Keep `convexClient()` in both paths
- Configure consistent `storagePrefix`

### Phase 3: UI Changes (Robust Indicator)

#### Step 3.1: Update `landing.tsx`

Add `useState` and `useEffect` for the last method reading.

---

## Testing Plan

### Native Testing (iOS/Android)

1. **Fresh install test**:
   - Uninstall app completely
   - Sign in with Google
   - Close and reopen app
   - Verify "Last Used" indicator shows on Google button

2. **Method switching test**:
   - Sign out
   - Sign in with Email
   - Verify indicator moves to Email button

3. **Persistence test**:
   - Force close app
   - Reopen
   - Verify indicator persists

### Web Testing (Expo Web)

1. **Start the app in web mode**:
   ```bash
   cd apps/native && bun run web
   ```

2. **Cookie verification**:
   - Open DevTools > Application > Cookies
   - Sign in with any method
   - Verify `better-auth.last_used_login_method` cookie is set

3. **Cross-session test**:
   - Sign in with Google
   - Close browser tab
   - Reopen (same browser)
   - Verify indicator shows on Google

### Cross-Platform Consistency

1. Sign in on native with Google
2. Sign in on web with Email
3. Verify each platform maintains its own "last used" state independently (this is expected behavior - they use different storage)

---

## Sources

- [Better Auth Expo Integration](https://www.better-auth.com/docs/integrations/expo)
- [Convex + Better Auth Expo Guide](https://labs.convex.dev/better-auth/framework-guides/expo)
- [Better Auth Last Login Method Plugin](https://www.better-auth.com/docs/plugins/last-login-method)
- [GitHub Issue #6409: lastLoginMethod in Expo](https://github.com/better-auth/better-auth/issues/6409)
- [@better-auth/expo npm package](https://www.npmjs.com/package/@better-auth/expo)
- [@convex-dev/better-auth npm package](https://www.npmjs.com/package/@convex-dev/better-auth)

---

## Appendix: Type Definitions

### lastLoginMethodClient (Expo Version)

```typescript
interface LastLoginMethodClientConfig {
  storage: {
    setItem: (key: string, value: string) => any;
    getItem: (key: string) => string | null;
    deleteItemAsync: (key: string) => Awaitable<void>;
  };
  storagePrefix?: string;
  customResolveMethod?: (url: string | URL) => Awaitable<string | undefined | null>;
}
```

### crossDomain (Server)

```typescript
crossDomain({ siteUrl: string }): BetterAuthPlugin
```

### crossDomainClient (Client)

```typescript
crossDomainClient(opts?: {
  storage?: {
    setItem: (key: string, value: string) => any;
    getItem: (key: string) => string | null;
  };
  storagePrefix?: string;
  disableCache?: boolean;
}): BetterAuthClientPlugin
```

---

## Version Information

- `better-auth`: 1.4.9 (pinned)
- `@better-auth/expo`: 1.4.9 (pinned)
- `@convex-dev/better-auth`: ^0.10.9

**Note**: Per Convex documentation, these versions should be pinned exactly for compatibility.
