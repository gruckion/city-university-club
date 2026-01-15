# Storybook Implementation Phases

This document outlines the phased implementation of Storybook across the monorepo, using CLI tools for generation and validating at each step with `type-check` and `lint:fix`.

---

## Overview

### Applications to Configure

| App | Location | Storybook Framework | Port |
|-----|----------|---------------------|------|
| Next.js Web Admin | `apps/web` | `@storybook/nextjs` | 6006 |
| Expo Native Mobile | `apps/native` | `@storybook/react-native` | Device |
| Expo Native Web | `apps/native` | `@storybook/react-native-web-vite` | 6007 |

### Validation Commands (Run After Each Phase)

```bash
# From monorepo root
bun run check-types          # TypeScript validation
bun biome check --write .    # Lint and format fix
```

---

## Phase 1: Next.js Web App - Basic Setup

**Goal:** Get Storybook running with auto-generated config using CLI.

### 1.1 Initialize Storybook via CLI

```bash
cd apps/web
npx storybook@latest init --builder vite --skip-install
bun install
```

The CLI will:
- Detect Next.js framework automatically
- Create `.storybook/main.ts` and `.storybook/preview.ts`
- Add required dependencies to `package.json`
- Create example stories (we'll replace these)

### 1.2 Validate Initial Setup

```bash
# Test Storybook runs
bun run storybook

# Validate types and lint
cd ../..
bun run check-types
bun biome check --write .
```

### 1.3 Configure Tailwind CSS v4

Update `.storybook/preview.ts` to import global styles:

```typescript
import "../src/index.css";
```

### 1.4 Create First Story (Button)

Create `apps/web/src/components/ui/button.stories.tsx` with basic variants.

### 1.5 Validate Phase 1

```bash
bun run check-types
bun biome check --write .
bun run storybook  # Visual verification
```

---

## Phase 2: Next.js Web App - Theme & Dark Mode

**Goal:** Add theme switching for light/dark mode testing.

### 2.1 Install Theme Addon

```bash
cd apps/web
bun add -d @storybook/addon-themes
```

### 2.2 Configure Theme Switching

Update `.storybook/main.ts` to include addon.
Update `.storybook/preview.ts` with `withThemeByClassName` decorator.

### 2.3 Validate Phase 2

```bash
bun run check-types
bun biome check --write .
```

---

## Phase 3: Next.js Web App - All UI Component Stories

**Goal:** Create stories for every UI component with full variant coverage.

### Components to Document

| Component | Variants/States | Priority |
|-----------|-----------------|----------|
| `button.tsx` | 6 variants, 8 sizes, disabled, loading, with icon | High |
| `input.tsx` | text, email, password, disabled, with label | High |
| `label.tsx` | default, required indicator | Medium |
| `card.tsx` | with header, footer, simple | High |
| `checkbox.tsx` | checked, unchecked, disabled, indeterminate | Medium |
| `dropdown-menu.tsx` | open, closed, with items, nested | Medium |
| `skeleton.tsx` | line, circle, card shapes | Low |
| `sonner.tsx` | success, error, warning, info toasts | Medium |

### 3.1 Create Stories for Each Component

Each story file should include:
- Default state
- All variants
- All sizes (if applicable)
- Disabled state
- Loading state (if applicable)
- Error state (if applicable)
- Composition examples
- Dark mode appearance

### 3.2 Validate Phase 3

```bash
bun run check-types
bun biome check --write .
```

---

## Phase 4: Next.js Web App - Feature Component Stories

**Goal:** Document composed/feature components.

### Components to Document

| Component | Description | Dependencies |
|-----------|-------------|--------------|
| `sign-in-form.tsx` | Auth sign-in form | Input, Button, Card |
| `sign-up-form.tsx` | Auth sign-up form | Input, Button, Card |
| `user-menu.tsx` | User dropdown menu | DropdownMenu, Button |
| `header.tsx` | Page header | Multiple |
| `mode-toggle.tsx` | Theme toggle button | Button, DropdownMenu |
| `loader.tsx` | Loading indicator | Skeleton |

### 4.1 Create Feature Component Stories

Include interaction states and realistic data.

### 4.2 Validate Phase 4

```bash
bun run check-types
bun biome check --write .
```

---

## Phase 5: Next.js Web App - Interaction Testing

**Goal:** Add play functions for automated component testing.

### 5.1 Install Testing Addons

```bash
cd apps/web
bun add -d @storybook/test @storybook/addon-interactions
```

### 5.2 Add Play Functions to Stories

Example for sign-in form:

```typescript
export const FilledForm: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(
      canvas.getByLabelText(/email/i),
      "test@example.com"
    );
    await userEvent.type(
      canvas.getByLabelText(/password/i),
      "password123"
    );
    await userEvent.click(canvas.getByRole("button", { name: /sign in/i }));

    await expect(canvas.getByRole("button")).toBeDisabled();
  },
};
```

### 5.3 Validate Phase 5

```bash
bun run check-types
bun biome check --write .
bun run storybook  # Run interaction tests visually
```

---

## Phase 6: Next.js Web App - Accessibility Testing

**Goal:** Add automated accessibility auditing.

### 6.1 Install A11y Addon

```bash
cd apps/web
bun add -d @storybook/addon-a11y
```

### 6.2 Configure A11y Addon

Add to `.storybook/main.ts` addons array.

### 6.3 Review and Fix A11y Issues

Run Storybook, check A11y panel for each component, fix violations.

### 6.4 Validate Phase 6

```bash
bun run check-types
bun biome check --write .
```

---

## Phase 7: Next.js Web App - Documentation (MDX)

**Goal:** Add rich documentation with MDX files.

### 7.1 Create Documentation Structure

```
apps/web/src/
├── docs/
│   ├── Introduction.mdx
│   ├── Colors.mdx
│   ├── Typography.mdx
│   └── GettingStarted.mdx
```

### 7.2 Configure Autodocs

Update stories to use `tags: ["autodocs"]` for auto-generated docs.

### 7.3 Create Component Documentation Pages

Add detailed usage guidelines, do's and don'ts, accessibility notes.

### 7.4 Validate Phase 7

```bash
bun run check-types
bun biome check --write .
```

---

## Phase 8: Expo Native App - Basic Setup

**Goal:** Initialize Storybook for React Native with on-device UI.

### 8.1 Initialize Storybook via CLI

```bash
cd apps/native
npx storybook@latest init --type react_native
bun install
```

### 8.2 Update Metro Configuration

The CLI should update `metro.config.cjs`, but verify `withStorybook` is properly integrated with existing UniWind config.

### 8.3 Generate Storybook Requirements File

```bash
npx sb-rn-get-stories
```

### 8.4 Add Environment Toggle

Create mechanism to switch between app mode and Storybook mode.

### 8.5 Validate Phase 8

```bash
bun run check-types
bun biome check --write .
STORYBOOK=true expo start  # Test on device/simulator
```

---

## Phase 9: Expo Native App - Theme Integration

**Goal:** Configure Storybook to use CUC brand colors and UniWind styles.

### 9.1 Configure Preview with Brand Theme

Update `.storybook/preview.tsx`:
- Import CUC_COLORS
- Set background values
- Configure decorators for consistent styling

### 9.2 Test UniWind Style Rendering

Verify Tailwind classes render correctly in stories.

### 9.3 Validate Phase 9

```bash
bun run check-types
bun biome check --write .
```

---

## Phase 10: Expo Native App - Form Component Stories

**Goal:** Document all form-related components.

### Components to Document

| Component | Location | Features |
|-----------|----------|----------|
| `StyledButton` | `form.tsx` | primary, secondary, tertiary, loading |
| `StyledTextInput` | `form.tsx` | text, email, password, with label |
| `FormContainer` | `form.tsx` | layout wrapper |
| `FormHeader` | `form.tsx` | title, subtitle |
| `KeyboardAwareForm` | `keyboard/` | platform-specific behavior |

### 10.1 Create Form Stories

With interactive state management for controlled inputs.

### 10.2 Validate Phase 10

```bash
bun run check-types
bun biome check --write .
```

---

## Phase 11: Expo Native App - UI Component Stories

**Goal:** Document remaining UI components.

### Components to Document

| Component | Features |
|-----------|----------|
| `CategoryFilter.tsx` | Animated chips, selection state, Reanimated |
| `MembershipCard.tsx` | Card layout, user data display |
| `ExternalLinkButton.tsx` | Link handling |
| `LastUsedIndicator.tsx` | Status indicator |
| `container.tsx` | Layout wrapper |
| `theme-toggle.tsx` | Theme switching |

### 11.1 Create UI Stories

Include animation states where applicable.

### 11.2 Validate Phase 11

```bash
bun run check-types
bun biome check --write .
```

---

## Phase 12: Expo Native App - Screen/Feature Stories

**Goal:** Document composed screen components.

### Components to Document

| Component | Description |
|-----------|-------------|
| `sign-in.tsx` | Complete sign-in screen |
| `sign-up.tsx` | Complete sign-up screen |

### 12.1 Create Screen Stories

With mocked navigation and auth contexts.

### 12.2 Validate Phase 12

```bash
bun run check-types
bun biome check --write .
```

---

## Phase 13: Expo Native Web Storybook

**Goal:** Set up web-based Storybook for native components (for documentation sharing).

### 13.1 Install React Native Web Vite Framework

```bash
cd apps/native
bun add -d @storybook/react-native-web-vite react-native-web react-dom
```

### 13.2 Create Separate Web Config

Create `.storybook-web/` directory with web-specific config.

### 13.3 Configure Vite for React Native Web

Handle module aliases and polyfills.

### 13.4 Validate Phase 13

```bash
bun run check-types
bun biome check --write .
bun run storybook:web-ui  # Test in browser
```

---

## Phase 14: Turborepo Integration

**Goal:** Add Storybook tasks to Turborepo for orchestrated builds.

### 14.1 Update turbo.json

Add `storybook` (dev), `storybook:build` (production) tasks.

### 14.2 Update Root package.json

Add convenience scripts for running Storybook across apps.

### 14.3 Update .gitignore

Add `storybook-static/`, `storybook.requires.ts`.

### 14.4 Update biome.jsonc

Ignore generated Storybook files from linting.

### 14.5 Validate Phase 14

```bash
bun run check-types
bun biome check --write .
bun run storybook:web      # Test turbo task
bun run storybook:native   # Test turbo task
```

---

## Phase 15: Static Build & Deployment

**Goal:** Configure production builds for Storybook.

### 15.1 Test Static Builds

```bash
bun run storybook:build:web
bun run storybook:build:native-web
```

### 15.2 Configure Deployment (Optional)

Options:
- Vercel (auto-deploy on PR)
- Netlify
- GitHub Pages
- Chromatic (visual testing + hosting)

### 15.3 Validate Phase 15

```bash
# Verify static builds work
npx serve apps/web/storybook-static
npx serve apps/native/storybook-static
```

---

## Phase 16: Visual Regression Testing (Optional)

**Goal:** Add Chromatic or similar for visual diff testing.

### 16.1 Set Up Chromatic

```bash
npx chromatic --project-token=<token>
```

### 16.2 Configure CI Integration

Add to GitHub Actions or similar.

### 16.3 Validate Phase 16

Run visual tests, review baselines.

---

## Phase 17: Final Polish & Documentation

**Goal:** Complete documentation and clean up.

### 17.1 Update README

Add Storybook section with commands.

### 17.2 Create Contributing Guide

Document how to add new stories.

### 17.3 Review All Stories

Ensure consistency across all stories.

### 17.4 Final Validation

```bash
bun run check-types
bun biome check --write .
bun run build  # Ensure no conflicts with main build
```

---

## Command Reference

### Development

```bash
# Next.js Web App
bun run storybook:web           # Dev server on :6006

# Expo Native (on-device)
bun run storybook:native        # Expo Go
bun run storybook:native:ios    # iOS Simulator
bun run storybook:native:android # Android Emulator

# Expo Native (web UI)
bun run storybook:native:web-ui # Browser on :6007
```

### Production Builds

```bash
bun run storybook:build         # All apps
bun run storybook:build:web     # Web only
bun run storybook:build:native  # Native web UI only
```

### Validation

```bash
bun run check-types             # TypeScript
bun biome check --write .       # Lint + format
```

---

## Estimated Timeline

| Phase | Description | Complexity |
|-------|-------------|------------|
| 1-2 | Web basic + themes | Low |
| 3-4 | Web components | Medium |
| 5-7 | Web testing + docs | Medium |
| 8-9 | Native basic + themes | Medium |
| 10-12 | Native components | Medium |
| 13 | Native web UI | Medium |
| 14-15 | Integration + builds | Low |
| 16-17 | Visual testing + polish | Low |

---

## Validation Checklist (Run After Every Phase)

- [ ] `bun run check-types` passes
- [ ] `bun biome check --write .` passes
- [ ] Storybook dev server runs without errors
- [ ] All stories render correctly
- [ ] No console errors in browser/device
- [ ] Dark mode works (where applicable)
- [ ] Interactive controls work
