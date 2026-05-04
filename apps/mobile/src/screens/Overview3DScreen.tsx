import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { RootStackScreenProps } from '@/navigation/types';
import { Colors, FontFamily, FontSize, Spacing, GlobalStyles, GlassStyles } from '@/theme';

type Props = RootStackScreenProps<'Overview3D'>;

/**
 * 3D Overview Screen
 *
 * This screen will host a WebGL/Three.js 3D cityscape of Sydney rendered
 * inside a WebView or via expo-gl. The actual 3D renderer will be wired
 * in a later step. The placeholder below provides the correct layout shell.
 */
export default function Overview3DScreen({ navigation }: Props) {
  const { t } = useTranslation();

  const handleExplore = useCallback(() => {
    navigation.replace('Main');
  }, [navigation]);

  return (
    <SafeAreaView style={styles.screen}>
      {/* 3D canvas placeholder – wired in Step 3 */}
      <View style={styles.canvasPlaceholder}>
        <Text style={styles.placeholderLabel}>[3D Sydney Cityscape]</Text>
        <Text style={styles.placeholderSub}>Three.js / expo-gl renderer (Step 3)</Text>
      </View>

      {/* Overlay UI */}
      <View style={styles.overlay}>
        <Text style={styles.title}>{t('screens.overview3d.title')}</Text>

        <TouchableOpacity style={[styles.exploreBtn, GlassStyles.pill]} onPress={handleExplore}>
          <Text style={styles.exploreBtnText}>{t('screens.overview3d.explore')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { ...GlobalStyles.screen },
  canvasPlaceholder: {
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
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xxl,
    color: Colors.white,
    marginBottom: Spacing.lg,
  },
  exploreBtn: {
    backgroundColor: Colors.gold,
    borderColor: Colors.gold,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  exploreBtnText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.deepNavy,
  },
});
