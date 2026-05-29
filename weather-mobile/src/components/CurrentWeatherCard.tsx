import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import type { CurrentWeather } from '@/types/weather';

type CurrentWeatherCardProps = {
  weather: CurrentWeather;
};

export function CurrentWeatherCard({ weather }: CurrentWeatherCardProps) {
  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <View>
        <ThemedText type="subtitle">Current</ThemedText>
        <ThemedText themeColor="textSecondary">{weather.city}</ThemedText>
      </View>

      <ThemedText style={styles.temperature}>{weather.temperature}°</ThemedText>

      <View style={styles.details}>
        <ThemedText themeColor="textSecondary">{weather.description}</ThemedText>
        <ThemedText themeColor="textSecondary">Feels like: {weather.feelsLike}°</ThemedText>
        <ThemedText themeColor="textSecondary">Wind: {weather.windSpeed} km/h</ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.three,
    borderRadius: 28,
    padding: Spacing.four,
  },
  temperature: {
    fontSize: 72,
    lineHeight: 78,
    fontWeight: '700',
  },
  details: {
    gap: Spacing.one,
  },
});
