import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// ─── Stack Params ────────────────────────────────────────────────────────────

/** Root stack – covers pre-auth flow and the main tab navigator */
export type RootStackParamList = {
  LanguageSelection: undefined;
  AiOnboarding: undefined;
  Overview3D: undefined;
  Main: undefined; // Bottom tab navigator
};

/** Main bottom-tab navigator */
export type MainTabParamList = {
  Home: undefined;
  Explore: undefined;
  Map3D: undefined;
  Itinerary: undefined;
  Profile: undefined;
};

/** Stacks nested inside individual tabs (extend as needed) */
export type HomeStackParamList = {
  HomeScreen: undefined;
  AiChat: undefined;
};

export type ExploreStackParamList = {
  ExploreScreen: undefined;
  Restaurants: undefined;
};

export type TransportStackParamList = {
  Transport: undefined;
};

// ─── Screen Props Helpers ────────────────────────────────────────────────────

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  BottomTabScreenProps<MainTabParamList, T>;
