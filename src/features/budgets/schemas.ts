import type { TFunction } from 'i18next';
import { z } from 'zod';

import { CURRENCIES, isValidMoneyInput, parseMoneyInput } from '@/lib/money';

/** Mirrors `config('budgets.max_amount')` in the API, in cents. */
const MAX_AMOUNT = 99_999_999_999;

export function createBudgetSchema(t: TFunction) {
  return z.object({
    name: z.string().trim().min(1, t('validation.required')).max(100),
    amount: z
      .string()
      .refine(isValidMoneyInput, t('validation.amount'))
      .refine((value) => (parseMoneyInput(value) ?? 0) > 0, t('validation.amountPositive'))
      .refine((value) => (parseMoneyInput(value) ?? 0) <= MAX_AMOUNT, t('validation.amountTooLarge')),
    currency: z.enum(CURRENCIES),
  });
}

/** Form values: the amount is the text typed by the user, converted to cents on submit. */
export type BudgetFormValues = z.infer<ReturnType<typeof createBudgetSchema>>;
