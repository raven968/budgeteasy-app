/**
 * Design tokens. Screens and components read them through `useTheme()`; never hard-code
 * colors or spacing in components.
 */
const palette = {
  green500: '#16A34A',
  green600: '#15803D',
  red500: '#DC2626',
  red400: '#F87171',
  gray50: '#F8FAFC',
  gray100: '#F1F5F9',
  gray300: '#CBD5E1',
  gray500: '#64748B',
  gray700: '#334155',
  gray800: '#1E293B',
  gray900: '#0F172A',
  white: '#FFFFFF',
};

const lightColors = {
  background: palette.gray50,
  surface: palette.white,
  text: palette.gray900,
  textMuted: palette.gray500,
  border: palette.gray300,
  primary: palette.green600,
  primaryText: palette.white,
  danger: palette.red500,
};

export type ThemeColors = typeof lightColors;

const darkColors: ThemeColors = {
  background: palette.gray900,
  surface: palette.gray800,
  text: palette.gray50,
  textMuted: palette.gray300,
  border: palette.gray700,
  primary: palette.green500,
  primaryText: palette.white,
  danger: palette.red400,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  md: 10,
  lg: 16,
} as const;

export const typography = {
  title: { fontSize: 28, fontWeight: '700' },
  subtitle: { fontSize: 18, fontWeight: '600' },
  body: { fontSize: 16, fontWeight: '400' },
  label: { fontSize: 14, fontWeight: '600' },
  caption: { fontSize: 13, fontWeight: '400' },
} as const;

export const themes = {
  light: { colors: lightColors, spacing, radius, typography },
  dark: { colors: darkColors, spacing, radius, typography },
};

export type Theme = (typeof themes)['light'];
