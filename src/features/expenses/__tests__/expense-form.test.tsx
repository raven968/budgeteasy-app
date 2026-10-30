import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import type { Category } from '@/features/categories/types';
import { todayString, yesterdayString } from '@/lib/dates';

import { ExpenseForm } from '../components/expense-form';

jest.mock('expo-symbols', () => ({ SymbolView: () => null }));
jest.mock('@expo/ui/community/datetime-picker', () => ({ DateTimePicker: () => null }));

const categories: Category[] = [
  { id: 1, name: 'Súper', icon: 'cart', color: '#5E81AC', is_deleted: false, created_at: '', updated_at: '' },
  { id: 2, name: 'Gasolina', icon: 'car', color: '#BF616A', is_deleted: false, created_at: '', updated_at: '' },
];

async function renderForm(onSubmit = jest.fn().mockResolvedValue(undefined)) {
  await render(
    <ExpenseForm
      categories={categories}
      currency="MXN"
      defaultValues={{ amount: '', category_id: undefined, spent_on: todayString(), note: '' }}
      submitLabel="Guardar gasto"
      isSubmitting={false}
      onSubmit={onSubmit}
    />,
  );

  return onSubmit;
}

it('registers an expense in cents with the chosen category and date', async () => {
  const onSubmit = await renderForm();

  await fireEvent.changeText(screen.getByLabelText('Monto (MXN)'), '450.5');
  await fireEvent.press(screen.getByRole('radio', { name: 'Gasolina' }));
  await fireEvent.press(screen.getByRole('radio', { name: 'Ayer' }));
  await fireEvent.changeText(screen.getByLabelText('Nota (opcional)'), '  Tanque lleno ');
  await fireEvent.press(screen.getByRole('button', { name: 'Guardar gasto' }));

  await waitFor(() =>
    expect(onSubmit).toHaveBeenCalledWith({
      amount: 45_050,
      category_id: 2,
      spent_on: yesterdayString(),
      note: 'Tanque lleno',
    }),
  );
});

it('sends an empty note as null and defaults to today', async () => {
  const onSubmit = await renderForm();

  await fireEvent.changeText(screen.getByLabelText('Monto (MXN)'), '100');
  await fireEvent.press(screen.getByRole('radio', { name: 'Súper' }));
  await fireEvent.press(screen.getByRole('button', { name: 'Guardar gasto' }));

  await waitFor(() =>
    expect(onSubmit).toHaveBeenCalledWith({ amount: 10_000, category_id: 1, spent_on: todayString(), note: null }),
  );
});

it('requires a category', async () => {
  const onSubmit = await renderForm();

  await fireEvent.changeText(screen.getByLabelText('Monto (MXN)'), '100');
  await fireEvent.press(screen.getByRole('button', { name: 'Guardar gasto' }));

  expect(await screen.findByText('Elige una categoría.')).toBeOnTheScreen();
  expect(onSubmit).not.toHaveBeenCalled();
});
