import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CurrentWeatherCard } from '@/components/CurrentWeatherCard';
import { ForecastCard } from '@/components/ForecastCard';
import { SavedCitiesCard } from '@/components/SavedCitiesCard';
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

          <TextInput
            placeholder="Search city"
            placeholderTextColor="#7E8A9A"
            style={styles.searchInput}
          />

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
  searchInput: {
    minHeight: 52,
    borderRadius: 18,
    paddingHorizontal: Spacing.three,
    fontSize: 17,
    backgroundColor: '#F0F4FA',
    color: '#111827',
  },
});
