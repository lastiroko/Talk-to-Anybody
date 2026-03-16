# SpeakCoach — Requirements Document v1.0

## 1. Functional Requirements

### 1.1 Authentication (FR-AUTH)

| ID | Requirement | Priority | Status |
|---|---|---|---|
| FR-AUTH-01 | User can create account with email + password | Must | Stub |
| FR-AUTH-02 | User can log in with email + password | Must | Stub |
| FR-AUTH-03 | User can log in with Apple ID | Should | Not started |
| FR-AUTH-04 | User can log in with Google | Should | Not started |
| FR-AUTH-05 | User can log out | Must | Stub |
| FR-AUTH-06 | User can reset password via email | Should | Not started |
| FR-AUTH-07 | Auth tokens refresh automatically | Must | Not started |
| FR-AUTH-08 | User stays logged in between app sessions | Must | Stub (AsyncStorage) |

### 1.2 Onboarding (FR-ONBOARD)

| ID | Requirement | Priority | Status |
|---|---|---|---|
| FR-ONBOARD-01 | User selects speaking goal (4 options) | Must | UI done |
| FR-ONBOARD-02 | User selects daily time (5/10/15 min) | Must | UI done |
| FR-ONBOARD-03 | User records 60-90s baseline speech | Must | UI done, recording works |
| FR-ONBOARD-04 | Baseline generates initial scorecard | Must | Mock only |
| FR-ONBOARD-05 | Onboarding data persists to user profile | Must | Not started |
| FR-ONBOARD-06 | User can skip baseline (with flag) | Should | UI done |
| FR-ONBOARD-07 | Goal selection saves and drives plan customization | Should | Not started |

### 1.3 60-Day Plan (FR-PLAN)

| ID | Requirement | Priority | Status |
|---|---|---|---|
| FR-PLAN-01 | Display 60-day grid with lock/complete/current states | Must | UI done |
| FR-PLAN-02 | Day N unlocks only after Day N-1 completed | Must | Done (local) |
| FR-PLAN-03 | Each day shows: title, objective, exercises, lesson | Must | UI done |
| FR-PLAN-04 | Progress persists across sessions | Must | Done (AsyncStorage) |
| FR-PLAN-05 | Days 1-2 are free preview, Days 3+ require payment | Must | Not started |
| FR-PLAN-06 | Plan data loads from API (not bundled JSON) | Should | Not started |
| FR-PLAN-07 | Streak tracking (consecutive days practiced) | Must | Done (local) |
| FR-PLAN-08 | Streak rescue notification if missed day | Should | Not started |

### 1.4 Recording & Playback (FR-REC)

| ID | Requirement | Priority | Status |
|---|---|---|---|
| FR-REC-01 | Record audio using device microphone | Must | Done (expo-av) |
| FR-REC-02 | Request microphone permission before first recording | Must | Done |
| FR-REC-03 | Show recording timer counting up | Must | Done |
| FR-REC-04 | Auto-stop at max duration | Must | Done |
| FR-REC-05 | Pause and resume recording | Should | Done |
| FR-REC-06 | Play back completed recording | Must | Done |
| FR-REC-07 | Re-record (discard and start over) | Must | Done |
| FR-REC-08 | Show animated waveform while recording | Nice | Done (simulated) |
| FR-REC-09 | Upload recording to cloud storage (S3/Supabase) | Must | Stub only |
| FR-REC-10 | Audio format: AAC/m4a, 44.1kHz, mono | Must | Done |

### 1.5 Speech Analysis (FR-ANALYSIS)

| ID | Requirement | Priority | Status |
|---|---|---|---|
| FR-ANALYSIS-01 | Transcribe audio to text (STT) | Must | Not connected (mock) |
| FR-ANALYSIS-02 | Calculate WPM from transcript | Must | Not connected (mock) |
| FR-ANALYSIS-03 | Detect filler words with timestamps | Must | Not connected (mock) |
| FR-ANALYSIS-04 | Calculate pause count, average, longest | Must | Not connected (mock) |
| FR-ANALYSIS-05 | Calculate vocabulary richness (type-token ratio) | Should | Not connected (mock) |
| FR-ANALYSIS-06 | Generate overall score (0-100) | Must | Not connected (mock) |
| FR-ANALYSIS-07 | Generate sub-scores: delivery, clarity, story | Must | Not connected (mock) |
| FR-ANALYSIS-08 | Generate 1-3 wins (positive observations) | Must | Not connected (mock) |
| FR-ANALYSIS-09 | Generate 1-2 fixes (improvement suggestions) | Must | Not connected (mock) |
| FR-ANALYSIS-10 | Generate coaching message (max 90 words, supportive) | Must | Not connected (mock) |
| FR-ANALYSIS-11 | Show analysis results on scorecard screen | Must | UI done |
| FR-ANALYSIS-12 | Analysis runs async (queued → processing → done) | Must | Stub only |
| FR-ANALYSIS-13 | Poll for analysis completion | Should | Not started |

### 1.6 Practice Modes (FR-PRACTICE)

