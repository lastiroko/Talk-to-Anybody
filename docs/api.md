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
- `GET /progress/summary` – streak, totals, trend metrics (WPM, fillers/min, Speaking Score), plus anxiety and SRS summaries (see extended fields below).

## Sessions & Recording
- `POST /sessions` – create session (mode: daily/freestyle/script/impromptu/roleplay/game).
- `POST /sessions/:id/upload-url` – presigned URL for audio upload.
- `POST /sessions/:id/submit` – mark recording ready for analysis.
- `GET /sessions/:id` – session status (queued | processing | done | error).

## Analysis
- `GET /sessions/:id/analysis` – scorecard JSON with metrics, scores, coaching tips, and reward format (see Variable Rewards below).

## Purchases
- `POST /purchase/verify` – verify receipt/token (iOS/Android) for monthly/lifetime.
- `GET /purchase/status` – current entitlement (free/paid, expiry when applicable).

## Support
- `POST /feedback/report` – report bad coaching/transcript issues with references.

---

## Spaced Repetition (SRS)

### `GET /srs/due`
Returns drills due for review today, ordered by priority.

**Response:**
```json
{
  "due_cards": [
    {
      "card_id": "srs_abc123",
      "drill_id": "pause_punch_01",
      "dimension": "pauses",
      "current_interval_days": 3,
      "last_score": 62,
      "review_count": 4,
      "review_priority": 0.8,
      "next_review_date": "2026-03-09"
    }
  ],
  "total_due": 3
}
```

### `POST /srs/review`
Submit a review result after the user completes a scheduled drill. Updates the card's interval based on performance.

**Request:**
```json
{
  "card_id": "srs_abc123",
  "session_id": "sess_xyz",
  "score": 74,
  "action": "completed"          // completed | snoozed | skipped
}
```

**Response:**
```json
{
  "card_id": "srs_abc123",
  "previous_interval_days": 3,
  "new_interval_days": 7,        // doubled because score improved
  "next_review_date": "2026-03-16",
  "ease_factor": 2.1
}
```

**Scheduling rules:**
- Score ≥ previous + threshold → interval doubles.
- Score < previous − threshold → interval halves (minimum 1 day).
- `action: "snoozed"` → reschedule to tomorrow (allowed once per card).
- `action: "skipped"` (second skip) → interval resets to 1 day.

### `GET /srs/stats`
User's SRS overview for the progress dashboard.

**Response:**
```json
{
  "active_cards": 12,
  "cards_by_dimension": {
    "fillers": 3,
    "pauses": 4,
    "pace": 2,
    "structure": 1,
    "vocal_variety": 2,
    "clarity": 0,
    "storytelling": 0
  },
  "reviews_completed_total": 47,
  "reviews_completed_this_week": 8,
  "next_review_date": "2026-03-10",
  "average_ease_factor": 2.3
}
```

---

## Unlearning Protocol

### `GET /unlearning/status`
Current habits being tracked, phase per habit, and progress metrics.

**Response:**
```json
{
  "habits": [
    {
      "habit_type": "filler",
      "current_phase": "disrupt",
      "phase_started_at": "2026-02-28T10:00:00Z",
      "phases_completed": ["detect"],
      "detection_accuracy": 0.87,        // from detect phase (retained for reference)
      "consecutive_clean_sessions": 1,   // for replace phase tracking
      "detection_threshold": 2.0         // current phase gate value
    },
    {
      "habit_type": "rushing",
      "current_phase": "detect",
      "phase_started_at": "2026-03-05T14:00:00Z",
      "phases_completed": [],
      "detection_accuracy": 0.55,
      "consecutive_clean_sessions": 0,
      "detection_threshold": 0.8
    }
  ]
}
```

### `POST /unlearning/detect-tap`
Submit user-tapped filler markers during playback for accuracy comparison against AI-detected markers.

**Request:**
```json
{
  "session_id": "sess_xyz",
  "habit_type": "filler",
  "user_taps": [
    { "timestamp_sec": 4.2 },
    { "timestamp_sec": 11.7 },
    { "timestamp_sec": 18.1 },
    { "timestamp_sec": 25.9 }
  ]
}
```

