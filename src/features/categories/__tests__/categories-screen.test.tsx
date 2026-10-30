import { render, screen } from '@testing-library/react-native';

import CategoriesScreen from '@/app/(app)/categories';
import { useCategories } from '@/features/categories/hooks';
import type { Category } from '@/features/categories/types';

jest.mock('expo-symbols', () => ({ SymbolView: () => null }));
jest.mock('expo-router', () => ({ router: { push: jest.fn() }, Stack: { Screen: () => null } }));
jest.mock('@/features/categories/hooks');

const mockedUseCategories = jest.mocked(useCategories);

function categories(count: number): Category[] {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `Categoría ${index + 1}`,
    icon: 'cart',
    color: '#5E81AC',
    is_deleted: false,
    created_at: '2026-10-30T00:00:00Z',
    updated_at: '2026-10-30T00:00:00Z',
  }));
}

function mockCategories(count: number) {
  mockedUseCategories.mockReturnValue({
    data: { data: categories(count), meta: { max: 10 } },
    isPending: false,
    error: null,
    refetch: jest.fn(),
  } as unknown as ReturnType<typeof useCategories>);
}

it('shows the counter and allows creating below the limit', async () => {
  mockCategories(7);

  await render(<CategoriesScreen />);

  expect(screen.getByText('7/10')).toBeOnTheScreen();
  expect(screen.getByRole('button', { name: 'Nueva categoría' })).toBeEnabled();
});

it('disables creating at the limit and explains why', async () => {
  mockCategories(10);

  await render(<CategoriesScreen />);

  expect(screen.getByText('10/10')).toBeOnTheScreen();
  expect(screen.getByRole('button', { name: 'Nueva categoría' })).toBeDisabled();
  expect(screen.getByText('Llegaste al límite de 10 categorías. Elimina una para crear otra.')).toBeOnTheScreen();
});
