# AI Public Speaking Coach (React Native iOS + Android)

## 1. Product positioning
### 1.1 One-liner
Duolingo-style, Codecademy-themed, 60-day public speaking plan with daily exercises, AI feedback (voice + content), and mini-games at €5/month or €30 lifetime.

### 1.2 Differentiation vs competitors
- **Orai** (Google Play): strong analysis + practice but higher pricing (~$9.99/mo). Our edge: structured 60-day content, better gamification, cheaper pricing, inner games, measurable improvement score.
- **PatterAI** (App Store): similar daily practice + AI feedback + roleplay; reviews cite paywall and content quality issues. Our edge: quality-controlled content, transparent pricing, deeper plan with practice principles + exposure ladder.

## 2. Pricing & packaging (app-store safe)
### 2.1 Plans
- **Monthly subscription:** €5/month (auto-renew).
- **Lifetime non-consumable:** €30 one-time.
- Lifetime users keep core coaching forever. Compute-heavy deep analysis uses fair-use limits (e.g., X minutes/day of Deep Coach) or optimized runs.

### 2.2 Paywall rules
- Show plan preview (day list) + 1–2 sample exercises free.
- Require purchase for: full 60-day plan, full analysis history, all mini-games, full deep-feedback (story/vocabulary coach).

## 3. Primary user journeys
### 3.1 Onboarding (3–5 minutes)
- Choose goal: Public speaking, Interviews, Work meetings, Social confidence.
- Choose baseline discomfort: anxiety rating (0–10) + speaking experience.
- Pick time: 5/10/15 minutes per day.
- Record baseline speech (60–90s prompt).
- App returns baseline scorecard, two focus areas, Day 1 unlocked.

### 3.2 Daily workout (5–12 minutes)
- Day card: 30–60s micro-lesson (text + optional audio), 1 drill (1–2 minutes), 1 recorded rep (60–180s), instant scorecard + 1–2 tips, 15s reflection (easier/same/harder).

### 3.3 Free practice modes
Freestyle, Script mode (paste script), Impromptu (random prompt), Roleplay (scenario prompts).

## 4. Feature requirements
### 4.1 Accounts & auth (MVP)
- Email + password; Apple/Google sign-in recommended.
- Store: profile (goal, experience), purchase status, progress (current day, streak).

### 4.2 60-day plan engine (content platform)
- Day list screen with 60 tiles.
- Each day: title, objective, exercise list, prompts, timer settings, target metrics.
- Lock/unlock: Day N after Day N-1 completed; optional skip not counted toward guarantee.
- **V1+:** adaptive paths (e.g., add filler mini-game days when struggling).

### 4.3 Recording & playback (MVP)
- Audio recording (WAV/CAF) with pause/resume, live timer, basic waveform.
- Playback with scrub, speed 0.8x–1.2x.
- Defaults: 60–180s recordings; hard cap 5 minutes.

### 4.4 Speech analysis + scorecard (MVP)
- Metrics: pace (WPM), pauses (count/avg), filler words/min (needs transcript), vocal variety (pitch proxy), energy (loudness proxy), clarity (sentence length/complexity), vocabulary richness (lexical diversity), structure (intro/body/close heuristics + LLM), storytelling (ABT/conflict→resolution LLM).
- Outputs: overall score 0–100; sub-scores delivery/clarity/story; top 2 fixes + 1 drill recommendation.
- **V1+:** filler timeline, compare-to-last overlay.

### 4.5 Inner games (mini-games)
- **MVP:** Filler Swap, Pause Punch, ABT Builder, Clarity Sprint.
- **V1+:** Pitch Painter; optional gesture coach later.

### 4.6 Progress dashboard (MVP)
- Streak, total minutes, trend charts (WPM, filler/min, vocal variety), Speaking Score improvement from baseline.
- **V1+:** weekly report; shareable before/after clip.

### 4.7 Notifications (MVP)
- Daily reminder at chosen time; streak rescue if missed.

## 5. 50% improvement guarantee
- Speaking Score composite (0–100): filler/min, pace control vs personal target, pause placement, vocal variety vs baseline, structure, clarity, story.
- Guarantee: if ≥50 of 60 days completed + baseline & final assessments, Speaking Score improves by ≥50% relative to baseline (e.g., 40 → 60).

## 6. AI & analysis architecture (cost-aware)
### 6.1 Pipeline
- Mobile uploads audio + metadata (prompt_id, duration) → backend stores → async job runs STT, audio feature extraction, NLP scoring + coaching → results saved and pushed.

### 6.2 Audio feature extraction
- VAD for speaking segments/pauses; compute WPM, pause stats, pitch range, loudness (RMS).
- Personal baseline normalization for fairness (e.g., +18% vocal variety vs baseline).

### 6.3 STT
- Use high-quality cloud STT for accuracy; store transcript, word-level timestamps (enables filler timeline).

