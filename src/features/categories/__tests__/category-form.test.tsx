import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { CategoryForm } from '../components/category-form';

jest.mock('expo-symbols', () => ({ SymbolView: () => null }));

it('submits the name, icon and color', async () => {
  const onSubmit = jest.fn().mockResolvedValue(undefined);
  await render(
    <CategoryForm
      defaultValues={{ name: '', icon: 'cart', color: '#5E81AC' }}
      submitLabel="Crear categoría"
      isSubmitting={false}
      onSubmit={onSubmit}
    />,
  );

  await fireEvent.changeText(screen.getByLabelText('Nombre'), ' Gasolina ');
  await fireEvent.press(screen.getByRole('radio', { name: 'Auto' }));
  await fireEvent.press(screen.getByRole('radio', { name: 'Color 1' }));

  expect(screen.getByText('Gasolina')).toBeOnTheScreen();

  await fireEvent.press(screen.getByRole('button', { name: 'Crear categoría' }));

  await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ name: 'Gasolina', icon: 'car', color: '#BF616A' }));
});

it('requires a name', async () => {
  const onSubmit = jest.fn();
  await render(
    <CategoryForm
      defaultValues={{ name: '', icon: 'cart', color: '#5E81AC' }}
      submitLabel="Crear categoría"
      isSubmitting={false}
      onSubmit={onSubmit}
    />,
  );

  await fireEvent.press(screen.getByRole('button', { name: 'Crear categoría' }));

  expect(await screen.findByText('Este campo es obligatorio.')).toBeOnTheScreen();
  expect(onSubmit).not.toHaveBeenCalled();
});
