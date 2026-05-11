# Build & Submit — SpeakCoach

> Step-by-step guide to build the SpeakCoach mobile app with EAS and submit it to the App Store and Google Play. Phase 8 of `DEPLOYMENT_PHASES.md`.

This document is **operator-facing** — every command must be run by you on your machine with your developer accounts. Claude cannot execute these for you.

---

## 0. Prerequisites

- Node 20+ installed
- Apple Developer Account ($99/year) — https://developer.apple.com/programs/enroll/
- Google Play Developer Account ($25 one-time) — https://play.google.com/console/signup
- Expo account (free) — https://expo.dev/signup
- EAS CLI installed globally:
  ```powershell
  npm install -g eas-cli
  eas login
  ```

---

## 1. Create the EAS project

From the repo root, in PowerShell:

```powershell
cd apps/mobile
eas init --id ""
```

EAS will assign a `projectId`. Copy it and replace **both** occurrences of `REPLACE_WITH_EAS_PROJECT_ID` in `apps/mobile/app.json`:

- `expo.extra.eas.projectId`
- `expo.updates.url`

Commit that change.

---

## 2. Replace placeholder assets

The repo ships with solid-color placeholder PNGs at `apps/mobile/assets/`. Before any production build:

1. Commission or design a real 1024×1024 icon following the brief in `apps/mobile/assets/README.md`.
2. Replace `icon.png`, `splash.png`, `adaptive-icon.png`, `notification-icon.png`, `favicon.png`.

The App Store will reject a submission with the generic placeholder icon.

---

## 3. Configure secrets

The mobile app reads `EXPO_PUBLIC_*` env vars at build time. Set them in EAS so production builds embed the correct values:

```powershell
eas env:create --scope project --name EXPO_PUBLIC_API_BASE --value https://talk-to-anybody-api.fly.dev/api/v1 --environment production
# Repeat for preview if you want a separate API base
```

Server-side secrets (Deepgram, Anthropic, Supabase service role, etc.) live on the API server, not on the device — do not ship them with the mobile build.

---

## 4. Fill in submit credentials

Edit `apps/mobile/eas.json` and replace:

- `submit.production.ios.appleId` — the email tied to your Apple Developer account.
- `submit.production.ios.ascAppId` — App Store Connect numeric ID (from the App Information page in App Store Connect).
- `submit.production.ios.appleTeamId` — your 10-character Team ID (Apple Developer → Membership).
- `submit.production.android.serviceAccountKeyPath` — path to the Google Play service account JSON. Generate it from Google Play Console → Setup → API access → Create new service account, give it the **Release Manager** role, and download the JSON. Save it as `apps/mobile/google-service-account.json`. **Do not commit it** — it's already gitignored.

---

## 5. iOS production build & submit

```powershell
cd apps/mobile

# First build — EAS will prompt you to create/use distribution certificate
# and provisioning profile. Choose "Let Expo handle it" unless you have a reason not to.
eas build --platform ios --profile production

# Once the build finishes (10–20 min), submit:
eas submit --platform ios --profile production --latest
```

Then in App Store Connect:

1. Wait ~15 minutes for the binary to appear under **App Store** → **TestFlight**.
2. Add the binary to a new App Store version.
3. Fill in description, keywords, screenshots, age rating (copy from `docs/STORE_LISTING.md`).
4. Upload screenshots (see "Screenshot copy" in `STORE_LISTING.md`).
5. Add export compliance answer — we set `ITSAppUsesNonExemptEncryption: false` in `app.json` so this is automatic.
6. Submit for review.

**Typical first-review time:** 24–48 hours. Common rejection causes:

- Missing privacy policy URL — make sure `https://speakcoach.app/privacy` actually resolves.
- Crashes on launch — test on a real device first (`eas build --profile preview`).
- Subscription products not finalized in App Store Connect — products must be in **Ready to Submit** state before Apple will approve.

---

## 6. Android production build & submit

```powershell
cd apps/mobile

# Builds an .aab (Android App Bundle) for the Play Store
eas build --platform android --profile production

# Submit to the internal track first (safer than going straight to production)
eas submit --platform android --profile production --latest
```

In Google Play Console:

1. Internal testing → review & rollout (no review needed for internal tracks).
2. Test thoroughly on a real Android device.
3. When ready, **promote** the internal release to production (this triggers Play review, usually 1–3 days).
4. Fill in the Store listing using copy from `docs/STORE_LISTING.md`.
5. Complete the Data safety form using the answers in `STORE_LISTING.md`.
6. Set the Content rating via the IARC questionnaire.

---

## 7. OTA updates after launch

Once the binary is live, push JS-only updates without resubmitting:

```powershell
cd apps/mobile
eas update --branch production --message "Fix paywall copy"
```

This pushes to all installed apps within ~10 minutes. Use sparingly — Apple requires that OTA updates not change the core functionality of the app.

---

## 8. Versioning

Production builds use `expo.version` (the user-visible version string, e.g. `1.0.0`) and platform-specific build numbers. With `"appVersionSource": "remote"` in `eas.json`, EAS auto-increments the iOS `buildNumber` and Android `versionCode` on each production build, so you only ever need to bump `expo.version` for marketing-visible releases.

Bump `expo.version` in `app.json` before each release:

```powershell
# e.g. for a 1.0.1 release
# Edit apps/mobile/app.json -> "version": "1.0.1"
git commit -am "chore: bump version to 1.0.1"
eas build --platform all --profile production
```

---

## 9. Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| `eas build` fails with "Missing credentials" | First-time setup | Run `eas credentials` and let Expo provision them |
| iOS build succeeds but crashes on launch | Missing native module link | Run `npx expo prebuild --clean` then rebuild |
| Apple rejects for "incomplete metadata" | Subscription products not finalized | Mark all IAPs as **Ready to Submit** in App Store Connect |
| Play Console says "App Bundle missing" | Wrong build type | Confirm `production.android.buildType` is `app-bundle` in `eas.json` |
| Notifications don't fire on iOS | Missing entitlement | EAS auto-adds it when `expo-notifications` is in `plugins` — re-build if you added the plugin after the previous build |
| `eas submit` for Android fails authentication | Bad service account JSON | Confirm the JSON is in `apps/mobile/google-service-account.json` and the service account has Release Manager role |

---

## 10. After launch

- Monitor crash reports in EAS dashboard → Insights.
- Watch App Store ratings; respond to reviews from App Store Connect.
- Watch Play Console → Vitals for ANR/crash rates above 1.5% (Google will surface a "bad behavior" warning).
- Set up Sentry or similar if you want real-time error monitoring beyond what EAS provides.
