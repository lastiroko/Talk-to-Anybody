/** Maximum day number in the 60-day plan */
export const MAX_DAY = 60;

/** Hard cap for any single recording in seconds */
export const MAX_RECORDING_SEC = 300;

/** Default review priority for SRS cards */
export const DEFAULT_REVIEW_PRIORITY = 0.5;

/** Default interval for new SRS cards in days */
export const DEFAULT_SRS_INTERVAL_DAYS = 1;

/** Default post-session anxiety threshold for desensitization level advancement */
export const DESENSITIZATION_THRESHOLD_DEFAULT = 4;

/** Anxiety spike detection: rating ≥ rolling average + this delta triggers calming exercise */
export const ANXIETY_SPIKE_DELTA = 3;

/**
 * Micro-commitment curve: target session duration ranges (in seconds) by day range.
 * Content pipeline enforces these bounds during day authoring.
 */
export const MICRO_COMMITMENT_CURVE: Record<string, [number, number]> = {
  '1-5': [90, 120],
  '6-15': [180, 300],
  '16-30': [300, 480],
  '31-60': [480, 720],
};

/** Labels for each desensitization ladder level */
export const DESENSITIZATION_LEVEL_LABELS: Record<number, string> = {
  1: 'Audio-only, private',
  2: 'Audio, AI-analyzed',
  3: 'Camera on, private',
  4: 'Camera on, AI-analyzed',
  5: 'Anonymous community share',
  6: 'Live group practice',
};
