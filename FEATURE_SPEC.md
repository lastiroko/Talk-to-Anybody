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

## 14. Psychological Learning Engines

Seven evidence-based systems that drive retention, habit formation, and measurable skill acquisition. Each engine operates independently but shares data through the analysis pipeline and user progress model.

### 14.1 Spaced Repetition for Skills (SRS-S)

**What it is:** An Ebbinghaus-curve scheduling system that resurfaces drills the user struggles with at increasing intervals (+1d, +3d, +7d, +14d), adapted per skill dimension.

**Why it works (psychology):** Spaced repetition exploits the spacing effect — memories and motor skills consolidate more durably when practice is distributed over time rather than massed. By scheduling reviews just before the forgetting curve drops, SRS maximizes retention per minute of practice.

**How it works in the app:**
- Each drill is tracked per dimension: fillers, pauses, pace, structure, vocal variety, clarity, storytelling.
- After a drill, the system compares the user's score to their personal baseline for that dimension.
- If the user improves (score ≥ previous + threshold), the review interval doubles (e.g., +3d → +7d).
- If the user regresses (score < previous - threshold), the interval halves (e.g., +7d → +3d).
- Scheduled drills appear as "Review drills" on the Home screen alongside the daily workout.
- Users can snooze a review drill once; second skip resets the interval to +1d.

**Data/API requirements:**
- New table `srs_cards`: id, user_id, drill_id, dimension, current_interval_days, ease_factor, next_review_date, last_score, review_count, created_at, updated_at.
- New endpoint: GET /srs/due — returns drills due today; POST /srs/review — submits review result and updates scheduling.
- Reads from `analysis_results.metrics_json` for per-dimension scores.

### 14.2 Unlearning Protocol (Detect → Disrupt → Replace)

**What it is:** A three-phase system for breaking ingrained bad habits (e.g., filler words, uptalk, rushed pacing) using a structured behavioral intervention pipeline.

**Why it works (psychology):** Habits are stored as automatic motor programs in the basal ganglia. Simply telling someone to "stop saying um" fails because the behavior is unconscious. The Detect→Disrupt→Replace framework (rooted in habit reversal training from CBT) makes the behavior conscious, interrupts the automatic loop, then installs a competing response.

**How it works in the app:**
- **Phase 1 — Detect:** User listens to their own recording playback and taps the screen each time they notice the target pattern (e.g., filler words). The app shows a filler timeline and compares user-tapped markers to AI-detected markers. Goal: user achieves ≥80% detection accuracy.
- **Phase 2 — Disrupt:** Stop-and-restart exercises. User practices speaking, and the app buzzes/flashes when the target pattern is detected in real-time. User must stop, pause for 2 seconds, and restart the sentence. Breaks the autopilot loop.
- **Phase 3 — Replace:** Drill the replacement behavior until automatic. For fillers → pause-breathing exercises (inhale during natural pause instead of filling). For rushed pacing → metronome-paced speaking drills. Replacement is considered learned when the user completes 3 consecutive sessions without regression.

**Data/API requirements:**
- New table `unlearning_progress`: id, user_id, habit_type (filler|uptalk|rushing|etc.), current_phase (detect|disrupt|replace), phase_started_at, detection_accuracy, consecutive_clean_sessions, created_at.
- Extend `analysis_results` with `habit_markers_json` (timestamped detected patterns).
- New endpoints: GET /unlearning/status, POST /unlearning/detect-tap (submits user-tapped markers for accuracy comparison).

### 14.3 Desensitization Ladder

**What it is:** A graduated exposure system from CBT that moves users through 6 levels of increasing social exposure, gated by self-reported comfort.

**Why it works (psychology):** Social anxiety follows classical conditioning — the amygdala associates speaking situations with threat. Systematic desensitization (Wolpe, 1958) pairs graduated exposure with relaxation to extinguish the fear response. Each level is just outside the comfort zone but not overwhelming, preventing avoidance reinforcement.

