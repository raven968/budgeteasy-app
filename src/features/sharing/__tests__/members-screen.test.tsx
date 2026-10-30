import { fireEvent, render, screen } from '@testing-library/react-native';
import { Alert } from 'react-native';

import BudgetMembersScreen from '@/app/(app)/budgets/[budgetId]/members';
import { useAuth } from '@/features/auth/auth-provider';
import { useBudget } from '@/features/budgets/hooks';
import { useBudgetMembers, useCreateInvitation, useRemoveMember } from '@/features/sharing/hooks';

jest.mock('expo-router', () => ({
  router: { dismissTo: jest.fn() },
  Stack: { Screen: () => null },
  useLocalSearchParams: () => ({ budgetId: '7' }),
}));
jest.mock('@/features/auth/auth-provider');
jest.mock('@/features/budgets/hooks');
jest.mock('@/features/sharing/hooks');

const members = [
  { id: 1, name: 'Aron', email: 'aron@example.com', role: 'owner', joined_at: '' },
  { id: 2, name: 'Esposa', email: 'esposa@example.com', role: 'member', joined_at: '' },
];

function signInAs(userId: number, role: 'owner' | 'member') {
  jest.mocked(useAuth).mockReturnValue({
    state: { status: 'signedIn', user: { id: userId, name: '', email: '', created_at: '' } },
  } as unknown as ReturnType<typeof useAuth>);
  jest.mocked(useBudget).mockReturnValue({
    data: { id: 7, name: 'Casa', role },
    isPending: false,
    error: null,
  } as unknown as ReturnType<typeof useBudget>);
}

beforeEach(() => {
  jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
  jest.mocked(useBudgetMembers).mockReturnValue({
    data: members,
    isPending: false,
    isRefetching: false,
    error: null,
    refetch: jest.fn(),
  } as unknown as ReturnType<typeof useBudgetMembers>);
  jest.mocked(useRemoveMember).mockReturnValue({ mutateAsync: jest.fn(), isPending: false } as unknown as ReturnType<
    typeof useRemoveMember
  >);
  jest.mocked(useCreateInvitation).mockReturnValue({
    mutateAsync: jest.fn(),
    isPending: false,
    data: undefined,
  } as unknown as ReturnType<typeof useCreateInvitation>);
});

it('lets the owner invite and remove members, but never themselves', async () => {
  signInAs(1, 'owner');

  await render(<BudgetMembersScreen />);

  expect(screen.getByRole('button', { name: 'Generar código de invitación' })).toBeOnTheScreen();
  expect(screen.getByText('Aron (tú)')).toBeOnTheScreen();
  expect(screen.getAllByRole('button', { name: /Quitar a/ })).toHaveLength(1);
  expect(screen.queryByRole('button', { name: 'Salir del presupuesto' })).not.toBeOnTheScreen();

  await fireEvent.press(screen.getByRole('button', { name: 'Quitar a Esposa' }));

  expect(Alert.alert).toHaveBeenCalledWith('¿Quitar a Esposa?', expect.any(String), expect.any(Array));
});

it('lets a member see the members and leave, without inviting or removing', async () => {
  signInAs(2, 'member');

  await render(<BudgetMembersScreen />);

  expect(screen.queryByRole('button', { name: 'Generar código de invitación' })).not.toBeOnTheScreen();
  expect(screen.queryByRole('button', { name: /Quitar a/ })).not.toBeOnTheScreen();
  expect(screen.getByText('Esposa (tú)')).toBeOnTheScreen();

  await fireEvent.press(screen.getByRole('button', { name: 'Salir del presupuesto' }));

  expect(Alert.alert).toHaveBeenCalledWith('¿Salir del presupuesto?', expect.any(String), expect.any(Array));
});

it('shows the generated code with its expiration', async () => {
  signInAs(1, 'owner');
  jest.mocked(useCreateInvitation).mockReturnValue({
    mutateAsync: jest.fn(),
    isPending: false,
    data: { id: 1, budget_id: 7, code: '7HJYUX', expires_at: '2026-11-01T12:00:00Z', created_at: '' },
  } as unknown as ReturnType<typeof useCreateInvitation>);

  await render(<BudgetMembersScreen />);

  expect(screen.getByText('7HJYUX')).toBeOnTheScreen();
  expect(screen.getByText(/^Vence el/)).toBeOnTheScreen();
  expect(screen.getByRole('button', { name: 'Compartir código' })).toBeOnTheScreen();
});
