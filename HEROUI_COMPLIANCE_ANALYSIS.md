# HeroUI Native Compliance Analysis

This document analyzes the recent refactoring work against HeroUI Native documentation and best practices.

## Executive Summary

The recent refactoring successfully centralized brand colors into `apps/native/theme/colors.ts` and removed code duplication. However, there are opportunities to better align with HeroUI Native's recommended patterns for theming, styling, and composition.

**Overall Assessment: Partially Compliant** - The current implementation works correctly but uses a parallel theming approach rather than HeroUI's CSS variable system.

---

## Current Implementation Analysis

### What Was Done

1. **Created centralized color constants** (`apps/native/theme/colors.ts`):
   ```typescript
   export const CUC_COLORS = {
     navy: "#06273a",
     sage: "#85b09a",
     cream: "#fffef8",
     white: "#ffffff",
   } as const;
   ```

2. **Removed color re-exports** from multiple files to use single source of truth
3. **Added TypeScript types** for color keys and values
4. **Fixed Biome lint errors** related to export patterns

### HeroUI Native's Recommended Approach

HeroUI Native uses a CSS variable-based theming system with semantic color names:

```css
/* HeroUI's approach - semantic CSS variables */
--background: oklch(1 0 0);
--foreground: oklch(0.145 0 0);
--accent: oklch(0.205 0 0);
--accent-foreground: oklch(0.985 0 0);
--surface: oklch(1 0 0);
--surface-foreground: oklch(0.145 0 0);
```

Accessed via:
```typescript
import { useThemeColor } from "heroui-native";

function MyComponent() {
  const backgroundColor = useThemeColor("background");
  const accentColor = useThemeColor("accent");
}
```

---

## Detailed Findings

### 1. Provider Configuration ✅ COMPLIANT

**Current Implementation** (`apps/native/app/_layout.tsx`):
```typescript
<HeroUINativeProvider
  config={{
    textProps: {
      allowFontScaling: false,
    },
  }}
>
```

**Assessment**: The provider is correctly configured at the root level with a single instance, following HeroUI best practices.

**Recommendation**: No changes needed. Configuration object is correctly defined outside the component.

---

### 2. Color/Theming System ⚠️ PARTIALLY COMPLIANT

**Current Approach**:
- Hardcoded `CUC_COLORS` object with brand-specific hex values
- Direct usage: `backgroundColor: CUC_COLORS.navy`
- No integration with HeroUI's CSS variable system

**HeroUI Approach**:
- Semantic CSS variables defined in `global.css`
- `useThemeColor` hook for runtime access
- Built-in dark/light mode support

**Risk Assessment**: LOW RISK
- Current approach works correctly
- Does not break any HeroUI functionality
- Runs in parallel to HeroUI's theming system

**Recommendations**:

| Priority | Action | Impact | Risk |
|----------|--------|--------|------|
| Low | Map CUC_COLORS to custom CSS variables | Enables theme switching | Low |
| Low | Consider `useThemeColor` hook adoption | Better HeroUI integration | Medium |
| None | No immediate changes required | System works as-is | None |

**If Migration Desired** (optional):

Add to `apps/native/global.css`:
```css
:root {
  /* CUC Brand Colors as CSS variables */
  --cuc-navy: #06273a;
  --cuc-sage: #85b09a;
  --cuc-cream: #fffef8;
  --cuc-white: #ffffff;

  /* Mapping to HeroUI semantic tokens */
  --accent: var(--cuc-sage);
  --accent-foreground: var(--cuc-navy);
  --background: var(--cuc-cream);
  --foreground: var(--cuc-navy);
  --surface: var(--cuc-white);
  --surface-foreground: var(--cuc-navy);
}
```

---

### 3. Styling Approach ⚠️ PARTIALLY COMPLIANT

**Current Approach**:
- Heavy use of inline `style` objects with React Native StyleSheet patterns
- Example from `signin.tsx`:
  ```typescript
  <Text style={{
    color: CUC_COLORS.sage,
    fontSize: 14,
    fontWeight: "500",
  }}>
  ```

**HeroUI Approach**:
- Prefers `className` with Tailwind/Uniwind utilities
- `cn()` utility for conditional classes
- Example:
  ```typescript
  <Text className="text-accent text-sm font-medium">
  ```

**Risk Assessment**: MEDIUM RISK
- Changing styling approach requires touching many files
- Could introduce visual regressions
- Benefits are maintainability, not functionality

