# Authentication Investigation: Better Auth + Convex + Expo

## Problem Summary

Authentication is failing across all development environments with "Invalid origin" errors. This has been an ongoing issue through multiple debugging sessions without resolution.

---

## Observed Errors

### 1. iOS Simulator (localhost)
```
14/01/2026, 11:49:07 [CONVEX H(POST /api/auth/sign-up/email)] [ERROR]
'2026-01-14T11:49:07.611Z ERROR [Better Auth]: Invalid origin: exp://127.0.0.1:8081'
```

### 2. Expo Go on Physical Device (local network)
```
14/01/2026, 11:56:29 [CONVEX H(POST /api/auth/sign-up/email)] [ERROR]
'2026-01-14T11:56:29.956Z ERROR [Better Auth]: Invalid origin: exp://192.168.1.163:8081'
```

### 3. Web Browser (press W in Metro)
- `GET /api/auth/get-session` - Status 200 but **CORS error**
- `POST /api/auth/sign-in/email` - **CORS error**
- `POST /api/auth/sign-up/email` - **CORS error**

### 4. Development Build Mode
- QR code opens Safari on phone
- Safari shows "can't connect to server" (localhost unreachable from phone)

---

## User-Facing Error

The error shown to users is:
> "Unable to create account. Please try again."

This is unhelpful because:
- It doesn't indicate the actual problem (server-side origin validation)
- "Try again" will produce the same result
- User cannot fix this - it's a configuration issue

---

## Environment Details

### Metro Bundler Output
- Metro waiting on: `exp://192.168.1.163:8081`
- Web waiting on: `http://localhost:8081`
- Mode: "Using Expo Go" (Press S to switch to development build)

### Convex Deployment
- Deployment: `artful-cod-78`
- Site URL: `https://artful-cod-78.convex.site`

### Convex Environment Variables (Current)
```
BETTER_AUTH_SECRET=wdh0RLepFOAuSkdlRpWDwnT3dLOINPgTJC8xV9N1+d0
NATIVE_APP_URL=convoexpo-and-nextjs-web-bun-better-auth://
SITE_URL=http://localhost:3001
```

### App Scheme (from app.config.ts)
```
scheme: "cityuniversityclub"
```

**ISSUE FOUND**: The `NATIVE_APP_URL` env var is `convoexpo-and-nextjs-web-bun-better-auth://` but the actual app scheme is `cityuniversityclub://`

---

## Origins Being Rejected

| Environment | Origin Sent | Current Status |
|------------|-------------|----------------|
| iOS Simulator | `exp://127.0.0.1:8081` | Rejected |
| Expo Go (phone) | `exp://192.168.1.163:8081` | Rejected |
| Web (localhost) | `http://localhost:8081` | CORS Error |
| Production App | `cityuniversityclub://` | Unknown |

---

## Current Configuration Analysis

### 1. Server Auth Config (`packages/backend/convex/auth.ts`)

```typescript
trustedOrigins: [
  siteUrl,  // http://localhost:3001
  nativeAppUrl,  // convoexpo-and-nextjs-web-bun-better-auth:// (WRONG - should be cityuniversityclub://)
  // Expo Go development URLs
  ...(process.env.NODE_ENV === "development"
    ? ["exp://"]
    : []),
],
```

**Issues Found:**
1. `nativeAppUrl` doesn't match actual app scheme
2. `"exp://"` alone may not be working - need to verify pattern syntax

### 2. HTTP Routes (`packages/backend/convex/http.ts`)

```typescript
authComponent.registerRoutes(http, createAuth, { cors: false });
```

**CRITICAL ISSUE**: `cors: false` breaks web browser authentication entirely!

### 3. Native Auth Client (`apps/native/lib/auth-client.ts`)

```typescript
plugins: [
  expoClient({
    scheme: Constants.expoConfig?.scheme as string,
    storagePrefix: Constants.expoConfig?.scheme as string,
    storage: SecureStore,
  }),
  convexClient(),
  lastLoginMethodClient(),
],
```

