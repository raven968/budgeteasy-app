import type { TFunction } from 'i18next';
import { z } from 'zod';

import { isValidMoneyInput, parseMoneyInput } from '@/lib/money';

/** Mirrors `config('budgets.max_amount')` in the API, in cents. */
const MAX_AMOUNT = 99_999_999_999;

export function createExpenseSchema(t: TFunction) {
  return z.object({
    amount: z
      .string()
      .refine(isValidMoneyInput, t('validation.amount'))
      .refine((value) => (parseMoneyInput(value) ?? 0) > 0, t('validation.amountPositive'))
      .refine((value) => (parseMoneyInput(value) ?? 0) <= MAX_AMOUNT, t('validation.amountTooLarge')),
    // Starts empty in a new expense; required on submit.
    category_id: z
      .number()
      .int()
      .positive()
      .optional()
      .refine((value) => value !== undefined, t('expenses.validation.category')),
    spent_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    note: z.string().trim().max(255),
  });
}

export type ExpenseFormValues = z.input<ReturnType<typeof createExpenseSchema>>;
