# 60-Day Plan Day Schema (JSON)

## Example 1 — Basic day (record drill only)

A minimal day with a single recording exercise. No psychological engine fields needed for simple early days.

```jsonc
{
  "day": 3,
  "title": "Find Your Natural Pace",
  "objective": "Discover your comfortable speaking speed",
  "duration_target_sec": 110,             // (14.5) Day 3 sits in the 90-120s micro-commitment window
  "lesson": {
    "type": "text",                       // text | audio | video (future)
    "content": "Most people speak too fast when nervous. Your natural pace is...",
    "assetUrl": null
  },
  "exercises": [
    {
      "id": "pace_baseline_01",
      "type": "record",                   // record | quiz | reflection | game | unlearning_drill | imitation_drill
      "prompt": "Talk about your morning routine for 60 seconds at a comfortable pace.",
      "duration_sec": 60,
      "targets": ["wpm"],
      "instructions": "Don't rush. Breathe naturally between sentences.",
      "max_duration_sec": 300,            // enforce 5-minute cap
      "srs_dimensions": ["pace"],
      "review_priority": 0.5
    }
  ],
  "games": [],
  "difficulty": 1,
  "est_minutes": 2,
  "tags": ["pace", "basics"],
  "anxiety_gate": {
    "min_level": 1,                       // Level 1 = audio-only private, no gate
    "show_pre_rating": false,             // Skip anxiety prompts on ultra-short early days
    "show_post_rating": false
  },
  "reward_eligible_formats": [
    "full_scorecard",
    "golden_insight"
  ],
  "content_version": "2.0.0",
  "migration": {
    "previous_version": "1.0.0",
    "notes": "Added psychological engine fields"
  }
}
```

## Example 2 — Advanced day (unlearning + imitation + anxiety gating)

A mid-plan day that uses three psychological engines: Unlearning Protocol for filler detection, Mirror Neuron Imitation for pause technique, and anxiety gating at desensitization level 2.

