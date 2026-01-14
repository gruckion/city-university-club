# Better-Auth Integration Fix Analysis

**Date:** January 13, 2026
**Issue:** Better-Auth authentication not working in React Native/Expo app
**Working Reference:** `~/gruckion-workdir/convexpo` repository

---

## Executive Summary

This document analyzes why Better-Auth works in the `convexpo` repository but fails in `convoexpo-and-nextjs-web-bun-better-auth`. After a comprehensive comparison of both codebases, **7 critical issues** were identified that prevent authentication from functioning correctly.

---

## Root Causes Identified

### 1. Environment Variables Not Configured (CRITICAL)

**Severity:** 🔴 Critical - Auth will fail immediately

**Location:** `apps/native/.env`

**Broken Configuration:**
```env
EXPO_PUBLIC_CONVEX_URL=https://<YOUR_CONVEX_URL>
EXPO_PUBLIC_CONVEX_SITE_URL=https://<YOUR_CONVEX_URL>
```

**Problem:** The `.env` file contains placeholder values `<YOUR_CONVEX_URL>` instead of actual Convex deployment URLs. The auth client's `baseURL` becomes invalid, causing all authentication requests to fail.

**Backend `.env.local` also has issues:**
```env
EXPO_PUBLIC_CONVEX_SITE_URL=  # EMPTY!
NEXT_PUBLIC_CONVEX_SITE_URL=  # EMPTY!
```

**Working Configuration (from convexpo):**
- Uses actual Convex URLs like `https://brilliant-antelope-830.convex.cloud`
- The `.site` URL variant is required for HTTP actions

**Fix Required:**
```env
# apps/native/.env
EXPO_PUBLIC_CONVEX_URL=https://artful-cod-78.convex.cloud
EXPO_PUBLIC_CONVEX_SITE_URL=https://artful-cod-78.convex.site

# packages/backend/.env.local
EXPO_PUBLIC_CONVEX_SITE_URL=https://artful-cod-78.convex.site
NEXT_PUBLIC_CONVEX_SITE_URL=https://artful-cod-78.convex.site
```

---

### 2. Missing Expo Plugins in app.json (CRITICAL)

**Severity:** 🔴 Critical - Token storage will fail

**Location:** `apps/native/app.json`

**Broken Configuration:**
```json
{
  "expo": {
    "plugins": ["expo-font"]
  }
}
```

**Working Configuration (from convexpo):**
```json
{
  "expo": {
    "plugins": [
      ["expo-splash-screen", {...}],
      "expo-router",
      "expo-secure-store",
      "expo-web-browser"
    ]
  }
}
```

**Missing Plugins:**
| Plugin | Purpose | Impact if Missing |
|--------|---------|-------------------|
| `expo-secure-store` | Secure token storage | Tokens cannot be persisted, user logged out on app restart |
| `expo-web-browser` | OAuth flows | Social login (Google, Apple) won't work |
| `expo-router` | Deep linking | May affect auth redirects |

**Why This Matters:**

The auth client uses SecureStore for token persistence:
```typescript
expoClient({
  scheme: Constants.expoConfig?.scheme as string,
  storagePrefix: Constants.expoConfig?.scheme as string,
  storage: SecureStore,  // Requires expo-secure-store plugin!
})
```

---

### 3. Missing Auth Trigger Exports (CRITICAL)

**Severity:** 🔴 Critical - Auth hooks won't fire

**Location:** `packages/backend/convex/auth.ts`

**Broken Configuration:**
```typescript
export const authComponent = createClient<DataModel>(components.betterAuth);

function createAuth(ctx: GenericCtx<DataModel>) {
  return betterAuth({...});
}

export { createAuth };

export const getCurrentUser = query({...});

// MISSING: Trigger exports!
```

**Working Configuration (from convexpo):**
```typescript
// convex/auth.ts
import { authComponent } from "./lib/betterAuth";

export const { onCreate, onUpdate, onDelete } = authComponent.triggersApi();
```

**Why This Matters:**

The `triggersApi()` exports are required by the `@convex-dev/better-auth` component. Without them, the internal Convex functions that handle user creation/updates/deletion won't be properly registered.

---