### 6.4 Coaching engine (LLM)
- Two passes: structured scoring (JSON) then coaching message (≤90 words, 2 actionable tips, 1 encouragement, supportive tone).
- Example JSON:
```json
{
  "scores": {"overall": 72, "delivery": 68, "clarity": 74, "story": 70},
  "metrics": {"wpm": 154, "filler_per_min": 3.2, "avg_pause_sec": 0.7, "pitch_range_hz": 85},
  "wins": ["Clear opening", "Good pace control"],
  "fixes": [
    {"title": "Replace filler with pause", "drill_id": "pause_punch_01"},
    {"title": "Add a takeaway sentence", "drill_id": "abtbuilder_02"}
  ],
  "tags": ["impromptu", "clarity"]
}
```
- Hard rules: supportive tone only; no shaming/diagnosis.

### 6.5 Quality control
- Content proofreading pipeline (human + automated); LLM output post-check (grammar, forbidden phrases, length). Provide "Report bad feedback" button.

## 7. Data model (Postgres schema)
- **users:** id, email, created_at, goal, daily_minutes_target, timezone, baseline_completed.
- **purchases:** id, user_id, platform, type (monthly/lifetime), status, store_transaction_id, expires_at (nullable for lifetime).
- **plan_days:** id, day_number (1–60), title, description, difficulty, assets_json, exercises_json.
- **sessions:** id, user_id, plan_day_id (nullable for freestyle), mode (daily/freestyle/script/impromptu/roleplay/game), created_at, duration_sec, prompt_id.
- **recordings:** id, session_id, audio_url, audio_duration_sec, audio_format, created_at.
- **analysis_results:** id, session_id, transcript_text, transcript_words_json, metrics_json, scores_json, coaching_text, created_at.
- **streaks:** user_id, current_streak, longest_streak, last_practice_date.
- **events_analytics:** id, user_id, event_name, properties_json, created_at.

## 8. Backend API (REST /api/v1)
- Auth: POST /auth/signup, /auth/login, /auth/apple, /auth/google, /auth/refresh.
- Plan & content: GET /plan, GET /plan/day/:dayNumber, POST /plan/day/:dayNumber/complete.
- Recording upload: POST /sessions, POST /sessions/:id/upload-url, POST /sessions/:id/submit, GET /sessions/:id (status queued|processing|done|error).
- Analysis: GET /sessions/:id/analysis, GET /progress/summary.
- Purchases: POST /purchase/verify, GET /purchase/status.
- Support: POST /feedback/report (bad coaching, transcript errors).

## 9. React Native app spec
### 9.1 Tech stack
React Native + TypeScript; Expo or bare RN; React Navigation; TanStack Query; Zustand; RevenueCat; Sentry.

### 9.2 Navigation map
Auth stack: Welcome, Login/Signup, Paywall (after onboarding preview).
Main tabs: Home (Today), Plan (60 days), Practice, Progress, Settings.

### 9.3 Key screens
- **Home/Today:** today card, start button, streak banner, quick stats.
- **Plan:** grid/list of Day 1–60 with lock/completion indicators; tap → Day Detail.
- **Day Detail:** lesson card, drill card, record CTA; post-completion score + next-day CTA.
- **Recording:** timer, pause/resume, optional live pace indicator, save + upload progress.
- **Analysis Result:** overall + sub-scores, metrics cards, 2 tips, redo button.
- **Practice:** freestyle, script, impromptu, roleplay, games list.
- **Progress:** charts (WPM, fillers/min, score trend), baseline vs current, achievements.
- **Settings:** account, purchase status, reminder time, data export/delete.

## 10. Content system
- Format: per-day JSON with day, title, objective, lesson, exercises (id, type, prompt, duration_sec, targets), game_unlocks, content_version, migration rules.
- Production pipeline: plain English, grammar checker, reading level check, internal QA, versioned publishes (avoid breaking in-progress users).

## 11. Analytics to track
- Funnel: onboarding_completed, paywall_viewed, purchase_started/completed, day_started, recording_uploaded, analysis_viewed, day_completed, streak_incremented, refund_requested (if possible).
- Retention: D1/D7/D30 retention, plan completion rate, avg minutes practiced/week.
- Learning outcomes: avg Speaking Score increase at day 30 & 60, avg filler/min reduction, avg pace stability improvement.

## 12. Codex/Coding workflow tips
- Feed Codex single-module tasks with acceptance criteria, paths, tests.
- Suggested tasks: project bootstrap, auth module, plan UI, recording module, session lifecycle, results screen, games, purchases, progress dashboard, notifications.
- Example recording module prompt included for Expo RN TS with API flow (create session → presign upload → submit → poll → navigate).

## 13. Competitor-beating checklist
- Transparent pricing, reliable payments/progress, structured daily plan, high content quality, more drills/games per weakness.
- Optional: produce full 60-day content pack + LLM prompt templates with strict validation.
