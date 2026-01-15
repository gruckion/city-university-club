# Storybook with Next.js: Comprehensive Research Report (2025-2026)

> **Research Date:** January 2025
> **Latest Storybook Version:** 10.1.x (ESM-only)
> **Target Next.js Versions:** 14.x, 15.x, 16.x

---

## Executive Summary

Storybook has undergone significant evolution in 2025, with version 10 marking a major milestone by going **ESM-only**. This transition reduces package size by approximately 29% (on top of the 50% reduction in Storybook 9) and simplifies the codebase. For Next.js applications, the **`@storybook/nextjs-vite`** framework is now the recommended approach, offering faster builds, modern tooling, and better test support compared to the legacy Webpack-based framework.

### Key Takeaways

1. **Use `@storybook/nextjs-vite`** for most Next.js projects (Vite-powered, faster, better testing support)
2. **Node.js 20.19+ or 22.12+** is required for Storybook 10
3. **ESM-only** configuration is mandatory - all config files must be valid ESM
4. **React Server Components (RSC)** are supported via the `experimentalRSC` feature flag
5. **Tailwind CSS v4** requires the `@tailwindcss/vite` plugin configured in Storybook's `viteFinal`
6. **Turborepo integration** is straightforward with proper cache configuration

---

## Table of Contents