### 4. Missing authFunctions in createClient (CRITICAL)

**Severity:** 🔴 Critical - Internal auth functions not wired

**Location:** `packages/backend/convex/auth.ts`

**Broken Configuration:**
```typescript
export const authComponent = createClient<DataModel>(components.betterAuth);
// No options passed!
```

**Working Configuration (from convexpo):**
```typescript
import { type AuthFunctions, createClient } from "@convex-dev/better-auth";
import { components, internal } from "./_generated/api";

const authFunctions: AuthFunctions = internal.auth;

export const authComponent = createClient<DataModel>(components.betterAuth, {
  authFunctions,
  verbose: isDevelopment(),
  triggers: {
    user: {
      onCreate: async (ctx, authUser) => {
        // Handle user creation
      },
      onUpdate: async (ctx, oldUser, newUser) => {
        // Handle user updates
      },
      onDelete: async (ctx, authUser) => {
        // Handle user deletion
      },
    },
  },
});
```

**Why This Matters:**

The `authFunctions` parameter connects the Better Auth component to Convex's internal mutation/query system. Without it, auth operations cannot properly interact with the Convex database.

---

### 5. Missing expectAuth in ConvexReactClient (HIGH)

**Severity:** 🟠 High - Race conditions possible

**Location:** `apps/native/app/_layout.tsx`

**Broken Configuration:**
```typescript
const convex = new ConvexReactClient(env.EXPO_PUBLIC_CONVEX_URL, {
  unsavedChangesWarning: false,
});
```

**Working Configuration (from convexpo):**
```typescript
const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL, {
  expectAuth: true,  // IMPORTANT!
  unsavedChangesWarning: false,
  verbose: false,
});
```

**Why This Matters:**

The `expectAuth: true` option tells Convex to pause all queries until the user is authenticated. Without it:
- Queries may fire before auth state is ready
- Protected queries may fail with "unauthenticated" errors
- Race conditions between auth and data fetching

---

### 6. Missing CORS Configuration in http.ts (MEDIUM)

**Severity:** 🟡 Medium - May cause cross-origin issues

**Location:** `packages/backend/convex/http.ts`

**Broken Configuration:**
```typescript
authComponent.registerRoutes(http, createAuth);
// No CORS option!
```

**Working Configuration (from convexpo):**
```typescript
authComponent.registerRoutes(http, createAuth, { cors: false });
```

**Why This Matters:**

For mobile apps (React Native/Expo), CORS settings can impact whether HTTP requests succeed. The working project explicitly disables CORS which may be necessary for the mobile client.

---

### 7. Different auth.config.ts Approach (MEDIUM)

**Severity:** 🟡 Medium - May cause provider mismatch

**Location:** `packages/backend/convex/auth.config.ts`

**Broken Configuration:**
```typescript
import { getAuthConfigProvider } from "@convex-dev/better-auth/auth-config";
import type { AuthConfig } from "convex/server";

export default {
  providers: [getAuthConfigProvider()],
} satisfies AuthConfig;
```

**Working Configuration (from convexpo):**
```typescript
export default {
  providers: [
    {
      domain: process.env.CONVEX_SITE_URL,
      applicationID: "convex",
    },
  ],
};
```

**Why This Matters:**

The working project explicitly sets the `domain` and `applicationID` for the auth provider, while the broken project uses an abstraction (`getAuthConfigProvider()`). The explicit approach ensures the correct domain is used.

---

## Package Version Comparison

| Package | Working (convexpo) | Broken (yours) | Notes |
|---------|-------------------|----------------|-------|
| `better-auth` | 1.3.11 | 1.4.9 | Major version jump |
| `@convex-dev/better-auth` | ^0.8.6 | ^0.10.9 | Breaking changes possible |
| `@better-auth/expo` | 1.3.11 | 1.4.9 | Should match better-auth |
| `convex` | ^1.27.3 | ^1.31.2 | Minor update |

**Recommendation:** If issues persist after fixes, consider downgrading to the working versions.

---

## File-by-File Comparison

### Backend Auth Setup

