import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { Colors } from './colors';
import { FontFamily, FontSize } from './typography';

export * from './colors';
export * from './typography';
export * from './glassmorphism';

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const Shadows = {
  gold: {
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
  soft: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
} as const;

export const GlobalStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.deepNavy,
  } as ViewStyle,
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  h1: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xxl,
    color: Colors.white,
    letterSpacing: -0.5,
  } as TextStyle,
  h2: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xl,
    color: Colors.white,
  } as TextStyle,
  body: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.offWhite,
  } as TextStyle,
  caption: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.midGray,
  } as TextStyle,
  goldText: {
    color: Colors.gold,
  } as TextStyle,
});
