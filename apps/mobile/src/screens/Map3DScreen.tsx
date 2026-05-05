import React, { useRef, useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { BlurView } from 'expo-blur';

import {
  Colors,
  FontFamily,
  FontSize,
  Spacing,
  GlobalStyles,
} from '@/theme';
import { FeatureFlags } from '@/config/featureFlags';

// ─── Conditional imports – react-native-maps not available on web ─────────────

interface MapViewInstance {
  animateCamera: (camera: CameraConfig, opts?: { duration?: number }) => void;
}

interface MapViewProps {
  style?: object;
  mapType?: string;
  showsBuildings?: boolean;
  showsCompass?: boolean;
  showsUserLocation?: boolean;
  pitchEnabled?: boolean;
  rotateEnabled?: boolean;
  scrollEnabled?: boolean;
  zoomEnabled?: boolean;
  onMapReady?: () => void;
  children?: React.ReactNode;
  provider?: string;
}

interface CameraConfig {
  center?: { latitude: number; longitude: number };
  pitch?: number;
  heading?: number;
  altitude?: number;
  zoom?: number;
}

interface CameraProps {
  pitch?: number;
  heading?: number;
  altitude?: number;
  zoom?: number;
  centerCoordinate?: [number, number];
}

/** react-native-maps MapView exposes imperative methods via ref. */
type MapViewType = React.ForwardRefExoticComponent<
  MapViewProps & React.RefAttributes<MapViewInstance>
>;

let MapView: MapViewType | null = null;
// Camera component is reserved for future use
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let _Camera: React.ComponentType<CameraProps> | null = null;

if (FeatureFlags.supportsNativeMap) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const RNM = require('react-native-maps');
  MapView = RNM.default;
}

// ─── Sydney landmarks ─────────────────────────────────────────────────────────
/** Initial 3D camera looking over Sydney CBD */
const SYDNEY_CAMERA: CameraConfig = {
  center: { latitude: -33.8688, longitude: 151.2093 },
  pitch: 60,        // 60° tilt for 3D perspective
  heading: 0,
  altitude: 1500,   // metres above ground (iOS)
  zoom: 15,         // zoom level (Android)
};

/** Preset views to cycle through */
const CAMERA_PRESETS: Array<{ label: string; camera: CameraConfig }> = [
  {
    label: 'CBD',
    camera: {
      center: { latitude: -33.8688, longitude: 151.2093 },
      pitch: 60, heading: 0, altitude: 1500, zoom: 15,
    },
  },
  {
    label: 'Opera',
    camera: {
      center: { latitude: -33.8568, longitude: 151.2153 },
      pitch: 70, heading: 200, altitude: 800, zoom: 16,
    },
  },
  {
    label: 'Bridge',
    camera: {
      center: { latitude: -33.8523, longitude: 151.2108 },
      pitch: 65, heading: 90, altitude: 600, zoom: 16,
    },
  },
];

// ─── Control button helper ────────────────────────────────────────────────────

interface ControlBtnProps {
  label: string;
  onPress: () => void;
  active?: boolean;
}

function ControlButton({ label, onPress, active = false }: ControlBtnProps) {
  const content = (
    <Text style={[styles.controlBtnText, active && styles.controlBtnTextActive]}>{label}</Text>
  );

  if (Platform.OS !== 'web') {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.75} style={styles.controlBtnWrap}>
        <BlurView intensity={35} tint="dark" style={[styles.controlBtn, active && styles.controlBtnActive]}>
          {content}
        </BlurView>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[styles.controlBtn, styles.controlBtnFallback, active && styles.controlBtnActive]}
    >
      {content}
    </TouchableOpacity>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function Map3DScreen() {
  const { t } = useTranslation();
  const mapRef = useRef<MapViewInstance>(null);
  const [activePreset, setActivePreset] = useState(0);
  const [mapReady, setMapReady] = useState(false);

  /** Fly camera to the selected preset */
  const flyToPreset = useCallback(
    (index: number) => {
      setActivePreset(index);
      mapRef.current?.animateCamera(CAMERA_PRESETS[index].camera, { duration: 1200 });
    },
    [],
  );

  /** Centre on current location (no location permission required – flies to Sydney) */
  const handleMyLocation = useCallback(() => {
    mapRef.current?.animateCamera(SYDNEY_CAMERA, { duration: 800 });
  }, []);

  // Apply initial 3D camera once map is ready
  useEffect(() => {
    if (mapReady) {
      mapRef.current?.animateCamera(SYDNEY_CAMERA, { duration: 0 });
    }
  }, [mapReady]);

  // ── Web fallback ────────────────────────────────────────────────────────
  if (!FeatureFlags.supportsNativeMap || !MapView) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.webFallback}>
          <Text style={styles.fallbackIcon}>🗺️</Text>
          <Text style={styles.fallbackLabel}>{t('screens.map3d.title')}</Text>
          <Text style={styles.fallbackSub}>(3D map available on iOS / Android)</Text>
        </View>
        <View style={styles.headerWeb}>
          <Text style={styles.title}>{t('screens.map3d.title')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      {/* ── 3D Map canvas ──────────────────────────────────────────────── */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        mapType="standard"
        showsBuildings
        showsCompass={false}
        showsUserLocation
        pitchEnabled
        rotateEnabled
        scrollEnabled
        zoomEnabled
        onMapReady={() => setMapReady(true)}
      />

      {/* Loading indicator */}
      {!mapReady && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator color={Colors.gold} size="large" />
        </View>
      )}

      {/* ── Floating header ─────────────────────────────────────────────── */}
      <View style={styles.header}>
        <BlurView intensity={40} tint="dark" style={styles.headerBlur}>
          <Text style={styles.title}>{t('screens.map3d.title')}</Text>
        </BlurView>
      </View>

      {/* ── Preset selector ─────────────────────────────────────────────── */}
      <View style={styles.presets}>
        {CAMERA_PRESETS.map((preset, i) => (
          <ControlButton
            key={preset.label}
            label={preset.label}
            onPress={() => flyToPreset(i)}
            active={activePreset === i}
          />
        ))}
      </View>

      {/* ── Right side controls ─────────────────────────────────────────── */}
      <View style={styles.controls}>
        <ControlButton label={t('screens.map3d.layers')} onPress={() => {}} />
        <ControlButton label="📍" onPress={handleMyLocation} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { ...GlobalStyles.screen },

  webFallback: {
    flex: 1,
    backgroundColor: Colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackIcon: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  fallbackLabel: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.white,
  },
  fallbackSub: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.midGray,
    marginTop: Spacing.xs,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
  headerWeb: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
  },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.deepNavy,
    alignItems: 'center',
    justifyContent: 'center',
  },

  header: {
    position: 'absolute',
    top: Spacing.lg,
    left: Spacing.lg,
    right: Spacing.lg,
  },
  headerBlur: {
    borderRadius: 14,
    padding: Spacing.sm,
    paddingHorizontal: Spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.white,
  },

  presets: {
    position: 'absolute',
    bottom: Spacing.xl,
    left: Spacing.lg,
    flexDirection: 'row',
    gap: Spacing.sm,
  },

  controls: {
    position: 'absolute',
    bottom: Spacing.xl,
    right: Spacing.lg,
    gap: Spacing.sm,
  },
  controlBtnWrap: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  controlBtn: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    overflow: 'hidden',
  },
  controlBtnFallback: {
    backgroundColor: Colors.glassNavy,
  },
  controlBtnActive: {
    borderColor: Colors.gold,
  },
  controlBtnText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.white,
  },
  controlBtnTextActive: {
    color: Colors.gold,
  },
});
