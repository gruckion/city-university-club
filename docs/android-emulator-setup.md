# Android Emulator Setup for Expo React Native

This document covers setting up an Android emulator on Apple Silicon Mac for testing the Expo React Native application, along with Maestro UI testing integration.

## Current Environment Status (After Setup)

| Component | Status | Notes |
|-----------|--------|-------|
| Maestro | Installed (v2.1.0) | UI testing framework, connects to emulator |
| Java | JDK 21 (via Android Studio) | Android Studio's bundled JBR |
| Android Studio | Installed (2025.2.2.8) | Installed via Homebrew |
| Android SDK | Configured | `$HOME/Library/Android/sdk` |
| AVD | Pixel_8_API_35 | Android 15, ARM64, Google APIs |

## Key Understanding: Maestro vs Emulators

**Maestro is a UI testing framework, not an emulator provider.**

- Maestro downloaded OpenJDK because it requires Java 17+ for its test automation engine
- Maestro connects to existing emulators/simulators to run tests
- You must install Android Studio separately to get the Android emulator
- Maestro will automatically detect running emulators when executing tests

## Setup Steps

### Step 1: Install Android Studio

Download Android Studio from: https://developer.android.com/studio

For Apple Silicon Macs (M1/M2/M3/M4), Android Studio includes native ARM64 support with excellent performance.

### Step 2: Configure Android SDK

After installing Android Studio:

1. Open Android Studio
2. Go to **Settings > Languages & Frameworks > Android SDK**
3. From the **SDK Platforms** tab, select **Android 15 (VanillaIceCream)**:
   - Android SDK Platform 35
   - Sources for Android 35
   - **Google APIs ARM 64 v8a System Image** (critical for Apple Silicon - do NOT use x86 images)
4. From the **SDK Tools** tab:
   - Ensure Android SDK Build-Tools 35.0.0 is selected
   - Android Emulator
   - Android SDK Platform-Tools
5. Click **Apply** to download and install

### Step 3: Configure Environment Variables

Add to `~/.zshrc` or `~/.zprofile`:

```bash
# Android SDK
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

Then reload the shell configuration:

```bash
source ~/.zshrc
```

Verify the setup:

```bash
echo $ANDROID_HOME
# Should output: /Users/sigex/Library/Android/sdk

adb --version
# Should show Android Debug Bridge version
```

### Step 4: Create Android Virtual Device (AVD)

1. In Android Studio: **Tools > Device Manager**
2. Click **Create Virtual Device**
3. Choose a device profile:
   - **Recommended**: Pixel 8 or Medium Phone (idiomatic for Android development)
   - These profiles accurately represent how apps run on most Android devices
4. Select system image:
   - Choose **API 35** (Android 15)
   - **Must be ARM64-v8a** for Apple Silicon
5. Configure AVD settings and finish

### Step 5: Run the Expo App on Android Emulator

1. Start the emulator from Android Studio Device Manager
2. In terminal, run the Expo development server:
   ```bash
   bun run dev:native
   ```
3. Press `a` in the Expo CLI to open on Android
4. The app will build and install on the emulator

## Samsung Galaxy Device Considerations

### Most Popular Samsung Phones (2024-2025)

By sales volume:
- **Galaxy A15/A16** (budget line) - Actually the best-selling Samsung phones
- **Galaxy S24/S25 Ultra** - Flagship devices, popular but lower volume

### Emulator Options for Samsung

Samsung provides [official emulator skins](https://developer.samsung.com/galaxy-emulator-skin) that give the visual appearance of Galaxy devices.

**Important limitation**: Samsung skins are cosmetic only - they run stock Android, not Samsung's One UI. They don't include Samsung-specific features.

### Recommendation

**Use Pixel or generic device profiles** for Expo/React Native development:
- Pixel 8
- Medium Phone
- These are the standard choices and accurately test Android behavior
- Samsung skins add visual chrome but don't change functionality

## Maestro Integration

Once the emulator is running, Maestro will automatically detect it:

```bash
# Verify Maestro can see the emulator
maestro test your-flow.yaml
```

Maestro supports:
- Android emulators and physical devices
- iOS simulators (not physical iOS devices)
- React Native and Expo apps
- YAML-based test flows

## System Requirements

For optimal Android emulator performance on Apple Silicon:

| Requirement | Recommended |
|-------------|-------------|
| Mac | Any Apple Silicon (M1, M2, M3, M4) |
| RAM | 16 GB or more |
| Storage | 512 GB+ (Android Studio + SDK ~10-15 GB) |
| macOS | 11 Big Sur or later |

## Troubleshooting

### Emulator won't start
- Ensure you selected ARM64-v8a system image, not x86
- Check that virtualization is enabled (usually default on Mac)

### Expo can't find emulator
- Make sure emulator is fully booted before running `npx expo run:android`
- Verify `ANDROID_HOME` is set correctly
- Run `adb devices` to check if emulator is detected

### Slow performance
- Close other heavy applications
- Allocate more RAM to the emulator in AVD settings
- Use a simpler device profile (e.g., Medium Phone vs Pixel 8 Pro)

## Quick Start (After Setup)

### Start the Emulator

```bash
# Option 1: Using emulator command
$ANDROID_HOME/emulator/emulator -avd Pixel_8_API_35 &

# Option 2: Using Android Studio
# Open Android Studio > Tools > Device Manager > Click Play on Pixel_8_API_35
```

### Verify Emulator is Running

```bash
adb devices
# Should show: emulator-5554    device
```

### Run Expo App on Android

```bash
# Start the development server
bun run dev:native

# Press 'a' in the Expo CLI to open on Android
# Or run directly:
npx expo run:android
```

### Run Maestro Tests

```bash
# Maestro will auto-detect the running emulator
maestro test your-flow.yaml
```

## References

- [Expo Android Studio Emulator Documentation](https://docs.expo.dev/workflow/android-studio-emulator/)
- [React Native Environment Setup](https://reactnative.dev/docs/set-up-your-environment)
- [Android Studio AVD Manager](https://developer.android.com/studio/run/managing-avds)
- [Samsung Galaxy Emulator Skin](https://developer.samsung.com/galaxy-emulator-skin)
- [Maestro Documentation](https://maestro.mobile.dev/)
- [Maestro GitHub](https://github.com/mobile-dev-inc/Maestro)