**How it works in the app:**
- **Level 1 — Audio-only, private:** Record audio only, no sharing, no AI analysis. Pure safe practice.
- **Level 2 — Audio, AI-analyzed:** Audio recordings are analyzed and scored. User sees feedback.
- **Level 3 — Camera on, private:** Video recording enabled but kept private. User gets comfortable seeing themselves.
- **Level 4 — Camera on, AI-analyzed:** Video recordings analyzed for delivery + body language cues.
- **Level 5 — Anonymous community share:** User can share clips (voice-only or video) to a community feed with no profile attached.
- **Level 6 — Live group practice:** Real-time practice rooms with other users (2–4 people).
- Progression gate: user rates anxiety (1–10) before and after each session. A level unlocks when the user's rolling average post-session anxiety at the current level drops below a configurable threshold (default: 4/10) over 3+ sessions.

**Data/API requirements:**
- New table `desensitization_progress`: id, user_id, current_level (1–6), level_unlocked_at (array of timestamps), created_at.
- Reads from `anxiety_ratings` table (see 14.6 Fear Journal) for gating logic.
- Threshold configurable server-side per user via `user_settings.desensitization_threshold`.

### 14.4 Variable Reward System

**What it is:** An unpredictable feedback format rotation system that varies the type of post-session reward to maintain engagement through novelty.

**Why it works (psychology):** Variable ratio reinforcement schedules (Skinner) produce the highest, most extinction-resistant response rates. When the brain cannot predict the exact reward, dopamine release is sustained across trials. Fixed feedback formats (same scorecard every time) habituate quickly; variable formats maintain curiosity and motivation.

**How it works in the app:**
- After each session, instead of always showing the same scorecard, the app selects one of 5 feedback formats:
  1. **Full scorecard** — standard detailed metrics + sub-scores + tips.
  2. **Single golden insight** — one high-impact observation with depth (e.g., "Your pause placement improved 40% — here's why that matters…").
  3. **Surprise challenge unlock** — a bonus mini-game or drill unlocked as a reward.
  4. **Community before/after clip** — shows an anonymized community member's Day 1 vs Day 30 comparison (inspirational social proof).
  5. **Streak milestone reward** — celebratory animation + milestone badge (e.g., "7-day streak! You're in the top 15% of learners").
- Selection algorithm: weighted random based on user engagement patterns. If a user tends to skip scorecards, reduce scorecard frequency. If they engage deeply with insights, increase insight frequency. Weights updated every 7 days.
- Full scorecard is always available on-demand via "View full results" button regardless of which format was shown.

**Data/API requirements:**
- New table `reward_weights`: user_id, format_type, weight (0.0–1.0), last_shown_at, engagement_score, updated_at.
- New table `reward_history`: id, user_id, session_id, format_shown, engagement_action (dismissed|viewed|tapped_detail|shared), created_at.
- Extend coaching endpoint response with `reward_format` field; client renders accordingly.

### 14.5 Micro-Commitment Curve

**What it is:** A session duration curve that starts at 90 seconds on Day 1 and gradually increases to 12 minutes by Day 30+, designed so the user never consciously notices the increase.

**Why it works (psychology):** The foot-in-the-door effect (Freedman & Fraser, 1966) shows that small initial commitments dramatically increase compliance with larger subsequent requests. By starting trivially small and increasing gradually, the user's self-identity shifts from "I'm trying this app" to "I'm someone who practices speaking daily" before the sessions feel long.

**How it works in the app:**
- Session duration targets by phase:
  - **Days 1–5:** 1–2 minutes (90s → 120s). Ultra-low friction. "Just one quick drill."
  - **Days 6–15:** 3–5 minutes. Add a second drill or extend recording length.
  - **Days 16–30:** 5–8 minutes. Full lesson + drill + recording + reflection.
  - **Days 31–60:** 8–12 minutes. Multiple drills, review drills (SRS), extended recordings.
- The daily workout screen never shows total estimated time prominently — it shows individual card durations ("30s lesson", "2 min drill") so the aggregate isn't salient.
- If a user completes early, celebrate it. Never guilt for short sessions.

