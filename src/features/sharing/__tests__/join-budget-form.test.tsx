import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { AxiosError, AxiosHeaders } from 'axios';

import { JoinBudgetForm } from '../components/join-budget-form';
import { useAcceptInvitation } from '../hooks';

jest.mock('../hooks');

const mutateAsync = jest.fn();

function validationError(message: string): AxiosError {
  const headers = new AxiosHeaders();

  return new AxiosError('Request failed', 'ERR', { headers }, null, {
    status: 422,
    statusText: '',
    headers,
    config: { headers },
    data: { message, errors: { code: [message] } },
  });
}

beforeEach(() => {
  mutateAsync.mockReset();
  jest.mocked(useAcceptInvitation).mockReturnValue({ mutateAsync, isPending: false } as unknown as ReturnType<
    typeof useAcceptInvitation
  >);
});

it('normalizes the code and opens the joined budget', async () => {
  const budget = { id: 9, name: 'Casa' };
  mutateAsync.mockResolvedValue(budget);
  const onJoined = jest.fn();
  await render(<JoinBudgetForm onJoined={onJoined} />);

  await fireEvent.changeText(screen.getByLabelText('Código de invitación'), ' abc-234 ');
  await fireEvent.press(screen.getByRole('button', { name: 'Unirme' }));

  await waitFor(() => expect(onJoined).toHaveBeenCalledWith(budget));
  expect(mutateAsync).toHaveBeenCalledWith('ABC234');
});

it('rejects malformed codes before calling the API', async () => {
  await render(<JoinBudgetForm onJoined={jest.fn()} />);

  await fireEvent.changeText(screen.getByLabelText('Código de invitación'), 'ABC');
  await fireEvent.press(screen.getByRole('button', { name: 'Unirme' }));

  expect(await screen.findByText('El código tiene 6 letras y números, por ejemplo ABC234.')).toBeOnTheScreen();
  expect(mutateAsync).not.toHaveBeenCalled();
});

it('shows why the API rejected the code', async () => {
  mutateAsync.mockRejectedValue(validationError('El código de invitación expiró. Pide uno nuevo.'));
  await render(<JoinBudgetForm onJoined={jest.fn()} />);

  await fireEvent.changeText(screen.getByLabelText('Código de invitación'), 'ABC234');
  await fireEvent.press(screen.getByRole('button', { name: 'Unirme' }));

  expect(await screen.findByText('El código de invitación expiró. Pide uno nuevo.')).toBeOnTheScreen();
});
