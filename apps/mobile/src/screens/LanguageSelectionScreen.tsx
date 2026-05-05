import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import type { RootStackScreenProps } from '@/navigation/types';
import { Colors, FontFamily, FontSize, GlassStyles, Spacing, GlobalStyles } from '@/theme';
import { SUPPORTED_LANGUAGES, applyLayoutDirection } from '@/i18n';
import type { LanguageCode } from '@/i18n';

type Props = RootStackScreenProps<'LanguageSelection'>;

export default function LanguageSelectionScreen({ navigation }: Props) {
  const { t, i18n } = useTranslation();

  const handleSelect = useCallback(
    (code: string) => {
      i18n.changeLanguage(code);
      applyLayoutDirection(code);
    },
    [i18n],
  );

  const handleContinue = useCallback(() => {
    navigation.replace('AiOnboarding');
  }, [navigation]);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('screens.languageSelection.title')}</Text>
        <Text style={styles.subtitle}>{t('screens.languageSelection.subtitle')}</Text>
      </View>

      <FlatList
        data={SUPPORTED_LANGUAGES}
        keyExtractor={(item) => item.code}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const isSelected = i18n.language === item.code;
          return (
            <TouchableOpacity
              style={[styles.languageItem, GlassStyles.card, isSelected && styles.selectedItem]}
              onPress={() => handleSelect(item.code)}
              activeOpacity={0.75}
            >
              <Text style={styles.nativeLabel}>{item.nativeLabel}</Text>
              <Text style={styles.enLabel}>{item.label}</Text>
              {isSelected && <View style={styles.dot} />}
            </TouchableOpacity>
          );
        }}
      />

      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
          <Text style={styles.continueBtnText}>{t('screens.languageSelection.continue')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { ...GlobalStyles.screen },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xxl,
    color: Colors.white,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.midGray,
  },
  list: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  selectedItem: {
    borderColor: Colors.gold,
  },
  nativeLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.white,
    flex: 1,
  },
  enLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.midGray,
    marginRight: Spacing.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.gold,
  },
  footer: {
    padding: Spacing.lg,
  },
  continueBtn: {
    backgroundColor: Colors.gold,
    borderRadius: 14,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  continueBtnText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.deepNavy,
  },
});
