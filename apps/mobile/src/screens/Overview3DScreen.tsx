import React, { useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BlurView } from 'expo-blur';

import type { RootStackScreenProps } from '@/navigation/types';
import { Colors, FontFamily, FontSize, Spacing, GlobalStyles } from '@/theme';
import { FeatureFlags } from '@/config/featureFlags';

// ─── expo-gl context type augmentation ───────────────────────────────────────
/** expo-gl extends WebGLRenderingContext with an explicit frame-flush method. */
interface ExpoGLRenderingContext extends WebGLRenderingContext {
  endFrameEXP(): void;
}

/** Minimal HTMLCanvasElement-like object that Three.js WebGLRenderer accepts. */
interface ExpoGLCanvas {
  width: number;
  height: number;
  clientHeight: number;
  style: Record<string, unknown>;
  addEventListener(): void;
  removeEventListener(): void;
}

// ─── Conditional imports – expo-gl / Three.js not available on web ────────────
let GLView: React.ComponentType<{
  style?: object;
  onContextCreate: (gl: ExpoGLRenderingContext) => void;
}> | null = null;

if (FeatureFlags.supportsExpoGL) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  GLView = require('expo-gl').GLView;
}

// ─── Three.js scene setup ─────────────────────────────────────────────────────

/**
 * Bootstrap a simple animated Three.js scene inside an expo-gl context.
 * The scene renders a stylised Sydney skyline as coloured box geometry –
 * no external assets required.
 */
function setupThreeScene(gl: ExpoGLRenderingContext): () => void {
  // Lazy-require Three.js only when the GL context is available
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const THREE = require('three') as typeof import('three');

  const expoCanvas: ExpoGLCanvas = {
    width: gl.drawingBufferWidth,
    height: gl.drawingBufferHeight,
    clientHeight: gl.drawingBufferHeight,
    style: {},
    addEventListener: () => {},
    removeEventListener: () => {},
  };

  const renderer = new THREE.WebGLRenderer({
    canvas: expoCanvas as unknown as HTMLCanvasElement,
    context: gl as unknown as WebGL2RenderingContext,
  });
  renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight, false);
  renderer.setClearColor(new THREE.Color(Colors.deepNavy));

  const scene = new THREE.Scene();
  const aspect = gl.drawingBufferWidth / gl.drawingBufferHeight;
  const camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
  camera.position.set(0, 8, 24);
  camera.lookAt(0, 2, 0);

  // ── Lighting ──────────────────────────────────────────────────────────────
  const ambientLight = new THREE.AmbientLight(0x4466aa, 1.2);
  scene.add(ambientLight);
  const dirLight = new THREE.DirectionalLight(0xffd700, 1.5);
  dirLight.position.set(10, 20, 10);
  scene.add(dirLight);

  // ── Ground plane ──────────────────────────────────────────────────────────
  const groundGeo = new THREE.PlaneGeometry(60, 40);
  const groundMat = new THREE.MeshLambertMaterial({ color: 0x0d1b2a });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  // ── Harbour ───────────────────────────────────────────────────────────────
  const harbourGeo = new THREE.PlaneGeometry(60, 15);
  const harbourMat = new THREE.MeshLambertMaterial({
    color: 0x1a3a5a,
    transparent: true,
    opacity: 0.85,
  });
  const harbour = new THREE.Mesh(harbourGeo, harbourMat);
  harbour.rotation.x = -Math.PI / 2;
  harbour.position.z = -10;
  harbour.position.y = 0.01;
  scene.add(harbour);

  // ── Sydney CBD buildings ──────────────────────────────────────────────────
  const goldColor = new THREE.Color(Colors.gold);
  const navyLightColor = new THREE.Color(Colors.navyLight);

  const buildingData = [
    // Sydney Tower (tallest)
    { x: 0, z: 0, w: 1.2, d: 1.2, h: 18, color: goldColor },
    // CBD blocks
    { x: -5, z: 0, w: 2.5, d: 2.5, h: 10, color: navyLightColor },
    { x: -8, z: 1, w: 2, d: 2, h: 7, color: navyLightColor },
    { x: 5, z: 0, w: 2.5, d: 2.5, h: 9, color: navyLightColor },
    { x: 8, z: 1, w: 2, d: 2, h: 6, color: navyLightColor },
    { x: -3, z: -2, w: 1.8, d: 1.8, h: 12, color: navyLightColor },
    { x: 3, z: -2, w: 1.8, d: 1.8, h: 11, color: navyLightColor },
    { x: -6, z: -3, w: 1.5, d: 1.5, h: 8, color: navyLightColor },
    { x: 6, z: -3, w: 1.5, d: 1.5, h: 8, color: navyLightColor },
    // Opera House base
    { x: 10, z: -8, w: 4, d: 3, h: 1.5, color: new THREE.Color(0xf0ece0) },
    // Harbour Bridge pylons
    { x: -14, z: -10, w: 1.5, d: 1.5, h: 5, color: new THREE.Color(0x8a8a8a) },
    { x: 14, z: -10, w: 1.5, d: 1.5, h: 5, color: new THREE.Color(0x8a8a8a) },
  ];

  buildingData.forEach(({ x, z, w, d, h, color }) => {
    const geo = new THREE.BoxGeometry(w, h, d);
    const mat = new THREE.MeshLambertMaterial({ color });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, h / 2, z);
    scene.add(mesh);
  });

  // ── Animation loop ────────────────────────────────────────────────────────
  let animFrameId: ReturnType<typeof requestAnimationFrame>;
  let angle = 0;

  function animate() {
    animFrameId = requestAnimationFrame(animate);
    angle += 0.003;
    // Slowly rotate camera around the scene
    camera.position.x = Math.sin(angle) * 24;
    camera.position.z = Math.cos(angle) * 24;
    camera.lookAt(0, 3, 0);

    renderer.render(scene, camera);
    // expo-gl requires an explicit frame flush after each render
    gl.endFrameEXP();
  }

  animate();

  // Return cleanup function
  return () => {
    cancelAnimationFrame(animFrameId);
    renderer.dispose();
  };
}

