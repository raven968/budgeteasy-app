import { pickActiveBudget } from '../active-budget';
import type { Budget } from '../types';

function budget(id: number): Budget {
  return {
    id,
    name: `Budget ${id}`,
    amount: 100_000,
    currency: 'MXN',
    role: 'owner',
    owner: { id: 1, name: 'Aron' },
    created_at: '2026-10-30T00:00:00Z',
    updated_at: '2026-10-30T00:00:00Z',
  };
}

describe('pickActiveBudget', () => {
  it('uses the stored budget when available', () => {
    expect(pickActiveBudget([budget(1), budget(2)], 2)?.id).toBe(2);
  });

  it('falls back to the first budget when the stored one is gone or unset', () => {
    expect(pickActiveBudget([budget(1), budget(2)], 99)?.id).toBe(1);
    expect(pickActiveBudget([budget(1), budget(2)], null)?.id).toBe(1);
  });

  it('returns null without budgets', () => {
    expect(pickActiveBudget([], 1)).toBeNull();
  });
});
