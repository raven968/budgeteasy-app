import type { Category } from '@/features/categories/types';

export type Expense = {
  id: number;
  budget_id: number;
  /** Cents. */
  amount: number;
  /** `YYYY-MM-DD` */
  spent_on: string;
  note: string | null;
  category: Category;
  /** Null when the author deleted their account. */
  user: { id: number; name: string } | null;
  created_at: string;
  updated_at: string;
};

export type ExpensePayload = {
  category_id: number;
  amount: number;
  spent_on: string;
  note: string | null;
};

export type ExpenseFilters = {
  /** `YYYY-MM` */
  month: string;
  category_id?: number;
  user_id?: number;
};

/** A page of GET /budgets/{budget}/expenses (Laravel pagination). */
export type ExpensePage = {
  data: Expense[];
  meta: { current_page: number; last_page: number; per_page: number; total: number };
};
