import { Alert, Share, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { ThemedText } from '@/components/themed-text';
import type { Budget } from '@/features/budgets/types';
import { useTheme } from '@/hooks/use-theme';
import { getErrorMessage } from '@/lib/api/errors';
import { formatDateTime } from '@/lib/dates';

import { useCreateInvitation } from '../hooks';

type InvitationCardProps = {
  budget: Budget;
};

/**
 * Lets the owner generate a single-use code and send it with the system share sheet.
 */
export function InvitationCard({ budget }: InvitationCardProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const createInvitationMutation = useCreateInvitation(budget.id);
  const invitation = createInvitationMutation.data;

  const generate = () =>
    createInvitationMutation
      .mutateAsync()
      .catch((error: unknown) => Alert.alert(getErrorMessage(error)));

  const share = (code: string, expiresAt: string) =>
    Share.share({
      message: t('sharing.invite.shareMessage', {
        budget: budget.name,
        code,
        expiresAt: formatDateTime(expiresAt),
      }),
    });

  return (
    <Card>
      <ThemedText variant="subtitle">{t('sharing.invite.title')}</ThemedText>
      <ThemedText tone="muted">{t('sharing.invite.explanation')}</ThemedText>

      {invitation ? (
        <View style={{ alignItems: 'center', gap: theme.spacing.xs }}>
          <ThemedText
            variant="title"
            selectable
            accessibilityLabel={t('sharing.invite.codeLabel', { code: invitation.code.split('').join(' ') })}
            style={{ letterSpacing: 8 }}>
            {invitation.code}
          </ThemedText>
          <ThemedText variant="caption" tone="muted">
            {t('sharing.invite.expiresAt', { date: formatDateTime(invitation.expires_at) })}
          </ThemedText>
        </View>
      ) : null}

      {invitation ? (
        <>
          <Button title={t('sharing.invite.share')} onPress={() => share(invitation.code, invitation.expires_at)} />
          <Button
            title={t('sharing.invite.regenerate')}
            variant="ghost"
            onPress={generate}
            isLoading={createInvitationMutation.isPending}
          />
          <ThemedText variant="caption" tone="muted">
            {t('sharing.invite.regenerateHint')}
          </ThemedText>
        </>
      ) : (
        <Button
          title={t('sharing.invite.generate')}
          onPress={generate}
          isLoading={createInvitationMutation.isPending}
        />
      )}
    </Card>
  );
}
