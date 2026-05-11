# App Assets

These files are required by Expo / EAS Build before submission to the App Store or Play Store. The current files are **solid-color placeholders** so the project builds — replace each one with the final designed artwork before shipping to production.

## Files

| File | Size | Purpose | Background |
|------|------|---------|-----------|
| `icon.png` | 1024 x 1024 | App icon (iOS + Android source). No transparency, no rounded corners — stores add them. | #0A0A0A |
| `splash.png` | 1024 x 1024+ (any) | Splash / launch screen image. Centered, transparent OK. | #0A0A0A |
| `adaptive-icon.png` | 1024 x 1024 | Android adaptive icon foreground. Keep important content inside the central 66% safe zone. | #0A0A0A (background set in `app.json`) |
| `notification-icon.png` | 96 x 96 | Android status-bar notification icon. Must be a solid silhouette on transparent background. | transparent |
| `favicon.png` | 48-64 px | Web favicon. | transparent |

## How to generate the real assets

The simplest path is to commission a designer (Fiverr / 99designs, $20–50) and ask them to deliver:

- One **1024×1024 PNG** master icon (no transparency, no rounded corners)
- One **monochrome white silhouette** on transparent background for `notification-icon.png`

Then use Expo's CLI to derive everything else:

```bash
# From apps/mobile/
npx expo install expo-asset
# Replace icon.png and splash.png with the designed versions, then build.
```

EAS Build auto-generates platform-specific sizes from `icon.png`. The asset bundle pattern in `app.json` (`"**/*"`) ensures everything is shipped.

## Brand reference

- **Primary background:** `#0A0A0A`
- **Brand accent (orange):** `#FF4500`
- **Body text:** `#F5F5F5` (off-white) on dark
- **Font:** JetBrains Mono (display), Space Grotesk (UI)

Use the microphone-on-dark motif suggested in `DEPLOYMENT_PHASES.md` Phase 7.
