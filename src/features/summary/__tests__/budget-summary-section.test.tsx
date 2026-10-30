import { render, screen } from '@testing-library/react-native';

import { BudgetSummarySection } from '../components/budget-summary-section';
import type { useBudgetSummary } from '../hooks';
import type { BudgetSummary } from '../types';

jest.mock('expo-symbols', () => ({ SymbolView: () => null }));

const category = (id: number, name: string) => ({
  id,
  name,
  icon: 'cart',
  color: '#5E81AC',
  is_deleted: false,
  created_at: '',
  updated_at: '',
});

function summary(overrides: Partial<BudgetSummary> = {}): BudgetSummary {
  return {
    month: '2026-10',
    currency: 'MXN',
    budget_amount: 1_000_000,
    spent_amount: 450_000,
    remaining_amount: 550_000,
    spent_percentage: 45,
    categories: [
      { category: category(1, 'Súper'), spent_amount: 400_000, expenses_count: 2, limit_amount: null },
      { category: category(2, 'Gasolina'), spent_amount: 50_000, expenses_count: 1, limit_amount: null },
      { category: category(3, 'Ropa'), spent_amount: 0, expenses_count: 0, limit_amount: null },
    ],
    members: [
      { user: { id: 1, name: 'Aron' }, spent_amount: 300_000 },
      { user: { id: 2, name: 'Esposa' }, spent_amount: 150_000 },
    ],
    ...overrides,
  };
}

function loadedQuery(data: BudgetSummary) {
  return { isPending: false, error: null, data, refetch: jest.fn() } as unknown as ReturnType<typeof useBudgetSummary>;
}

it('shows spending, remaining and the progress of the month', async () => {
  await render(<BudgetSummarySection summaryQuery={loadedQuery(summary())} currentUserId={1} />);

  expect(screen.getByText('$4,500.00')).toBeOnTheScreen();
  expect(screen.getByText('de $10,000.00')).toBeOnTheScreen();
  expect(screen.getByText('Te quedan $5,500.00')).toBeOnTheScreen();
  expect(screen.getByRole('progressbar', { name: 'Has gastado el 45% del presupuesto' })).toHaveAccessibilityValue({
    now: 45,
  });
});

it('shows the overspent amount when the budget is exceeded', async () => {
  await render(
    <BudgetSummarySection
      summaryQuery={loadedQuery(summary({ spent_amount: 1_250_000, remaining_amount: -250_000, spent_percentage: 125 }))}
      currentUserId={1}
    />,
  );

  expect(screen.getByText('Te pasaste por $2,500.00')).toBeOnTheScreen();
  expect(screen.getByText('125%')).toBeOnTheScreen();
});

it('lists categories with spending and summarizes unused ones', async () => {
  await render(<BudgetSummarySection summaryQuery={loadedQuery(summary())} currentUserId={1} />);

  expect(screen.getByText('Súper')).toBeOnTheScreen();
  expect(screen.getByText('2 gastos')).toBeOnTheScreen();
  expect(screen.getByText('89%')).toBeOnTheScreen();
  expect(screen.getByText('1 gasto')).toBeOnTheScreen();
  expect(screen.queryByText('Ropa')).not.toBeOnTheScreen();
  expect(screen.getByText('1 categoría sin gastos')).toBeOnTheScreen();
});

it('shows who spent what in shared budgets, marking the current user', async () => {
  await render(<BudgetSummarySection summaryQuery={loadedQuery(summary())} currentUserId={1} />);

  expect(screen.getByText('Por persona')).toBeOnTheScreen();
  expect(screen.getByText('Aron (tú)')).toBeOnTheScreen();
  expect(screen.getByText('Esposa')).toBeOnTheScreen();
});

it('hides the per-person breakdown with a single member', async () => {
  await render(
    <BudgetSummarySection
      summaryQuery={loadedQuery(summary({ members: [{ user: { id: 1, name: 'Aron' }, spent_amount: 450_000 }] }))}
      currentUserId={1}
    />,
  );

  expect(screen.queryByText('Por persona')).not.toBeOnTheScreen();
});