| File | Working | Broken | Issue |
|------|---------|--------|-------|
| `convex/auth.ts` | Exports triggers via `triggersApi()` | Only exports `createAuth` and `getCurrentUser` | Missing trigger exports |
| `convex/auth.ts` | Uses `authFunctions` parameter | No options in `createClient` | Missing authFunctions |
| `convex/auth.config.ts` | Explicit domain/applicationID | Uses `getAuthConfigProvider()` | Abstraction may fail |
| `convex/http.ts` | `{ cors: false }` option | No CORS option | May cause issues |

### Native App Setup

| File | Working | Broken | Issue |
|------|---------|--------|-------|
| `app.json` | Has expo-secure-store plugin | Missing plugin | Token storage fails |
| `app/_layout.tsx` | `expectAuth: true` | Missing option | Race conditions |
| `.env` | Actual URLs | Placeholder values | Auth requests fail |
| `lib/auth-client.ts` | Proper baseURL | Invalid baseURL | All requests fail |

---

## Fix Implementation Plan

### Step 1: Fix Environment Variables
1. Update `apps/native/.env` with actual Convex URLs
2. Update `packages/backend/.env.local` with site URLs

### Step 2: Update app.json
1. Add `expo-secure-store` plugin
2. Add `expo-web-browser` plugin

### Step 3: Update Backend Auth
1. Restructure `auth.ts` to include authFunctions
2. Add trigger exports
3. Update `auth.config.ts` with explicit provider config
4. Add CORS option to `http.ts`

### Step 4: Update Native App
1. Add `expectAuth: true` to ConvexReactClient

---

## Testing Checklist

After implementing fixes:

- [ ] Environment variables load correctly
- [ ] App builds without errors
- [ ] User can sign up with email/password
- [ ] User can sign in with email/password
- [ ] User session persists after app restart
- [ ] User can sign out
- [ ] Protected queries work when authenticated
- [ ] Protected queries correctly deny unauthenticated users

---

## Fixes Applied

All issues have been fixed. Here's a summary of the changes made:

### 1. Environment Variables Fixed

**File:** `apps/native/.env`
```env
EXPO_PUBLIC_CONVEX_URL=https://artful-cod-78.convex.cloud
EXPO_PUBLIC_CONVEX_SITE_URL=https://artful-cod-78.convex.site
```

**File:** `packages/backend/.env.local`
- Added `EXPO_PUBLIC_CONVEX_SITE_URL=https://artful-cod-78.convex.site`
- Added `NEXT_PUBLIC_CONVEX_SITE_URL=https://artful-cod-78.convex.site`
- Added `NATIVE_APP_URL=convoexpo-and-nextjs-web-bun-better-auth://`

### 2. Expo Plugins Added

**File:** `apps/native/app.json`
```json
"plugins": [
  "expo-font",
  "expo-router",
  "expo-secure-store",
  "expo-web-browser"
]
```

### 3. Auth Triggers and authFunctions Added

**File:** `packages/backend/convex/auth.ts`
- Added `authFunctions` parameter to `createClient`
- Added `triggers` configuration for user lifecycle events
- Added trigger exports: `export const { onCreate, onUpdate, onDelete } = authComponent.triggersApi();`
- Fixed trustedOrigins to use string patterns instead of RegExp

### 4. expectAuth Added

**File:** `apps/native/app/_layout.tsx`
```typescript
const convex = new ConvexReactClient(env.EXPO_PUBLIC_CONVEX_URL, {
  expectAuth: true,
  unsavedChangesWarning: false,
});
```

### 5. CORS Configuration Added

**File:** `packages/backend/convex/http.ts`
```typescript
authComponent.registerRoutes(http, createAuth, { cors: false });
```

### 6. Auth Config Updated

**File:** `packages/backend/convex/auth.config.ts`
```typescript
export default {
  providers: [
    {
      domain: process.env.CONVEX_SITE_URL || process.env.SITE_URL,
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig;
```

---

## Verification

After applying fixes:

1. **Convex functions compiled successfully:** ✅
   ```
   ✔ Convex functions ready!
   ```

2. **Files modified:**
   - `apps/native/.env`
   - `apps/native/app.json`
   - `apps/native/app/_layout.tsx`
   - `packages/backend/.env.local`
   - `packages/backend/convex/auth.ts`
   - `packages/backend/convex/auth.config.ts`
   - `packages/backend/convex/http.ts`

