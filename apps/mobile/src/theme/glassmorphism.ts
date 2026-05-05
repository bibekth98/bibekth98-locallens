import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors } from './colors';

/**
 * Glassmorphism utility styles for SydneyGo.
 * Apply these as base and merge with component-specific overrides.
 *
 * On native platforms (iOS / Android) combine these styles with expo-blur's
 * BlurView for real backdrop-filter blur (see GlassCard component).
 * On web a semi-transparent background is used as a fallback.
 */

export interface GlassStyle {
  container: ViewStyle;
  card: ViewStyle;
  cardDark: ViewStyle;
  border: ViewStyle;
  innerShadow: ViewStyle;
}

export const GlassStyles = StyleSheet.create<Record<string, ViewStyle | TextStyle>>({
  /** Standard frosted-glass card */
  card: {
    backgroundColor: Colors.glassBg,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderRadius: 16,
    overflow: 'hidden',
  },

  /** Darker glass card for contrast over light backgrounds */
  cardDark: {
    backgroundColor: Colors.glassNavy,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 16,
    overflow: 'hidden',
  },

  /** Full-screen glass overlay */
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.overlayDark,
  },

  /** Floating button / pill */
  pill: {
    backgroundColor: Colors.glassBg,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderRadius: 100,
    paddingVertical: 10,
    paddingHorizontal: 20,
    overflow: 'hidden',
  },

  /** Input field */
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: Colors.white,
  },

  /** Bottom sheet / drawer */
  sheet: {
    backgroundColor: Colors.glassNavy,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: Colors.glassBorder,
    overflow: 'hidden',
  },

  /**
   * Blur-card: intended for use inside a BlurView wrapper (GlassCard).
   * The translucent tint sits above the blur layer for the correct layering.
   */
  blurCard: {
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderRadius: 16,
    overflow: 'hidden',
  },

  /** Blur pill – use inside BlurView / GlassCard */
  blurPill: {
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderRadius: 100,
    paddingVertical: 10,
    paddingHorizontal: 20,
    overflow: 'hidden',
  },
});
