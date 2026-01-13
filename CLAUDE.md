# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
bun install

# Development - run all apps (web, native, backend)
bun run dev

# Development - individual apps
bun run dev:web     # Next.js web app on port 3001
bun run dev:native  # Expo React Native app
bun run dev:server  # Convex backend only

# Initial setup (first time)
bun run dev:setup   # Configure Convex project

# Build and type checking
bun run build
bun run check-types

# Linting and formatting (Biome)
bun biome check --write .

# Cloudflare deployment (from apps/web/)
cd apps/web && bun run alchemy dev    # Local dev
cd apps/web && bun run deploy         # Deploy
cd apps/web && bun run destroy        # Tear down
```

## Architecture

This is a Turborepo monorepo with a shared Convex backend serving both a Next.js web app and an Expo React Native app.

### Workspace Structure
- `apps/web` - Next.js 16 web app (port 3001)
- `apps/native` - Expo/React Native mobile app
- `packages/backend` - Convex functions and schema (`convex/` directory)
- `packages/env` - Typed environment variables (t3-env), exports `env/web` and `env/native`
- `packages/config` - Shared TypeScript config
- `packages/infra` - Alchemy infrastructure for Cloudflare deployment

### Authentication Flow
Better-Auth integrated with Convex:
- Backend: `packages/backend/convex/auth.ts` creates auth client with `@convex-dev/better-auth`
- Web client: `apps/web/src/lib/auth-client.ts` uses Better-Auth React client
- Web server: `apps/web/src/lib/auth-server.ts` provides SSR auth helpers via `convexBetterAuthNextJs`
- Native client: `apps/native/lib/auth-client.ts` uses Better-Auth with Expo SecureStore

The web app wraps children in `ConvexBetterAuthProvider` which handles token synchronization.

### Convex Backend
- Schema defined in `packages/backend/convex/schema.ts`
- Components configured in `convex.config.ts` (betterAuth, agent)
- AI agent setup using `@convex-dev/agent` with Google Gemini (`agent.ts`, `chat.ts`)

### Environment Variables
- Web: `NEXT_PUBLIC_CONVEX_URL`, `NEXT_PUBLIC_CONVEX_SITE_URL`
- Native: `EXPO_PUBLIC_CONVEX_URL`, `EXPO_PUBLIC_CONVEX_SITE_URL`
- Backend: `SITE_URL`, `NATIVE_APP_URL`, `GOOGLE_GENERATIVE_AI_API_KEY`

Copy `.env.local` from `packages/backend/` to both `apps/web/.env` and `apps/native/.env` after setup.

## Code Style

- Biome for linting/formatting with tab indentation and double quotes
- Tailwind CSS v4 with sorted class names (`cn`, `clsx`, `cva` functions)
- Pre-commit hook runs Biome on staged files (lefthook)
