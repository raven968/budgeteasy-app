import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { AxiosError, AxiosHeaders } from 'axios';

import { BudgetForm } from '../components/budget-form';

function validationError(errors: Record<string, string[]>): AxiosError {
  const headers = new AxiosHeaders();

  return new AxiosError('Request failed', 'ERR', { headers }, null, {
    status: 422,
    statusText: '',
    headers,
    config: { headers },
    data: { message: 'Invalid', errors },
  });
}

async function renderForm(onSubmit = jest.fn().mockResolvedValue(undefined)) {
  await render(
    <BudgetForm
      defaultValues={{ name: '', amount: '', currency: 'MXN' }}
      submitLabel="Crear presupuesto"
      isSubmitting={false}
      onSubmit={onSubmit}
    />,
  );

  return onSubmit;
}

it('submits the amount in cents with the selected currency', async () => {
  const onSubmit = await renderForm();

  await fireEvent.changeText(screen.getByLabelText('Nombre'), '  Casa ');
  await fireEvent.changeText(screen.getByLabelText('Monto mensual'), '15000.5');
  await fireEvent.press(screen.getByRole('radio', { name: 'USD' }));
  await fireEvent.press(screen.getByRole('button', { name: 'Crear presupuesto' }));

  await waitFor(() =>
    expect(onSubmit).toHaveBeenCalledWith({ name: 'Casa', amount: 1_500_050, currency: 'USD' }),
  );
});

it('validates the amount before submitting', async () => {
  const onSubmit = await renderForm();

  await fireEvent.changeText(screen.getByLabelText('Nombre'), 'Casa');
  await fireEvent.changeText(screen.getByLabelText('Monto mensual'), '10.123');
  await fireEvent.press(screen.getByRole('button', { name: 'Crear presupuesto' }));

  expect(await screen.findByText('Escribe un monto válido, con máximo 2 decimales.')).toBeOnTheScreen();
  expect(onSubmit).not.toHaveBeenCalled();
});

it('shows API validation errors on their fields', async () => {
  await renderForm(jest.fn().mockRejectedValue(validationError({ currency: ['La moneda no es válida.'] })));

  await fireEvent.changeText(screen.getByLabelText('Nombre'), 'Casa');
  await fireEvent.changeText(screen.getByLabelText('Monto mensual'), '100');
  await fireEvent.press(screen.getByRole('button', { name: 'Crear presupuesto' }));

  expect(await screen.findByText('La moneda no es válida.')).toBeOnTheScreen();
});
