export type BudgetRole = 'owner' | 'member';

export type Budget = {
  id: number;
  name: string;
  /** Monthly amount in cents. */
  amount: number;
  currency: string;
  role: BudgetRole;
  owner: { id: number; name: string };
  created_at: string;
  updated_at: string;
};

export type BudgetPayload = {
  name: string;
  amount: number;
  currency: string;
};