---

## Next Steps

1. Run `npx expo prebuild --clean` to rebuild native modules with new plugins
2. Run `bun run dev` to start development servers
3. Test authentication flows:
   - Sign up with email/password
   - Sign in with email/password
   - Session persistence (close and reopen app)
   - Sign out

---

## Additional Fixes (January 13, 2026 - Session 2)

### 7. Navigation After Auth - Stack.Protected Guards

**Issue:** After signing up or signing in, the user stayed on the auth screen instead of navigating to the home screen.

**Root Cause:** The root `_layout.tsx` didn't use `Stack.Protected` guards to automatically show/hide screens based on auth state.

**File:** `apps/native/app/_layout.tsx`
```typescript
function StackLayout() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return null;
  }

  return (
    <Stack screenOptions={{ animation: "fade" }}>
      {/* Only show auth screens when NOT authenticated */}
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false,
            gestureEnabled: false, // Prevent back navigation
          }}
        />
      </Stack.Protected>

      {/* Only show main tabs when authenticated */}
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
      </Stack.Protected>
    </Stack>
  );
}
```

### 8. Security Fix - Email Enumeration Prevention

**Issue:** Error messages like "user already exists" revealed whether an email was registered, enabling email enumeration attacks.

**Fix:** Sanitized all auth error messages to use generic responses:

**Files Modified:**
- `apps/native/app/(auth)/email/signup.tsx`
- `apps/native/app/(auth)/email/signin.tsx`
- `apps/native/app/(auth)/email/(reset)/request-password-reset.tsx`
- `apps/native/app/(auth)/email/(reset)/reset-password.tsx`

**Error Message Mapping:**
| Original (Revealing)               | Fixed (Generic)                                                  |
|-----------------------------------|------------------------------------------------------------------|
| "User already exists"             | "Unable to create account. Please check your details or try signing in." |
| "User not found"                  | "Invalid email or password. Please try again."                   |
| "Invalid password"                | "Invalid email or password. Please try again."                   |
| "No user with this email"         | "If an account exists, you'll receive a reset link."            |

**Security Best Practices Applied:**
1. **Signup/Signin:** Same generic error for both "user exists" and "user not found"
2. **Password Reset:** Always show success message regardless of email existence
3. **Rate Limiting Messages:** Preserved (not a security risk to reveal)

---

## All Files Modified

### Session 1 (Better Auth Integration)
- `apps/native/.env` - Set actual Convex URLs
- `apps/native/app.json` - Added expo plugins
- `apps/native/app/_layout.tsx` - Added expectAuth
- `packages/backend/.env.local` - Added missing env vars
- `packages/backend/convex/auth.ts` - Added authFunctions and triggers
- `packages/backend/convex/auth.config.ts` - Explicit config
- `packages/backend/convex/http.ts` - Added CORS config

### Session 2 (Navigation & Security)
- `apps/native/app/_layout.tsx` - Added Stack.Protected guards (later changed)
- `apps/native/app/(auth)/email/signup.tsx` - Sanitized error messages
- `apps/native/app/(auth)/email/signin.tsx` - Sanitized error messages
- `apps/native/app/(auth)/email/(reset)/request-password-reset.tsx` - Always show success
- `apps/native/app/(auth)/email/(reset)/reset-password.tsx` - Sanitized error messages

### Session 3 (Selective Auth Pattern)
- `apps/native/app/_layout.tsx` - Changed to Selective Auth pattern (no guards)
- `apps/native/app/(auth)/landing.tsx` - Changed X button to use `router.dismiss()`
- `docs/AUTH_NAVIGATION_PATTERNS.md` - Created comprehensive documentation

---

## References

- [Convex Better Auth Expo Guide](https://github.com/get-convex/better-auth/blob/main/docs/content/docs/framework-guides/expo.mdx)
- [Better Auth Triggers Documentation](https://github.com/get-convex/better-auth/blob/main/docs/content/docs/features/triggers.mdx)
- [OWASP Email Enumeration Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#authentication-and-error-messages)
- Working Reference: `~/gruckion-workdir/convexpo`