**Data/API requirements:**
- Duration targets are encoded in the `plan_days.exercises_json` field per day (already exists).
- No new tables needed. The content authoring pipeline enforces the curve when generating day content.
- Analytics event `session_duration_vs_target` tracks actual vs planned to monitor if users are dropping off at any phase boundary.

### 14.6 Fear Journal & Anxiety Tracker

**What it is:** A pre/post session anxiety self-report (1–10 scale) with longitudinal tracking, trend visualization, and integration into other engines.

**Why it works (psychology):** Self-monitoring is a core CBT technique — tracking anxiety makes it concrete and observable rather than diffuse and overwhelming. Seeing a downward trend provides objective evidence of progress that counteracts the "I'm not improving" cognitive distortion common in anxiety. The act of rating also creates psychological distance from the emotion (affect labeling reduces amygdala activation).

**How it works in the app:**
- Before each session: "How anxious do you feel about practicing right now?" (1–10 slider, with anchors: 1 = calm, 5 = nervous, 10 = panicking).
- After each session: "How do you feel now?" (same scale).
- Progress screen shows an anxiety trend graph (rolling 7-day average) alongside the Speaking Score trend.
- Data drives other systems:
  - **Desensitization ladder gating:** level progression requires rolling post-session anxiety below threshold.
  - **Encouragement triggers:** if pre-session anxiety spikes ≥3 points above rolling average, show a calming micro-exercise (breathing prompt) before starting.
  - **Milestone celebrations:** "Your average anxiety dropped from 7.2 to 4.1 over 30 days!" shown on Progress screen and as a Variable Reward format.

**Data/API requirements:**
- New table `anxiety_ratings`: id, user_id, session_id, pre_rating (1–10), post_rating (1–10), created_at.
- New endpoint: POST /sessions/:id/anxiety — submits pre or post rating; GET /progress/anxiety — returns trend data.
- Extend `GET /progress/summary` to include anxiety trend (rolling averages, milestone flags).

### 14.7 Mirror Neuron Imitation Drills

**What it is:** A watch-then-mimic system that plays a short expert clip (15 seconds) demonstrating a specific technique, then immediately prompts the user to record themselves mimicking it, with side-by-side waveform/pace comparison.

**Why it works (psychology):** Mirror neurons fire both when performing an action and when observing someone else perform it (Rizzolatti et al.). Observational learning (Bandura) is most effective when the model demonstrates a specific, isolated skill and the learner immediately practices it. The side-by-side comparison provides concrete visual feedback that closes the perception-action gap.

**How it works in the app:**
- Used for: pause placement, vocal variety, pacing, emphasis patterns.
- Flow: expert clip plays (15s, with visual highlights on the target technique) → "Your turn" prompt → user records same passage (15s) → app shows side-by-side comparison:
  - Waveform overlay (expert vs user) for pause placement and pacing.
  - Pace graph (WPM over time) aligned to the same passage.
  - Pitch contour overlay for vocal variety drills.
  - Emphasis detection (louder/slower words highlighted) for emphasis pattern drills.
- Scoring: similarity score (0–100) comparing user's pattern to expert's on the target dimension. Not about matching exactly — about capturing the technique principle (e.g., "pause before key point" rather than "pause at exactly 4.2 seconds").
- Expert clips are curated and recorded by coaches; stored as assets in the content system.

**Data/API requirements:**
- New table `expert_clips`: id, technique_type (pause|variety|pacing|emphasis), transcript_text, audio_url, waveform_json, pace_profile_json, pitch_profile_json, created_at.
- New table `imitation_results`: id, user_id, session_id, expert_clip_id, similarity_score, dimension_scores_json, created_at.
- Extend `plan_days.exercises_json` to support exercise type `imitation_drill` with `expert_clip_id` reference.
- New endpoint: GET /expert-clips/:id — returns clip metadata + audio URL; POST /imitation/compare — submits user recording for comparison against expert clip.
