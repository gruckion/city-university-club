import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "City University Club",
  slug: "city-university-club",
  version: "1.0.0",
  orientation: "portrait",
  scheme: "cityuniversityclub",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,

  // Universal app icon (fallback)
  icon: "./assets/images/icons/ios-light.png",

  // iOS-specific configuration
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.cityuniversityclub.app",
    config: {
      usesNonExemptEncryption: false,
    },
    // iOS icons with dark mode support (iOS 18+)
    icon: {
      light: "./assets/images/icons/ios-light.png",
      dark: "./assets/images/icons/ios-dark.png",
      tinted: "./assets/images/icons/ios-tinted.png",
    },
  },

  // Android-specific configuration
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/icons/adaptive-icon.png",
      monochromeImage: "./assets/images/icons/adaptive-icon.png",
      backgroundColor: "#06273A",
    },
    package: "com.cityuniversityclub.app",
  },

  // Web-specific configuration
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/icons/favicon.ico",
  },

  // Plugins
  plugins: [
    "expo-font",
    "expo-router",
    "expo-secure-store",
    "expo-web-browser",
    [
      "expo-sensors",
      {
        motionPermission:
          "Allow City University Club to access device motion for card animations",
      },
    ],
    [
      "expo-splash-screen",
      {
        backgroundColor: "#1a1a2e",
        image: "./assets/images/icons/splash-icon-light.png",
        imageWidth: 200,
        ios: {
          backgroundColor: "#1a1a2e",
          image: "./assets/images/icons/splash-icon-light.png",
          resizeMode: "contain",
        },
        android: {
          backgroundColor: "#1a1a2e",
          image: "./assets/images/icons/splash-icon-light.png",
          imageWidth: 200,
        },
        dark: {
          backgroundColor: "#0d0d1a",
          image: "./assets/images/icons/splash-icon-dark.png",
        },
      },
    ],
  ],

  // Experiments
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
});
