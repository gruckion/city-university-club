# Storybook Implementation Plan

This document provides a comprehensive plan for implementing Storybook in the `convoexpo-and-nextjs-web-bun-better-auth` monorepo, covering both the Expo React Native app (`apps/native`) and the Next.js web app (`apps/web`).

---

## Table of Contents

1. [Current Codebase Analysis](#current-codebase-analysis)
2. [Recommended Architecture](#recommended-architecture)
3. [Phase 1: Next.js Web App Storybook](#phase-1-nextjs-web-app-storybook)
4. [Phase 2: Expo Native App Storybook](#phase-2-expo-native-app-storybook)
5. [Phase 3: Optional Web Stories for Native](#phase-3-optional-web-stories-for-native)
6. [Turborepo Integration](#turborepo-integration)
7. [Testing Strategy](#testing-strategy)
8. [File Structure Summary](#file-structure-summary)

---

## Current Codebase Analysis

### Project Overview

| Aspect | Details |
|--------|---------|
| **Monorepo Tool** | Turborepo with Bun workspaces |
| **Package Manager** | Bun v1.2.20 |
| **Linting/Formatting** | Biome |
| **Git Hooks** | Lefthook |

### Apps Structure

#### `apps/web` - Next.js Admin Portal
- **Framework**: Next.js 16 with App Router
- **React Version**: 19.2.3
- **Styling**: Tailwind CSS v4 via `@tailwindcss/postcss`
- **Component Library**: shadcn/ui built on `@base-ui/react`
- **CSS Entry**: `src/index.css`
- **Variant System**: `class-variance-authority` (cva)

**Existing Components:**
```
apps/web/src/components/
├── ui/
│   ├── button.tsx      # CVA variants: default, outline, secondary, ghost, destructive, link
│   ├── input.tsx
│   ├── label.tsx
│   ├── card.tsx
│   ├── checkbox.tsx
│   ├── dropdown-menu.tsx
│   ├── skeleton.tsx
│   └── sonner.tsx      # Toast notifications
├── header.tsx
├── loader.tsx
├── mode-toggle.tsx
├── providers.tsx
├── sign-in-form.tsx
├── sign-up-form.tsx
├── theme-provider.tsx
└── user-menu.tsx
```

#### `apps/native` - Expo Customer App
- **Framework**: Expo SDK 54 with expo-router
- **React Native**: 0.81.5
- **React Version**: 19.1.0
- **Styling**: UniWind (Tailwind v4 for React Native)
- **Component Library**: heroui-native v1.0.0-beta.12
- **CSS Entry**: `global.css`
- **Metro Config**: Custom with monorepo support

**Existing Components:**
```
apps/native/components/
├── CategoryFilter.tsx      # Animated filter chips with Reanimated
├── ExternalLinkButton.tsx
├── LastUsedIndicator.tsx
├── MembershipCard.tsx
├── container.tsx
├── form.tsx               # FormContainer, FormHeader, StyledTextInput, StyledButton
├── keyboard/
│   ├── KeyboardAwareForm.tsx
│   └── KeyboardAwareForm.native.tsx
├── sign-in.tsx
├── sign-up.tsx
└── theme-toggle.tsx
```

**Theme System:**
```typescript
// apps/native/theme/colors.ts
export const CUC_COLORS = {
  navy: "#06273a",
  sage: "#85b09a",
  cream: "#fffef8",
  white: "#ffffff",
} as const;
```

### Current State
- **No existing Storybook configuration**
- **No `.stories.tsx` files**
- **No `.storybook/` directories**

---

## Recommended Architecture

### Decision: Separate Storybook Configurations Per App

Given the fundamental differences between React Native and Next.js components, we recommend **separate Storybook configurations** for each app rather than a shared root configuration.

**Rationale:**
1. **Different Frameworks**: Native uses `@storybook/react-native`, Web uses `@storybook/nextjs`
2. **Different Component APIs**: RN primitives vs HTML elements
3. **Different Styling**: UniWind style objects vs Tailwind classNames
4. **Simplified Maintenance**: Each team can evolve independently

### High-Level Structure

```
convoexpo-and-nextjs-web-bun-better-auth/
├── turbo.json                    # Storybook tasks
├── package.json                  # Root storybook scripts
├── biome.jsonc                   # Ignore storybook outputs
│
├── apps/
│   ├── native/
│   │   ├── .storybook/           # React Native Storybook
│   │   │   ├── index.tsx
│   │   │   ├── main.ts
│   │   │   └── preview.tsx
│   │   ├── metro.config.cjs      # + withStorybook
│   │   └── components/
│   │       └── *.stories.tsx     # Co-located stories
│   │
│   └── web/
│       ├── .storybook/           # Next.js Storybook
│       │   ├── main.ts
│       │   └── preview.tsx
│       └── src/components/
│           └── ui/*.stories.tsx  # Co-located stories
```

---

## Phase 1: Next.js Web App Storybook

This phase has lower complexity and establishes patterns for the native app.

### Step 1.1: Install Dependencies

```bash
cd apps/web
bun add -d @storybook/nextjs @storybook/addon-essentials @storybook/addon-interactions @storybook/addon-themes @storybook/test @storybook/blocks storybook
```

**Dependencies Explained:**
| Package | Purpose |
|---------|---------|
| `@storybook/nextjs` | Next.js framework integration |
| `@storybook/addon-essentials` | Controls, actions, docs, viewport, backgrounds |
| `@storybook/addon-interactions` | Play function testing |
| `@storybook/addon-themes` | Theme switching (light/dark) |
| `@storybook/test` | Testing utilities |
| `@storybook/blocks` | MDX documentation blocks |
| `storybook` | CLI and core |

### Step 1.2: Create `.storybook/main.ts`

```typescript
// apps/web/.storybook/main.ts
import type { StorybookConfig } from "@storybook/nextjs";
import path from "node:path";

const config: StorybookConfig = {
  stories: [
    "../src/components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../src/**/*.mdx",
  ],

  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-themes",
  ],

  framework: {
    name: "@storybook/nextjs",
    options: {
      nextConfigPath: path.resolve(__dirname, "../next.config.ts"),
    },
  },

  staticDirs: ["../public"],

  typescript: {
    reactDocgen: "react-docgen-typescript",
  },

  docs: {
    autodocs: "tag",
  },
};

export default config;
```

### Step 1.3: Create `.storybook/preview.tsx`

```typescript
// apps/web/.storybook/preview.tsx
import type { Preview, Renderer } from "@storybook/nextjs";
import { withThemeByClassName } from "@storybook/addon-themes";

// Import global styles
import "../src/index.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: {
      appDirectory: true,
    },
    layout: "centered",
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#ffffff" },
        { name: "dark", value: "#0a0a0a" },
      ],
    },
  },

  decorators: [
    // Theme switching decorator for dark mode
    withThemeByClassName<Renderer>({
      themes: {
        light: "",
        dark: "dark",
      },
      defaultTheme: "light",
    }),
  ],

  tags: ["autodocs"],
};

export default preview;
```

### Step 1.4: Add Scripts to `apps/web/package.json`

```json
{
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "storybook:build": "storybook build -o storybook-static"
  }
}
```

### Step 1.5: Create Component Stories

#### Button Stories

```typescript
// apps/web/src/components/ui/button.stories.tsx
import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";
import { Button } from "./button";

const meta = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline", "secondary", "ghost", "destructive", "link"],
      description: "Visual style variant",
    },
    size: {
      control: "select",
      options: ["default", "xs", "sm", "lg", "icon", "icon-xs", "icon-sm", "icon-lg"],
      description: "Button size",
    },
    disabled: {
      control: "boolean",
    },
  },
  args: {
    onClick: fn(),
    children: "Button",
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: "default",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline Button",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary Button",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Ghost Button",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Delete",
  },
};

export const Link: Story = {
  args: {
    variant: "link",
    children: "Link Button",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    children: "Small Button",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    children: "Large Button",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Disabled Button",
  },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <svg
          data-icon="inline-start"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
        Continue
      </>
    ),
  },
};
```

#### Input Stories

```typescript
// apps/web/src/components/ui/input.stories.tsx
import type { Meta, StoryObj } from "@storybook/nextjs";
import { Input } from "./input";
import { Label } from "./label";

const meta = {
  title: "UI/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "tel", "url"],
    },
    disabled: {
      control: "boolean",
    },
    placeholder: {
      control: "text",
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Enter text...",
  },
};

export const Email: Story = {
  args: {
    type: "email",
    placeholder: "email@example.com",
  },
};

export const Password: Story = {
  args: {
    type: "password",
    placeholder: "Enter password",
  },
};

export const WithLabel: Story = {
  render: (args) => (
    <div className="space-y-2">
      <Label htmlFor="input-example">Email</Label>
      <Input {...args} id="input-example" />
    </div>
  ),
  args: {
    type: "email",
    placeholder: "email@example.com",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "Disabled input",
    value: "Cannot edit this",
  },
};
```

#### Card Stories

```typescript
// apps/web/src/components/ui/card.stories.tsx
import type { Meta, StoryObj } from "@storybook/nextjs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./card";
import { Button } from "./button";

const meta = {
  title: "UI/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the card content area.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
};

export const SimpleCard: Story = {
  render: () => (
    <Card className="w-[350px] p-6">
      <p>Simple card with just content.</p>
    </Card>
  ),
};
```

### Step 1.6: Update Biome Configuration

Add to `biome.jsonc` at root:

```jsonc
{
  "files": {
    "includes": [
      "!**/storybook-static",
      "!**/*.stories.tsx"  // Optional: if you want different lint rules for stories
    ]
  }
}
```

---

## Phase 2: Expo Native App Storybook

This phase is more complex due to React Native's Metro bundler integration.

### Step 2.1: Install Dependencies

```bash
cd apps/native
bun add -d @storybook/react-native @storybook/addon-ondevice-controls @storybook/addon-ondevice-actions @storybook/addon-ondevice-backgrounds @react-native-async-storage/async-storage
```

**Dependencies Explained:**
| Package | Purpose |
|---------|---------|
| `@storybook/react-native` | Core RN Storybook |
| `@storybook/addon-ondevice-controls` | Controls panel on device |
| `@storybook/addon-ondevice-actions` | Action logging on device |
| `@storybook/addon-ondevice-backgrounds` | Background switching |
| `@react-native-async-storage/async-storage` | Persist story selection |

### Step 2.2: Create `.storybook/main.ts`

```typescript
// apps/native/.storybook/main.ts
import type { StorybookConfig } from "@storybook/react-native";

const config: StorybookConfig = {
  stories: [
    "../components/**/*.stories.?(ts|tsx|js|jsx)",
    "../app/**/*.stories.?(ts|tsx|js|jsx)",
  ],
  addons: [
    "@storybook/addon-ondevice-controls",
    "@storybook/addon-ondevice-actions",
    "@storybook/addon-ondevice-backgrounds",
  ],
};

export default config;
```

### Step 2.3: Create `.storybook/preview.tsx`

```typescript
// apps/native/.storybook/preview.tsx
import type { Preview } from "@storybook/react-native";
import { View, Appearance } from "react-native";
import { withBackgrounds } from "@storybook/addon-ondevice-backgrounds";
import { CUC_COLORS } from "../theme/colors";

const preview: Preview = {
  decorators: [
    // Wrap all stories in a container with proper styling
    (Story) => (
      <View
        style={{
          flex: 1,
          padding: 16,
          backgroundColor: CUC_COLORS.cream,
        }}
      >
        <Story />
      </View>
    ),
    withBackgrounds,
  ],

  parameters: {
    actions: {
      argTypesRegex: "^on[A-Z].*",
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: Appearance.getColorScheme() === "dark" ? "dark" : "light",
      values: [
        { name: "light", value: CUC_COLORS.cream },
        { name: "dark", value: CUC_COLORS.navy },
        { name: "white", value: CUC_COLORS.white },
      ],
    },
  },
};

export default preview;
```

### Step 2.4: Create `.storybook/index.tsx`

```typescript
// apps/native/.storybook/index.tsx
import { view } from "./storybook.requires";
import AsyncStorage from "@react-native-async-storage/async-storage";

const StorybookUIRoot = view.getStorybookUI({
  // Show on-device UI navigation
  onDeviceUI: true,

  // Remember last selected story
  shouldPersistSelection: true,

  // Storage for persistence
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },

  // Optional: Enable WebSocket for remote control
  enableWebsockets: false,
  host: "localhost",
  port: 7007,

  // Initial story to show
  initialSelection: {
    kind: "Components/Form",
    name: "StyledButton",
  },

  // Theme customization
  theme: {
    backgroundColor: "#fffef8",
    headerTextColor: "#06273a",
    labelColor: "#06273a",
    borderColor: "#85b09a",
    previewBorderColor: "#85b09a",
    buttonTextColor: "#06273a",
    buttonActiveTextColor: "#fffef8",
  },
});

export default StorybookUIRoot;
```

### Step 2.5: Update Metro Configuration

Modify `apps/native/metro.config.cjs`:

```javascript
"use strict";
const { getDefaultConfig } = require("expo/metro-config");
const { FileStore } = require("metro-cache");
const { withUniwindConfig } = require("uniwind/metro");
const withStorybook = require("@storybook/react-native/metro/withStorybook");
const path = require("node:path");

/** @type {import('expo/metro-config').MetroConfig} */
const defaultConfig = getDefaultConfig(__dirname);

// Apply UniWind config
const uniwindConfig = withUniwindConfig(defaultConfig, {
  cssEntryFile: "./global.css",
  dtsFile: "./uniwind-types.d.ts",
});

// Apply monorepo and turborepo config
let config = withTurborepoManagedCache(withMonorepoPaths(uniwindConfig));

// Apply Storybook config (controlled by environment variable)
config = withStorybook(config, {
  enabled: process.env.STORYBOOK === "true",
  configPath: path.resolve(__dirname, "./.storybook"),
  // Optional: WebSocket for remote control
  // websockets: {
  //   port: 7007,
  //   host: "localhost",
  // },
});

// Enable package exports for proper module resolution
config.resolver.unstable_enablePackageExports = true;

// Disable hierarchical lookup for monorepo compatibility
config.resolver.disableHierarchicalLookup = true;

module.exports = config;

// ... existing helper functions remain unchanged ...
function withMonorepoPaths(config) {
  const projectRoot = __dirname;
  const workspaceRoot = path.resolve(projectRoot, "../..");

  config.watchFolders = [workspaceRoot];
  config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, "node_modules"),
    path.resolve(workspaceRoot, "node_modules"),
  ];

  return config;
}

function withTurborepoManagedCache(config) {
  config.cacheStores = [
    new FileStore({ root: path.join(__dirname, ".cache/metro") }),
  ];
  return config;
}
```

### Step 2.6: Create App Entry Point Toggle

Create `apps/native/app/_storybook.tsx`:

```typescript
// apps/native/app/_storybook.tsx
// This file is only used when STORYBOOK=true
export { default } from "../.storybook";
```

Update `apps/native/app/_layout.tsx` to conditionally load Storybook:

```typescript
// At the top of _layout.tsx, add:
import Constants from "expo-constants";

// Check if Storybook mode is enabled
const STORYBOOK_ENABLED = Constants.expoConfig?.extra?.storybook === true;

// In your component, conditionally render:
if (STORYBOOK_ENABLED) {
  const Storybook = require("./_storybook").default;
  return <Storybook />;
}

// ... rest of your existing layout code
```

Alternatively, create a dedicated entry point for Storybook mode.

### Step 2.7: Add Scripts to `apps/native/package.json`

```json
{
  "scripts": {
    "storybook": "STORYBOOK=true expo start",
    "storybook:ios": "STORYBOOK=true expo run:ios",
    "storybook:android": "STORYBOOK=true expo run:android",
    "storybook:web": "STORYBOOK=true expo start --web"
  }
}
```

### Step 2.8: Create Component Stories

#### Form Component Stories

```typescript
// apps/native/components/form.stories.tsx
import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { fn } from "@storybook/test";
import {
  FormContainer,
  FormHeader,
  StyledTextInput,
  StyledButton,
} from "./form";

// StyledButton Stories
const buttonMeta = {
  title: "Components/Form/StyledButton",
  component: StyledButton,
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary"],
    },
    isLoading: {
      control: "boolean",
    },
    label: {
      control: "text",
    },
  },
  args: {
    onPress: fn(),
    label: "Button",
  },
  decorators: [
    (Story) => (
      <View style={{ width: 300 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof StyledButton>;

export default buttonMeta;
type ButtonStory = StoryObj<typeof buttonMeta>;

export const Primary: ButtonStory = {
  args: {
    variant: "primary",
    label: "Primary Button",
  },
};

export const Secondary: ButtonStory = {
  args: {
    variant: "secondary",
    label: "Secondary Button",
  },
};

export const Tertiary: ButtonStory = {
  args: {
    variant: "tertiary",
    label: "Tertiary Button",
  },
};

export const Loading: ButtonStory = {
  args: {
    isLoading: true,
    label: "Loading...",
  },
};
```

#### StyledTextInput Stories

```typescript
// apps/native/components/styled-text-input.stories.tsx
import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { useState } from "react";
import { fn } from "@storybook/test";
import { StyledTextInput } from "./form";

const meta = {
  title: "Components/Form/StyledTextInput",
  component: StyledTextInput,
  argTypes: {
    keyboardType: {
      control: "select",
      options: ["default", "email-address", "numeric", "phone-pad"],
    },
    autoCapitalize: {
      control: "select",
      options: ["none", "sentences", "words", "characters"],
    },
    secureTextEntry: {
      control: "boolean",
    },
  },
  decorators: [
    (Story) => (
      <View style={{ width: 300 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof StyledTextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// Wrapper component to handle state
const TextInputWithState = (props: React.ComponentProps<typeof StyledTextInput>) => {
  const [value, setValue] = useState(props.value || "");
  return <StyledTextInput {...props} value={value} onChangeText={setValue} />;
};

export const Default: Story = {
  render: (args) => <TextInputWithState {...args} />,
  args: {
    label: "Email",
    placeholder: "Enter your email",
    value: "",
    onChangeText: fn(),
  },
};

export const Password: Story = {
  render: (args) => <TextInputWithState {...args} />,
  args: {
    label: "Password",
    placeholder: "Enter your password",
    secureTextEntry: true,
    textContentType: "password",
    autoComplete: "password",
    value: "",
    onChangeText: fn(),
  },
};

export const Email: Story = {
  render: (args) => <TextInputWithState {...args} />,
  args: {
    label: "Email Address",
    placeholder: "you@example.com",
    keyboardType: "email-address",
    autoCapitalize: "none",
    textContentType: "emailAddress",
    autoComplete: "email",
    value: "",
    onChangeText: fn(),
  },
};
```

#### CategoryFilter Stories

```typescript
// apps/native/components/CategoryFilter.stories.tsx
import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";
import { View } from "react-native";
import { CategoryFilter, EVENT_CATEGORIES, type Category } from "./CategoryFilter";

const meta = {
  title: "Components/CategoryFilter",
  component: CategoryFilter,
  decorators: [
    (Story) => (
      <View style={{ width: "100%" }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof CategoryFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive wrapper
const CategoryFilterWithState = ({
  categories,
  initialCategory = null,
}: {
  categories: Category[];
  initialCategory?: string | null;
}) => {
  const [selected, setSelected] = useState<string | null>(initialCategory);
  return (
    <CategoryFilter
      categories={categories}
      selectedCategory={selected}
      onSelectCategory={setSelected}
    />
  );
};

export const Default: Story = {
  render: () => <CategoryFilterWithState categories={EVENT_CATEGORIES} />,
};

export const WithSelection: Story = {
  render: () => (
    <CategoryFilterWithState
      categories={EVENT_CATEGORIES}
      initialCategory="seasonal"
    />
  ),
};

export const CustomCategories: Story = {
  render: () => (
    <CategoryFilterWithState
      categories={[
        { id: null, label: "All", icon: "apps-outline" },
        { id: "music", label: "Music", icon: "musical-notes-outline" },
        { id: "sports", label: "Sports", icon: "football-outline" },
        { id: "food", label: "Food", icon: "restaurant-outline" },
      ]}
    />
  ),
};
```

---

## Phase 3: Optional Web Stories for Native

For documentation and sharing purposes, you can set up a web-based Storybook for the native components using `@storybook/react-native-web-vite`.

### Step 3.1: Install Additional Dependencies

```bash
cd apps/native
bun add -d @storybook/react-native-web-vite @storybook/addon-essentials react-native-web
```

### Step 3.2: Create `.storybook-web/main.ts`

```typescript
// apps/native/.storybook-web/main.ts
import type { StorybookConfig } from "@storybook/react-native-web-vite";

const config: StorybookConfig = {
  stories: [
    "../components/**/*.stories.?(ts|tsx|js|jsx)",
  ],

  addons: [
    "@storybook/addon-essentials",
  ],

  framework: "@storybook/react-native-web-vite",

  docs: {
    autodocs: "tag",
  },
};

export default config;
```

### Step 3.3: Create `.storybook-web/preview.tsx`

```typescript
// apps/native/.storybook-web/preview.tsx
import type { Preview } from "@storybook/react-native-web-vite";
import { CUC_COLORS } from "../theme/colors";

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "cream",
      values: [
        { name: "cream", value: CUC_COLORS.cream },
        { name: "navy", value: CUC_COLORS.navy },
        { name: "white", value: CUC_COLORS.white },
      ],
    },
  },
};

export default preview;
```

### Step 3.4: Add Web Storybook Scripts

```json
{
  "scripts": {
    "storybook:web-ui": "storybook dev -p 6007 -c .storybook-web",
    "storybook:web-build": "storybook build -c .storybook-web -o storybook-static"
  }
}
```

---

## Turborepo Integration

### Step 4.1: Update `turbo.json`

```json
{
  "$schema": "https://turbo.build/schema.json",
  "ui": "tui",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "outputs": ["dist/**", ".next/**"]
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "check-types": {
      "dependsOn": ["^check-types"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "storybook": {
      "cache": false,
      "persistent": true
    },
    "storybook:build": {
      "dependsOn": ["^build"],
      "outputs": ["storybook-static/**"]
    },
    "dev:setup": {
      "cache": false,
      "persistent": true
    },
    "deploy": {
      "cache": false
    },
    "destroy": {
      "cache": false
    }
  }
}
```

### Step 4.2: Update Root `package.json`

```json
{
  "scripts": {
    "storybook:web": "turbo -F web storybook",
    "storybook:native": "turbo -F native storybook",
    "storybook:build": "turbo storybook:build",
    "storybook:build:web": "turbo -F web storybook:build",
    "storybook:build:native": "turbo -F native storybook:web-build"
  }
}
```

### Step 4.3: Update `.gitignore`

Add to root `.gitignore`:

```
# Storybook
storybook-static/
.storybook/storybook.requires.ts
```

---

## Testing Strategy

### Visual Testing

1. **Local Development**: Use Storybook's built-in visual comparison
2. **CI Integration**: Consider Chromatic for automated visual regression testing

### Interaction Testing

Use `@storybook/test` for component interaction tests:

```typescript
// Example interaction test
import { expect, userEvent, within } from "@storybook/test";

export const ClickInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");

    await userEvent.click(button);

    await expect(button).toHaveBeenCalled();
  },
};
```

### Accessibility Testing

Add `@storybook/addon-a11y` for accessibility audits:

```bash
bun add -d @storybook/addon-a11y
```

Add to addons in `main.ts`:
```typescript
addons: [
  "@storybook/addon-essentials",
  "@storybook/addon-a11y",
],
```

### Story Coverage Checklist

For each component, create stories covering:

- [ ] Default state
- [ ] All variants/sizes
- [ ] Loading states
- [ ] Error states
- [ ] Disabled states
- [ ] Interactive states (hover, focus, active)
- [ ] Edge cases (empty content, long content, etc.)
- [ ] Responsive behavior (if applicable)
- [ ] Dark mode appearance

---

## File Structure Summary

After implementation, your project will have this structure:

```
convoexpo-and-nextjs-web-bun-better-auth/
├── .gitignore                           # + storybook-static/
├── turbo.json                           # + storybook tasks
├── package.json                         # + storybook scripts
├── biome.jsonc                          # + ignore storybook outputs
│
├── apps/
│   ├── native/
│   │   ├── .storybook/
│   │   │   ├── index.tsx                # Storybook entry point
│   │   │   ├── main.ts                  # RN Storybook config
│   │   │   ├── preview.tsx              # Global decorators
│   │   │   └── storybook.requires.ts    # Auto-generated (gitignored)
│   │   ├── .storybook-web/              # Optional: Web UI for native
│   │   │   ├── main.ts
│   │   │   └── preview.tsx
│   │   ├── metro.config.cjs             # + withStorybook
│   │   ├── package.json                 # + storybook deps & scripts
│   │   └── components/
│   │       ├── form.tsx
│   │       ├── form.stories.tsx
│   │       ├── CategoryFilter.tsx
│   │       ├── CategoryFilter.stories.tsx
│   │       └── ...
│   │
│   └── web/
│       ├── .storybook/
│       │   ├── main.ts                  # Next.js Storybook config
│       │   └── preview.tsx              # Global decorators + CSS
│       ├── package.json                 # + storybook deps & scripts
│       └── src/components/
│           ├── ui/
│           │   ├── button.tsx
│           │   ├── button.stories.tsx
│           │   ├── input.tsx
│           │   ├── input.stories.tsx
│           │   ├── card.tsx
│           │   ├── card.stories.tsx
│           │   └── ...
│           ├── sign-in-form.tsx
│           ├── sign-in-form.stories.tsx
│           └── ...
│
└── docs/
    └── storybook-implementation-plan.md  # This file
```

---

## Quick Start Commands

After implementation, use these commands:

```bash
# Web app Storybook (Next.js)
bun run storybook:web           # Dev server on port 6006
bun run storybook:build:web     # Build static site

# Native app Storybook (Expo)
bun run storybook:native        # Expo dev with Storybook UI
cd apps/native && bun run storybook:ios      # iOS simulator
cd apps/native && bun run storybook:android  # Android emulator
cd apps/native && bun run storybook:web      # Web browser

# Build all Storybooks
bun run storybook:build
```

---

## Implementation Checklist

### Phase 1: Web App (Estimated: 2-3 hours)
- [ ] Install dependencies in `apps/web`
- [ ] Create `.storybook/main.ts`
- [ ] Create `.storybook/preview.tsx`
- [ ] Add scripts to `package.json`
- [ ] Create `button.stories.tsx`
- [ ] Create `input.stories.tsx`
- [ ] Create `card.stories.tsx`
- [ ] Create remaining UI component stories
- [ ] Test with `bun run storybook:web`

### Phase 2: Native App (Estimated: 3-4 hours)
- [ ] Install dependencies in `apps/native`
- [ ] Create `.storybook/main.ts`
- [ ] Create `.storybook/preview.tsx`
- [ ] Create `.storybook/index.tsx`
- [ ] Update `metro.config.cjs` with `withStorybook`
- [ ] Add scripts to `package.json`
- [ ] Create form component stories
- [ ] Create CategoryFilter stories
- [ ] Test on iOS/Android/Web

### Phase 3: Turborepo & Polish (Estimated: 1 hour)
- [ ] Update `turbo.json` with storybook tasks
- [ ] Update root `package.json` with scripts
- [ ] Update `biome.jsonc` to ignore outputs
- [ ] Update `.gitignore`
- [ ] Test full workflow

### Phase 4: Optional Web UI for Native (Estimated: 1-2 hours)
- [ ] Install `@storybook/react-native-web-vite`
- [ ] Create `.storybook-web/` configuration
- [ ] Test web build

---

## Notes and Considerations

1. **Storybook Version**: This plan uses Storybook 9.x which is the current latest. Verify compatibility before installation.

2. **UniWind Compatibility**: The native Storybook may require additional configuration to properly render Tailwind styles. Test thoroughly and adjust decorators as needed.

3. **heroui-native Components**: If documenting heroui-native components, they should work out of the box since they're React Native components.

4. **CI/CD**: Consider adding Storybook build to your CI pipeline for visual regression testing.

5. **Deployment**: Static Storybook builds can be deployed to Vercel, Netlify, or GitHub Pages for team access.
