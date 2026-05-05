import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';

import en from './locales/en.json';
import zh from './locales/zh.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import hi from './locales/hi.json';
import ar from './locales/ar.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import neLatin from './locales/ne-Latn.json';

export const SUPPORTED_LANGUAGES = [
  { code: 'en',      label: 'English',             nativeLabel: 'English',         rtl: false },
  { code: 'zh',      label: 'Chinese (Simplified)', nativeLabel: '中文（简体）',      rtl: false },
  { code: 'ja',      label: 'Japanese',             nativeLabel: '日本語',           rtl: false },
  { code: 'ko',      label: 'Korean',               nativeLabel: '한국어',           rtl: false },
  { code: 'hi',      label: 'Hindi',                nativeLabel: 'हिन्दी',          rtl: false },
  { code: 'ar',      label: 'Arabic',               nativeLabel: 'العربية',         rtl: true  },
  { code: 'fr',      label: 'French',               nativeLabel: 'Français',        rtl: false },
  { code: 'de',      label: 'German',               nativeLabel: 'Deutsch',         rtl: false },
  { code: 'ne-Latn', label: 'Nepali (Latin)',        nativeLabel: 'Nepali (Latin)',  rtl: false },
] as const;

export type LanguageCode = typeof SUPPORTED_LANGUAGES[number]['code'];

/** Returns true if the given language code requires RTL layout */
export function isRTL(code: string): boolean {
  const lang = SUPPORTED_LANGUAGES.find((l) => l.code === code);
  return lang?.rtl ?? false;
}

/** Apply RTL layout changes at runtime (call after language switch) */
export function applyLayoutDirection(languageCode: string): void {
  const rtl = isRTL(languageCode);
  if (I18nManager.isRTL !== rtl) {
    I18nManager.allowRTL(rtl);
    I18nManager.forceRTL(rtl);
    // Note: A full app reload is required for RTL changes to take full effect.
    // Trigger via expo-updates or react-native-restart in production.
  }
}

i18n.use(initReactI18next).init({
  resources: {
    en:        { translation: en },
    zh:        { translation: zh },
    ja:        { translation: ja },
    ko:        { translation: ko },
    hi:        { translation: hi },
    ar:        { translation: ar },
    fr:        { translation: fr },
    de:        { translation: de },
    'ne-Latn': { translation: neLatin },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React Native handles XSS
  },
  compatibilityJSON: 'v3',
});

export default i18n;
