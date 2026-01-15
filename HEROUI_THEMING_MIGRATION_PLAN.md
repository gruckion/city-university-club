# HeroUI Native Theming Migration Plan

This document outlines the migration from hardcoded `CUC_COLORS` to HeroUI Native's idiomatic theming system with light/dark mode support.

## Idiomatic Approach (Per HeroUI Documentation)

**Primary method: `className` with Tailwind CSS utilities**

> "HeroUI Native is built with `className` as the go-to styling solution."
> — [HeroUI Native Styling Docs](https://v3.heroui.com/docs/native/getting-started/styling)

**Secondary method: `useThemeColor` hook** — Only for scenarios where className cannot be used (icons, third-party components, dynamic calculations).

**DO NOT create custom hook wrappers** — Use `useThemeColor` directly from `heroui-native`.

---

## Current Brand Colors (Baseline - Must Be Preserved)

| Color Name | Hex Value | Current Usage |
|------------|-----------|---------------|
| Navy | `#06273a` | Headers, tab bar, text on light bg, overlays |
| Sage | `#85b09a` | Accent text, links, highlights |
| Cream | `#fffef8` | Page backgrounds, text on dark bg |
| White | `#ffffff` | Cards, inputs, surfaces |
| Muted | `#666666` | Secondary text |
| Border | `#e5e5e5` | Input borders |

---

## Phase 1: Define CSS Variables in global.css

### File: `apps/native/global.css`

```css
@import "tailwindcss";
@import "uniwind";
@import "heroui-native/styles";

@source "./node_modules/heroui-native/lib";

/* ============================================
   City University Club Brand Theme

   These CSS variables integrate with HeroUI's
   theming system. Use className with Tailwind
   utilities (bg-background, text-foreground, etc.)
   ============================================ */

:root {
  /* Brand constants (theme-independent) */
  --cuc-navy: #06273a;
  --cuc-sage: #85b09a;
  --cuc-cream: #fffef8;

  /* Light mode semantic tokens */
  --background: #fffef8;           /* cream - page backgrounds */
  --foreground: #06273a;           /* navy - primary text */
  --accent: #85b09a;               /* sage - links, highlights */
  --accent-foreground: #06273a;    /* navy - text on accent bg */
  --surface: #ffffff;              /* white - cards, inputs */
  --surface-foreground: #06273a;   /* navy - text on surfaces */
  --muted: #666666;                /* gray - secondary text */
  --border: #e5e5e5;               /* light gray - borders */

  /* Primary brand (locked - always navy for tab bar, headers) */
  --primary: #06273a;
  --primary-foreground: #fffef8;
}

.dark {
  /* Dark mode semantic tokens */
  --background: #06273a;           /* navy - page backgrounds */
  --foreground: #fffef8;           /* cream - primary text */
  --accent: #85b09a;               /* sage - links, highlights */
  --accent-foreground: #06273a;    /* navy - text on accent bg */
  --surface: #0a3d54;              /* lighter navy - cards */
  --surface-foreground: #fffef8;   /* cream - text on surfaces */
  --muted: #85b09a;                /* sage - secondary text */
  --border: #1a4d64;               /* dark blue - borders */

  /* Primary brand stays the same */
  --primary: #06273a;
  --primary-foreground: #fffef8;
}
```

---

## Phase 2: Migration Patterns

### Pattern A: Backgrounds (Use className)

**Before:**
```tsx
<View style={{ backgroundColor: CUC_COLORS.cream }}>
```

**After:**
```tsx
<View className="bg-background">
```

### Pattern B: Text Colors (Use className)

**Before:**
```tsx
<Text style={{ color: CUC_COLORS.navy, fontSize: 16, fontWeight: "600" }}>
```

**After:**
```tsx
<Text className="text-foreground text-base font-semibold">
```

### Pattern C: Icons (Use useThemeColor - only exception)

**Before:**
```tsx
<Ionicons color={CUC_COLORS.navy} name="home" size={24} />
```

**After:**
```tsx
import { useThemeColor } from "heroui-native";

const foreground = useThemeColor("foreground");
<Ionicons color={foreground} name="home" size={24} />
```

### Pattern D: Mixed (className for colors, style for layout)

**Before:**
```tsx
<View style={{
  backgroundColor: CUC_COLORS.white,
  borderRadius: 12,
  padding: 16,
  shadowColor: "#000",
  shadowOpacity: 0.1,
}}>
```

**After:**
```tsx
<View
  className="bg-surface"
  style={{
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
  }}
>
```

### Pattern E: Conditional Colors (Use useThemeColor for dynamic scenarios)

**Before:**
```tsx
backgroundColor: featured ? CUC_COLORS.navy : CUC_COLORS.white,
```

**After:**
```tsx
const primary = useThemeColor("primary");
const surface = useThemeColor("surface");
// ...
backgroundColor: featured ? primary : surface,
```

---

## Phase 3: Color Mapping Reference

| Old Code | New className | New useThemeColor | When to Use |
|----------|---------------|-------------------|-------------|
| `CUC_COLORS.cream` (bg) | `bg-background` | `useThemeColor("background")` | className preferred |
| `CUC_COLORS.navy` (text) | `text-foreground` | `useThemeColor("foreground")` | className for Text, hook for Icons |
| `CUC_COLORS.navy` (bg) | `bg-primary` | `useThemeColor("primary")` | Tab bar, headers (brand-locked) |
| `CUC_COLORS.sage` | `text-accent` / `bg-accent` | `useThemeColor("accent")` | Accent elements |
| `CUC_COLORS.white` | `bg-surface` | `useThemeColor("surface")` | Cards, inputs |
| `"#666"` / `"#888"` | `text-muted` | `useThemeColor("muted")` | Secondary text |
| `"#e5e5e5"` | `border-border` | `useThemeColor("border")` | Borders |

---

## Phase 4: Files to Update (27 files)

### Files with Local CUC_COLORS Duplicates (Remove constant, use theme)
- `app/(tabs)/_layout.tsx`
- `app/(auth)/landing.tsx`
- `components/ExternalLinkButton.tsx`

### Files Importing from @/theme/colors (Update imports, use theme)
- `components/form.tsx`
- `components/CategoryFilter.tsx`
- `components/MembershipCard.tsx`
- `app/(tabs)/index.tsx`
- `app/(tabs)/events/index.tsx`
- `app/(tabs)/events/[id].tsx`
- `app/(tabs)/menu/index.tsx`
- `app/(tabs)/menu/[category].tsx`
- `app/(tabs)/menu/_layout.tsx`
- `app/(tabs)/more/index.tsx`
- `app/(tabs)/more/membership.tsx`
- `app/(tabs)/more/about.tsx`
- `app/(tabs)/more/bugle.tsx`
- `app/(tabs)/more/contact.tsx`
- `app/(tabs)/more/dining-room.tsx`
- `app/(tabs)/more/fabric-fund.tsx`
- `app/(tabs)/more/reciprocal-clubs.tsx`
- `app/(auth)/email/_layout.tsx`
- `app/(auth)/email/signin.tsx`
- `app/(auth)/email/signup.tsx`
- `app/(auth)/email/(reset)/request-password-reset.tsx`
- `app/(auth)/email/(reset)/reset-password.tsx`
- `app/(auth)/email/(reset)/verify-reset-code.tsx`

### Files to Delete
- `theme/colors.ts`
- `theme/index.ts`

---

## Phase 5: Subagent Work Distribution

### Subagent 1: Foundation + Core Components
- `global.css` (CSS variables)
- `components/form.tsx`
- `components/CategoryFilter.tsx`
- `components/MembershipCard.tsx`
- `components/ExternalLinkButton.tsx`

### Subagent 2: Tab Layouts + Menu
- `app/(tabs)/_layout.tsx`
- `app/(tabs)/index.tsx`
- `app/(tabs)/menu/_layout.tsx`
- `app/(tabs)/menu/index.tsx`
- `app/(tabs)/menu/[category].tsx`

### Subagent 3: Events + More (part 1)
- `app/(tabs)/events/index.tsx`
- `app/(tabs)/events/[id].tsx`
- `app/(tabs)/more/index.tsx`
- `app/(tabs)/more/membership.tsx`

### Subagent 4: More Screens (part 2)
- `app/(tabs)/more/about.tsx`
- `app/(tabs)/more/bugle.tsx`
- `app/(tabs)/more/contact.tsx`
- `app/(tabs)/more/dining-room.tsx`
- `app/(tabs)/more/fabric-fund.tsx`
- `app/(tabs)/more/reciprocal-clubs.tsx`

### Subagent 5: Auth Screens
- `app/(auth)/landing.tsx`
- `app/(auth)/_layout.tsx`
- `app/(auth)/email/_layout.tsx`
- `app/(auth)/email/signin.tsx`
- `app/(auth)/email/signup.tsx`
- `app/(auth)/email/(reset)/request-password-reset.tsx`
- `app/(auth)/email/(reset)/reset-password.tsx`
- `app/(auth)/email/(reset)/verify-reset-code.tsx`

---

## Phase 6: Verification Protocol

After EACH subagent batch:
1. Run `bun run check-types` - must pass with no errors
2. Run `bun biome check --write .` - must pass with no errors
3. Take iOS simulator screenshot - compare to baseline
4. UI must be IDENTICAL to before (this is a refactor, not a redesign)

---

## Phase 7: Add Theme Toggle (After Migration)

Add theme toggle to More screen using existing `AppThemeContext`:

```tsx
import { Switch } from "react-native";
import { useThemeColor } from "heroui-native";
import { useAppTheme } from "@/contexts/app-theme-context";

// In More screen, add before Sign Out:
const { colorScheme, toggleColorScheme } = useAppTheme();
const foreground = useThemeColor("foreground");
const muted = useThemeColor("muted");

<View className="bg-surface rounded-xl p-4 mb-3 flex-row items-center justify-between">
  <View className="flex-row items-center gap-3.5">
    <View className="w-11 h-11 rounded-full bg-foreground/10 items-center justify-center">
      <Ionicons
        color={foreground}
        name={colorScheme === "dark" ? "moon" : "sunny"}
        size={22}
      />
    </View>
    <View>
      <Text className="text-foreground text-base font-medium">Dark Mode</Text>
      <Text className="text-muted text-sm mt-0.5">
        {colorScheme === "dark" ? "On" : "Off"}
      </Text>
    </View>
  </View>
  <Switch
    value={colorScheme === "dark"}
    onValueChange={toggleColorScheme}
  />
</View>
```

---

## Important Rules

1. **UI Must Not Change** — This is a refactor. The visual appearance must remain identical by using the exact same hex color values in CSS variables.

2. **className is Primary** — Use Tailwind utilities (`bg-background`, `text-foreground`) as the default approach.

3. **useThemeColor for Icons Only** — The hook is only for `Ionicons` and components that don't accept className.

4. **NO Custom Hook Wrappers** — Do NOT create `useCUCTheme()` or any wrapper. Use `useThemeColor` directly from `heroui-native`.

5. **Verify After Each Batch** — Run type check, lint, and compare screenshots before proceeding.

---

## Cleanup After Migration

1. Delete `apps/native/theme/colors.ts`
2. Delete `apps/native/theme/index.ts`
3. Verify no remaining `CUC_COLORS` references: `grep -r "CUC_COLORS" apps/native/`