| ID | Requirement | Priority | Status |
|---|---|---|---|
| FR-PRACTICE-01 | Freestyle: record with no prompt, any duration | Must | UI done |
| FR-PRACTICE-02 | Script mode: paste text, practice delivery | Must | UI done |
| FR-PRACTICE-03 | Impromptu: random prompt, 60s, zero prep | Must | UI done |
| FR-PRACTICE-04 | Roleplay: scenario-based recording | Must | UI done |
| FR-PRACTICE-05 | All modes trigger analysis after recording | Must | Mock only |
| FR-PRACTICE-06 | Freestyle available for free users | Must | Not enforced |
| FR-PRACTICE-07 | Script/Impromptu/Roleplay require payment | Must | Not enforced |

### 1.7 Mini-Games (FR-GAMES)

| ID | Requirement | Priority | Status |
|---|---|---|---|
| FR-GAMES-01 | Filler Swap: tap fillers, replace with power words, 60s timed | Must | Done |
| FR-GAMES-02 | Pause Punch: tap at ideal pause points in scrolling text | Must | Done |
| FR-GAMES-03 | ABT Builder: 3-phase story recording (AND/BUT/THEREFORE) | Must | Done |
| FR-GAMES-04 | Clarity Sprint: explain complex concept simply in 30s | Must | Done |
| FR-GAMES-05 | Games unlock at specific days (Filler Swap=D15, ABT=D13, etc.) | Must | Done |
| FR-GAMES-06 | High scores persist locally | Must | Done |
| FR-GAMES-07 | Games work 100% offline | Must | Done |

### 1.8 Progress Dashboard (FR-PROGRESS)

| ID | Requirement | Priority | Status |
|---|---|---|---|
| FR-PROGRESS-01 | Show current streak and days completed | Must | Done (mock data) |
| FR-PROGRESS-02 | Show speaking score with trend | Must | Done (mock data) |
| FR-PROGRESS-03 | Show skill breakdown (7 dimensions) | Must | Done (mock data) |
| FR-PROGRESS-04 | Show key metrics: WPM, fillers/min, pause avg | Must | Done (mock data) |
| FR-PROGRESS-05 | Show anxiety trend (pre/post) | Should | Done (mock data) |
| FR-PROGRESS-06 | Show achievements/badges | Should | Done (mock data) |
| FR-PROGRESS-07 | Show desensitization level progress | Should | Done (mock data) |
| FR-PROGRESS-08 | All data comes from real analysis results (not mock) | Must | Not started |

### 1.9 Psychological Engines (FR-PSYCH)

| ID | Requirement | Priority | Status |
|---|---|---|---|
| FR-PSYCH-01 | SRS: resurface drills on Ebbinghaus intervals | Should | Spec done, not implemented |
| FR-PSYCH-02 | Unlearning: Detect→Disrupt→Replace pipeline for fillers | Should | Spec done, not implemented |
| FR-PSYCH-03 | Desensitization: 6-level graduated exposure ladder | Should | Spec done, not implemented |
| FR-PSYCH-04 | Variable rewards: rotate feedback formats | Should | Spec done, not implemented |
| FR-PSYCH-05 | Micro-commitment: session duration curve 90s→12min | Must | Done (in plan content) |
| FR-PSYCH-06 | Fear journal: pre/post anxiety rating (1-10) | Should | UI done |
| FR-PSYCH-07 | Mirror neuron: imitation drills with expert clips | Nice | Spec done, not implemented |

### 1.10 Purchases (FR-PURCHASE)

| ID | Requirement | Priority | Status |
|---|---|---|---|
| FR-PURCHASE-01 | Monthly subscription: €5/month auto-renew | Must | Stub |
| FR-PURCHASE-02 | Lifetime purchase: €30 one-time | Must | Stub |
| FR-PURCHASE-03 | Paywall screen with clear pricing | Must | UI done |
| FR-PURCHASE-04 | Restore purchases | Must | Stub |
| FR-PURCHASE-05 | Receipt verification on backend | Must | Stub |
| FR-PURCHASE-06 | Gate locked features for free users | Must | Partially done |
| FR-PURCHASE-07 | RevenueCat integration | Must | Not connected |

### 1.11 Settings (FR-SETTINGS)

| ID | Requirement | Priority | Status |
|---|---|---|---|
| FR-SETTINGS-01 | View/edit profile (email, goal, daily time) | Should | UI done (alerts) |
| FR-SETTINGS-02 | View subscription status | Must | UI done (mock) |
| FR-SETTINGS-03 | Toggle daily reminder notification | Should | UI done (local only) |
| FR-SETTINGS-04 | Reset progress | Must | Done |
| FR-SETTINGS-05 | Sign out | Must | Stub |
| FR-SETTINGS-06 | Delete account | Should | Not started |
| FR-SETTINGS-07 | Export data | Nice | Not started |

---

## 2. Non-Functional Requirements

### 2.1 Performance (NFR-PERF)

