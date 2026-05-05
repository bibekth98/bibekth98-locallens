import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

import {
  Colors,
  FontFamily,
  FontSize,
  GlassStyles,
  Spacing,
  GlobalStyles,
} from '@/theme';

/**
 * 3D Map Screen
 *
 * Will host a Mapbox GL / Three.js 3D tile map of Sydney.
 * Map renderer is wired in Step 3. This shell provides the correct
 * layout with layer controls and location button.
 */
export default function Map3DScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.screen}>
      {/* Map canvas placeholder */}
      <View style={styles.mapPlaceholder}>
        <Text style={styles.placeholderLabel}>[3D Map Canvas]</Text>
        <Text style={styles.placeholderSub}>Mapbox GL / expo-gl (Step 3)</Text>
      </View>

      {/* Floating controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={[styles.controlBtn, GlassStyles.card]}>
          <Text style={styles.controlBtnText}>{t('screens.map3d.layers')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.controlBtn, GlassStyles.card]}>
          <Text style={styles.controlBtnText}>{t('screens.map3d.myLocation')}</Text>
        </TouchableOpacity>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{t('screens.map3d.title')}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { ...GlobalStyles.screen },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: Colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.lg,
    color: Colors.midGray,
  },
  placeholderSub: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.midGray,
    marginTop: Spacing.xs,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.white,
  },
  controls: {
    position: 'absolute',
    bottom: Spacing.xl,
    right: Spacing.lg,
    gap: Spacing.sm,
  },
  controlBtn: {
    padding: Spacing.sm,
    borderRadius: 12,
  },
  controlBtnText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.white,
  },
});
