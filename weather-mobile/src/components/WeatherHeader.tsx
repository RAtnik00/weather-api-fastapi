import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

export function WeatherHeader() {
  return (
    <View style={styles.header}>
      <ThemedText type="title">Weather</ThemedText>
      <ThemedText themeColor="textSecondary">Mobile dashboard</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: Spacing.one,
  },
});