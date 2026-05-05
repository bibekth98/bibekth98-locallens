import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import {
  Colors,
  FontFamily,
  FontSize,
  GlassStyles,
  Spacing,
  GlobalStyles,
} from '@/theme';
import { SUPPORTED_LANGUAGES, applyLayoutDirection } from '@/i18n';

type RootNav = NativeStackNavigationProp<RootStackParamList>;

export default function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<RootNav>();

  const handleLanguageChange = useCallback(
    (code: string) => {
      i18n.changeLanguage(code);
      applyLayoutDirection(code);
    },
    [i18n],
  );

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('screens.profile.title')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* User info – loaded from GET /users/me in Step 2 */}
        <View style={[styles.avatarCard, GlassStyles.card]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitial}>?</Text>
          </View>
          <Text style={styles.userName}>{t('screens.profile.title')}</Text>
        </View>

        {/* Language selector */}
        <Text style={styles.sectionLabel}>{t('screens.profile.language')}</Text>
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isActive = i18n.language === lang.code;
          return (
            <TouchableOpacity
              key={lang.code}
              style={[styles.langItem, GlassStyles.card, isActive && styles.langItemActive]}
              onPress={() => handleLanguageChange(lang.code)}
            >
              <Text style={styles.langNative}>{lang.nativeLabel}</Text>
              {isActive && <View style={styles.dot} />}
            </TouchableOpacity>
          );
        })}

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => navigation.replace('LanguageSelection')}
        >
          <Text style={styles.logoutBtnText}>{t('screens.profile.logout')}</Text>
        </TouchableOpacity>
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.glassBorder,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xxl,
    color: Colors.white,
  },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  avatarCard: {
    alignItems: 'center',
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  avatarInitial: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xxl,
    color: Colors.deepNavy,
  },
  userName: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.lg,
    color: Colors.white,
  },
  sectionLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.gold,
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
  langItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  langItemActive: {
    borderColor: Colors.gold,
  },
  langNative: {
    flex: 1,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    color: Colors.white,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.gold,
  },
  logoutBtn: {
    marginTop: Spacing.xl,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.error,
    borderRadius: 12,
  },
  logoutBtnText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    color: Colors.error,
  },
});
