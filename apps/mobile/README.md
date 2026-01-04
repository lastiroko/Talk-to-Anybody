# SpeakCoach Mobile (Expo)

React Native app scaffolded with Expo (TypeScript) for the SpeakCoach product.

## Requirements
- Node.js >= 18
- npm (uses workspace from repo root)
- Expo CLI via `npx expo` (installed automatically on first run)

## Setup
1. From repo root, install dependencies (this will also install mobile dependencies):
   ```bash
   npm install
   ```
   > Note: if registry access is restricted, configure your npm proxy/registry before installing.
2. Start the development server:
   ```bash
   cd apps/mobile
   npm start
   ```
3. Use the Expo Dev Tools QR or device/emulator shortcuts for iOS/Android/web.
   - If your npm registry blocks downloads, set the registry or proxy first, then rerun `npm install`.

## Navigation flow
- Auth stack: Welcome → Login/Signup (placeholder buttons simulate auth)
- Onboarding stack: Goal → Time preference → Baseline placeholder
- Main tabs: Home, Plan, Practice, Progress, Settings

## Project structure
- `App.tsx` – sets the current flow (auth → onboarding → main tabs)
- `src/navigation/AppNavigator.tsx` – navigation stacks and tabs
- `src/screens/*` – placeholder screens
- `src/components/*` – shared UI components (button, screen container)
- `src/theme/*` – color, spacing, typography tokens

## Assets
- No binary icons/splash assets are bundled in this repo. Expo will fall back to defaults; add your own under `apps/mobile/assets/` and wire them in `app.json` when ready.
