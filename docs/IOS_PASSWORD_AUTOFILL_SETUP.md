# iOS Password AutoFill Setup Guide

> **Status**: Planned - awaiting Apple Developer account setup
> **Created**: 2025-01-14
> **Website**: cityuniversityclub.co.uk (hosted on Wix)

## Problem Summary

iOS Password AutoFill is not showing automatic credential suggestions (QuickType bar) when returning to the login screen. Users see the "Passwords" key icon but no automatic suggestions.

### Root Cause Analysis

Three compounding issues:

1. **Expo Go Limitation**: Running in Expo Go means passwords are saved under "Expo" bundle ID (`host.exp.Exponent`), not the app's bundle ID. Expo Go cannot use custom Associated Domains entitlements.

2. **Missing Associated Domains Configuration**: The app lacks `associatedDomains` configuration needed for iOS to match saved credentials to the app.

3. **iOS Simulator Bugs**: Even with correct configuration, iOS Simulator has known inconsistent behavior with password autofill.

### How iOS Password AutoFill Works

| Feature | Requirement | Current Status |
|---------|-------------|----------------|
| Save password prompt | `textContentType="newPassword"` | ✅ Working |
| "Passwords" key icon | `textContentType="password"` | ✅ Working |
| **QuickType bar suggestions** | Associated Domains + AASA file + Native build | ❌ Not configured |

From Apple's documentation:
> "The QuickType bar only appears if the user has at least one password saved on the iOS device and the Keychain AutoFill setting is enabled. The QuickType bar includes any credentials for your associated domains."

---

## Solution: Development Build with Associated Domains

### Requirements

| Requirement | Status | Cost | Notes |
|-------------|--------|------|-------|
| Expo Account | ❌ Needed | Free | https://expo.dev/signup |
| EAS CLI | ❌ Needed | Free | `npm install -g eas-cli` |
| EAS Build (cloud) | ❌ Needed | Free tier: 30 builds/month | |
| Apple Developer Account | ❌ Needed | $99/year | Required for device builds |
| Apple Team ID | ❌ Needed | Included with dev account | 10-char code like `ABCD123456` |

### Build Options

- **iOS Simulator builds**: Free (no Apple Developer account needed)
- **iOS Device builds**: Requires paid Apple Developer account ($99/year)

---

## Planned Code Changes

### 1. Update `apps/native/app.config.ts`

Add `associatedDomains` to the iOS configuration:

```typescript
ios: {
  supportsTablet: true,
  bundleIdentifier: "com.cityuniversityclub.app",
  associatedDomains: ["webcredentials:cityuniversityclub.co.uk"],  // ADD THIS
  config: {
    usesNonExemptEncryption: false,
  },
  // ... rest of existing config
}
```

### 2. Create `apps/native/eas.json` (NEW FILE)

EAS Build configuration:

```json
{
  "cli": {
    "version": ">= 15.0.0",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "development-device": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

### 3. Create Apple App Site Association (AASA) File

**Option A: Next.js Route Handler** (if using Next.js for the domain)

Create `apps/web/src/app/.well-known/apple-app-site-association/route.ts`:

```typescript
import { NextResponse } from "next/server";

const AASA = {
  webcredentials: {
    apps: ["YOUR_TEAM_ID.com.cityuniversityclub.app"],  // Replace YOUR_TEAM_ID
  },
};

