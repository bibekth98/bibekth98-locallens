import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
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

export default function TransportScreen() {
  const { t } = useTranslation();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('screens.transport.title')}</Text>
      </View>

      {/* Journey planner */}
      <View style={[styles.plannerCard, GlassStyles.cardDark]}>
        <Text style={styles.plannerLabel}>{t('screens.transport.planJourney')}</Text>

        <View style={styles.fieldWrapper}>
          <Text style={styles.fieldLabel}>{t('screens.transport.from')}</Text>
          <TextInput
            style={styles.fieldInput}
            value={from}
            onChangeText={setFrom}
            placeholder="e.g. Central Station"
            placeholderTextColor={Colors.midGray}
          />
        </View>

        <View style={styles.fieldWrapper}>
          <Text style={styles.fieldLabel}>{t('screens.transport.to')}</Text>
          <TextInput
            style={styles.fieldInput}
            value={to}
            onChangeText={setTo}
            placeholder="e.g. Sydney Opera House"
            placeholderTextColor={Colors.midGray}
          />
        </View>

        <TouchableOpacity style={styles.searchBtn}>
          <Text style={styles.searchBtnText}>{t('common.search')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Trip results – loaded from GET /transport/trip in Step 2 */}
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
  },
  plannerCard: {
    margin: Spacing.lg,
    padding: Spacing.lg,
  },
  plannerLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.gold,
    marginBottom: Spacing.md,
  },
  fieldWrapper: { marginBottom: Spacing.md },
  fieldLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.midGray,
    marginBottom: Spacing.xs,
  },
  fieldInput: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    padding: Spacing.sm,
    color: Colors.white,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
  },
  searchBtn: {
    backgroundColor: Colors.gold,
    borderRadius: 12,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  searchBtnText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
    color: Colors.deepNavy,
  },
  content: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl },
  emptyState: {
    paddingTop: Spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.midGray,
  },
});
