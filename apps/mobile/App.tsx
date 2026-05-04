import 'react-native-gesture-handler';
import React, { useCallback, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {
  NotoSans_400Regular,
  NotoSans_500Medium,
  NotoSans_700Bold,
} from '@expo-google-fonts/noto-sans';
import { I18nextProvider } from 'react-i18next';

import i18n from '@/i18n';
import AppNavigator from '@/navigation/AppNavigator';
import { Colors } from '@/theme';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    NotoSans_400Regular,
    NotoSans_500Medium,
    NotoSans_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <I18nextProvider i18n={i18n}>
        <NavigationContainer>
          <StatusBar style="light" backgroundColor={Colors.deepNavy} />
          <AppNavigator />
        </NavigationContainer>
      </I18nextProvider>
    </SafeAreaProvider>
  );
}
