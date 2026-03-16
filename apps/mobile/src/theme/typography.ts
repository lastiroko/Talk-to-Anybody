export const typography = {
  fontFamily: {
    regular: 'Nunito-Regular',
    medium: 'Nunito-Medium',
    semiBold: 'Nunito-SemiBold',
    bold: 'Nunito-Bold',
    extraBold: 'Nunito-ExtraBold',
  },

  hero: 36,
  title: 26,
  heading: 20,
  subheading: 17,
  body: 15,
  caption: 13,
  small: 11,
  tiny: 10,

  // Backwards compat aliases
  weightBold: '700' as const,
  weightSemi: '600' as const,
  weightRegular: '400' as const,
};
