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

export default function RestaurantsScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('screens.restaurants.title')}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={[styles.actionBtn, GlassStyles.pill]}>
            <Text style={styles.actionBtnText}>{t('screens.restaurants.filter')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, GlassStyles.pill]}>
            <Text style={styles.actionBtnText}>{t('screens.restaurants.sortBy')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchWrapper}>
        <TextInput
          style={[styles.searchInput, GlassStyles.input]}
          placeholder={t('common.search')}
          placeholderTextColor={Colors.midGray}
        />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Restaurant list – loaded from GET /restaurants/search in Step 2 */}
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>{t('common.loading')}</Text>
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
    marginBottom: Spacing.sm,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionBtn: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs },
  actionBtnText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
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
  emptyState: {
    paddingTop: Spacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.midGray,
  },
});
