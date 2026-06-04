import { StyleSheet, TextInput, type TextInputProps } from 'react-native';

import { Spacing } from '@/constants/theme';

export function SearchInput({ placeholder = 'Search city', style, ...props }: TextInputProps) {
  return (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor="#7E8A9A"
      style={[styles.input, style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: 52,
    borderRadius: 18,
    paddingHorizontal: Spacing.three,
    fontSize: 17,
    backgroundColor: '#F0F4FA',
    color: '#111827',
  },
});
