import { Redirect, router, Stack } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, SectionList, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/button';
import { Chip } from '@/components/chip';
import { ErrorState } from '@/components/error-state';
import { LoadingScreen } from '@/components/loading-screen';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/features/auth/auth-provider';
import { useActiveBudget } from '@/features/budgets/active-budget-provider';
import { useBudgetCategories } from '@/features/categories/hooks';
import { ExpenseListItem } from '@/features/expenses/components/expense-list-item';
import { MonthSwitcher } from '@/features/expenses/components/month-switcher';
import { groupExpensesByDay } from '@/features/expenses/grouping';
import { useExpenses } from '@/features/expenses/hooks';
import { canManageExpense } from '@/features/expenses/permissions';
import { useTheme } from '@/hooks/use-theme';
import { currentMonth, formatDayLabel } from '@/lib/dates';
import { formatMoney } from '@/lib/money';

export default function ExpensesScreen() {
  const { activeBudget, isLoading } = useActiveBudget();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!activeBudget) {
    return <Redirect href="/" />;
  }

  return <ExpensesList budgetId={activeBudget.id} currency={activeBudget.currency} role={activeBudget.role} />;
}

type ExpensesListProps = {
  budgetId: number;
  currency: string;
  role: 'owner' | 'member';
};

function ExpensesList({ budgetId, currency, role }: ExpensesListProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { state } = useAuth();
  const userId = state.status === 'signedIn' ? state.user.id : 0;
  const [month, setMonth] = useState(currentMonth());
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [onlyMine, setOnlyMine] = useState(false);
  const { data: categories = [] } = useBudgetCategories(budgetId);
  const expensesQuery = useExpenses(budgetId, {
    month,
    category_id: categoryId,
    user_id: onlyMine ? userId : undefined,
  });

  if (expensesQuery.isPending) {
    return <LoadingScreen />;
  }

  if (expensesQuery.error) {
    return <ErrorState error={expensesQuery.error} onRetry={() => expensesQuery.refetch()} />;
  }

  const expenses = expensesQuery.data.pages.flatMap((page) => page.data);
  const sections = groupExpensesByDay(expenses);

  return (
    <>
      <Stack.Screen options={{ title: t('expenses.title') }} />
      <SectionList
        sections={sections}
        keyExtractor={(expense) => String(expense.id)}
        style={{ backgroundColor: theme.colors.base200 }}
        contentContainerStyle={{ padding: theme.spacing.lg, gap: theme.spacing.sm }}
        stickySectionHeadersEnabled={false}
        refreshing={expensesQuery.isRefetching}
        onRefresh={() => expensesQuery.refetch()}
        onEndReached={() => expensesQuery.hasNextPage && expensesQuery.fetchNextPage()}
        ListHeaderComponent={
          <View style={{ gap: theme.spacing.md, marginBottom: theme.spacing.sm }}>
            <Button title={t('expenses.new')} onPress={() => router.push('/expenses/new')} />
            <MonthSwitcher month={month} onChange={setMonth} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: theme.spacing.sm }}>
              <Chip
                role="button"
                label={t('expenses.filters.onlyMine')}
                isSelected={onlyMine}
                onPress={() => setOnlyMine(!onlyMine)}
              />
              {categories.map((category) => (
                <Chip
                  key={category.id}
                  label={category.name}
                  isSelected={category.id === categoryId}
                  onPress={() => setCategoryId(category.id === categoryId ? undefined : category.id)}
                />
              ))}
            </ScrollView>
          </View>
        }
        renderSectionHeader={({ section }) => (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: theme.spacing.md,
              marginBottom: theme.spacing.xs,
            }}>
            <ThemedText variant="label" tone="muted" style={{ textTransform: 'capitalize' }}>
              {formatDayLabel(section.day)}
            </ThemedText>
            <ThemedText variant="label" tone="muted">
              {formatMoney(section.total, currency)}
            </ThemedText>
          </View>
        )}
        renderItem={({ item }) => (
          <ExpenseListItem
            expense={item}
            currency={currency}
            onPress={
              canManageExpense(item, userId, role)
                ? () => router.push({ pathname: '/expenses/[expenseId]/edit', params: { expenseId: item.id } })
                : undefined
            }
          />
        )}
        ListEmptyComponent={<ThemedText tone="muted">{t('expenses.empty')}</ThemedText>}
        ListFooterComponent={
          expensesQuery.isFetchingNextPage ? <ActivityIndicator color={theme.colors.primary} /> : undefined
        }
      />
    </>
  );
}
