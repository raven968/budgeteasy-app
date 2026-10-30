import { StyleSheet, TextInput, type TextInputProps, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

import { ThemedText } from './themed-text';

type TextFieldProps = TextInputProps & {
  label: string;
  error?: string;
};

export function TextField({ label, error, style, ...inputProps }: TextFieldProps) {
  const theme = useTheme();

  return (
    <View style={{ gap: theme.spacing.xs }}>
      <ThemedText variant="label">{label}</ThemedText>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={theme.colors.textMuted}
        style={[
          styles.input,
          theme.typography.body,
          {
            color: theme.colors.text,
            backgroundColor: theme.colors.surface,
            borderColor: error ? theme.colors.danger : theme.colors.border,
            borderRadius: theme.radius.md,
            paddingHorizontal: theme.spacing.md,
          },
          style,
        ]}
        {...inputProps}
      />
      {error ? (
        <ThemedText variant="caption" tone="danger">
          {error}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    minHeight: 48,
  },
});