```jsonc
{
  "day": 22,
  "title": "Break the Filler Habit",
  "objective": "Detect your filler patterns and replace them with intentional pauses",
  "duration_target_sec": 420,             // (14.5) Day 22 sits in the 300-480s window (7 minutes)
  "lesson": {
    "type": "audio",
    "content": "Filler words aren't a character flaw — they're an autopilot habit. Today you'll learn to notice them, interrupt the pattern, and install a better default...",
    "assetUrl": "https://cdn.speakcoach.app/lessons/day22.mp3"
  },
  "exercises": [
    // Exercise 1: Unlearning drill — Detect phase
    // User listens to their own previous recording and taps each filler word
    {
      "id": "filler_detect_04",
      "type": "unlearning_drill",
      "prompt": "Listen to your Day 21 recording. Tap the screen every time you hear yourself say 'um', 'uh', 'like', or 'you know'.",
      "duration_sec": 90,
      "targets": ["filler_per_min"],
      "instructions": "Focus on hearing the fillers — don't judge, just notice. The app will compare your taps to the AI-detected fillers.",
      "max_duration_sec": 180,
      "srs_dimensions": ["fillers"],
      "review_priority": 0.9,            // High priority — filler detection is a key skill to reinforce
      "unlearning": {
        "habit_type": "filler",
        "phase": "detect",
        "detection_threshold": 0.8        // User must tap ≥80% of AI-detected fillers to pass
      }
    },

    // Exercise 2: Unlearning drill — Disrupt phase
    // Real-time filler interruption while speaking
    {
      "id": "filler_disrupt_02",
      "type": "unlearning_drill",
      "prompt": "Describe your favorite hobby for 90 seconds. When the app buzzes, STOP, pause for 2 seconds, then restart the sentence without the filler.",
      "duration_sec": 90,
      "targets": ["filler_per_min"],
      "instructions": "The app will vibrate when it detects a filler in real-time. Stop immediately, breathe, restart the sentence cleanly.",
      "max_duration_sec": 180,
      "srs_dimensions": ["fillers", "pauses"],
      "review_priority": 0.85,
      "unlearning": {
        "habit_type": "filler",
        "phase": "disrupt",
        "detection_threshold": 2.0        // Must get filler rate below 2/min to pass
      }
    },

    // Exercise 3: Imitation drill — Learn pause placement from an expert
    // Watch expert clip, then mimic the pause pattern
    {
      "id": "pause_imitate_05",
      "type": "imitation_drill",
      "prompt": "Watch how the coach places pauses before key points. Then deliver the same passage with the same pause pattern.",
      "duration_sec": 15,
      "targets": ["avg_pause_sec", "filler_per_min"],
      "instructions": "Don't try to copy the exact words — focus on WHERE the pauses land and HOW LONG they last. The side-by-side view will show you the comparison.",
      "max_duration_sec": 30,
      "srs_dimensions": ["pauses", "fillers"],
      "review_priority": 0.7,
      "imitation": {
        "expert_clip_id": "expert_pause_05",
        "technique_type": "pause",
        "comparison_dimensions": ["waveform", "pace"]
                                          // Show waveform overlay (pause placement) and
                                          // pace graph (WPM over time) in side-by-side view
      }
    },

    // Exercise 4: Standard recording — Apply what you learned
    {
      "id": "filler_free_record_01",
      "type": "record",
      "prompt": "Give a 2-minute explanation of something you know well. Focus on replacing every filler impulse with a clean pause.",
      "duration_sec": 120,
      "targets": ["filler_per_min", "avg_pause_sec", "wpm"],
      "instructions": "This is your chance to put it all together. Fillers will still happen — that's fine. Just notice them.",
      "max_duration_sec": 300,
      "srs_dimensions": ["fillers", "pauses", "pace"],
      "review_priority": 0.8
    }
  ],
  "games": ["filler_swap", "pause_punch"],
  "difficulty": 3,
  "est_minutes": 7,
  "tags": ["fillers", "pauses", "unlearning", "imitation"],

  "anxiety_gate": {
    "min_level": 2,                       // Requires desensitization level 2 (audio, AI-analyzed)
                                          // because this day includes AI feedback on recordings.
                                          // Users still at level 1 (private-only) will see a
                                          // prompt to complete level 1 comfort first.
    "show_pre_rating": true,              // "How anxious do you feel?" before session (1-10)
    "show_post_rating": true              // "How do you feel now?" after session (1-10)
  },

  "reward_eligible_formats": [
    "full_scorecard",                     // Standard detailed results
    "golden_insight",                     // Single deep observation about filler improvement
    "surprise_challenge",                 // Bonus mini-game unlock
    "streak_milestone"                    // If streak milestone was just hit
  ],
  // Note: "community_before_after" excluded because min_level < 5 (community sharing)

  "content_version": "2.0.0",
  "migration": {
    "previous_version": "1.0.0",
    "notes": "Added unlearning drills, imitation drill, anxiety gating, variable rewards"
  }
}
```

## Field Reference

### Day-level fields

| Field | Type | Required | Engine | Description |
|---|---|---|---|---|
| `day` | integer | yes | — | Day number (1–60) |
| `title` | string | yes | — | Day title |
| `objective` | string | yes | — | Learning objective |
| `duration_target_sec` | integer | yes | 14.5 Micro-Commitment | Target total session duration in seconds. Content pipeline enforces the curve: Days 1–5 (90–120s), 6–15 (180–300s), 16–30 (300–480s), 31–60 (480–720s). |
| `lesson` | object | yes | — | Micro-lesson content |
| `exercises` | array | yes | — | Exercise list (see below) |
| `games` | string[] | no | — | Mini-game IDs unlocked on this day |
| `difficulty` | integer | yes | — | 1–5 difficulty rating |
| `est_minutes` | integer | yes | — | Estimated duration shown in Plan list (derived from `duration_target_sec`) |
| `tags` | string[] | yes | — | Content tags for filtering |
| `anxiety_gate` | object | no | 14.3 / 14.6 | Desensitization ladder gate + anxiety rating config |
| `reward_eligible_formats` | string[] | no | 14.4 Variable Reward | Allowed post-session reward formats. Defaults to `["full_scorecard"]` if omitted. |
| `content_version` | string | yes | — | Semver version |
| `migration` | object | no | — | Version migration metadata |

