import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors, BorderRadius } from '@/theme';
import { FeatureFlags } from '@/config/featureFlags';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  /** Dark navy-tinted variant – better on light backgrounds */
  dark?: boolean;
  /** Blur intensity (0-100). Defaults to 20. Only applied when supportsBlur is true. */
  blurIntensity?: number;
}

/**
 * Reusable glassmorphism card container.
 *
 * On native (iOS / Android) renders a real blur using expo-blur's BlurView.
 * On web falls back to a semi-transparent overlay because CSS backdrop-filter
 * support is not guaranteed in all browsers.
 */
export default function GlassCard({
  children,
  style,
  dark = false,
  blurIntensity = 20,
}: GlassCardProps) {
  const baseStyle = dark ? styles.dark : styles.light;

  if (FeatureFlags.supportsBlur) {
    return (
      <BlurView
        intensity={blurIntensity}
        tint={dark ? 'dark' : 'light'}
        style={[baseStyle, style]}
      >
        {children}
      </BlurView>
    );
  }

  // Web / unsupported platform – solid semi-transparent fallback
  return (
    <View style={[baseStyle, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  light: {
    backgroundColor: Colors.glassBg,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  dark: {
    backgroundColor: Colors.glassNavy,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
});
