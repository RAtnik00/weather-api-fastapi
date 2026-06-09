import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import type { ForecastDay } from '@/types/weather';

type ForecastCardProps = {
  forecast: ForecastDay[];
};

export function ForecastCard({ forecast }: ForecastCardProps) {
  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <ThemedText type="subtitle">5-day forecast</ThemedText>

      <View style={styles.list}>
        {forecast.map((forecastDay) => (
          <View key={forecastDay.day} style={styles.row}>
            <ThemedText>{forecastDay.day}</ThemedText>
            <ThemedText themeColor="textSecondary">
              {forecastDay.min}° / {forecastDay.max}°
            </ThemedText>
          </View>
        ))}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.three,
    borderRadius: 24,
    padding: Spacing.three,
  },
  list: {
    gap: Spacing.two,
  },
  row: {
    minHeight: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
