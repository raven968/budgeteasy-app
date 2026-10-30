/**
 * Design tokens, modeled on daisyUI themes: "nord" (light) and "dim" (dark).
 * Screens and components read them through `useTheme()`; never hard-code colors or spacing.
 *
 * Naming follows daisyUI: `base100/200/300` are layered backgrounds (100 = surfaces such as
 * cards and inputs, 200 = screen background, 300 = borders/dividers), `*Content` is the
 * readable color on top of its pair.
 *
 * Two nord colors are slightly deeper than the original theme so text keeps a WCAG AA
 * contrast of at least 4.5:1: primary #5E81AC -> #4D6E96 and error #BF616A -> #AE4750.
 */
const nordColors = {
  primary: '#4D6E96',
  primaryContent: '#ECEFF4',
  secondary: '#81A1C1',
  secondaryContent: '#2E3440',
  accent: '#88C0D0',
  accentContent: '#2E3440',
  neutral: '#4C566A',
  neutralContent: '#D8DEE9',
  base100: '#ECEFF4',
  base200: '#E5E9F0',
  base300: '#D8DEE9',
  baseContent: '#2E3440',
  baseContentMuted: '#4C566A',
  info: '#B48EAD',
  success: '#A3BE8C',
  warning: '#EBCB8B',
  error: '#AE4750',
  errorContent: '#ECEFF4',
};

export type ThemeColors = typeof nordColors;

const dimColors: ThemeColors = {
  primary: '#9FE88D',
  primaryContent: '#1C212B',
  secondary: '#FF7D5C',
  secondaryContent: '#1C212B',
  accent: '#C792E9',
  accentContent: '#1C212B',
  neutral: '#1C212B',
  neutralContent: '#B2CCD6',
  base100: '#2A303C',
  base200: '#242933',
  base300: '#20252E',
  baseContent: '#B2CCD6',
  baseContentMuted: '#8A9BA8',
  info: '#28EBFF',
  success: '#62EFBD',
  warning: '#EFD057',
  error: '#FFAE9B',
  errorContent: '#1C212B',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

/** daisyUI radii: `field` for buttons/inputs, `box` for cards and modals. */
export const radius = {
  field: 8,
  box: 16,
  full: 999,
} as const;

/** Border width for inputs and outlined buttons, like daisyUI's 1px `border`. */
export const borderWidth = 1;

export const typography = {
  title: { fontSize: 28, fontWeight: '800' },
  subtitle: { fontSize: 18, fontWeight: '700' },
  body: { fontSize: 16, fontWeight: '400' },
  label: { fontSize: 14, fontWeight: '600' },
  button: { fontSize: 16, fontWeight: '600' },
  caption: { fontSize: 13, fontWeight: '400' },
} as const;

export const themes = {
  light: { colors: nordColors, spacing, radius, borderWidth, typography },
  dark: { colors: dimColors, spacing, radius, borderWidth, typography },
};

export type Theme = (typeof themes)['light'];
