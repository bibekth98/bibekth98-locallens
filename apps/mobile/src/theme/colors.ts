/**
 * SydneyGo Colour Palette
 * Primary: Deep Navy (#0D1B2A)
 * Accent:  Gold    (#C9A84C)
 */
export const Colors = {
  // --- Core ---
  deepNavy: '#0D1B2A',
  navy: '#1A2E42',
  navyLight: '#243D56',

  gold: '#C9A84C',
  goldLight: '#E0C068',
  goldDark: '#A07830',

  // --- Neutrals ---
  white: '#FFFFFF',
  offWhite: '#F5F5F0',
  lightGray: '#D4D4D0',
  midGray: '#8A8A8A',
  darkGray: '#3A3A3A',
  black: '#000000',

  // --- Semantic ---
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  info: '#2196F3',

  // --- Glassmorphism ---
  glassBg: 'rgba(255, 255, 255, 0.12)',
  glassBorder: 'rgba(255, 255, 255, 0.25)',
  glassNavy: 'rgba(13, 27, 42, 0.75)',
  glassDark: 'rgba(0, 0, 0, 0.40)',

  // --- Overlay ---
  overlayLight: 'rgba(255, 255, 255, 0.08)',
  overlayDark: 'rgba(0, 0, 0, 0.60)',

  // --- Transparent ---
  transparent: 'transparent',
} as const;

export type ColorKey = keyof typeof Colors;