**Recommendations**:

| Priority | Action | Impact | Risk |
|----------|--------|--------|------|
| None | Keep current inline styles | Working system | None |
| Future | Gradually adopt className on new components | Better consistency | Low |
| Future | Create Tailwind color utilities for CUC colors | Unified approach | Low |

**If Tailwind Integration Desired** (optional):

Add to `apps/native/tailwind.config.js`:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        cuc: {
          navy: "#06273a",
          sage: "#85b09a",
          cream: "#fffef8",
        },
      },
    },
  },
};
```

Then use as: `className="bg-cuc-navy text-cuc-cream"`

---

### 4. Component Composition ✅ COMPLIANT

**Current Usage**:
- `StyledTextInput` and `StyledButton` are custom components wrapping HeroUI primitives
- Proper prop forwarding with refs
- Clean interface extraction

**HeroUI Pattern**:
- Compound components with dot notation (e.g., `Button.Label`)
- `asChild` prop for composition

**Assessment**: Current approach is valid. Custom wrapper components are acceptable when they provide consistent styling and behavior across the app.

**Recommendation**: No changes needed. The abstraction level is appropriate.

---

### 5. Animation Configuration ✅ COMPLIANT

**Current Implementation**:
- Uses `react-native-reanimated` directly for custom animations
- Example from `events/index.tsx`:
  ```typescript
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  ```

**HeroUI Approach**:
- Built-in `animation` prop on components
- Global animation control via provider

**Assessment**: Direct reanimated usage is fine for custom animations. HeroUI's animation prop is for component-level animations, not custom gestures.

**Recommendation**: No changes needed.

---

### 6. Form Components ✅ COMPLIANT

**Current Implementation** (`components/form.tsx`):
- Custom `StyledTextInput` wrapping base TextInput
- Proper ref forwarding with `forwardRef`
- Clean props interface

**Assessment**: Follows React patterns correctly. The wrapper provides consistent styling and accessibility attributes.

**Recommendation**: No changes needed.

---

## Risk Matrix for Potential Changes

| Change | Benefit | Risk | Effort | Recommendation |
|--------|---------|------|--------|----------------|
| Keep current CUC_COLORS | None (already done) | None | None | ✅ Keep |
| Add CSS variables | Theme switching | Low | Low | 🔄 Optional |
| Use `useThemeColor` | HeroUI alignment | Medium | Medium | ⏸️ Defer |
| Convert to className | Consistency | Medium | High | ⏸️ Defer |
| Add Tailwind colors | Better DX | Low | Low | 🔄 Optional |

---

## Conclusion

### What's Working Well

1. **Centralized color management** - Single source of truth in `theme/colors.ts`
2. **Type safety** - Proper TypeScript types for colors
3. **Provider setup** - Correctly configured HeroUINativeProvider
4. **Component abstraction** - Clean form component wrappers
5. **Animation usage** - Appropriate use of reanimated

### No Breaking Changes Required

The current implementation does not conflict with HeroUI Native. It runs a parallel theming system that:
- Works correctly
- Is maintainable
- Is type-safe
- Does not break any HeroUI functionality

### Optional Future Enhancements

If the team wants deeper HeroUI integration in the future:

1. **Phase 1** (Low effort): Add CUC colors to `global.css` as CSS variables
2. **Phase 2** (Medium effort): Create a custom hook `useCUCColor()` that mirrors `useThemeColor`
3. **Phase 3** (High effort): Gradually migrate inline styles to className-based styling

These phases are optional and should be driven by specific needs (e.g., dark mode support, design system consistency).

---

## Files Reviewed

- `apps/native/theme/colors.ts`
- `apps/native/components/form.tsx`
- `apps/native/app/_layout.tsx`
- `apps/native/global.css`
- `apps/native/contexts/app-theme-context.tsx`
- `apps/native/app/(auth)/email/signin.tsx`
- `apps/native/app/(auth)/email/signup.tsx`
- `apps/native/app/(auth)/email/(reset)/reset-password.tsx`
- `apps/native/app/(tabs)/events/index.tsx`

## HeroUI Documentation Consulted

- Provider configuration and best practices
- Theming system (CSS variables, useThemeColor)
- Design principles (semantic intent, composition)
- Styling approaches (className, StyleSheet, cn utility)
- Animation configuration
- Component composition patterns
