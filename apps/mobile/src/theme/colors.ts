// SpeakCoach — Bright Pastel design tokens (Brief v3 — typography-led, gamified)
//
// Field names kept stable from the previous dark theme so existing components
// don't need updates. Values fully replaced.

export const colors = {
  // Backgrounds
  background: '#FFF8F1',           // app bg — soft cream
  backgroundLight: '#FFFBF6',      // slightly lighter cream variant
  surface: '#FFFFFF',              // white cards
  surfaceMuted: '#F7EFE2',         // muted cream chip background
  surfaceHighlight: '#FFEDDD',     // warm peach hero card

  // Brand
  primary: '#FF7A45',              // warm coral — main accent
  primaryLight: '#FFD9C2',         // primary-soft — selected chip bg, soft pills
  primaryDark: '#E55A22',          // pressed accent

  // Secondary (kept name for record-state; now a warm red)
  gold: '#E5564B',                 // error red / recording (kept name for compat)
  goldLight: 'rgba(229,86,75,0.12)',
  goldDark: '#C6443A',

  // Accent system (multi-color pastels)
  teal: '#7ED9B5',                 // mint — wins, completed, success
  tealLight: 'rgba(126,217,181,0.16)',

  // Gamification colors
  gem: '#BFA8FF',                  // lavender — gems
  coin: '#FFD05C',                 // butter — coins
  fire: '#FF7A45',                 // coral — streak fire
  xp: '#FFD05C',                   // butter — XP

  // Text
  text: '#1F1B16',                 // warm near-black
  textBody: '#1F1B16',
  textMuted: '#998E80',            // muted captions
  textLight: '#998E80',
  textOnDark: '#FFFFFF',
  textOnPrimary: '#FFFFFF',
  textSecondary: '#5B544B',        // subtitle gray

  // Status
  success: '#2EBD7E',
  successBg: 'rgba(46,189,126,0.12)',
  warning: '#F5A623',
  warningBg: 'rgba(245,166,35,0.12)',
  error: '#E5564B',
  errorBg: 'rgba(229,86,75,0.12)',

  // Exercise type tints (soft accent backgrounds)
  recordBg: 'rgba(255,122,69,0.12)',     // coral wash
  drillBg: 'rgba(255,208,92,0.16)',      // butter wash
  reflectionBg: 'rgba(141,201,255,0.16)', // sky wash
  gameBg: 'rgba(126,217,181,0.16)',      // mint wash
  unlearningBg: 'rgba(229,86,75,0.12)',  // red wash
  imitationBg: 'rgba(191,168,255,0.16)', // lavender wash

  // Category accent colors
  categoryRed: '#E5564B',
  categoryBlue: '#8DC9FF',         // sky
  categoryGreen: '#7ED9B5',        // mint
  categoryPurple: '#BFA8FF',       // lavender
  categoryOrange: '#FF7A45',       // primary coral
  categoryTeal: '#7ED9B5',         // mint
  categoryButter: '#FFD05C',
  categoryBlush: '#FFB4C4',

  // Direct accent aliases (new components prefer these explicit names)
  mint: '#7ED9B5',
  butter: '#FFD05C',
  lavender: '#BFA8FF',
  blush: '#FFB4C4',
  sky: '#8DC9FF',
  peach: '#FFEDDD',

  // UI Chrome
  divider: 'rgba(31,27,22,0.08)',
  border: 'rgba(31,27,22,0.08)',
  borderHi: 'rgba(31,27,22,0.14)',
  borderAccent: 'rgba(255,122,69,0.45)',
  track: '#F0E6D9',                // progress bar track
  cardShadow: 'rgba(31,27,22,0.06)',
  cardShadowWarm: 'rgba(255,122,69,0.12)',
  overlay: 'rgba(31,27,22,0.45)',
  recording: '#E5564B',

  // Glow effects (now warm coral instead of dark orange)
  accentGlow: 'rgba(255,122,69,0.30)',
  accentGlowSm: 'rgba(255,122,69,0.16)',

  // Tab bar (now white translucent instead of dark)
  tabBg: 'rgba(255,255,255,0.92)',
  tabActive: '#FF7A45',
  tabInactive: '#998E80',

  // Backwards compat
  muted: '#998E80',
};
