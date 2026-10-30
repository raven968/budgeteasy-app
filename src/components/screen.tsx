import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, RefreshControl, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/use-theme';

type ScreenProps = {
  children: ReactNode;
  /** Vertically center the content, e.g. for auth forms. */
  centered?: boolean;
  /** Enables pull to refresh. */
  onRefresh?: () => void;
  isRefreshing?: boolean;
};

/**
 * Base layout for screens: safe area, keyboard avoidance and scroll.
 */
export function Screen({ children, centered = false, onRefresh, isRefreshing = false }: ScreenProps) {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: theme.colors.base200 }]}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          refreshControl={
            onRefresh ? (
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
            ) : undefined
          }
          contentContainerStyle={[
            styles.content,
            centered && styles.centered,
            { padding: theme.spacing.xl, gap: theme.spacing.lg },
          ]}>
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flexGrow: 1 },
  centered: { justifyContent: 'center' },
});
