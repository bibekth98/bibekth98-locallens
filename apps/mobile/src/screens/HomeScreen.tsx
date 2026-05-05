import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '@/navigation/types';
import {
  Colors,
  FontFamily,
  FontSize,
  GlassStyles,
  Spacing,
  GlobalStyles,
  Shadows,
} from '@/theme';

type HomeNavProp = NativeStackNavigationProp<HomeStackParamList, 'HomeScreen'>;

export default function HomeScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<HomeNavProp>();

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Greeting */}
        <View style={styles.greetingRow}>
          <View>
            <Text style={styles.appName}>{t('common.appName')}</Text>
            <Text style={styles.discover}>{t('screens.home.discover')}</Text>
          </View>
          {/* AI Chat shortcut */}
          <TouchableOpacity
            style={[styles.aiBtn, GlassStyles.pill]}
            onPress={() => navigation.navigate('AiChat')}
          >
            <Text style={styles.aiBtnText}>AI</Text>
          </TouchableOpacity>
        </View>

        {/* Quick-action cards – populated with live data in Step 2 */}
        {(
          [
            { key: 'explore',     label: t('navigation.explore') },
            { key: 'map',         label: t('navigation.map') },
            { key: 'itinerary',   label: t('navigation.itinerary') },
            { key: 'restaurants', label: t('screens.restaurants.title') },
            { key: 'transport',   label: t('screens.transport.title') },
          ] as const
        ).map(({ key, label }) => (
          <View key={key} style={[styles.card, GlassStyles.card]}>
            <Text style={styles.cardTitle}>{label}</Text>
            <Text style={styles.cardSub}>{t('common.loading')}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { ...GlobalStyles.screen },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  appName: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.display,
    color: Colors.gold,
  },
  discover: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.midGray,
  },
  aiBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderColor: Colors.gold,
  },
  aiBtnText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
    color: Colors.gold,
  },
  card: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.soft,
  },
  cardTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  cardSub: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.midGray,
  },
});
