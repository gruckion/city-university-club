# Auth Navigation Fix Documentation

## Problem

When clicking social OAuth buttons (GitHub/Google/Apple), the app would immediately navigate to the tabs screen before authentication completed. This occurred because the `onSuccess` callback was firing when the OAuth redirect was initiated, not when authentication completed.

### Root Cause

The `onSuccess` callback in Better Auth's `signIn.social()` has different semantics for email vs. social OAuth:

| Auth Type | When `onSuccess` Fires | Auth Complete? |
|-----------|------------------------|----------------|
| `signIn.email()` | Server confirms credentials | ✅ Yes |
| `signIn.social()` | OAuth authorization URL obtained | ❌ No (redirect initiated) |

For social OAuth on Expo:
1. `signIn.social()` returns authorization URL
2. expoClient plugin opens browser
3. User authenticates with provider
4. Provider redirects via deep link
5. expoClient exchanges code for tokens
6. **Now** authentication is complete

The old code called `router.replace("/(tabs)")` in `onSuccess`, which fired at step 1-2, not step 6.

## Solution

Centralize navigation in the `(auth)/_layout.tsx` using a `useConvexAuth()` state listener.

### Architecture

```
(auth)/_layout.tsx  ←── Single auth state listener
  │
  ├── landing.tsx       (no navigation logic)
  │
  └── email/
      ├── signin.tsx    (no navigation logic)
      ├── signup.tsx    (no navigation logic)
      └── (reset)/...   (navigates to signin, not tabs)
```

### Files Changed

1. **`apps/native/app/(auth)/_layout.tsx`**
   - Added `useConvexAuth()` hook
   - Added `useEffect` that navigates to `/(tabs)` when `isAuthenticated` becomes true

2. **`apps/native/app/(auth)/email/signin.tsx`**
   - Removed `router.replace("/(tabs)")` from `onSuccess`
   - Removed unused `router` import

3. **`apps/native/app/(auth)/email/signup.tsx`**
   - Removed `router.replace("/(tabs)")` from `onSuccess`
   - Removed unused `router` import

4. **`apps/native/lib/oauth/useGitHubAuth.ts`**
   - Removed callback object (`onRequest`, `onSuccess`, `onError`)
   - Simplified to try/catch pattern

5. **`apps/native/lib/oauth/useGoogleAuth.ts`**
   - Same changes as GitHub

6. **`apps/native/lib/oauth/useAppleAuth.ts`**
   - Same changes as GitHub

## Expected Behavior

### Email Sign-In

| Step | Action | Route |
|------|--------|-------|
| 1 | User on landing | `/(auth)/landing` |
| 2 | Click "Continue with Email" | `/(auth)/email/signin` (drawer) |
| 3 | Enter credentials, click Sign In | Stay on drawer |
| 4 | Auth succeeds | Navigate to `/(tabs)` |

**Unhappy paths:**
- Invalid credentials → Alert, stay on drawer
- Network error → Alert, stay on drawer
- User closes drawer → Back to landing

### Social OAuth (GitHub/Google/Apple)

| Step | Action | Route |
|------|--------|-------|
| 1 | User on landing | `/(auth)/landing` |
| 2 | Click "GitHub" button | **Stay on landing** |
| 3 | OAuth modal appears | `/(auth)/landing` |
| 4 | Click "Continue" | Browser opens |
| 5 | Complete OAuth | Browser |
| 6 | Deep link callback | `/(auth)/landing` |
| 7 | Auth state changes | Navigate to `/(tabs)` |

**Unhappy paths:**
- Cancel OAuth modal → Stay on landing
- Cancel in browser → Stay on landing
- OAuth error → Stay on landing

## Why This Works

The `(auth)/_layout.tsx` wraps all auth screens. When any auth method succeeds:

1. Better Auth updates the session
2. Convex syncs the token
3. `useConvexAuth()` reflects `isAuthenticated: true`
4. `useEffect` in layout triggers
5. `router.replace("/(tabs)")` executes

This provides:
- **Single source of truth** for auth navigation
- **Consistent behavior** across all auth methods
- **No premature navigation** for social OAuth
- **Clean separation** of auth logic from navigation

## Code Reference

### Auth Layout (`apps/native/app/(auth)/_layout.tsx:6-17`)

```typescript
export default function AuthLayout() {
  const router = useRouter();
  const { isAuthenticated } = useConvexAuth();

  // Single source of truth: Navigate to tabs when user becomes authenticated
  // This handles all auth methods: email signin/signup, and social OAuth
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, router]);
  // ...
}
```

### Social OAuth Hook (`apps/native/lib/oauth/useGitHubAuth.ts`)

```typescript
const signIn = async () => {
  setIsLoading(true);
  try {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/",
    });
    // OAuth redirect initiated - browser will open
    // Navigation handled by (auth)/_layout.tsx when auth completes via deep link
  } catch (error) {
    console.error("GitHub sign in error:", error);
  } finally {
    setIsLoading(false);
  }
};
```
