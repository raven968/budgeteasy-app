import { CATEGORY_COLORS, CATEGORY_ICONS, categoryIconSymbol, contrastingForeground } from '../catalog';

describe('categoryIconSymbol', () => {
  it('maps known keys and falls back to "other"', () => {
    expect(categoryIconSymbol('cart')).toBe(CATEGORY_ICONS.cart);
    expect(categoryIconSymbol('unknown-icon')).toBe(CATEGORY_ICONS.other);
  });
});

describe('contrastingForeground', () => {
  it('uses dark icons on light colors and light icons on dark colors', () => {
    expect(contrastingForeground('#EBCB8B')).toBe('#2E3440');
    expect(contrastingForeground('#4C566A')).toBe('#ECEFF4');
  });

  it('keeps every palette color readable', () => {
    for (const color of CATEGORY_COLORS) {
      expect(['#2E3440', '#ECEFF4']).toContain(contrastingForeground(color));
    }
  });
});

it('only uses icon keys the API accepts (alpha_dash, max 50)', () => {
  for (const key of Object.keys(CATEGORY_ICONS)) {
    expect(key).toMatch(/^[a-z_-]{1,50}$/);
  }
});
