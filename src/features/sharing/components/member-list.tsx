import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

import type { BudgetMember } from '../types';

type MemberListProps = {
  members: BudgetMember[];
  currentUserId: number;
  /** Shown only to the owner, for members other than the owner. */
  onRemove?: (member: BudgetMember) => void;
};

export function MemberList({ members, currentUserId, onRemove }: MemberListProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Card>
      <ThemedText variant="subtitle">{t('sharing.members.title', { count: members.length })}</ThemedText>
      {members.map((member) => (
        <View
          key={member.id}
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: theme.spacing.sm }}>
          <View style={{ flexShrink: 1, gap: 2 }}>
            <ThemedText variant="label" numberOfLines={1}>
              {member.id === currentUserId ? t('summary.you', { name: member.name }) : member.name}
            </ThemedText>
            <ThemedText variant="caption" tone="muted" numberOfLines={1}>
              {member.email}
            </ThemedText>
          </View>
          {member.role === 'owner' ? (
            <Badge label={t('sharing.members.owner')} variant="primary" />
          ) : onRemove ? (
            <Button
              title={t('sharing.members.remove')}
              accessibilityLabel={t('sharing.members.removeLabel', { name: member.name })}
              variant="ghost"
              onPress={() => onRemove(member)}
            />
          ) : (
            <Badge label={t('sharing.members.member')} variant="outline" />
          )}
        </View>
      ))}
    </Card>
  );
}
