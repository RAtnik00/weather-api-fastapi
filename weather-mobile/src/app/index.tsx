import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
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

          <ThemedView type="backgroundElement" style={styles.currentCard}>
            <View>
              <ThemedText type="subtitle">Current</ThemedText>
              <ThemedText themeColor="textSecondary">Warsaw</ThemedText>
            </View>

            <ThemedText style={styles.temperature}>5°</ThemedText>

            <View style={styles.weatherDetails}>
              <ThemedText themeColor="textSecondary">Clear sky</ThemedText>
              <ThemedText themeColor="textSecondary">Feels like: 3°</ThemedText>
              <ThemedText themeColor="textSecondary">Wind: 2 km/h</ThemedText>
            </View>
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.sectionCard}>
            <ThemedText type="subtitle">5-day forecast</ThemedText>
            <View style={styles.forecastList}>
              {['Today', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                <View key={day} style={styles.forecastRow}>
                  <ThemedText>{day}</ThemedText>
                  <ThemedText themeColor="textSecondary">5° / 12°</ThemedText>
                </View>
              ))}
            </View>
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.sectionCard}>
            <ThemedText type="subtitle">Saved cities</ThemedText>
            <ThemedText themeColor="textSecondary">History and favorites will live here.</ThemedText>
          </ThemedView>
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
  currentCard: {
    gap: Spacing.three,
    borderRadius: 28,
    padding: Spacing.four,
  },
  temperature: {
    fontSize: 72,
    lineHeight: 78,
    fontWeight: '700',
  },
  weatherDetails: {
    gap: Spacing.one,
  },
  sectionCard: {
    gap: Spacing.three,
    borderRadius: 24,
    padding: Spacing.three,
  },
  forecastList: {
    gap: Spacing.two,
  },
  forecastRow: {
    minHeight: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});