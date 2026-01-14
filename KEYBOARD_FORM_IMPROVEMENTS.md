# Keyboard & Form Improvements Plan

This document outlines the planned improvements to keyboard handling and form submission behavior in the native Expo app.

## Problem Statement

When using the iOS simulator (and native devices), users cannot submit the login form by pressing Enter/Return on the keyboard. They must physically tap the "Sign In" button. This is a poor user experience, especially when using a hardware keyboard.

## Features to Implement

| # | Feature | Description | Platform |
|---|---------|-------------|----------|
| 1 | **Enter/Return key submission** | Pressing Enter/Return submits the login form | iOS, Android, Web |
| 2 | **Keyboard toolbar** | Previous/Next/Done buttons above keyboard for field navigation | iOS, Android |
| 3 | **Auto-scroll to focused input** | Content scrolls automatically when keyboard opens | iOS, Android |
| 4 | **Dismiss keyboard on drag** | Swipe down to dismiss the keyboard | iOS, Android |
| 5 | **Cross-platform support** | All features work appropriately on each platform | All |

## Technical Approach

### React 19: No forwardRef Required

React 19 (which we're using - v19.1.0) deprecates `forwardRef`. Refs can now be passed directly as props:

```tsx
// React 19 - No forwardRef wrapper needed
function StyledTextInput({ label, ref, ...props }) {
  return (
    <View>
      <Text>{label}</Text>
      <TextInput ref={ref} {...props} />
    </View>
  );
}
```

### Expo Platform-Specific File Extensions

Following Expo's official documentation, we use platform-specific file extensions:

- `Component.tsx` — Web bundler picks this (fallback)
- `Component.native.tsx` — Metro bundler picks this (iOS + Android)

This approach:
- Zero runtime overhead (resolved at build time)
- Perfect tree-shaking (web bundle never sees native-only code)
- Type-safe (each file has proper types for its platform)
- Official Expo/React Native pattern

### Library: react-native-keyboard-controller

Already installed (v1.18.5). Provides:
- `KeyboardProvider` — Root wrapper for keyboard functionality
- `KeyboardAwareScrollView` — Auto-scrolls to focused input
- `KeyboardToolbar` — Previous/Next/Done navigation buttons
- `KeyboardGestureArea` — Dismiss keyboard on drag (Android 11+)

**Note:** This library only supports iOS and Android, not web. We handle this with platform-specific files.

---

## Files to Create

### 1. `apps/native/components/keyboard/KeyboardAwareForm.native.tsx`

Native implementation using react-native-keyboard-controller.

```tsx
import { ReactNode } from "react";
import {
  KeyboardAwareScrollView,
  KeyboardToolbar,
} from "react-native-keyboard-controller";
import { StyleSheet } from "react-native";

interface KeyboardAwareFormProps {
  children: ReactNode;
  bottomOffset?: number;
}

export function KeyboardAwareForm({
  children,
  bottomOffset = 62
}: KeyboardAwareFormProps) {
  return (
    <>
      <KeyboardAwareScrollView
        bottomOffset={bottomOffset}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </KeyboardAwareScrollView>
      <KeyboardToolbar>
        <KeyboardToolbar.Prev />
        <KeyboardToolbar.Next />
        <KeyboardToolbar.Done />
      </KeyboardToolbar>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});
```

### 2. `apps/native/components/keyboard/KeyboardAwareForm.tsx`

Web fallback using standard ScrollView.

```tsx
import { ReactNode } from "react";
import { ScrollView, StyleSheet } from "react-native";

interface KeyboardAwareFormProps {
  children: ReactNode;
  bottomOffset?: number;
}

export function KeyboardAwareForm({
  children,
  bottomOffset: _bottomOffset, // Unused on web
}: KeyboardAwareFormProps) {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );
  // No KeyboardToolbar on web - browsers handle keyboard natively
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});
```

### 3. `apps/native/components/keyboard/index.ts`

Re-export for clean imports.

```tsx
export { KeyboardAwareForm } from "./KeyboardAwareForm";
```

---

## Files to Modify

### 1. `apps/native/app/_layout.tsx`

**Change:** Wrap app with `KeyboardProvider` from react-native-keyboard-controller.

**Current state:** No KeyboardProvider

**Required change:** Add KeyboardProvider wrapper (only on native platforms)

```tsx
import { KeyboardProvider } from "react-native-keyboard-controller";

// Wrap the root layout content with KeyboardProvider
<KeyboardProvider>
  {/* existing app content */}
</KeyboardProvider>
```

**Note:** May need platform-specific handling since KeyboardProvider is native-only.

---

### 2. `apps/native/components/form.tsx`

**Change:** Update `StyledTextInput` to accept keyboard-related props and ref.

**Current props (lines 66-86):**
```tsx
export function StyledTextInput({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  autoCorrect,
  textContentType,
  autoComplete,
}: { ... })
```

**New props to add:**
```tsx
export function StyledTextInput({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  autoCorrect,
  textContentType,
  autoComplete,
  // NEW: Keyboard navigation props
  ref,                    // React 19 style - no forwardRef needed
  returnKeyType,          // "next" | "go" | "done" | "search" | "send"
  onSubmitEditing,        // Callback when Enter/Return pressed
  blurOnSubmit,           // Whether to blur on submit (default: true)
}: { ... })
```

**Forward these props to the underlying TextInput:**
```tsx
<TextInput
  ref={ref}
  returnKeyType={returnKeyType}
  onSubmitEditing={onSubmitEditing}
  blurOnSubmit={blurOnSubmit}
  // ... existing props
/>
```

---

### 3. `apps/native/app/(auth)/email/signin.tsx`

**Change:** Implement keyboard-aware form with Enter key submission.

**Current structure (lines 89-167):**
- Uses `FormContainer` (basic View wrapper)
- Two `StyledTextInput` components (email, password)
- `StyledButton` for submission
- No keyboard navigation

**New structure:**
```tsx
import { useRef } from "react";
import { TextInput } from "react-native";
import { KeyboardAwareForm } from "@/components/keyboard";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Ref for focusing password field
  const passwordRef = useRef<TextInput>(null);

  const handleSignIn = async () => { /* existing logic */ };

  return (
    <KeyboardAwareForm>
      <FormHeader
        title="Welcome Back"
        description="Sign in to access your membership and exclusive club features"
      />

      <StyledTextInput
        label="Email Address"
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        textContentType="emailAddress"
        autoComplete="email"
        // NEW: Keyboard navigation
        returnKeyType="next"
        blurOnSubmit={false}
        onSubmitEditing={() => passwordRef.current?.focus()}
      />

      <StyledTextInput
        ref={passwordRef}
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        textContentType="password"
        autoComplete="password"
        // NEW: Submit on Enter
        returnKeyType="go"
        onSubmitEditing={handleSignIn}
      />

      <View style={{ marginTop: 8 }}>
        <StyledButton
          onPress={handleSignIn}
          label="Sign In"
          isLoading={isLoading}
        />
      </View>

      {/* ... rest of component (forgot password link, sign up link) */}
    </KeyboardAwareForm>
  );
}
```

---

### 4. `apps/native/app/(auth)/email/signup.tsx`

**Change:** Same pattern as signin.tsx for the signup form.

**Current structure (lines 96-180):**
- Uses `KeyboardAvoidingView` + `ScrollView`
- Four `StyledTextInput` components (name, email, password, confirmPassword)
- No keyboard navigation between fields

**New structure:**
- Replace `KeyboardAvoidingView` + `ScrollView` with `KeyboardAwareForm`
- Add refs for each field after the first
- Chain `onSubmitEditing` handlers: name → email → password → confirmPassword → submit
- Use `returnKeyType="next"` for all fields except last
- Use `returnKeyType="go"` on confirmPassword field

```tsx
const emailRef = useRef<TextInput>(null);
const passwordRef = useRef<TextInput>(null);
const confirmPasswordRef = useRef<TextInput>(null);

// Field chain:
// Name:            returnKeyType="next"  → focus email
// Email:           returnKeyType="next"  → focus password
// Password:        returnKeyType="next"  → focus confirmPassword
// ConfirmPassword: returnKeyType="go"    → handleSignUp
```

---

## Summary of Changes

| File | Action | Description |
|------|--------|-------------|
| `components/keyboard/KeyboardAwareForm.native.tsx` | **Create** | Native keyboard handling with toolbar |
| `components/keyboard/KeyboardAwareForm.tsx` | **Create** | Web fallback with basic ScrollView |
| `components/keyboard/index.ts` | **Create** | Re-exports |
| `app/_layout.tsx` | **Modify** | Add KeyboardProvider wrapper |
| `components/form.tsx` | **Modify** | Add ref, returnKeyType, onSubmitEditing, blurOnSubmit props |
| `app/(auth)/email/signin.tsx` | **Modify** | Use KeyboardAwareForm, add field refs and keyboard handlers |
| `app/(auth)/email/signup.tsx` | **Modify** | Same pattern as signin.tsx |

---

## Testing Plan

### iOS Simulator
1. Open sign-in screen
2. Tap email field → keyboard appears with "Next" button
3. Press Enter/Return → focus moves to password field
4. Press Enter/Return → form submits
5. Verify Previous/Next/Done toolbar appears above keyboard
6. Verify scrolling when keyboard covers input

### Android Emulator
1. Same tests as iOS
2. Verify KeyboardGestureArea allows swipe-to-dismiss (Android 11+)

### Web Browser
1. Open sign-in screen
2. Tab between fields works
3. Press Enter in password field → form submits
4. No JavaScript errors from native-only imports

---

## Dependencies

Already installed:
- `react-native-keyboard-controller`: ^1.18.5
- `react-native-reanimated`: ~4.1.1 (required by keyboard-controller)
- `react`: 19.1.0 (supports ref as prop)

No new dependencies required.

---

## References

- [Expo Platform-Specific Modules](https://docs.expo.dev/router/advanced/platform-specific-modules/)
- [React Native TextInput](https://reactnative.dev/docs/textinput)
- [react-native-keyboard-controller Docs](https://kirillzyusko.github.io/react-native-keyboard-controller/)
- [React 19 ref as prop](https://react.dev/blog/2024/12/05/react-19)
