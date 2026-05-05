import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';

import {
  Colors,
  FontFamily,
  FontSize,
  GlassStyles,
  Spacing,
  GlobalStyles,
} from '@/theme';

export default function ItineraryScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('screens.itinerary.title')}</Text>
        <TouchableOpacity style={[styles.addBtn, GlassStyles.pill]}>
          <Text style={styles.addBtnText}>{t('screens.itinerary.addItem')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Itinerary items will be loaded from GET /itineraries in Step 2 */}
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>{t('screens.itinerary.empty')}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { ...GlobalStyles.screen },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.glassBorder,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.white,
  },
  addBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderColor: Colors.gold,
  },
  addBtnText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.gold,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Spacing.xxl,
  },
  emptyText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.midGray,
    textAlign: 'center',
  },
});
