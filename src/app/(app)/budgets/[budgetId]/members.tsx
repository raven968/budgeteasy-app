import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/button';
import { ErrorState } from '@/components/error-state';
import { LoadingScreen } from '@/components/loading-screen';
import { Screen } from '@/components/screen';
import { useAuth } from '@/features/auth/auth-provider';
import { useBudget } from '@/features/budgets/hooks';
import { InvitationCard } from '@/features/sharing/components/invitation-card';
import { MemberList } from '@/features/sharing/components/member-list';
import { useBudgetMembers, useRemoveMember } from '@/features/sharing/hooks';
import type { BudgetMember } from '@/features/sharing/types';
import { getErrorMessage } from '@/lib/api/errors';

export default function BudgetMembersScreen() {
  const { t } = useTranslation();
  const { budgetId } = useLocalSearchParams<{ budgetId: string }>();
  const { state } = useAuth();
  const userId = state.status === 'signedIn' ? state.user.id : 0;
  const budgetQuery = useBudget(Number(budgetId));
  const membersQuery = useBudgetMembers(Number(budgetId));
  const removeMemberMutation = useRemoveMember(Number(budgetId));
  const budget = budgetQuery.data;

  if (budgetQuery.isPending || membersQuery.isPending) {
    return <LoadingScreen />;
  }

  if (!budget || membersQuery.error) {
    return <ErrorState error={membersQuery.error ?? budgetQuery.error} onRetry={() => membersQuery.refetch()} />;
  }

  const isOwner = budget.role === 'owner';

  const removeWithConfirmation = (title: string, message: string, memberId: number, onRemoved: () => void) =>
    Alert.alert(title, message, [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('sharing.members.confirm'),
        style: 'destructive',
        onPress: () =>
          removeMemberMutation
            .mutateAsync(memberId)
            .then(onRemoved)
            .catch((error: unknown) => Alert.alert(getErrorMessage(error))),
      },
    ]);

  const confirmRemove = (member: BudgetMember) =>
    removeWithConfirmation(
      t('sharing.members.removeTitle', { name: member.name }),
      t('sharing.members.removeMessage', { budget: budget.name }),
      member.id,
      () => undefined,
    );

  const confirmLeave = () =>
    removeWithConfirmation(
      t('sharing.leave.title'),
      t('sharing.leave.message', { budget: budget.name }),
      userId,
      () => router.dismissTo('/'),
    );

  return (
    <Screen onRefresh={() => membersQuery.refetch()} isRefreshing={membersQuery.isRefetching}>
      <Stack.Screen options={{ title: t('sharing.title', { budget: budget.name }) }} />
      {isOwner ? <InvitationCard budget={budget} /> : null}
      <MemberList members={membersQuery.data} currentUserId={userId} onRemove={isOwner ? confirmRemove : undefined} />
      {isOwner ? null : (
        <Button
          title={t('sharing.leave.button')}
          variant="ghost"
          onPress={confirmLeave}
          isLoading={removeMemberMutation.isPending}
        />
      )}
    </Screen>
  );
}
