import type { Category } from '@/features/categories/types';

/** GET /budgets/{budget}/summary?month=YYYY-MM. Amounts in cents. */
export type BudgetSummary = {
  month: string;
  currency: string;
  budget_amount: number;
  spent_amount: number;
  /** Negative when the budget is exceeded. */
  remaining_amount: number;
  spent_percentage: number;
  categories: {
    category: Category;
    spent_amount: number;
    expenses_count: number;
    /** Per-category limit; always null until limits are enabled in the API. */
    limit_amount: number | null;
  }[];
  members: {
    /** Null for expenses of deleted accounts. */
    user: { id: number; name: string } | null;
    spent_amount: number;
  }[];
};