**Response:**
```json
{
  "ai_detected_count": 5,
  "user_tapped_count": 4,
  "matched": 4,                   // user taps that matched an AI-detected marker (±0.5s tolerance)
  "missed": 1,                    // AI-detected markers the user didn't tap
  "false_positives": 0,           // user taps with no matching AI marker
  "accuracy": 0.8,                // matched / ai_detected_count
  "threshold": 0.8,
  "phase_passed": true,           // accuracy ≥ threshold
  "ai_markers": [
    { "timestamp_sec": 4.3, "word": "um" },
    { "timestamp_sec": 11.6, "word": "uh" },
    { "timestamp_sec": 18.0, "word": "like" },
    { "timestamp_sec": 25.8, "word": "you know" },
    { "timestamp_sec": 33.2, "word": "um" }
  ]
}
```

### `POST /unlearning/phase-complete`
Mark a phase as passed and advance to the next phase. Called by the client after the user meets the phase gate threshold.

**Request:**
```json
{
  "habit_type": "filler",
  "completed_phase": "detect"     // detect | disrupt | replace
}
```

**Response:**
```json
{
  "habit_type": "filler",
  "completed_phase": "detect",
  "next_phase": "disrupt",        // null if replace was completed (habit fully unlearned)
  "phase_started_at": "2026-03-09T15:30:00Z",
  "detection_threshold": 2.0      // gate value for the new phase
}
```

---

## Anxiety & Desensitization

### `POST /sessions/:id/anxiety`
Submit a pre-session or post-session anxiety self-report rating.

**Request:**
```json
{
  "timing": "pre",               // pre | post
  "rating": 7                    // 1-10 (1=calm, 5=nervous, 10=panicking)
}
```

**Response:**
```json
{
  "session_id": "sess_xyz",
  "timing": "pre",
  "rating": 7,
  "rolling_avg_pre": 6.2,        // 7-day rolling average for pre-session
  "spike_detected": true,         // true if rating ≥ rolling_avg + 3
  "show_calming_exercise": true   // client should show breathing prompt before starting
}
```

### `GET /progress/anxiety`
Anxiety trend data for the progress dashboard.

**Response:**
```json
{
  "ratings": [
    {
      "session_id": "sess_abc",
      "date": "2026-03-01",
      "pre": 8,
      "post": 6
    },
    {
      "session_id": "sess_def",
      "date": "2026-03-02",
      "pre": 7,
      "post": 5
    }
  ],
  "rolling_avg_pre_7d": 6.2,
  "rolling_avg_post_7d": 4.1,
  "all_time_avg_pre": 7.1,
  "all_time_avg_post": 4.8,
  "milestones": [
    {
      "type": "avg_drop",
      "message": "Your average anxiety dropped from 7.2 to 4.1!",
      "achieved_at": "2026-03-08"
    }
  ]
}
```

### `GET /desensitization/status`
Current desensitization ladder level, level history, and threshold config.

**Response:**
```json
{
  "current_level": 2,
  "levels": [
    { "level": 1, "label": "Audio-only, private", "unlocked_at": "2026-02-10T08:00:00Z" },
    { "level": 2, "label": "Audio, AI-analyzed", "unlocked_at": "2026-02-18T12:00:00Z" },
    { "level": 3, "label": "Camera on, private", "unlocked_at": null },
    { "level": 4, "label": "Camera on, AI-analyzed", "unlocked_at": null },
    { "level": 5, "label": "Anonymous community share", "unlocked_at": null },
    { "level": 6, "label": "Live group practice", "unlocked_at": null }
  ],
  "threshold": 4,                  // post-session anxiety must stay below this
  "sessions_at_current_level": 5,
  "rolling_avg_post_at_level": 4.3,
  "sessions_below_threshold": 2,   // need 3+ to unlock next level
  "next_level_ready": false
}
```

---

## Variable Rewards

### Extended field on `GET /sessions/:id/analysis`
The existing analysis response now includes a `reward` object selected by the variable reward engine.