### Exercise-level fields

| Field | Type | Required | Engine | Description |
|---|---|---|---|---|
| `id` | string | yes | — | Unique exercise identifier |
| `type` | string | yes | — | `record` \| `quiz` \| `reflection` \| `game` \| `unlearning_drill` \| `imitation_drill` |
| `prompt` | string | yes | — | User-facing prompt text |
| `duration_sec` | integer | yes | — | Target duration for this exercise |
| `targets` | string[] | yes | — | Metrics this exercise targets for scoring |
| `instructions` | string | no | — | Additional instructions |
| `max_duration_sec` | integer | no | — | Hard cap (default 300s) |
| `srs_dimensions` | string[] | no | 14.1 SRS-S | Skill dimensions trained: `fillers` \| `pauses` \| `pace` \| `structure` \| `vocal_variety` \| `clarity` \| `storytelling`. SRS creates review cards per dimension on completion. |
| `review_priority` | number | no | 14.1 SRS-S | 0.0–1.0 priority hint for SRS rescheduling. Higher = more aggressively rescheduled on regression. Default 0.5. |
| `unlearning` | object | conditional | 14.2 Unlearning | Required when `type` is `unlearning_drill`. |
| `imitation` | object | conditional | 14.7 Imitation | Required when `type` is `imitation_drill`. |

### `unlearning` object

| Field | Type | Required | Description |
|---|---|---|---|
| `habit_type` | string | yes | `filler` \| `uptalk` \| `rushing` |
| `phase` | string | yes | `detect` \| `disrupt` \| `replace` |
| `detection_threshold` | number | yes | Phase-completion gate. Detect: accuracy ratio 0.0–1.0 (e.g., 0.8 = 80% match). Disrupt: max incidents/min to pass. Replace: consecutive clean sessions required (integer). |

### `imitation` object

| Field | Type | Required | Description |
|---|---|---|---|
| `expert_clip_id` | string | yes | References `expert_clips.id` table |
| `technique_type` | string | yes | `pause` \| `variety` \| `pacing` \| `emphasis` |
| `comparison_dimensions` | string[] | yes | Overlays shown in side-by-side view: `waveform` \| `pace` \| `pitch` \| `emphasis` |

### `anxiety_gate` object

| Field | Type | Required | Description |
|---|---|---|---|
| `min_level` | integer | yes | Minimum desensitization ladder level (1–6) required to access this day |
| `show_pre_rating` | boolean | yes | Whether to show the pre-session anxiety rating prompt (1–10) |
| `show_post_rating` | boolean | yes | Whether to show the post-session anxiety rating prompt (1–10) |

## Notes
- Keep text plain-English; run grammar/readability checks before publishing.
- Version each day; never break users mid-plan—add migration notes instead.
- Defaults: recording prompts 60–180 seconds; enforce 300s hard cap.
- `srs_dimensions` and `review_priority` can appear on any exercise type, not just drills. Even `quiz` and `reflection` exercises can feed the SRS scheduler.
- `anxiety_gate.show_pre_rating` and `show_post_rating` should both be `true` for most days. Set to `false` only for ultra-short early days (Days 1–3) where the friction of two extra prompts would hurt the micro-commitment curve.
- `reward_eligible_formats` should exclude `community_before_after` until the user has reached desensitization level 5 (community sharing). Content pipeline should validate this against `anxiety_gate.min_level`.
- When `duration_target_sec` is present, the analytics pipeline emits `session_duration_vs_target` events to track adherence to the micro-commitment curve.
