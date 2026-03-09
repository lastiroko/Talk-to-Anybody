# SpeakCoach Product Spec (MVP → V1)

## Positioning
- Duolingo-style, Codecademy-themed, 60-day public speaking plan.
- Daily practice with AI feedback (delivery + content), gamified streaks, and mini-games.
- Pricing: €5/month subscription or €30 lifetime (IAP-compliant).

## Core Experiences
- **60-day plan**: Day 1–60 list with lock/unlock after completion; preview Day 1–2 free. Session durations follow a Micro-Commitment Curve (90s on Day 1 → 12 min by Day 30+) so users build the habit before sessions feel long.
- **Daily workout**: micro-lesson (30–60s), drill (1–2m), recording (60–180s, hard cap 5m), instant scorecard, two tips, reflection quick-tap. Includes SRS-scheduled review drills when past skills are due for reinforcement.
- **Practice modes**: Freestyle, Script mode (paste text), Impromptu prompt, Roleplay scenarios.
- **Mini-games**: Filler Swap, Pause Punch, ABT Builder, Clarity Sprint.
- **Imitation drills**: Watch a 15s expert clip demonstrating a technique (pause placement, vocal variety, pacing, emphasis), then record yourself mimicking it with side-by-side waveform/pace comparison.
- **Unlearning drills**: Three-phase habit-breaking exercises (Detect → Disrupt → Replace) for filler words, uptalk, and rushing.
- **Desensitization ladder**: 6-level graduated exposure system (audio-only private → live group practice), gated by self-reported anxiety ratings.
- **Progress**: streak, total minutes, trends (WPM, fillers/min, vocal variety proxy, Speaking Score), baseline vs current, anxiety trend graph (rolling 7-day average from Fear Journal).

## Onboarding
- Select goal: Public speaking / Interviews / Work meetings / Social confidence.
- Baseline inputs: anxiety 0–10, experience level, daily minutes (5/10/15).
- Baseline recording (60–90s) → baseline scorecard + two focus areas → unlock Day 1.

## Scoring & Feedback
- **Scores**: Overall 0–100; sub-scores Delivery, Clarity, Story/Structure.
- **Delivery metrics**: WPM, pause count/average, filler words per minute (needs transcript), vocal variety proxy (pitch range), energy proxy (loudness variance).
- **Content metrics**: clarity proxy (sentence length/complexity), vocabulary richness, structure heuristics (intro/body/close), storytelling cues (ABT/conflict→resolution via LLM).
- **Output**: top 2 fixes + 1 drill recommendation, supportive tone only, max ~90 words coaching. Post-session feedback format varies via the Variable Reward System (full scorecard, single golden insight, surprise challenge unlock, community before/after clip, or streak milestone) to maintain engagement through novelty.
- **Anxiety tracking**: Pre/post session anxiety self-report (1–10) feeds the Fear Journal & Anxiety Tracker. Trend visualization on Progress screen; data gates desensitization ladder progression and triggers encouragement on anxiety spikes.
- **Spaced repetition**: Per-dimension skill scores (fillers, pauses, pace, structure, vocal variety, clarity, storytelling) feed the SRS-S engine, which schedules review drills on Ebbinghaus-curve intervals that adapt based on user improvement or regression.
- **Imitation scoring**: Mirror Neuron Imitation Drills produce a similarity score (0–100) comparing user waveform/pace/pitch patterns against expert clips.
- **Future (V1+)**: filler timeline, compare-to-last overlay, adaptive filler remediation days.

## Notifications
- Daily reminder at chosen time; streak-rescue reminder if missed.

## Platforms & Tech
- Mobile: Expo React Native (TypeScript), React Navigation, TanStack Query, Zustand, RevenueCat, Sentry.
- Backend: Node.js (Fastify), Postgres; async workers for STT + audio features + LLM coaching.
- Shared: TypeScript types + Zod schemas in /packages/shared.

## Reliability & Quality
- Transparent pricing, receipt verification, reliable progress sync.
- Content quality pipeline (grammar, reading level); "Report bad feedback" entry point.
- Personal baseline normalization for fairness (e.g., vocal variety improvement vs self).
