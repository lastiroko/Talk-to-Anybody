# 60-Day Plan Day Schema (JSON)

```json
{
  "day": 12,
  "title": "Pause Like a Pro",
  "objective": "Replace fillers with intentional pauses",
  "lesson": {
    "type": "text", // text | audio | video (future)
    "content": "Pauses sound confident because...",
    "assetUrl": "https://.../lesson12.mp3" // optional
  },
  "exercises": [
    {
      "id": "pause_punch_01",
      "type": "record", // record | quiz | reflection | game
      "prompt": "Explain your job in 60 seconds. Add 3 pauses.",
      "duration_sec": 60,
      "targets": ["filler_per_min", "avg_pause_sec"],
      "instructions": "Focus on clear pauses instead of fillers.",
      "max_duration_sec": 300 // enforce 5-minute cap
    }
  ],
  "games": ["pause_punch"],
  "difficulty": 2,
  "est_minutes": 8,
  "tags": ["pauses", "fillers"],
  "content_version": "1.0.0",
  "migration": {
    "previous_version": "0.9.0",
    "notes": "Updated prompt for clarity"
  }
}
```

## Notes
- Keep text plain-English; run grammar/readability checks before publishing.
- Version each day; never break users mid-plan—add migration notes instead.
- Defaults: recording prompts 60–180 seconds; enforce 300s hard cap.
