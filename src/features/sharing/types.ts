import type { BudgetRole } from '@/features/budgets/types';

export type BudgetMember = {
  id: number;
  name: string;
  email: string;
  role: BudgetRole;
  joined_at: string;
};

export type BudgetInvitation = {
  id: number;
  budget_id: number;
  /** 6 characters, single use. */
  code: string;
  expires_at: string;
  created_at: string;
};