**Issue**: No conditional handling for web vs native - uses `expoClient` for everything.

### 4. Web Auth Client (`apps/web/src/lib/auth-client.ts`)

```typescript
plugins: [convexClient()],
```

**Issue**: Missing `crossDomainClient()` plugin required for CORS.

---

## Research Findings

### Better Auth trustedOrigins Pattern Syntax

From official documentation:

| Pattern | Description |
|---------|-------------|
| `?` | Matches exactly one character (except `/`) |
| `*` | Matches zero or more characters that don't cross `/` |
| `**` | Matches zero or more characters including `/` |

#### Pattern Examples from Documentation

| Pattern | Matches | Does Not Match |
|---------|---------|----------------|
| `exp://192.168.*.*:*/**` | `exp://192.168.1.100:8081/path` | `exp://10.0.0.29:8081/path` |
| `myapp://` | All URLs starting with `myapp://` | - |
| `exp://` | All URLs starting with `exp://` (prefix matching) | - |

**Key Insight**: For custom schemes like `exp://` or `myapp://`, patterns match against the full URL including paths when wildcards are present, or use **prefix matching** when no wildcards exist.

### Official Better Auth Expo Configuration (from docs)

```typescript
export const auth = betterAuth({
  trustedOrigins: [
    "myapp://",

    // Development mode - Expo's exp:// scheme with local IP ranges
    ...(process.env.NODE_ENV === "development" ? [
      "exp://",                      // Trust all Expo URLs (prefix matching)
      "exp://**",                    // Trust all Expo URLs (wildcard matching)
      "exp://192.168.*.*:*/**",      // Trust 192.168.x.x IP range with any port and path
    ] : [])
  ]
})
```

### Convex + Better Auth Expo Web Support (CRITICAL)

From the Convex Better Auth documentation, to support **both Expo native AND Expo Web**:

#### Server-side changes required:

```typescript
import { crossDomain } from "@convex-dev/better-auth/plugins";

const siteUrl = process.env.SITE_URL!;

export const createAuth = (ctx) => betterAuth({
  trustedOrigins: [siteUrl, "your-scheme://"],
  plugins: [
    expo(),
    convex({ authConfig }),
    crossDomain({ siteUrl }),  // REQUIRED for web
  ],
});
```

#### HTTP routes change required:

```typescript
// CORS handling is required for client side frameworks
authComponent.registerRoutes(http, createAuth, { cors: true });  // MUST be true for web
```

#### Client-side changes required:

```typescript
import { Platform } from "react-native";
import { expoClient } from "@better-auth/expo/client";
import { crossDomainClient } from "@convex-dev/better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.EXPO_PUBLIC_CONVEX_SITE_URL,
  plugins: [
    convexClient(),
    // CRITICAL: expoClient and crossDomainClient CANNOT both be included!
    ...(Platform.OS === "web"
      ? [crossDomainClient()]
      : [
          expoClient({
            scheme: Constants.expoConfig?.scheme as string,
            storagePrefix: Constants.expoConfig?.scheme as string,
            storage: SecureStore,
          }),
        ]),
  ],
});
```

### Reference Repo Analysis (`~/gruckion-workdir/convexpo/`)

The reference repo uses a different approach:
- Sets `EXPO_MOBILE_URL` env var to the specific development IP (e.g., `exp://192.168.1.163:8081`)
- Uses `cors: false`
- Has `trustedOrigins: ["https://appleid.apple.com", requireEnv("EXPO_MOBILE_URL")]`

**Problem with this approach**: IP addresses change between devices and network configurations, making it inflexible.

---

## Root Causes Identified

### Issue 1: NATIVE_APP_URL Mismatch
- **Current**: `NATIVE_APP_URL=convoexpo-and-nextjs-web-bun-better-auth://`
- **Required**: `NATIVE_APP_URL=cityuniversityclub://` (matches app.config.ts scheme)

### Issue 2: CORS Disabled
- **Current**: `cors: false` in http.ts
- **Required**: `cors: true` for web browser support

