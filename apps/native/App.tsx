/**
 * App Entry Point - Conditional Storybook/App Toggle
 *
 * This file serves as the entry point that conditionally loads either:
 * - Storybook UI when STORYBOOK=true environment variable is set
 * - Normal expo-router app otherwise
 *
 * Usage:
 * - Normal app: bun run start
 * - Storybook: STORYBOOK=true bun run start (or bun run storybook)
 */
import Constants from "expo-constants";

// Check if Storybook mode is enabled via environment variable
const STORYBOOK_ENABLED =
  Constants.expoConfig?.extra?.storybookEnabled === true ||
  process.env.STORYBOOK === "true";

let App: React.ComponentType;

if (STORYBOOK_ENABLED) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  App = require("./.rnstorybook").default;
} else {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  App = require("expo-router/entry").default;
}

export default App;
