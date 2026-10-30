import type { Expense } from './types';

export type ExpenseDaySection = {
  /** `YYYY-MM-DD` */
  day: string;
  /** Sum of the day in cents. */
  total: number;
  data: Expense[];
};

/**
 * Groups expenses (already sorted newest first by the API) into one section per day,
 * keeping the order.
 */
export function groupExpensesByDay(expenses: Expense[]): ExpenseDaySection[] {
  const sections: ExpenseDaySection[] = [];

  for (const expense of expenses) {
    const lastSection = sections.at(-1);

    if (lastSection?.day === expense.spent_on) {
      lastSection.data.push(expense);
      lastSection.total += expense.amount;
    } else {
      sections.push({ day: expense.spent_on, total: expense.amount, data: [expense] });
    }
  }

  return sections;
}
