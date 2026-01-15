# Expo Native Development & Deployment Guide

A comprehensive guide to understanding Expo's native development workflow, from local development to app store deployment.

## Table of Contents

- [Native Directories (android/ios)](#native-directories-androidios)
  - [What Are They?](#what-are-they)
  - [Why Are They Generated?](#why-are-they-generated)
  - [Should They Be Gitignored?](#should-they-be-gitignored)
- [Expo Prebuild](#expo-prebuild)
  - [What Is Prebuild?](#what-is-prebuild)
  - [Common Commands](#common-commands)
  - [When to Use --clean](#when-to-use---clean)
- [Expo Go vs Development Builds](#expo-go-vs-development-builds)
  - [Expo Go](#expo-go)
  - [Development Builds](#development-builds)
  - [Comparison Table](#comparison-table)
- [Splash Screens](#splash-screens)
  - [Configuration](#configuration)
  - [Common Issues](#common-issues)
- [Deploying to App Stores](#deploying-to-app-stores)
  - [Prerequisites](#prerequisites)
  - [EAS Build & Submit Overview](#eas-build--submit-overview)
- [iOS Deployment](#ios-deployment)
  - [TestFlight (Beta Testing)](#testflight-beta-testing)
  - [App Store (Production)](#app-store-production)
- [Android Deployment](#android-deployment)
  - [Internal Testing (TestFlight Equivalent)](#internal-testing-testflight-equivalent)
  - [Google Play Store (Production)](#google-play-store-production)
- [Quick Reference Commands](#quick-reference-commands)
- [Resources](#resources)

---

## Native Directories (android/ios)

### What Are They?

The `android/` and `ios/` directories contain the complete native code required to build your app for each platform:

| Directory | Contents |
|-----------|----------|
| `android/` | Gradle build files, Java/Kotlin source, AndroidManifest.xml, resources |
| `ios/` | Xcode project, Swift/Objective-C source, Info.plist, CocoaPods dependencies |

### Why Are They Generated?

These directories are generated when you need capabilities beyond Expo Go:

1. **Run on physical devices/simulators** - Build standalone apps, not sandboxed in Expo Go
2. **Use native modules** - Access device features like Keychain, secure storage, sensors
3. **Custom configuration** - Bundle IDs, app icons, splash screens, permissions
4. **Production builds** - Required for App Store and Play Store submissions

### Should They Be Gitignored?

**Yes.** According to [official Expo documentation](https://docs.expo.dev/workflow/continuous-native-generation/):

> "The android and ios directories are automatically added to .gitignore when you create a new project, ensuring they are not committed between prebuilds."

**Recommended `.gitignore` entries:**

```gitignore
# Native directories (generated via expo prebuild)
/android
/ios
```

**Why gitignore them?**
- They're regenerated from `app.config.ts` and `package.json`
- Keeps repository clean and small
- Avoids merge conflicts in generated code
- EAS Build regenerates them automatically in the cloud

---

## Expo Prebuild

### What Is Prebuild?

Prebuild is Expo's **Continuous Native Generation (CNG)** system. It generates native `android/` and `ios/` directories from your configuration files, similar to how `node_modules/` is generated from `package.json`.

### Common Commands

```bash
# Generate both platforms
npx expo prebuild

# Generate specific platform
npx expo prebuild --platform android
npx expo prebuild --platform ios

# Clean regeneration (delete and recreate)
npx expo prebuild --clean

# Run and build (implicitly runs prebuild if needed)
npx expo run:android
npx expo run:ios
```

### When to Use --clean

Use `--clean` when:

| Scenario | Command |
|----------|---------|
| Added/removed native dependencies | `npx expo prebuild --clean` |
| Changed `app.config.ts` native settings | `npx expo prebuild --clean` |
| Upgraded Expo SDK version | `npx expo prebuild --clean` |
| Build errors after dependency changes | `npx expo prebuild --clean` |
| Corrupted native directories | `npx expo prebuild --clean` |

**Example scenario:**
```bash
# 1. Add a native dependency
bun add expo-splash-screen

# 2. Regenerate native code to include it
npx expo prebuild --clean

# 3. Build and run
npx expo run:android
```

---

## Expo Go vs Development Builds

### Expo Go

A pre-built sandbox app from the App Store/Play Store with common native modules pre-installed.

**Included packages:**
- expo-camera, expo-location, expo-notifications
- expo-file-system, expo-media-library
- expo-sensors, expo-haptics
- And many more ([full list](https://docs.expo.dev/versions/latest/))

**Limitations:**
- Cannot add custom native modules
- Limited to modules included in Expo Go
- Cannot customize native configuration
- Cannot use for production releases

### Development Builds

Custom-built versions of your app with your specific native modules and configuration.

**Benefits:**
- Include any native module
- Custom bundle ID, icons, splash screens
- Debug on physical devices
- Test production-like builds locally

### Comparison Table

| Feature | Expo Go | Development Build |
|---------|---------|-------------------|
| Setup time | Instant | Requires build (~5-15 min) |
| Custom native modules | No | Yes |
| Custom app config | No | Yes |
| Hot reload | Yes | Yes |
| Production testing | No | Yes |
| App Store submission | No | Yes |
| File size | ~80MB (shared) | Your app size |

---

## Splash Screens

### Configuration

Splash screens are configured in `app.config.ts` using the `expo-splash-screen` plugin:

```typescript
export default {
  plugins: [
    [
      "expo-splash-screen",
      {
        backgroundColor: "#ffffff",
        image: "./assets/splash.png",
        imageWidth: 200,
        // iOS 18+ dark mode support
        dark: {
          backgroundColor: "#000000",
          image: "./assets/splash-dark.png",
        },
      },
    ],
  ],
};
```

### Common Issues

**Error: `resource style/Theme.SplashScreen not found`**

This means `expo-splash-screen` is not installed but is referenced in your config.

**Fix:**
```bash
# 1. Install the package
bun add expo-splash-screen

# 2. Regenerate native code
npx expo prebuild --clean

# 3. Rebuild
npx expo run:android
```

---

## Deploying to App Stores

### Prerequisites

| Platform | Requirement | Cost |
|----------|-------------|------|
| Both | Expo account | Free |
| Both | EAS CLI | Free |
| iOS | Apple Developer Account | $99/year |
| Android | Google Play Developer Account | $25 one-time |

**Install EAS CLI:**
```bash
npm install -g eas-cli
eas login
```

### EAS Build & Submit Overview

EAS (Expo Application Services) provides cloud-based building and submission:

```
app.config.ts  →  EAS Build  →  .ipa/.aab  →  EAS Submit  →  App Stores
```

---

## iOS Deployment

### TestFlight (Beta Testing)

TestFlight is Apple's beta testing platform for iOS apps.

#### Quickest Method: npx testflight

```bash
npx testflight
```

This single command handles everything:
1. Creates production iOS build
2. Manages certificates and provisioning
3. Uploads to App Store Connect
4. Enables TestFlight distribution

#### Manual Method: EAS Build + Submit

```bash
# 1. Build for iOS
eas build --platform ios --profile production

# 2. Submit to App Store Connect (appears in TestFlight)
eas submit --platform ios
```

#### With Auto-Submit

```bash
eas build --platform ios --profile production --auto-submit
```

#### TestFlight Testing Limits

| Type | Limit | Review Required |
|------|-------|-----------------|
| Internal testers | 100 | No |
| External testers | 10,000 | Yes (usually hours) |

### App Store (Production)

After TestFlight testing:

1. Log into [App Store Connect](https://appstoreconnect.apple.com)
2. Select your app → TestFlight → select build
3. Click "Submit for Review"
4. Wait for Apple review (typically 24-48 hours)

---

## Android Deployment

### Internal Testing (TestFlight Equivalent)

Google Play Console's **Internal Testing Track** is the Android equivalent of TestFlight.

#### Features

| Feature | Details |
|---------|---------|
| Tester limit | 100 internal testers |
| Availability | Minutes after upload |
| Cost | Free (paid apps are free for testers) |
| Review required | No |
| Distribution | Via Play Store (internal link) |

#### Testing Tracks Comparison

| Track | Purpose | Testers | Review |
|-------|---------|---------|--------|
| Internal | QA/dev team | 100 | No |
| Closed (Alpha) | Selected external | Unlimited | No |
| Open (Beta) | Public beta | Unlimited | No |
| Production | Public release | Everyone | Yes |

### Google Play Store (Production)

#### First-Time Setup

1. Create app in [Google Play Console](https://play.google.com/console)
2. Create a Google Service Account Key ([guide](https://docs.expo.dev/submit/android/))
3. **Manually upload first build** (Google API requirement)

#### Subsequent Submissions

```bash
# Build for Android
eas build --platform android --profile production

# Submit to Play Store
eas submit --platform android
```

#### With Auto-Submit

```bash
eas build --platform android --profile production --auto-submit
```

---

## Quick Reference Commands

### Local Development

```bash
# Start Metro bundler
npx expo start

# Run on Android emulator/device
npx expo run:android

# Run on iOS simulator/device
npx expo run:ios

# Regenerate native directories
npx expo prebuild --clean
```

### Building & Submitting

```bash
# iOS to TestFlight (easiest)
npx testflight

# Build for both platforms
eas build --platform all

# Build specific platform
eas build --platform ios
eas build --platform android

# Submit to stores
eas submit --platform ios
eas submit --platform android

# Build and auto-submit
eas build --platform all --auto-submit
```

### CI/CD Workflow Example

Create `.eas/workflows/build-and-submit.yml`:

```yaml
on:
  push:
    branches: ['main']

jobs:
  build_ios:
    type: build
    params:
      platform: ios
      profile: production

  build_android:
    type: build
    params:
      platform: android
      profile: production

  submit_ios:
    needs: [build_ios]
    type: testflight
    params:
      build_id: ${{ needs.build_ios.outputs.build_id }}

  submit_android:
    needs: [build_android]
    type: submit
    params:
      build_id: ${{ needs.build_android.outputs.build_id }}
```

---

## Resources

### Official Documentation

- [Continuous Native Generation (CNG)](https://docs.expo.dev/workflow/continuous-native-generation/)
- [Adopt Prebuild](https://docs.expo.dev/guides/adopting-prebuild/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [EAS Submit](https://docs.expo.dev/submit/introduction/)
- [Submit to Apple App Store](https://docs.expo.dev/submit/ios/)
- [Submit to Google Play Store](https://docs.expo.dev/submit/android/)
- [npx testflight Command](https://docs.expo.dev/build-reference/npx-testflight/)

### Platform Documentation

- [App Store Connect](https://appstoreconnect.apple.com)
- [Google Play Console](https://play.google.com/console)
- [TestFlight Documentation](https://developer.apple.com/testflight/)
- [Google Play Internal Testing](https://support.google.com/googleplay/android-developer/answer/9845334)

### Cost Summary

| Service | Cost |
|---------|------|
| Expo Account | Free |
| EAS Build (free tier) | 30 builds/month |
| Apple Developer Program | $99/year |
| Google Play Developer | $25 one-time |
