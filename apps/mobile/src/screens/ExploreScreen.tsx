import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import {
  Colors,
  FontFamily,
  FontSize,
  GlassStyles,
  Spacing,
  GlobalStyles,
} from '@/theme';

export default function ExploreScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('screens.explore.title')}</Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchWrapper}>
        <TextInput
          style={[styles.searchInput, GlassStyles.input]}
          placeholder={t('common.search')}
          placeholderTextColor={Colors.midGray}
        />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Categories – loaded from GET /places/categories in Step 2 */}
        <Text style={styles.sectionLabel}>{t('screens.explore.categories')}</Text>
        <View style={styles.categoriesRow}>
          {['🏖️', '🏛️', '🎭', '🌿', '🍽️', '🛍️'].map((icon, i) => (
            <TouchableOpacity key={i} style={[styles.categoryChip, GlassStyles.card]}>
              <Text style={styles.categoryIcon}>{icon}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Nearby – loaded from GET /places/nearby in Step 2 */}
        <Text style={styles.sectionLabel}>{t('screens.explore.nearby')}</Text>
        <View style={styles.nearbyPlaceholder}>
          <Text style={styles.placeholderText}>{t('common.loading')}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { ...GlobalStyles.screen },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xxl,
    color: Colors.white,
  },
  searchWrapper: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  searchInput: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
  },
  content: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl },
  sectionLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.white,
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
  categoriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  categoryChip: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  categoryIcon: { fontSize: 26 },
  nearbyPlaceholder: {
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.glassBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  placeholderText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.midGray,
  },
});
