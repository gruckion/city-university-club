# Auth Navigation Patterns for Expo Router

This document describes two common authentication navigation patterns for React Native apps using Expo Router with Better Auth / Convex.

---

## Overview

| Pattern | Use Case | Initial Screen | Auth Required |
|---------|----------|----------------|---------------|
| **Selective Auth** | Social apps, e-commerce, content apps | Main app (tabs) | Only for specific features |
| **Auth-First** | Banking, healthcare, enterprise apps | Login screen | Yes, for entire app |

---

## Pattern A: Selective Auth (Current Implementation)

**Best for:** Apps where users can browse content without logging in, but need to authenticate for specific actions (e.g., purchasing, saving, commenting).

### Navigation Structure

```
app/
├── _layout.tsx          # Root - no auth guards
├── (tabs)/              # Always accessible
│   ├── _layout.tsx
│   ├── index.tsx        # Home - shows different UI based on auth
│   ├── menu/
│   ├── events/
│   └── more/
└── (auth)/              # Modal overlay
    ├── _layout.tsx
    ├── landing.tsx      # Has X button to dismiss
    └── email/
        ├── signin.tsx
        └── signup.tsx
```

### Root Layout Implementation

```typescript
// app/_layout.tsx
import { Stack } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",  // Start at tabs, not auth
};

function StackLayout() {
  return (
    <Stack screenOptions={{ animation: "fade" }}>
      {/* Main tabs - always accessible */}
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />

      {/* Auth screens - presented as fullscreen modal */}
      <Stack.Screen
        name="(auth)"
        options={{
          headerShown: false,
          presentation: "fullScreenModal",
          animation: "slide_from_bottom",
        }}
      />
    </Stack>
  );
}
```

### Auth Modal Close Button

```typescript
// app/(auth)/landing.tsx
import { useRouter } from "expo-router";

export default function Landing() {
  const router = useRouter();

  return (
    <View>
      {/* X button dismisses the modal */}
      <Pressable onPress={() => router.dismiss()}>
        <Ionicons name="close" size={24} />
      </Pressable>
      {/* ... rest of auth UI */}
    </View>
  );
}
```

### Triggering Auth From Screens

```typescript
// In any screen that needs auth
import { useConvexAuth } from "convex/react";
import { useRouter } from "expo-router";

export default function SomeFeature() {
  const { isAuthenticated } = useConvexAuth();
  const router = useRouter();

  const handleAuthRequired = () => {
    if (!isAuthenticated) {
      router.push("/(auth)/landing");
      return;
    }
    // Proceed with authenticated action
  };

  return (
    <View>
      {isAuthenticated ? (
        <AuthenticatedContent />
      ) : (
        <UnauthenticatedContent onSignIn={() => router.push("/(auth)/landing")} />
      )}
    </View>
  );
}
```

### Pros & Cons

**Pros:**
- Lower friction for new users
- Users can explore before committing
- Better for discovery and engagement
- X button provides clear escape route

**Cons:**
- More complex state management
- Need to handle unauthenticated states in many screens
- Potential for confusing UX if not designed well

---

## Pattern B: Auth-First (Gated Access)

**Best for:** Apps where all content requires authentication (banking, healthcare, enterprise, private communities).

### Navigation Structure

```
app/
├── _layout.tsx          # Root - with Stack.Protected guards
├── (tabs)/              # Only accessible when authenticated
│   ├── _layout.tsx
│   ├── index.tsx
│   └── ...
└── (auth)/              # Only accessible when NOT authenticated
    ├── _layout.tsx
    ├── landing.tsx      # No X button needed
    └── email/
        ├── signin.tsx
        └── signup.tsx
```

### Root Layout Implementation

```typescript
// app/_layout.tsx
import { Stack } from "expo-router";
import { useConvexAuth } from "convex/react";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

function StackLayout() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  // Show nothing while auth state is loading
  if (isLoading) {
    return <SplashScreen />;  // Or null
  }

  return (
    <Stack screenOptions={{ animation: "fade" }}>
      {/* Auth screens - only when NOT authenticated */}
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false,
            gestureEnabled: false,  // Prevent swipe back
          }}
        />
      </Stack.Protected>

      {/* Main tabs - only when authenticated */}
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            gestureEnabled: false,  // Prevent swipe to auth
          }}
        />
      </Stack.Protected>
    </Stack>
  );
}
```

