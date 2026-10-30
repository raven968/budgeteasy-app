import i18n from '@/lib/i18n';

import { createLoginSchema, createRegisterSchema } from '../schemas';

const t = i18n.t.bind(i18n);

function firstIssue(result: { success: boolean; error?: { issues: { path: PropertyKey[]; message: string }[] } }) {
  const issue = result.error?.issues[0];

  return issue ? { path: issue.path.join('.'), message: issue.message } : null;
}

describe('login schema', () => {
  it('accepts valid credentials', () => {
    expect(createLoginSchema(t).safeParse({ email: 'aron@example.com', password: 'x' }).success).toBe(true);
  });

  it('requires a valid email', () => {
    expect(firstIssue(createLoginSchema(t).safeParse({ email: 'aron', password: 'x' }))).toEqual({
      path: 'email',
      message: 'Escribe un correo electrónico válido.',
    });
  });
});

describe('register schema', () => {
  const valid = {
    name: 'Aron',
    email: 'aron@example.com',
    password: 'secret123',
    password_confirmation: 'secret123',
  };

  it('accepts valid data', () => {
    expect(createRegisterSchema(t).safeParse(valid).success).toBe(true);
  });

  it.each([
    [{ password: 'abc1', password_confirmation: 'abc1' }, 'password', 'La contraseña debe tener al menos 8 caracteres.'],
    [{ password: 'onlyletters', password_confirmation: 'onlyletters' }, 'password', 'La contraseña debe incluir al menos un número.'],
    [{ password: '12345678', password_confirmation: '12345678' }, 'password', 'La contraseña debe incluir al menos una letra.'],
    [{ password_confirmation: 'different1' }, 'password_confirmation', 'Las contraseñas no coinciden.'],
    [{ name: '   ' }, 'name', 'Este campo es obligatorio.'],
  ])('rejects %j', (overrides, path, message) => {
    expect(firstIssue(createRegisterSchema(t).safeParse({ ...valid, ...overrides }))).toEqual({ path, message });
  });
});
