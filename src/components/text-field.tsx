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
        placeholderTextColor={theme.colors.baseContentMuted}
        style={[
          styles.input,
          theme.typography.body,
          {
            color: theme.colors.baseContent,
            backgroundColor: theme.colors.base100,
            borderColor: error ? theme.colors.error : theme.colors.base300,
            borderWidth: theme.borderWidth,
            borderRadius: theme.radius.field,
            paddingHorizontal: theme.spacing.md,
          },
          style,
        ]}
        {...inputProps}
      />
      {error ? (
        <ThemedText variant="caption" tone="error">
          {error}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: 48,
  },
});
