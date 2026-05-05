import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';

import type { RootStackParamList, MainTabParamList } from './types';
import { Colors } from '@/theme';

// ─── Screen Imports ───────────────────────────────────────────────────────────
import LanguageSelectionScreen from '@/screens/LanguageSelectionScreen';
import AiOnboardingChatScreen from '@/screens/AiOnboardingChatScreen';
import Overview3DScreen from '@/screens/Overview3DScreen';
import HomeScreen from '@/screens/HomeScreen';
import AiChatScreen from '@/screens/AiChatScreen';
import Map3DScreen from '@/screens/Map3DScreen';
import ItineraryScreen from '@/screens/ItineraryScreen';
import ExploreScreen from '@/screens/ExploreScreen';
import RestaurantsScreen from '@/screens/RestaurantsScreen';
import TransportScreen from '@/screens/TransportScreen';
import ProfileScreen from '@/screens/ProfileScreen';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();

// ─── Bottom Tab Navigator ─────────────────────────────────────────────────────

function MainTabNavigator() {
  const { t } = useTranslation();

  return (
    <MainTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.navy,
          borderTopColor: Colors.glassBorder,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: Colors.gold,
        tabBarInactiveTintColor: Colors.midGray,
        tabBarLabelStyle: {
          fontSize: 11,
        },
      }}
    >
      <MainTab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: t('navigation.home') }}
      />
      <MainTab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{ title: t('navigation.explore') }}
      />
      <MainTab.Screen
        name="Map3D"
        component={Map3DScreen}
        options={{ title: t('navigation.map') }}
      />
      <MainTab.Screen
        name="Itinerary"
        component={ItineraryScreen}
        options={{ title: t('navigation.itinerary') }}
      />
      <MainTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: t('navigation.profile') }}
      />
    </MainTab.Navigator>
  );
}

// ─── Root Stack Navigator ─────────────────────────────────────────────────────

export default function AppNavigator() {
  return (
    <RootStack.Navigator
      initialRouteName="LanguageSelection"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.deepNavy },
        animation: 'slide_from_right',
      }}
    >
      <RootStack.Screen name="LanguageSelection" component={LanguageSelectionScreen} />
      <RootStack.Screen name="AiOnboarding" component={AiOnboardingChatScreen} />
      <RootStack.Screen name="Overview3D" component={Overview3DScreen} />
      <RootStack.Screen name="Main" component={MainTabNavigator} />
    </RootStack.Navigator>
  );
}
