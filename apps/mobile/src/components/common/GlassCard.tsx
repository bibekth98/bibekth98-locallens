import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { Colors, BorderRadius } from '@/theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  dark?: boolean;
}

/**
 * Reusable glassmorphism card container.
 *
 * - `dark` variant uses the navy-tinted glass (better on light backgrounds)
 * - Full backdrop-filter blur requires @react-native-community/blur on native;
 *   add it in Step 3 when the 3D screens are wired.
 */
export default function GlassCard({ children, style, dark = false }: GlassCardProps) {
  return (
    <View style={[dark ? styles.dark : styles.light, style]}>
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