// ─── Screen ───────────────────────────────────────────────────────────────────

type Props = RootStackScreenProps<'Overview3D'>;

export default function Overview3DScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const cleanupRef = useRef<(() => void) | null>(null);

  const handleContextCreate = useCallback((gl: ExpoGLRenderingContext) => {
    cleanupRef.current = setupThreeScene(gl);
  }, []);

  const handleExplore = useCallback(() => {
    cleanupRef.current?.();
    navigation.replace('Main');
  }, [navigation]);

  return (
    <SafeAreaView style={styles.screen}>
      {/* ── 3D canvas ───────────────────────────────────────────────────── */}
      {FeatureFlags.supportsExpoGL && GLView ? (
        <GLView style={StyleSheet.absoluteFill} onContextCreate={handleContextCreate} />
      ) : (
        // Web fallback – gradient placeholder
        <View style={styles.webFallback}>
          <Text style={styles.fallbackIcon}>🌆</Text>
          <Text style={styles.fallbackLabel}>Sydney Cityscape</Text>
          <Text style={styles.fallbackSub}>(3D view available on iOS / Android)</Text>
        </View>
      )}

      {/* ── Overlay UI ──────────────────────────────────────────────────── */}
      <View style={styles.overlay}>
        {Platform.OS !== 'web' ? (
          <BlurView intensity={30} tint="dark" style={styles.titleBlur}>
            <Text style={styles.title}>{t('screens.overview3d.title')}</Text>
          </BlurView>
        ) : (
          <View style={styles.titleFallback}>
            <Text style={styles.title}>{t('screens.overview3d.title')}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.exploreBtn} onPress={handleExplore} activeOpacity={0.8}>
          {Platform.OS !== 'web' ? (
            <BlurView intensity={40} tint="light" style={styles.exploreBtnInner}>
              <Text style={styles.exploreBtnText}>{t('screens.overview3d.explore')}</Text>
            </BlurView>
          ) : (
            <View style={[styles.exploreBtnInner, styles.exploreBtnFallback]}>
              <Text style={styles.exploreBtnText}>{t('screens.overview3d.explore')}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { ...GlobalStyles.screen },

  webFallback: {
    flex: 1,
    backgroundColor: Colors.deepNavy,
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

  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.lg,
  },
  titleBlur: {
    borderRadius: 16,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  titleFallback: {
    backgroundColor: Colors.glassNavy,
    borderRadius: 16,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xxl,
    color: Colors.white,
  },

  exploreBtn: {
    borderRadius: 100,
    overflow: 'hidden',
  },
  exploreBtnInner: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors.gold,
    overflow: 'hidden',
  },
  exploreBtnFallback: {
    backgroundColor: Colors.gold,
  },
  exploreBtnText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.deepNavy,
  },
});
