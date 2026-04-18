export const colors = {
  // Backgrounds — dark-first
  background: '#0A0A0A',          // app background
  backgroundLight: '#0F0F0F',     // slightly lighter variant
  surface: '#141414',              // cards, sheets (elevated)
  surfaceMuted: '#1F1F1F',        // inputs, chips, inactive tabs (subtle)
  surfaceHighlight: '#1A0A04',    // warm highlight card (accent tint)

  // Primary (orange accent)
  primary: '#FF4500',             // main accent
  primaryLight: '#FF7A1A',        // lighter accent / gradient end
  primaryDark: '#CC3700',         // pressed accent

  // Secondary (red for recording / live)
  gold: '#E63946',                // recording / live states
  goldLight: 'rgba(230,57,70,0.15)', // light red bg
  goldDark: '#CC2F3C',            // dark red

  // Accent (teal/green — kept for success)
  teal: '#4ADE80',                // success green
  tealLight: 'rgba(74,222,128,0.12)', // light green bg

  // Gamification colors
  gem: '#FF7A1A',                 // orange (was blue)
  coin: '#FF4500',                // orange (was gold)
  fire: '#FF4500',                // streak fire
  xp: '#FF7A1A',                  // XP accent

  // Text
  text: '#FFFFFF',                // primary headings
  textBody: '#FFFFFF',            // body text (white on dark)
  textMuted: '#8A8A8A',           // muted gray captions
  textLight: '#4A4A4A',           // disabled, hints
  textOnDark: '#FFFFFF',          // white on dark bg
  textOnPrimary: '#FFFFFF',       // white on primary

  // Status
  success: '#4ADE80',             // green
  successBg: 'rgba(74,222,128,0.12)',
  warning: '#FACC15',             // amber
  warningBg: 'rgba(250,204,21,0.12)',
  error: '#E63946',               // red
  errorBg: 'rgba(230,57,70,0.12)',

  // Exercise type colors — dark mode variants
  recordBg: 'rgba(255,69,0,0.12)',
  drillBg: 'rgba(255,122,26,0.12)',
  reflectionBg: 'rgba(138,138,138,0.12)',
  gameBg: 'rgba(74,222,128,0.12)',
  unlearningBg: 'rgba(230,57,70,0.12)',
  imitationBg: 'rgba(250,204,21,0.12)',

  // Category pill colors
  categoryRed: '#E63946',
  categoryBlue: '#60A5FA',
  categoryGreen: '#4ADE80',
  categoryPurple: '#A78BFA',
  categoryOrange: '#FF7A1A',
  categoryTeal: '#4ADE80',

  // UI Chrome
  divider: 'rgba(255,255,255,0.08)',
  border: 'rgba(255,255,255,0.08)',
  borderHi: 'rgba(255,255,255,0.16)',
  borderAccent: 'rgba(255,69,0,0.45)',
  cardShadow: 'rgba(0,0,0,0.5)',
  overlay: 'rgba(10,10,10,0.72)',
  recording: '#E63946',

  // Glow effects
  accentGlow: 'rgba(255,91,10,0.35)',
  accentGlowSm: 'rgba(255,91,10,0.18)',

  // Tab bar
  tabBg: 'rgba(10,10,10,0.78)',
  tabActive: '#FF7A1A',
  tabInactive: '#4A4A4A',

  // Backwards compat aliases
  muted: '#8A8A8A',
};
