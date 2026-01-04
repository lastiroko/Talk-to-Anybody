# SpeakCoach API (REST, /api/v1)

## Auth
- `POST /auth/signup` – email/password signup.
- `POST /auth/login` – email/password login.
- `POST /auth/apple` / `POST /auth/google` – federated login (optional in MVP).
- `POST /auth/refresh` – refresh tokens.

## Plan & Progress
- `GET /plan` – list days with lock/completion status.
- `GET /plan/day/:dayNumber` – full day detail JSON.
- `POST /plan/day/:dayNumber/complete` – mark completion (includes reflection + metrics ref).
- `GET /progress/summary` – streak, totals, trend metrics (WPM, fillers/min, Speaking Score).

## Sessions & Recording
- `POST /sessions` – create session (mode: daily/freestyle/script/impromptu/roleplay/game).
- `POST /sessions/:id/upload-url` – presigned URL for audio upload.
- `POST /sessions/:id/submit` – mark recording ready for analysis.
- `GET /sessions/:id` – session status (queued | processing | done | error).

## Analysis
- `GET /sessions/:id/analysis` – scorecard JSON with metrics, scores, coaching tips.

## Purchases
- `POST /purchase/verify` – verify receipt/token (iOS/Android) for monthly/lifetime.
- `GET /purchase/status` – current entitlement (free/paid, expiry when applicable).

## Support
- `POST /feedback/report` – report bad coaching/transcript issues with references.