export async function GET() {
  return NextResponse.json(AASA, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
```

**Option B: Wix Hosting** (current hosting)

Since the website is hosted on Wix, you'll need to:

1. Create a file named `apple-app-site-association` (no extension) with content:
```json
{
  "webcredentials": {
    "apps": ["YOUR_TEAM_ID.com.cityuniversityclub.app"]
  }
}
```

2. Upload it to Wix so it's accessible at:
   `https://cityuniversityclub.co.uk/.well-known/apple-app-site-association`

3. Ensure the response has `Content-Type: application/json`

**Wix Limitations**: Wix may not support serving files from `/.well-known/` paths. You may need to:
- Use Wix Velo (custom code) to create an HTTP function
- Point a subdomain to your Next.js app for the AASA file
- Use a reverse proxy or CDN like Cloudflare

### 4. Install Dependencies

```bash
cd apps/native
npx expo install expo-dev-client
```

This adds `expo-dev-client` to `package.json`.

---

## Setup Steps (After Apple Developer Account)

### Step 1: Get Your Apple Team ID

1. Go to https://developer.apple.com/account
2. Look in "Membership details" section
3. Copy the "Team ID" (10-character alphanumeric code)

### Step 2: Update AASA File

Replace `YOUR_TEAM_ID` with your actual Team ID in the AASA configuration.

### Step 3: Deploy AASA File

Make the AASA file accessible at:
```
https://cityuniversityclub.co.uk/.well-known/apple-app-site-association
```

Verify with:
```bash
curl -I https://cityuniversityclub.co.uk/.well-known/apple-app-site-association
```

Should return `Content-Type: application/json` and HTTP 200.

### Step 4: Install EAS CLI

```bash
npm install -g eas-cli
```

### Step 5: Login to Expo

```bash
eas login
```

### Step 6: Configure EAS

```bash
cd apps/native
eas build:configure
```

### Step 7: Build Development Client

**For iOS Simulator (free):**
```bash
eas build --platform ios --profile development
```

**For iOS Device (requires Apple Developer account):**
```bash
eas build --platform ios --profile development-device
```

### Step 8: Install and Test

1. Download the build from Expo dashboard or use `eas build:run`
2. Install on simulator/device
3. Start the bundler: `npx expo start`
4. Test password autofill functionality

---

## Important Notes

### Expo Go No Longer Works

After adding `expo-dev-client`, the app will no longer open in Expo Go. You must use the development build instead. The development workflow is:

1. Build once with EAS (`eas build`)
2. Install the development build
3. Start bundler with `npx expo start`
4. App connects to your local bundler

### AASA Caching

iOS caches the AASA file aggressively. After deploying changes:
- Wait 24-48 hours for cache to refresh
- Or reinstall the app to force re-fetch
- Use Apple's AASA validator: https://app-site-association.cdn-apple.com/a/v1/cityuniversityclub.co.uk

### Wix AASA Hosting Challenge

Wix may not support the `/.well-known/` path natively. Options:
1. **Cloudflare Workers**: Proxy the AASA request
2. **Subdomain**: Point `api.cityuniversityclub.co.uk` to your Next.js app
3. **Wix Velo HTTP Function**: Create a custom endpoint (if supported)

### Testing on Simulator vs Device

| Environment | Password Save | QuickType Suggestions |
|-------------|---------------|----------------------|
| Expo Go | Works (under "Expo") | Never works |
| Dev Build + Simulator | Works (under your app) | Inconsistent (known Apple bug) |
| Dev Build + Device | Works | Should work properly |

---

## Validation Tools

- **AASA Validator**: https://branch.io/resources/aasa-validator/
- **Apple CDN Check**: `https://app-site-association.cdn-apple.com/a/v1/cityuniversityclub.co.uk`
- **Manual Check**: `curl https://cityuniversityclub.co.uk/.well-known/apple-app-site-association`

---

## References

- [Expo: iOS Universal Links](https://docs.expo.dev/linking/ios-universal-links/)
- [Expo: Development Builds](https://docs.expo.dev/develop/development-builds/create-a-build/)
- [Apple: Password AutoFill](https://developer.apple.com/documentation/security/password-autofill)
- [Gist: Password AutoFill for Expo](https://gist.github.com/amcvitty/42cbe072184fe72485ad17cd7120bb89)
- [Apple: Supporting Associated Domains](https://developer.apple.com/documentation/xcode/supporting-associated-domains)

---

## TODO Checklist

- [ ] Create Apple Developer account ($99/year)
- [ ] Get Apple Team ID from developer portal
- [ ] Create Expo account (free)
- [ ] Update `app.config.ts` with `associatedDomains`
- [ ] Create `eas.json` configuration
- [ ] Install `expo-dev-client`
- [ ] Deploy AASA file to `cityuniversityclub.co.uk/.well-known/`
- [ ] Verify AASA file is accessible with correct content-type
- [ ] Run `eas build:configure`
- [ ] Build development client for iOS
- [ ] Test password autofill on simulator
- [ ] Test password autofill on real device
