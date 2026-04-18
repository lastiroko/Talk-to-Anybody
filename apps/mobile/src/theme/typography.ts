export const typography = {
  fontFamily: {
    regular: 'JetBrainsMono_400Regular',
    medium: 'JetBrainsMono_500Medium',
    semiBold: 'JetBrainsMono_600SemiBold',
    bold: 'JetBrainsMono_700Bold',
    extraBold: 'JetBrainsMono_700Bold',
    // Display face
    display: 'SpaceGrotesk_700Bold',
    displayMedium: 'SpaceGrotesk_500Medium',
    displaySemiBold: 'SpaceGrotesk_600SemiBold',
  },

  // Type scale — tech-editorial
  hero: 64,       // display XL
  title: 40,      // display L
  heading: 24,    // heading (mono)
  subheading: 18, // subheading
  body: 14,       // body
  caption: 11,    // caption (uppercase)
  small: 10,      // small labels
  tiny: 9,        // tiny labels

  // Backwards compat aliases
  weightBold: '700' as const,
  weightSemi: '600' as const,
  weightRegular: '400' as const,
};