**New field in analysis response:**
```json
{
  "scores": { "...existing..." },
  "metrics": { "...existing..." },
  "coaching_text": "...existing...",
  "reward": {
    "format": "golden_insight",    // full_scorecard | golden_insight | surprise_challenge |
                                   //   community_before_after | streak_milestone
    "content": {
      "title": "Your Pause Game Leveled Up",
      "body": "Your pause placement improved 40% since last week. Intentional pauses before key points make your message land harder — and your audience trusts you more.",
      "cta_label": "See full results"
    }
  }
}
```

**Format-specific `content` shapes:**
- `full_scorecard` — `content` is `null` (client renders the standard scorecard from `scores`/`metrics`).
- `golden_insight` — `{ title, body, cta_label }`.
- `surprise_challenge` — `{ title, body, unlocked_game_id, cta_label }`.
- `community_before_after` — `{ title, before_clip_url, after_clip_url, improvement_summary }`.
- `streak_milestone` — `{ title, body, streak_count, badge_id, cta_label }`.

### `POST /rewards/engagement`
Log how the user interacted with the reward format shown. Feeds the per-user weight algorithm.

**Request:**
```json
{
  "session_id": "sess_xyz",
  "format": "golden_insight",
  "action": "tapped_detail"       // dismissed | viewed | tapped_detail | shared
}
```

**Response:**
```json
{
  "recorded": true
}
```

---

## Imitation Drills

### `GET /expert-clips/:id`
Retrieve expert clip metadata, audio URL, and analysis profiles for side-by-side comparison.

**Response:**
```json
{
  "id": "expert_pause_05",
  "technique_type": "pause",      // pause | variety | pacing | emphasis
  "transcript_text": "The most important thing about leadership... [pause] ...is listening.",
  "audio_url": "https://cdn.speakcoach.app/expert-clips/pause_05.mp3",
  "duration_sec": 15,
  "waveform_json": [0.02, 0.15, 0.31, "..."],
  "pace_profile_json": {
    "timestamps_sec": [0, 1, 2, 3, "..."],
    "wpm": [140, 138, 0, 0, 145, "..."]
  },
  "pitch_profile_json": {
    "timestamps_sec": [0, 0.5, 1.0, "..."],
    "hz": [180, 195, 210, "..."]
  }
}
```

### `POST /imitation/compare`
Submit user recording for comparison against an expert clip. Returns similarity scores per dimension.

**Request:**
```json
{
  "session_id": "sess_xyz",
  "expert_clip_id": "expert_pause_05",
  "comparison_dimensions": ["waveform", "pace"]
}
```

**Response:**
```json
{
  "expert_clip_id": "expert_pause_05",
  "similarity_score": 72,          // overall 0-100
  "dimension_scores": {
    "waveform": 68,                // pause placement alignment
    "pace": 76                     // WPM-over-time pattern match
  },
  "comparison_data": {
    "waveform": {
      "expert": [0.02, 0.15, 0.31, "..."],
      "user": [0.03, 0.12, 0.28, "..."]
    },
    "pace": {
      "expert_wpm": [140, 138, 0, 0, 145, "..."],
      "user_wpm": [155, 148, 12, 0, 139, "..."]
    }
  },
  "feedback": "Your pauses land in the right spots — try holding them slightly longer for more impact."
}
```

---

## Extended Existing Endpoints

### `GET /progress/summary` — new fields

The existing response is extended with `anxiety_trend` and `srs_summary`:

```json
{
  "streak": 14,
  "total_minutes": 220,
  "speaking_score": 72,
  "trends": { "...existing WPM, fillers/min, Speaking Score..." },

  "anxiety_trend": {
    "rolling_avg_pre_7d": 5.8,
    "rolling_avg_post_7d": 3.9,
    "change_since_baseline": -3.3,
    "milestone_flags": ["avg_below_4"]
  },

  "srs_summary": {
    "active_cards": 12,
    "due_today": 3,
    "reviews_this_week": 8,
    "strongest_dimension": "pauses",
    "weakest_dimension": "fillers"
  }
}
```