| ID | Requirement | Target |
|---|---|---|
| NFR-PERF-01 | App cold start time | < 3 seconds |
| NFR-PERF-02 | Screen transition time | < 300ms |
| NFR-PERF-03 | Recording start latency | < 500ms after button press |
| NFR-PERF-04 | Analysis response time | < 30 seconds (async) |
| NFR-PERF-05 | Plan screen renders 60 tiles without jank | 60 FPS |
| NFR-PERF-06 | Game animations maintain 60 FPS | Smooth on iPhone 12+ |
| NFR-PERF-07 | API response time | < 500ms for reads, < 2s for writes |

### 2.2 Reliability (NFR-REL)

| ID | Requirement | Target |
|---|---|---|
| NFR-REL-01 | App crash rate | < 1% of sessions |
| NFR-REL-02 | Recording never loses audio | 99.9% reliability |
| NFR-REL-03 | Progress data persists across app kills/restarts | 100% |
| NFR-REL-04 | Offline mode: all local features work without internet | Must |
| NFR-REL-05 | Failed uploads retry automatically | 3 retries with backoff |
| NFR-REL-06 | Analysis failures show user-friendly error + retry | Must |

### 2.3 Security (NFR-SEC)

| ID | Requirement | Target |
|---|---|---|
| NFR-SEC-01 | Passwords hashed with bcrypt (min 10 rounds) | Must |
| NFR-SEC-02 | JWT tokens with expiration | 7-day access, 30-day refresh |
| NFR-SEC-03 | Audio recordings encrypted in transit (HTTPS) | Must |
| NFR-SEC-04 | No PII in client logs | Must |
| NFR-SEC-05 | Receipt verification server-side only | Must |
| NFR-SEC-06 | Rate limiting on auth endpoints | 10 req/min |
| NFR-SEC-07 | GDPR: data export and deletion support | Must for EU launch |

### 2.4 Usability (NFR-USE)

| ID | Requirement | Target |
|---|---|---|
| NFR-USE-01 | Onboarding completable in < 5 minutes | Must |
| NFR-USE-02 | Daily workout completable in stated time (5/10/15 min) | Must |
| NFR-USE-03 | All text readable (min 14px body, 4.5:1 contrast ratio) | Must |
| NFR-USE-04 | Buttons min 44x44px touch target | Must (Apple HIG) |
| NFR-USE-05 | Error messages are user-friendly (no technical jargon) | Must |
| NFR-USE-06 | Loading states shown for any action > 300ms | Must |
| NFR-USE-07 | Coaching tone: always supportive, never shaming | Must |

### 2.5 Compatibility (NFR-COMPAT)

| ID | Requirement | Target |
|---|---|---|
| NFR-COMPAT-01 | iOS 16+ | Must |
| NFR-COMPAT-02 | Android 10+ (API 29) | Must |
| NFR-COMPAT-03 | iPhone SE (small screen) to iPhone 16 Pro Max | Must |
| NFR-COMPAT-04 | Dark mode support | Nice (v2) |
| NFR-COMPAT-05 | Accessibility: VoiceOver/TalkBack basic support | Should |

### 2.6 Scalability (NFR-SCALE)

| ID | Requirement | Target |
|---|---|---|
| NFR-SCALE-01 | Support 1,000 concurrent users | Must for launch |
| NFR-SCALE-02 | Support 10,000 concurrent users | Target for 6 months |
| NFR-SCALE-03 | Database handles 100k user records | Must |
| NFR-SCALE-04 | Audio storage scales with usage | Must (S3/Supabase) |
| NFR-SCALE-05 | Analysis queue handles burst traffic | Must (BullMQ) |

---

## 3. Known Issues & Technical Debt

| Issue | Severity | Description |
|---|---|---|
| Mock analysis data | High | All scores/metrics are hardcoded, not from real AI |
| No real auth | High | Login/signup simulated, no backend verification |
| No data sync | High | Progress stored locally only, lost on reinstall |
| Navigation v7 breaking changes | Medium | Some screens may have incompatible prop patterns |
| Exercise completion not persisting | Medium | Completing exercises in DayDetail doesn't save |
| Expo SDK version pinning | Medium | SDK 54 needed for Expo Go, may need upgrade later |
| No error boundaries | Medium | Unhandled errors crash the app |
| No offline queue | Low | Failed API calls not retried |
| No analytics tracking | Low | No usage data collection |
| Bundle size not optimized | Low | plan.v1.json is large, should be lazy loaded |

---

## 4. Test Coverage Requirements

| Area | Required Coverage | Test Type |
|---|---|---|
| Progress hook (useProgress) | 100% | Unit |
| Plan data loading & filtering | 100% | Unit |
| Recording hook (useRecording) | 90% | Unit + Integration |
| Game scoring logic | 100% | Unit |
| Navigation flows | 90% | Integration |
| API service functions | 100% | Unit (with mocks) |
| Zod schema validation | 100% | Unit |
| Auth flow | 90% | Integration |
| Exercise completion flow | 100% | Integration |
| Purchase flow | 90% | Integration |