### Auth Screen (No Close Button)

```typescript
// app/(auth)/landing.tsx
export default function Landing() {
  // No X button - user MUST authenticate
  return (
    <View>
      <Text>Sign in to continue</Text>
      {/* Auth options only, no dismiss */}
    </View>
  );
}
```

### Automatic Navigation

With `Stack.Protected`, navigation happens automatically:
- When user signs in → `isAuthenticated` becomes `true` → tabs become visible
- When user signs out → `isAuthenticated` becomes `false` → auth screens become visible

```typescript
// No manual navigation needed after auth actions
await authClient.signIn.email({ email, password }, {
  onSuccess: () => {
    // Navigation happens automatically via Stack.Protected
    // No router.push() needed
  },
});
```

### Pros & Cons

**Pros:**
- Simpler screen implementations
- No need to handle unauthenticated states
- Clear user flow
- Automatic navigation on auth state change

**Cons:**
- Higher friction for new users
- Users can't preview content
- May reduce conversion rates

---

## Comparison Table

| Feature | Selective Auth | Auth-First |
|---------|---------------|------------|
| Initial screen | Tabs | Auth |
| Uses `Stack.Protected` | No | Yes |
| X button on auth | Yes | No |
| Navigation after auth | Manual or automatic | Automatic |
| `gestureEnabled` | Default (true) | false |
| Auth check location | Individual screens | Root layout |
| `presentation` for auth | `fullScreenModal` | Default (card) |

---

## Switching Between Patterns

### From Selective → Auth-First

1. Update `_layout.tsx` to use `Stack.Protected` guards
2. Remove X button from auth screens
3. Remove manual navigation calls after auth
4. Add `gestureEnabled: false` to prevent back navigation

### From Auth-First → Selective

1. Remove `Stack.Protected` guards from `_layout.tsx`
2. Add X button to auth screens with `router.dismiss()`
3. Set `presentation: "fullScreenModal"` for auth route
4. Add auth checks to individual screens as needed

---

## Common Patterns for Both

### Showing Login Prompt in Screens

```typescript
// components/AuthRequired.tsx
import { useConvexAuth } from "convex/react";
import { useRouter } from "expo-router";

interface AuthRequiredProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthRequired({ children, fallback }: AuthRequiredProps) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (!isAuthenticated) {
    return fallback || (
      <View>
        <Text>Please sign in to access this feature</Text>
        <Button onPress={() => router.push("/(auth)/landing")} title="Sign In" />
      </View>
    );
  }

  return <>{children}</>;
}
```

### Sign Out with Navigation

```typescript
// For Selective Auth
const handleSignOut = async () => {
  await authClient.signOut();
  // User stays on current screen or is redirected based on screen logic
};

// For Auth-First
const handleSignOut = async () => {
  await authClient.signOut();
  // Automatic navigation to auth via Stack.Protected
};
```

---

## Files Reference

### Selective Auth Pattern
- `app/_layout.tsx` - No guards, both routes always available
- `app/(auth)/landing.tsx` - Has X button with `router.dismiss()`
- `app/(auth)/_layout.tsx` - Standard stack
- Individual screens - Check `isAuthenticated` as needed

### Auth-First Pattern
- `app/_layout.tsx` - Uses `Stack.Protected` with `isAuthenticated` guard
- `app/(auth)/landing.tsx` - No X button
- `app/(auth)/_layout.tsx` - Standard stack
- Individual screens - Can assume user is authenticated

---

## Related Documentation

- [Expo Router Authentication](https://docs.expo.dev/router/reference/authentication/)
- [Better Auth Expo Guide](https://github.com/get-convex/better-auth/blob/main/docs/content/docs/framework-guides/expo.mdx)
- [Stack.Protected API](https://docs.expo.dev/router/advanced/stack/#protected-routes)
