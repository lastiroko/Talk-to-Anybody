// SpeakCoach typography — Brief v3 (Fraunces display + DM Sans body)
//
// Field names kept compatible with the previous mono setup.
// `fontFamily.regular/medium/semiBold/bold` now points at DM Sans variants.
// `fontFamily.display*` points at Fraunces.

export const typography = {
  fontFamily: {
    regular: 'DMSans_400Regular',
    medium: 'DMSans_500Medium',
    semiBold: 'DMSans_600SemiBold',
    bold: 'DMSans_700Bold',
    extraBold: 'DMSans_700Bold',
    // Display face (Fraunces — warm modern serif)
    display: 'Fraunces_600SemiBold',
    displayMedium: 'Fraunces_500Medium',
    displaySemiBold: 'Fraunces_600SemiBold',
    displayItalic: 'Fraunces_500Medium_Italic',
  },

  // Type scale — bright pastel system
  hero: 56,       // hero display (Welcome headline)
  title: 32,      // section title (Fraunces)
  display: 48,    // big day number (Fraunces)
  heading: 22,    // section heading (DM Sans Bold)
  subheading: 17, // subheading (DM Sans Medium)
  body: 15,       // body
  small: 13,      // small label
  caption: 11,    // eyebrow / tiny label (NOT all caps now)
  tiny: 10,

  // Backwards compat aliases
  weightBold: '700' as const,
  weightSemi: '600' as const,
  weightRegular: '400' as const,
};
