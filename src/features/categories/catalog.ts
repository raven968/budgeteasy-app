import type { SymbolViewProps } from 'expo-symbols';

type SymbolName = SymbolViewProps['name'];

/**
 * Icons a category can use. The key is what the API stores in `icon` (alpha_dash);
 * each one maps to an SF Symbol on iOS and a Material Symbol on Android/web.
 */
export const CATEGORY_ICONS = {
  cart: { ios: 'cart.fill', android: 'shopping_cart', web: 'shopping_cart' },
  food: { ios: 'fork.knife', android: 'restaurant', web: 'restaurant' },
  coffee: { ios: 'cup.and.saucer.fill', android: 'local_cafe', web: 'local_cafe' },
  home: { ios: 'house.fill', android: 'home', web: 'home' },
  bills: { ios: 'doc.text.fill', android: 'receipt_long', web: 'receipt_long' },
  car: { ios: 'car.fill', android: 'directions_car', web: 'directions_car' },
  transport: { ios: 'bus.fill', android: 'directions_bus', web: 'directions_bus' },
  health: { ios: 'cross.case.fill', android: 'medical_services', web: 'medical_services' },
  fitness: { ios: 'dumbbell.fill', android: 'fitness_center', web: 'fitness_center' },
  education: { ios: 'book.fill', android: 'school', web: 'school' },
  entertainment: { ios: 'film.fill', android: 'movie', web: 'movie' },
  games: { ios: 'gamecontroller.fill', android: 'sports_esports', web: 'sports_esports' },
  clothes: { ios: 'tshirt.fill', android: 'apparel', web: 'apparel' },
  gift: { ios: 'gift.fill', android: 'redeem', web: 'redeem' },
  pets: { ios: 'pawprint.fill', android: 'pets', web: 'pets' },
  travel: { ios: 'airplane', android: 'flight', web: 'flight' },
  phone: { ios: 'iphone', android: 'smartphone', web: 'smartphone' },
  maintenance: { ios: 'wrench.and.screwdriver.fill', android: 'build', web: 'build' },
  card: { ios: 'creditcard.fill', android: 'credit_card', web: 'credit_card' },
  other: { ios: 'ellipsis.circle.fill', android: 'more_horiz', web: 'more_horiz' },
} satisfies Record<string, SymbolName>;

export type CategoryIconKey = keyof typeof CATEGORY_ICONS;

export const CATEGORY_ICON_KEYS = Object.keys(CATEGORY_ICONS) as CategoryIconKey[];

/** Unknown keys (e.g. created by another client) render as `other`. */
export function categoryIconSymbol(iconKey: string): SymbolName {
  return CATEGORY_ICONS[iconKey as CategoryIconKey] ?? CATEGORY_ICONS.other;
}

/**
 * Category colors, from the Nord palette so they match the app theme in light and dark mode.
 */
export const CATEGORY_COLORS = [
  '#BF616A',
  '#D08770',
  '#EBCB8B',
  '#A3BE8C',
  '#8FBCBB',
  '#88C0D0',
  '#81A1C1',
  '#5E81AC',
  '#B48EAD',
  '#4C566A',
] as const;

/**
 * Dark or light foreground for an icon drawn on top of the given `#RRGGBB` color.
 */
export function contrastingForeground(hexColor: string): '#2E3440' | '#ECEFF4' {
  const [red, green, blue] = [1, 3, 5].map((start) => Number.parseInt(hexColor.slice(start, start + 2), 16) / 255);
  const toLinear = (channel: number) => (channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
  const luminance = 0.2126 * toLinear(red) + 0.7152 * toLinear(green) + 0.0722 * toLinear(blue);

  return luminance > 0.35 ? '#2E3440' : '#ECEFF4';
}
