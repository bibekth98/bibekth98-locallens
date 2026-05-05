import { Platform } from 'react-native';

/**
 * Feature flags for Step 3 capabilities.
 * Used to gracefully degrade on platforms where 3D / blur is unavailable.
 */
export const FeatureFlags = {
  /**
   * Whether the platform supports real blur (expo-blur BlurView).
   * On web, expo-blur uses CSS backdrop-filter which may not be supported in
   * all browsers. We fall back to a semi-transparent overlay in that case.
   */
  supportsBlur: Platform.OS !== 'web',

  /**
   * Whether expo-gl / WebGL is available for Three.js rendering.
   * expo-gl is unsupported on web inside Expo Go but works in a native build.
   */
  supportsExpoGL: Platform.OS !== 'web',

  /**
   * Whether react-native-maps 3D perspective view is available.
   * react-native-maps requires a native module and is not available on web.
   */
  supportsNativeMap: Platform.OS !== 'web',
} as const;
