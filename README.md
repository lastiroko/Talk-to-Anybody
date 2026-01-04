# SpeakCoach Monorepo

Cross-platform AI public speaking coach (placeholder name) with Expo React Native app and Fastify Node backend.

## Structure
- `apps/mobile` – Expo React Native (TypeScript) app.
- `apps/api` – Fastify Node.js (TypeScript) API server scaffold (coming next).
- `packages/shared` – shared TypeScript types and Zod schemas.
- `docs` – product spec, API contracts, content schema.

## Getting started
1. Install Node.js (>=18 recommended) and npm.
2. Install dependencies:
   - `npm install` at repo root (uses npm workspaces).
3. Run scripts (placeholders for now):
   - `npm run lint`
   - `npm run format`
   - `npm run typecheck`

## Run the mobile app (Stage 1)
- `cd apps/mobile`
- `npm start` (Expo dev server)
- Use the Expo Dev Tools QR or emulator shortcuts for iOS/Android/web

## Docs
- Product spec: [`docs/spec.md`](docs/spec.md)
- API contracts: [`docs/api.md`](docs/api.md)
- Content schema: [`docs/content-schema.md`](docs/content-schema.md)

## Next steps
- Stage 1: scaffold the mobile app (Expo) and API app (Fastify) using shared configs.
- Stage 2+: implement recording, analysis pipeline integrations, purchases, and dashboards.
