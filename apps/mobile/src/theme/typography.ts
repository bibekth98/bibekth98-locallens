import { Platform } from 'react-native';

/**
 * SydneyGo Typography
 * Base font: Noto Sans (loaded via expo-google-fonts)
 * Falls back to system sans-serif if not yet loaded.
 */
export const FontFamily = {
  regular: 'NotoSans_400Regular',
  medium: 'NotoSans_500Medium',
  semiBold: 'NotoSans_600SemiBold',
  bold: 'NotoSans_700Bold',
  // RTL-safe fallback (Arabic)
  system: Platform.select({ ios: 'System', android: 'Roboto', default: 'sans-serif' }),
} as const;

export const FontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  xxl: 30,
  display: 38,
} as const;

export const LineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
} as const;

export const LetterSpacing = {
  tight: -0.5,
  normal: 0,
  wide: 0.5,
  wider: 1,
} as const;