1. [Latest Storybook Versions and ESM Support](#1-latest-storybook-versions-and-esm-support)
2. [Framework Choice: Vite vs Webpack](#2-framework-choice-vite-vs-webpack)
3. [Step-by-Step Setup Guide](#3-step-by-step-setup-guide)
4. [App Router and RSC Considerations](#4-app-router-and-rsc-considerations)
5. [Tailwind CSS v4 Integration](#5-tailwind-css-v4-integration)
6. [Turborepo/Monorepo Setup](#6-turborepomonorepo-setup)
7. [Testing with Vitest Addon](#7-testing-with-vitest-addon)
8. [Performance Optimization](#8-performance-optimization)
9. [Known Issues and Workarounds](#9-known-issues-and-workarounds)
10. [References](#10-references)

---

## 1. Latest Storybook Versions and ESM Support

### Version Timeline

| Version | Release | Key Features |
|---------|---------|--------------|
| **10.x** | Nov 2025 | ESM-only, 29% smaller, Module Automocking, CSF Factories |
| **9.x** | Jul 2025 | 48% leaner, Vite-powered Next.js integration, Vitest addon |
| **8.x** | 2024 | RSC experimental support, @storybook/nextjs framework |

### ESM-Only in Storybook 10

Starting with Storybook 10, **all published code is ESM-only**. This is the main breaking change and delivers:

- **29% smaller install size** compared to v9
- **Readable, unminified code** for better debugging
- **Simplified maintenance** without dual CJS/ESM builds

#### Node.js Requirements

```
Node.js 20.19+ or 22.12+ or 24+
```

These versions support `require(esm)` without flags, enabling backward compatibility.

#### Required Changes for ESM

1. **Configuration files must be valid ESM:**
   ```typescript
   // .storybook/main.ts - MUST use ESM syntax
   import type { StorybookConfig } from '@storybook/nextjs-vite';

   const config: StorybookConfig = {
     // ...
   };

   export default config;
   ```

2. **Relative imports require file extensions:**
   ```typescript
   // Before (may not work)
   import { myHelper } from './helpers';

   // After (ESM compliant)
   import { myHelper } from './helpers.js';
   ```

3. **TypeScript moduleResolution update:**
   ```json
   // tsconfig.json
   {
     "compilerOptions": {
       "moduleResolution": "bundler" // or "node16", "nodenext"
     }
   }
   ```

---

## 2. Framework Choice: Vite vs Webpack

### Recommended: `@storybook/nextjs-vite`

The Vite-based framework is **recommended for most Next.js projects** as of 2025.

| Feature | `@storybook/nextjs-vite` | `@storybook/nextjs` (Webpack) |
|---------|--------------------------|-------------------------------|
| Build Speed | Faster (Vite) | Slower (Webpack) |
| HMR | Instant | Slower |
| Vitest Support | Full | Limited |
| Configuration | Simpler | More complex |
| Bundle Size | Smaller | Larger |

### When to Use Webpack-based Framework

Use `@storybook/nextjs` (Webpack) only if:

- Your project has custom Webpack configurations incompatible with Vite
- You require custom Babel configurations
- You need specific Webpack features not available in Vite

---

## 3. Step-by-Step Setup Guide

### New Project Setup

```bash
# Initialize Storybook in an existing Next.js project
npm create storybook@latest

# Or for a new monorepo project
npx storybook init
```

Storybook will auto-detect your Next.js setup and configure appropriately.

### Manual Configuration for `@storybook/nextjs-vite`

#### 1. Install Dependencies

```bash
npm install -D @storybook/nextjs-vite @storybook/addon-docs @storybook/addon-vitest
```

#### 2. Configure `.storybook/main.ts`

```typescript
import type { StorybookConfig } from '@storybook/nextjs-vite';

const config: StorybookConfig = {
  framework: '@storybook/nextjs-vite',
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../app/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-vitest',
  ],
  staticDirs: ['../public'],
  features: {
    experimentalRSC: true, // Enable for React Server Components
  },
};

export default config;
```

#### 3. Configure `.storybook/preview.ts`

```typescript
import type { Preview } from '@storybook/react';
import '../src/app/globals.css'; // Your global styles

const preview: Preview = {
  parameters: {
    nextjs: {
      appDirectory: true, // Enable App Router support
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
```

#### 4. Add Scripts to `package.json`

```json
{
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "test-storybook": "vitest --project=storybook"
  }
}
```

### Upgrading from Storybook 8/9 to 10

```bash
npx storybook@latest upgrade
```

The upgrade command will:
1. Locate all Storybook projects
2. Verify no blocking changes affect your setup
3. Update dependencies
4. Execute automigrations

---

## 4. App Router and RSC Considerations

### Enabling App Router Support

For components using `next/navigation`, set the `nextjs.appDirectory` parameter:

```typescript
// .storybook/preview.ts
const preview: Preview = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};
```

Or per-story:

```typescript
// MyComponent.stories.tsx
export const Default: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};
```

### React Server Components (RSC)

Enable the `experimentalRSC` feature flag to render async components:

```typescript
// .storybook/main.ts
const config: StorybookConfig = {
  features: {
    experimentalRSC: true,
  },
};
```

This automatically wraps stories in a `Suspense` wrapper.

### Mocking Server-Side Resources

For RSC components that access server-side resources:

#### Option 1: Mock Service Worker (MSW) - For Network Requests

```bash
npm install msw msw-storybook-addon --save-dev
npx msw init public
```

```typescript
// .storybook/preview.ts
import { initialize, mswLoader } from 'msw-storybook-addon';

initialize({ onUnhandledRequest: 'bypass' });

const preview: Preview = {
  loaders: [mswLoader],
};
```

#### Option 2: Module Mocking - For Database/File System Access

```typescript
// MyComponent.stories.tsx
import { fn } from '@storybook/test';
import * as dbModule from '../lib/db';

export default {
  title: 'Components/MyComponent',
  component: MyComponent,
  beforeEach: () => {
    // Mock database calls
    fn(dbModule.getData).mockResolvedValue({ items: [] });
  },
};
```

### Limitations

- RSC implementation in Storybook is **client-side only** (differs from server streaming)
- `unstable_after` experimental feature may not work
- `ssr: false` option with `next/dynamic` in Server Components may break

---

## 5. Tailwind CSS v4 Integration

### The Challenge

Storybook uses its own Vite instance, which doesn't include the Tailwind CSS v4 plugin by default.

### Solution: Configure `viteFinal`

```typescript
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/nextjs-vite';
import tailwindcss from '@tailwindcss/vite';

const config: StorybookConfig = {
  framework: '@storybook/nextjs-vite',
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],

  async viteFinal(config) {
    config.plugins = config.plugins || [];
    config.plugins.push(tailwindcss());
    return config;
  },
};

export default config;
```

### Import Tailwind CSS in Preview

```typescript
// .storybook/preview.ts
import '../src/tailwind.css'; // or your main CSS file with @import 'tailwindcss'

const preview: Preview = {
  // ...
};

export default preview;
```

### Tailwind CSS v4 File (No config.js needed)

```css
/* src/tailwind.css */
@import 'tailwindcss';

@theme {
  --color-primary: oklch(0.7 0.15 200);
  /* Your custom theme tokens */
}
```

### Known Issues with Monorepos (Nx)

Some users report issues with Tailwind 4 in Nx monorepos. Workaround: use `@tailwindcss/cli` instead of the Vite plugin.

---

## 6. Turborepo/Monorepo Setup

### Recommended Approaches

1. **Dedicated Storybook App** (Recommended for large teams)
2. **Storybook in UI Library Package**
3. **Storybook per Application**

### Setup Steps for Dedicated Storybook App

```bash
# Create Storybook app directory
mkdir apps/storybook
cd apps/storybook

# Initialize Storybook
npx create storybook@latest
```

### Configure `turbo.json`

```json
{
  "tasks": {
    "storybook": {
      "cache": false,
      "persistent": true,
      "interactive": true
    },
    "build-storybook": {
      "dependsOn": ["^build"],
      "outputs": ["storybook-static/**"]
    }
  }
}
```

### Co-locating Stories with Source Code

```typescript
// apps/storybook/.storybook/main.ts
const config: StorybookConfig = {
  stories: [
    '../../../packages/ui/src/**/*.stories.@(js|jsx|ts|tsx)',
    '../../../apps/web/src/**/*.stories.@(js|jsx|ts|tsx)',
  ],
};
```

### Excluding Stories from Build Cache

```json
// turbo.json
{
  "tasks": {
    "build": {
      "inputs": ["$TURBO_DEFAULT$", "!**/*.stories.{tsx,jsx,mdx}"]
    },
    "build-storybook": {
      "inputs": ["$TURBO_DEFAULT$"]
    }
  }
}
```

This prevents story changes from invalidating production build caches.

---

## 7. Testing with Vitest Addon

### Installation

```bash
npx storybook add @storybook/addon-vitest
```

### Requirements

- Next.js 14.1+
- `@storybook/nextjs-vite` framework
- Playwright browser binaries

```bash
npx playwright install
```

### Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import { storybookNextJsPlugin } from '@storybook/nextjs-vite/vite-plugin';

export default defineConfig({
  plugins: [storybookNextJsPlugin()],
  test: {
    browser: {
      enabled: true,
      provider: 'playwright',
      name: 'chromium',
    },
  },
});
```

### Running Tests

```bash
# Run all tests
npm run test

# Run only Storybook tests
npm run test -- --project=storybook
```

### Test Types Supported

- **Interaction tests** - Test component behavior
- **Accessibility tests** - a11y compliance
- **Visual tests** - Snapshot comparisons
- **Coverage reports** - Code coverage metrics

---

## 8. Performance Optimization

### Build Performance

1. **Use `@storybook/nextjs-vite`** - Significantly faster than Webpack
2. **Enable caching in Turborepo** - Cache `storybook-static/**`
3. **Lazy load addons** - Only include necessary addons

### Development Performance

1. **Filter stories** - Use `--grep` to test specific stories
2. **Disable unnecessary addons** during development
3. **Use the Vite builder** - Faster HMR

### Bundle Size Optimization

```typescript
// .storybook/main.ts
const config: StorybookConfig = {
  core: {
    disableTelemetry: true,
  },
  addons: [
    // Only essential addons
    '@storybook/addon-docs',
  ],
};
```

### Storybook 10 Size Improvements

| Version | Install Size Reduction |
|---------|----------------------|
| 9.x | 48% smaller than 8.x |
| 10.x | 29% smaller than 9.x |
| **Total** | **~62% smaller than 8.x** |

---

## 9. Known Issues and Workarounds

### Next.js 15 Compatibility Issues

#### Issue: React Version Inconsistency

Next.js 15 bundles React 19.0.0-rc, while Storybook may use a different version.

**Workaround:** Pin React versions in your package.json:

```json
{
  "resolutions": {
    "react": "19.0.0",
    "react-dom": "19.0.0"
  }
}
```

#### Issue: Vitest Addon Module Resolution

The Vitest addon fails due to React module resolution conflicts.

**Status:** Known issue, being addressed in upcoming releases.

**Workaround:** Use interaction tests in the browser instead of Vitest for now.

### Next.js 16 Compatibility Issues

#### Issue: SWC Loader Patch Error

```
bindings not loaded yet. Either call `loadBindings` to wait...
```

**Workaround:** Use `@storybook/nextjs-vite` instead of the Webpack-based framework.

#### Issue: nextjs-vite Support

**Status:** Support for Next.js 16 was added in Storybook 9.x and improved in 10.x.

### Tailwind CSS v4 in Monorepos

#### Issue: "Can't resolve 'tailwindcss'" in Nx

**Workaround:** Use `@tailwindcss/cli` instead of the Vite plugin:

```json
{
  "scripts": {
    "build:css": "tailwindcss -i ./src/input.css -o ./dist/output.css"
  }
}
```

### next/font Limitations

- **Font loaders configuration** in `next.config.js` not supported
- **display option** is ignored; all fonts load with `display: "block"`

### ESM Migration Issues

#### Issue: "exports is not defined"

**Solution:** Ensure all config files use ESM syntax and Node.js 20.19+.

#### Issue: Relative imports failing

**Solution:** Add `.js` extensions to all relative imports in config files.

---

## 10. References

### Official Documentation

1. [Storybook for Next.js with Vite](https://storybook.js.org/docs/get-started/frameworks/nextjs-vite) - Official setup guide
2. [Storybook for Next.js with Webpack](https://storybook.js.org/docs/get-started/frameworks/nextjs) - Legacy Webpack framework
3. [Migration Guide for Storybook 10](https://storybook.js.org/docs/releases/migration-guide) - ESM migration steps
4. [Install Storybook](https://storybook.js.org/docs/get-started/install) - Installation instructions

### Blog Posts and Announcements

5. [Storybook 10 Announcement](https://storybook.js.org/blog/storybook-10/) - Key features and changes
6. [Storybook is Going ESM-only](https://storybook.js.org/blog/storybook-is-going-esm-only/) - ESM transition details
7. [Introducing Storybook 9](https://storybook.js.org/announce/sb9) - Storybook 9 features
8. [Build a Next.js App with RSC and MSW](https://storybook.js.org/blog/build-a-nextjs-app-with-rsc-msw-storybook/) - RSC integration guide
9. [Storybook for React Server Components](https://storybook.js.org/blog/storybook-react-server-components/) - RSC support details

### Testing and Addons

10. [Vitest Addon Documentation](https://storybook.js.org/docs/writing-tests/integrations/vitest-addon/index) - Testing with Vitest
11. [Mocking Modules](https://storybook.js.org/docs/writing-stories/mocking-data-and-modules/mocking-modules) - Module mocking guide
12. [Tailwind CSS Recipe](https://storybook.js.org/recipes/tailwindcss) - Tailwind integration

### Monorepo and Turborepo

13. [Turborepo Storybook Guide](https://turborepo.dev/docs/guides/tools/storybook) - Official Turborepo documentation
14. [Storybook in a Turborepo Monorepo](https://www.pronextjs.dev/workshops/pro-next-js-workshop-hl06z/storybook-in-a-turborepo-monorepo-nnwqb) - Workshop guide

### GitHub Resources

15. [vite-plugin-storybook-nextjs](https://github.com/storybookjs/vite-plugin-storybook-nextjs) - Vite plugin repository
16. [Storybook RSC Demo](https://github.com/storybookjs/storybook-rsc-demo) - React Server Components demo
17. [Storybook Releases](https://github.com/storybookjs/storybook/releases) - Release notes

### Third-Party Resources

18. [Integrating Storybook with Tailwind CSS v4.1](https://medium.com/@ayomitunde.isijola/integrating-storybook-with-tailwind-css-v4-1-f520ae018c10) - Tailwind v4 guide
19. [Storybook v9 Released - InfoQ](https://www.infoq.com/news/2025/07/storybook-v9-released/) - Industry coverage
20. [@storybook/nextjs on npm](https://www.npmjs.com/package/@storybook/nextjs) - Package details
21. [@storybook/nextjs-vite on npm](https://www.npmjs.com/package/@storybook/nextjs-vite) - Package details

### Known Issues Tracking

22. [Next.js 15 Compatibility Issue #29554](https://github.com/storybookjs/storybook/issues/29554)
23. [Next.js 16 Support Issue #32710](https://github.com/storybookjs/storybook/issues/32710)
24. [Vitest Addon Next.js 15 Issue #31760](https://github.com/storybookjs/storybook/issues/31760)
25. [React Version Inconsistency Issue #30646](https://github.com/storybookjs/storybook/issues/30646)

---

## Quick Start Checklist

- [ ] Ensure Node.js 20.19+ or 22.12+
- [ ] Use `@storybook/nextjs-vite` framework
- [ ] Configure ESM-compliant `.storybook/main.ts`
- [ ] Enable `experimentalRSC` for Server Components
- [ ] Set `nextjs.appDirectory: true` for App Router
- [ ] Configure `viteFinal` for Tailwind CSS v4
- [ ] Add `storybook-static/**` to `.gitignore`
- [ ] Configure Turborepo caching for `storybook-static`
- [ ] Install Vitest addon for component testing

---

*This report was compiled from official Storybook documentation, blog posts, npm package information, and community discussions. Last updated: January 2025.*
