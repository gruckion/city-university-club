# Storybook for Expo React Native: Comprehensive Research Report (2025-2026)

**Research Date:** January 15, 2026
**Report Version:** 1.0

---

## Executive Summary

Storybook for React Native has undergone significant evolution in 2025-2026, with major releases including Storybook 9 and 10 introducing performance improvements, ESM-only support, and better Expo integration. The ecosystem now offers three distinct approaches for developing and testing React Native components:

1. **Native-only** - Full Storybook UI running on mobile devices/simulators
2. **Web-only** - React Native Web rendering in browsers via Vite
3. **Hybrid/Both** - Combined approach with web documentation and native rendering

Key highlights:
- **Storybook 10** (November 2025) is ESM-only, reducing install size by 29% on top of Storybook 9's 50% reduction
- **Metro configuration simplified** with the new `withStorybook` wrapper
- **React Native Web Vite framework** (`@storybook/react-native-web-vite`) replaces the deprecated Webpack addon
- **Expo template available** for quick starts: `npx create-expo-app --template expo-template-storybook`

---

## Table of Contents

1. [Latest Storybook Versions](#latest-storybook-versions)
2. [ESM Support and Performance](#esm-support-and-performance)
3. [Installation Guide for Expo](#installation-guide-for-expo)
4. [Metro Bundler Configuration](#metro-bundler-configuration)
5. [Web and Mobile Targets](#web-and-mobile-targets)
6. [Monorepo Setup](#monorepo-setup)
7. [NativeWind/Tailwind Integration](#nativewindtailwind-integration)
8. [Addons and Extensions](#addons-and-extensions)
9. [Performance Optimization](#performance-optimization)
10. [Known Issues and Workarounds](#known-issues-and-workarounds)
11. [Migration Guide](#migration-guide)
12. [References](#references)

---

## Latest Storybook Versions

### Storybook Core

| Version | Release Date | Key Features |
|---------|-------------|--------------|
| 10.1.x | January 2026 | ESM-only, 29% smaller, module automocking, CSF Factories |
| 10.0 | November 2025 | Breaking: ESM-only distribution |
| 9.0 | 2025 | 48% leaner, tag-based organization, modular installs |
| 8.5 | Late 2024 | React Native Web Vite framework introduction |

### Storybook React Native

| Package | Latest Version | Notes |
|---------|---------------|-------|
| `@storybook/react-native` | 10.1.11 | Core React Native support |
| `@storybook/react-native-web-vite` | 10.1.11 | Vite-based web rendering |
| `@storybook/addon-ondevice-controls` | 10.x | On-device prop editing |
| `@storybook/addon-ondevice-actions` | 10.x | Action logging on device |

### Node.js Requirements

Storybook 10 requires modern Node.js with ESM support:
- Node 20.16+
- Node 22.19+
- Node 24+

---

## ESM Support and Performance

### ESM-Only Architecture (Storybook 10)

Storybook 10 made the breaking decision to go ESM-only, removing CommonJS from published code. This architectural change delivers:

- **29% smaller install size** compared to Storybook 9
- **79% cumulative reduction** since Storybook 8
- **Un-minified distribution** for easier debugging
- **Simplified codebase** with removed legacy compatibility layers
- **Faster compilation and publishing**

### Performance Benefits

The transition to ESM provides:
- Alignment with modern bundlers and libraries
- Elimination of dual ESM/CJS output overhead
- Reduced testing complexity
- Better tree-shaking support

---

## Installation Guide for Expo

### Quick Start (New Projects)

```bash
# Create a new Expo project with Storybook pre-configured
npx create-expo-app --template expo-template-storybook AwesomeStorybook
```

### Adding to Existing Expo Projects

```bash
# Initialize Storybook in your project
npx storybook@latest init

# Or for specific version
npm create storybook@10
```

### Required Dependencies

```bash
# Core dependencies
npx expo install @storybook/react-native

# Required peer dependencies
npx expo install react-native-reanimated react-native-gesture-handler @gorhom/bottom-sheet react-native-svg

# On-device addons (optional but recommended)
npx expo install @storybook/addon-ondevice-controls @storybook/addon-ondevice-actions
npx expo install @react-native-community/datetimepicker @react-native-community/slider

# Cross-platform environment variables
npm install --save-dev cross-env
```

### Project Structure

After setup, your project should have:

```
your-expo-app/
├── .rnstorybook/           # Storybook configuration (v9+)
│   ├── main.ts             # Story discovery and addons
│   ├── preview.tsx         # Global decorators and parameters
│   └── storybook.requires.ts  # Auto-generated imports
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   └── Button.stories.tsx
├── metro.config.js         # Metro bundler with Storybook wrapper
├── app.config.js           # Expo configuration
└── App.tsx                 # Entry point with Storybook toggle
```

### Configuration Files

**`.rnstorybook/main.ts`**

```typescript
import type { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
  stories: [
    '../components/**/*.stories.@(js|jsx|ts|tsx)',
    '../app/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-ondevice-controls',
    '@storybook/addon-ondevice-actions',
    '@storybook/addon-ondevice-backgrounds',
  ],
};

export default main;
```

**`.rnstorybook/preview.tsx`**

```typescript
import type { Preview } from '@storybook/react';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
```

---

## Metro Bundler Configuration

### Storybook 10 Configuration (Current)

The Metro wrapper has been simplified in v10 with breaking changes:

**`metro.config.js`**

```javascript
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
// BREAKING: withStorybook is now a named export
const { withStorybook } = require('@storybook/react-native/metro/withStorybook');

const config = getDefaultConfig(__dirname);

module.exports = withStorybook(config, {
  // Enable Storybook based on environment variable
  enabled: process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true',
  // Configuration directory (default: .rnstorybook)
  configPath: path.resolve(__dirname, './.rnstorybook'),
});
```

### Key Changes from v9 to v10

| v9 | v10 |
|----|-----|
| Default export | Named export: `{ withStorybook }` |
| `withStorybookConfig` from separate path | Standard `withStorybook` from `metro/withStorybook` |
| `onDisabledRemoveStorybook` option | Automatic when `enabled: false` |

### Automatic Bundle Optimization

When `enabled: false`, Metro automatically:
- Stubs out the `.rnstorybook` import
- Removes all Storybook code from production bundle
- No conditional imports needed in your app code

---

## Web and Mobile Targets

### Three Setup Approaches

#### 1. Native-Only (On-Device)

Best for: Testing on actual devices, native-specific components

```typescript
// App.tsx - Simple export for native-only
export { default } from './.rnstorybook';
```

#### 2. Web-Only (React Native Web + Vite)

Best for: Documentation, sharing with team, testing in browser

**Install the Vite framework:**

```bash
npm install --save-dev @storybook/react-native-web-vite
```

**`.storybook/main.ts`** (for web):

```typescript
import type { StorybookConfig } from '@storybook/react-native-web-vite';

const config: StorybookConfig = {
  stories: ['../components/**/*.stories.@(js|jsx|ts|tsx)'],
  framework: '@storybook/react-native-web-vite',
  addons: ['@storybook/addon-essentials'],
};

export default config;
```

#### 3. Both (Recommended for Teams)

When initializing Storybook, select "Both" to get configurations for both environments:

- `.rnstorybook/` - React Native configuration
- `.storybook/` - React Native Web configuration

This allows you to:
- Develop on real devices or simulators
- Document and test in the browser
- Share interactive documentation with stakeholders
- Access 500+ Storybook addons on web

### Running Both Targets

**`package.json` scripts:**

```json
{
  "scripts": {
    "storybook": "cross-env EXPO_PUBLIC_STORYBOOK_ENABLED='true' expo start",
    "storybook:ios": "cross-env EXPO_PUBLIC_STORYBOOK_ENABLED='true' expo ios",
    "storybook:android": "cross-env EXPO_PUBLIC_STORYBOOK_ENABLED='true' expo android",
    "storybook:web": "storybook dev -p 6006",
    "storybook:build": "storybook build"
  }
}
```

### App Entry Point with Toggle

**`App.tsx`**

```typescript
import Constants from 'expo-constants';

function App() {
  // Your normal app component
  return <MainApp />;
}

let AppEntryPoint = App;

// Toggle based on environment variable
if (Constants.expoConfig?.extra?.storybookEnabled === 'true') {
  AppEntryPoint = require('./.rnstorybook').default;
}

export default AppEntryPoint;
```

**`app.config.js`**

```javascript
export default ({ config }) => ({
  ...config,
  name: 'MyApp',
  extra: {
    storybookEnabled: process.env.EXPO_PUBLIC_STORYBOOK_ENABLED,
  },
});
```

---

## Monorepo Setup

### Recommended Structure

For Turborepo/monorepo setups, create Storybook as a separate app:

```
monorepo/
├── apps/
│   ├── native/              # Expo app
│   ├── web/                 # Next.js app
│   └── storybook/           # Dedicated Storybook app
├── packages/
│   ├── ui/                  # Shared UI components
│   │   └── src/
│   │       ├── Button/
│   │       │   ├── Button.tsx
│   │       │   └── Button.stories.tsx
│   └── config/              # Shared configurations
```

### Benefits of Separate Storybook App

- Clean separation of dependencies
- No special case directories in monorepo root
- Standard dev/build scripts (not storybook-specific)
- Stories import components using fully scoped packages
- Easier CI/CD configuration

### Turborepo Configuration

**`apps/storybook/package.json`**

```json
{
  "name": "storybook",
  "private": true,
  "scripts": {
    "dev": "storybook dev -p 6006",
    "build": "storybook build"
  },
  "dependencies": {
    "@myorg/ui": "workspace:*"
  }
}
```

### Workspace Configuration Notes

- Yarn Workspaces is recommended for React Native monorepos
- Bun has some known issues with React Native workspaces
- Expo Router works seamlessly with monorepo setups
- Consider running two Metro bundlers (app on 8081, Storybook on 8082)

---

## NativeWind/Tailwind Integration

### Current Status (January 2026)

NativeWind integration with Storybook React Native Web Vite has known issues. Styles may not render correctly in web builds while working fine in native.

### Configuration for React Native Web Vite

**`.storybook/main.ts`**

```typescript
import type { StorybookConfig } from '@storybook/react-native-web-vite';

const config: StorybookConfig = {
  stories: ['../components/**/*.stories.@(js|jsx|ts|tsx)'],
  framework: {
    name: '@storybook/react-native-web-vite',
    options: {
      pluginReactOptions: {
        jsxImportSource: 'nativewind',
      },
    },
  },
};

export default config;
```

### Alternative: Vite Config Workaround

**`vite.config.ts`**

```typescript
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['nativewind/babel', { mode: 'transformOnly' }]],
      },
    }),
  ],
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
  },
});
```

### Import Tailwind CSS

**`.storybook/preview.ts`**

```typescript
import '../global.css'; // Your Tailwind CSS file

const preview = {
  // ... preview config
};

export default preview;
```

### Known Issues

- NativeWind styles may appear in `storybook dev` but not in `storybook build`
- The styles are compiled but classes may not be applied to elements
- Native Storybook rendering works correctly
- Issue tracked on GitHub (#32018)

---

## Addons and Extensions

### On-Device Addons

| Addon | Purpose |
|-------|---------|
| `@storybook/addon-ondevice-controls` | Edit component props in real-time |
| `@storybook/addon-ondevice-actions` | Log component actions/events |
| `@storybook/addon-ondevice-backgrounds` | Switch background colors |
| `@storybook/addon-ondevice-notes` | Display markdown notes |

### Installation

```bash
# Install on-device addons
npm install --save-dev \
  @storybook/addon-ondevice-controls \
  @storybook/addon-ondevice-actions \
  @storybook/addon-ondevice-backgrounds \
  @storybook/addon-ondevice-notes

# Required peer dependencies for controls
npx expo install \
  @react-native-community/datetimepicker \
  @react-native-community/slider
```

### Web Addons

When using React Native Web, you have access to 500+ Storybook addons:

```bash
npm install --save-dev \
  @storybook/addon-essentials \
  @storybook/addon-a11y \
  @storybook/addon-interactions
```

---

## Performance Optimization

### Lite Mode for Reduced Bundle Size

Use `@storybook/react-native-ui-lite` instead of the full UI:

```typescript
// Reduces dependencies (no react-native-reanimated required)
import StorybookUIRoot from '@storybook/react-native-ui-lite';
```

### Production Bundle Optimization

Metro automatically excludes Storybook when `enabled: false`:

```javascript
// metro.config.js
module.exports = withStorybook(config, {
  enabled: process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true',
});
```

### Story Code Splitting

Configure story discovery to limit scope:

```typescript
// .rnstorybook/main.ts
const main: StorybookConfig = {
  stories: [
    // Only include specific directories
    '../components/ui/**/*.stories.tsx',
    // Exclude test files
    '!**/*.test.stories.tsx',
  ],
};
```

### Tips for Better Performance

1. **Use environment variables** - Toggle Storybook at build time, not runtime
2. **Limit story scope** - Only include necessary story files
3. **Use lite mode** - When full UI features aren't needed
4. **Separate design system** - Put UI components in a dedicated package
5. **Cache metro bundler** - Use `--reset-cache` only when necessary

---

## Known Issues and Workarounds

### Issue 1: NX/Monorepo Configuration

**Problem:** NX generators create Vite/React config instead of Metro/React Native

**Workaround:** Manually configure Metro and add `vite-plugin-react-native-web` for web stories

### Issue 2: Blank Canvas/Theme Issues

**Problem:** Stories render but content is invisible

**Solution:** Switch between dark/light theme in Storybook UI to make text visible

### Issue 3: NativeWind v4 Build Issues

**Problem:** Styles work in dev but not in production builds

**Status:** Known issue (#32018), under investigation

**Workaround:** Use Webpack-based setup or await patch

### Issue 4: Dependency Version Mismatch

**Problem:** Mixed major versions cause undefined behavior

**Solution:** Align all `@storybook/*` packages to the same major version:

```bash
npm ls | grep storybook
# Verify all packages are on the same major version
```

### Issue 5: Metro Port Conflicts

**Problem:** Running app and Storybook simultaneously causes port conflicts

**Solution:** Expo detects port 8081 in use and auto-assigns 8082

---

## Migration Guide

### From v9 to v10

1. **Update all dependencies** to v10:

```bash
npm install @storybook/react-native@10 \
  @storybook/addon-ondevice-controls@10 \
  @storybook/addon-ondevice-actions@10
```

2. **Update Metro configuration:**

```javascript
// Before (v9)
const withStorybook = require('@storybook/react-native/metro/withStorybook');
module.exports = withStorybook(config);

// After (v10)
const { withStorybook } = require('@storybook/react-native/metro/withStorybook');
module.exports = withStorybook(config, {
  enabled: process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true',
});
```

3. **Remove deprecated options:**
   - Remove `onDisabledRemoveStorybook` (now automatic)
   - Replace `withStorybookConfig` with `withStorybook`

4. **Verify Node.js version:**
   - Requires Node 20.16+, 22.19+, or 24+

### From Webpack Addon to Vite Framework

1. **Replace packages:**

```bash
npm uninstall @storybook/addon-react-native-web @storybook/react-webpack5
npm install @storybook/react-native-web-vite
```

2. **Update `.storybook/main.ts`:**

```typescript
// Before
import type { StorybookConfig } from '@storybook/react-webpack5';
const config: StorybookConfig = {
  addons: ['@storybook/addon-react-native-web'],
  framework: '@storybook/react-webpack5',
};

// After
import type { StorybookConfig } from '@storybook/react-native-web-vite';
const config: StorybookConfig = {
  framework: '@storybook/react-native-web-vite',
};
```

---

## References

### Official Documentation
- [Storybook for React Native GitHub](https://github.com/storybookjs/react-native)
- [Storybook React Native Docs](https://storybookjs.github.io/react-native/docs/intro/)
- [Storybook for React Native Web (Vite)](https://storybook.js.org/docs/get-started/frameworks/react-native-web-vite)
- [Storybook 10 Release Blog](https://storybook.js.org/blog/storybook-10/)
- [Storybook 10 Migration Guide](https://storybook.js.org/docs/releases/migration-guide)
- [Storybook React Native Releases](https://github.com/storybookjs/react-native/releases)

### Expo Resources
- [Building beautiful components faster with Storybook 9 and Expo](https://expo.dev/blog/storybook-and-expo)
- [Storybook for React Native Tutorial](https://storybook.js.org/tutorials/intro-to-storybook/react-native/en/get-started/)

### Community Resources
- [Adding Storybook to your Expo project - Mauro Garcia](https://maurogarcia.dev/posts/Setup-storybook-with-expo/)
- [A cleaner approach of Storybook for React Native with Expo - Medium](https://medium.com/ekino-france/a-cleaner-approach-for-storybook-with-react-native-f9f5a59fdfa8)
- [Setting Up Universal Storybook with NativeWind - GeekyAnts](https://techblog.geekyants.com/setting-up-universal-storybook-with-nativewind-a-step-by-step-guide)
- [How to Cleanly Swap Between React Native Storybook 10 and Your App - Callstack](https://www.callstack.com/blog/how-to-cleanly-swap-between-react-native-storybook-10-and-your-app)
- [Run Storybook with NX Expo and React Native Paper - DEV Community](https://dev.to/typescriptteatime/run-storybook-with-nx-expo-and-react-native-paper-4l8l)

### Monorepo Templates
- [expo-storybook-monorepo-example](https://github.com/dannyhw/expo-storybook-monorepo-example)
- [storybook-rnw-monorepo](https://github.com/axeldelafosse/storybook-rnw-monorepo)
- [create-turbo-with-expo](https://github.com/Marknjo/create-turbo-with-expo)

### npm Packages
- [@storybook/react-native](https://www.npmjs.com/package/@storybook/react-native)
- [@storybook/react-native-web-vite](https://www.npmjs.com/package/@storybook/react-native-web-vite)
- [@storybook/addon-ondevice-controls](https://www.npmjs.com/package/@storybook/addon-ondevice-controls)

### Migration Resources
- [Storybook React Native Migration Guide](https://github.com/storybookjs/react-native/blob/next/MIGRATION.md)
- [Storybook 10.0 Release Notes](https://storybook.js.org/releases/10.0)

### Known Issues
- [NativeWind Styles Not Displaying in Storybook React Native Web Vite (#32018)](https://github.com/storybookjs/storybook/issues/32018)
- [Storybook 10 ESM-only Tracking (#31787)](https://github.com/storybookjs/storybook/issues/31787)
- [Tailwind/NativeWind Discussion (#28399)](https://github.com/storybookjs/storybook/discussions/28399)

---

## Summary

Storybook for React Native with Expo in 2025-2026 offers a mature, performant solution for component development. Key recommendations:

1. **Use Storybook 10** for the latest ESM-only performance benefits
2. **Configure Metro properly** with the new named `withStorybook` export
3. **Consider the "Both" approach** for combined native and web development
4. **Use the official Expo template** for new projects
5. **Watch NativeWind integration** for ongoing bug fixes
6. **Align all Storybook package versions** to avoid compatibility issues

The ecosystem continues to evolve rapidly, with the Storybook team actively maintaining React Native support and improving the developer experience.
