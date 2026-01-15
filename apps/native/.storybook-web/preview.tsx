import type { Preview } from "@storybook/react";
import type { ReactNode } from "react";
import { View } from "react-native";

// Import global styles for UniWind/Tailwind
import "../global.css";

// CUC Brand Colors (hex values for Storybook background)
const CUC_COLORS = {
  light: {
    background: "#fffef8", // cream
    foreground: "#06273a", // navy
    accent: "#85b09a", // sage
  },
  dark: {
    background: "#030d14", // very dark navy
    foreground: "#fffef8", // cream
    accent: "#85b09a", // sage
  },
};

/**
 * Storybook decorator that wraps stories with necessary providers
 */
const withProviders = (Story: () => ReactNode) => (
  <View
    style={{
      flex: 1,
      padding: 16,
      backgroundColor: CUC_COLORS.light.background,
    }}
  >
    <Story />
  </View>
);

const preview: Preview = {
  decorators: [withProviders],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: "CUC Light",
      values: [
        {
          name: "CUC Light",
          value: CUC_COLORS.light.background,
        },
        {
          name: "CUC Dark",
          value: CUC_COLORS.dark.background,
        },
      ],
    },
  },
};

export default preview;
