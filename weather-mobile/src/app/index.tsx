import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CurrentWeatherCard } from '@/components/CurrentWeatherCard';
import { ForecastCard } from '@/components/ForecastCard';
import { SavedCitiesCard } from '@/components/SavedCitiesCard';
import { SearchInput } from '@/components/SearchInput';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { mockCurrentWeather, mockForecast } from '@/constants/mockWeather';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <ThemedText type="title">Weather</ThemedText>
            <ThemedText themeColor="textSecondary">Mobile dashboard</ThemedText>
          </View>

          <SearchInput />

          <CurrentWeatherCard weather={mockCurrentWeather} />

          <ForecastCard forecast={mockForecast} />

          <SavedCitiesCard />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.four,
    gap: Spacing.three,
  },
  header: {
    gap: Spacing.one,
  },
});
