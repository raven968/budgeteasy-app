import { fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';

import ExpensesScreen from '@/app/(app)/expenses';
import { useAuth } from '@/features/auth/auth-provider';
import { useActiveBudget } from '@/features/budgets/active-budget-provider';
import { useBudgetCategories } from '@/features/categories/hooks';
import { useExpenses } from '@/features/expenses/hooks';
import type { Expense } from '@/features/expenses/types';

jest.mock('expo-symbols', () => ({ SymbolView: () => null }));
jest.mock('expo-router', () => ({ router: { push: jest.fn() }, Stack: { Screen: () => null }, Redirect: () => null }));
jest.mock('@/features/auth/auth-provider');
jest.mock('@/features/budgets/active-budget-provider');
jest.mock('@/features/categories/hooks');
jest.mock('@/features/expenses/hooks');

const category = { id: 1, name: 'Súper', icon: 'cart', color: '#5E81AC', is_deleted: false, created_at: '', updated_at: '' };

function expense(id: number, spentOn: string, amount: number, userId: number, userName: string): Expense {
  return {
    id,
    budget_id: 7,
    amount,
    spent_on: spentOn,
    note: null,
    category,
    user: { id: userId, name: userName },
    created_at: '',
    updated_at: '',
  };
}

beforeEach(() => {
  jest.mocked(useAuth).mockReturnValue({
    state: { status: 'signedIn', user: { id: 2, name: 'Esposa', email: 'e@example.com', created_at: '' } },
  } as unknown as ReturnType<typeof useAuth>);
  jest.mocked(useActiveBudget).mockReturnValue({
    activeBudget: { id: 7, currency: 'MXN', role: 'member' },
    isLoading: false,
  } as unknown as ReturnType<typeof useActiveBudget>);
  jest.mocked(useBudgetCategories).mockReturnValue({ data: [category] } as unknown as ReturnType<
    typeof useBudgetCategories
  >);
  jest.mocked(useExpenses).mockReturnValue({
    isPending: false,
    isRefetching: false,
    isFetchingNextPage: false,
    hasNextPage: false,
    refetch: jest.fn(),
    fetchNextPage: jest.fn(),
    error: null,
    data: {
      pages: [
        {
          data: [
            expense(3, '2026-10-29', 10_000, 2, 'Esposa'),
            expense(2, '2026-10-29', 2_550, 1, 'Aron'),
            expense(1, '2026-10-27', 99, 2, 'Esposa'),
          ],
          meta: { current_page: 1, last_page: 1, per_page: 50, total: 3 },
        },
      ],
    },
  } as unknown as ReturnType<typeof useExpenses>);
});

it('groups expenses by day with the daily total', async () => {
  await render(<ExpensesScreen />);

  expect(screen.getByText('jueves, 29 de octubre')).toBeOnTheScreen();
  expect(screen.getByText('$125.50')).toBeOnTheScreen();
  expect(screen.getByText('martes, 27 de octubre')).toBeOnTheScreen();
  // The only expense of the 27th: once as the day total, once as the expense amount.
  expect(screen.getAllByText('$0.99')).toHaveLength(2);
});

it('lets a member open only their own expenses', async () => {
  await render(<ExpensesScreen />);

  const editableItems = screen.getAllByRole('button', { name: /Súper/ });
  expect(editableItems).toHaveLength(2);

  await fireEvent.press(editableItems[0]);

  expect(router.push).toHaveBeenCalledWith({ pathname: '/expenses/[expenseId]/edit', params: { expenseId: 3 } });
});