### Issue 3: Missing crossDomain Plugin
- Server needs `crossDomain({ siteUrl })` plugin for web support
- Client needs conditional `crossDomainClient()` vs `expoClient()` based on platform

### Issue 4: Expo Development Origins
- Current config uses `"exp://"` which should work for prefix matching
- However, may need more explicit patterns like `"exp://127.0.0.1:*/**"` and `"exp://192.168.*.*:*/**"`

### Issue 5: Environment Detection
- `process.env.NODE_ENV` may not be `"development"` in Convex environment
- Need to verify how Convex sets this

---

## Recommended Solution

### 1. Fix Environment Variables (Convex)

```bash
npx convex env set NATIVE_APP_URL="cityuniversityclub://"
npx convex env set SITE_URL="http://localhost:8081"  # For Expo web
```

### 2. Update Server Auth Config (`packages/backend/convex/auth.ts`)

```typescript
import { crossDomain } from "@convex-dev/better-auth/plugins";

const siteUrl = process.env.SITE_URL!;
const nativeAppUrl = process.env.NATIVE_APP_URL || "cityuniversityclub://";

function createAuth(ctx: GenericCtx<DataModel>) {
  return betterAuth({
    baseURL: siteUrl,
    trustedOrigins: [
      siteUrl,
      nativeAppUrl,
      // Expo development URLs - explicit patterns
      "exp://127.0.0.1:*/**",      // iOS Simulator
      "exp://192.168.*.*:*/**",    // Local network devices
      "exp://10.*.*.*:*/**",       // Alternative local network range
      "exp://localhost:*/**",      // Localhost
    ],
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    plugins: [
      expo(),
      convex({ authConfig }),
      crossDomain({ siteUrl }),  // ADD THIS
    ],
  });
}
```

### 3. Update HTTP Routes (`packages/backend/convex/http.ts`)

```typescript
authComponent.registerRoutes(http, createAuth, { cors: true });  // CHANGE to true
```

### 4. Update Native Auth Client (`apps/native/lib/auth-client.ts`)

```typescript
import { Platform } from "react-native";
import { expoClient } from "@better-auth/expo/client";
import { crossDomainClient, convexClient } from "@convex-dev/better-auth/client/plugins";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
  baseURL: env.EXPO_PUBLIC_CONVEX_SITE_URL,
  plugins: [
    convexClient(),
    ...(Platform.OS === "web"
      ? [crossDomainClient()]
      : [
          expoClient({
            scheme: Constants.expoConfig?.scheme as string,
            storagePrefix: Constants.expoConfig?.scheme as string,
            storage: SecureStore,
          }),
        ]),
  ],
});
```

### 5. Verify Metro Config

Ensure `metro.config.js` has:
```javascript
config.resolver.unstable_enablePackageExports = true;
```

---

## Testing Checklist

After implementing changes:

- [ ] iOS Simulator: `exp://127.0.0.1:8081` should work
- [ ] Expo Go on phone: `exp://192.168.x.x:8081` should work
- [ ] Web browser: `http://localhost:8081` should work (no CORS errors)
- [ ] Production build: `cityuniversityclub://` should work

---

## Summary

The authentication failures are caused by **multiple configuration issues**:

1. **Wrong app scheme** in Convex env vars
2. **CORS disabled** which breaks web entirely
3. **Missing crossDomain plugin** required for web support
4. **Client not conditionally switching** between `expoClient` and `crossDomainClient`
5. **Potentially insufficient** trusted origin patterns for development

The fix requires changes to:
- Convex environment variables
- Server auth configuration (add crossDomain plugin)
- HTTP routes (enable CORS)
- Native auth client (conditional plugin loading)

---

## References

- [Better Auth Expo Integration](https://www.better-auth.com/docs/integrations/expo)
- [Convex + Better Auth Expo Guide](https://labs.convex.dev/better-auth/framework-guides/expo)
- [Better Auth Options Reference - trustedOrigins](https://www.better-auth.com/docs/reference/options#trustedorigins)
