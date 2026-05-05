import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import { planTrip, fetchDepartures } from '@/services/transport';
import {
  Colors,
  FontFamily,
  FontSize,
  GlassStyles,
  Spacing,
  GlobalStyles,
} from '@/theme';

export default function TransportScreen() {
  const { t } = useTranslation();
  const [originId, setOriginId] = useState('');
  const [destinationId, setDestinationId] = useState('');
  const [stopId, setStopId] = useState('');
  const [tripResult, setTripResult] = useState<unknown>(null);
  const [departures, setDepartures] = useState<unknown>(null);
  const [isLoadingTrip, setIsLoadingTrip] = useState(false);
  const [isLoadingDep, setIsLoadingDep] = useState(false);
  const [tripError, setTripError] = useState<string | null>(null);
  const [depError, setDepError] = useState<string | null>(null);

  const handlePlanTrip = useCallback(async () => {
    const origin = originId.trim();
    const dest = destinationId.trim();
    if (!origin || !dest) {
      setTripError('Please enter both origin and destination stop IDs.');
      return;
    }
    setIsLoadingTrip(true);
    setTripError(null);
    try {
      const result = await planTrip({ originId: origin, destinationId: dest });
      setTripResult(result);
    } catch {
      setTripError('Failed to plan trip. Please check stop IDs and try again.');
    } finally {
      setIsLoadingTrip(false);
    }
  }, [originId, destinationId]);

  const handleDepartures = useCallback(async () => {
    const stop = stopId.trim();
    if (!stop) {
      setDepError('Please enter a stop ID.');
      return;
    }
    setIsLoadingDep(true);
    setDepError(null);
    try {
      const result = await fetchDepartures(stop, 10);
      setDepartures(result);
    } catch {
      setDepError('Failed to load departures. Please check the stop ID.');
    } finally {
      setIsLoadingDep(false);
    }
  }, [stopId]);

  const tripData = tripResult as { journeys?: { legs?: { transportation?: { name?: string }; origin?: { name?: string }; destination?: { name?: string }; duration?: number }[] }[] } | null;

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('screens.transport.title')}</Text>
        </View>

        {/* Journey planner */}
        <View style={[styles.section, GlassStyles.cardDark]}>
          <Text style={styles.sectionTitle}>{t('screens.transport.planJourney')}</Text>

          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>{t('screens.transport.from')} (Stop ID)</Text>
            <TextInput
              style={[styles.fieldInput, GlassStyles.input]}
              value={originId}
              onChangeText={setOriginId}
              placeholder="e.g. 200060"
              placeholderTextColor={Colors.midGray}
              editable={!isLoadingTrip}
            />
          </View>

          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>{t('screens.transport.to')} (Stop ID)</Text>
            <TextInput
              style={[styles.fieldInput, GlassStyles.input]}
              value={destinationId}
              onChangeText={setDestinationId}
              placeholder="e.g. 200070"
              placeholderTextColor={Colors.midGray}
              editable={!isLoadingTrip}
            />
          </View>

          {tripError && (
            <View style={styles.errorInline}>
              <Text style={styles.errorText}>{tripError}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.primaryBtn, isLoadingTrip && styles.primaryBtnDisabled]}
            onPress={handlePlanTrip}
            disabled={isLoadingTrip}
          >
            {isLoadingTrip ? (
              <ActivityIndicator color={Colors.deepNavy} size="small" />
            ) : (
              <Text style={styles.primaryBtnText}>{t('common.search')}</Text>
            )}
          </TouchableOpacity>

          {tripData?.journeys != null && tripData.journeys.length > 0 && (
            <View style={styles.results}>
              <Text style={styles.resultsTitle}>Journeys</Text>
              {tripData.journeys.slice(0, 5).map((journey, i) => (
                <View key={i} style={[styles.journeyCard, GlassStyles.card]}>
                  {(journey.legs ?? []).map((leg, li) => (
                    <Text key={li} style={styles.legText}>
                      🚌 {leg.transportation?.name ?? 'Walk'}: {leg.origin?.name ?? '?'} → {leg.destination?.name ?? '?'}
                      {leg.duration != null ? ` (${Math.round(leg.duration / 60)} min)` : ''}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Real-time departures */}
        <View style={[styles.section, GlassStyles.cardDark]}>
          <Text style={styles.sectionTitle}>Live Departures</Text>

          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>Stop ID</Text>
            <TextInput
              style={[styles.fieldInput, GlassStyles.input]}
              value={stopId}
              onChangeText={setStopId}
              placeholder="e.g. 200060"
              placeholderTextColor={Colors.midGray}
              editable={!isLoadingDep}
            />
          </View>

          {depError && (
            <View style={styles.errorInline}>
              <Text style={styles.errorText}>{depError}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.primaryBtn, isLoadingDep && styles.primaryBtnDisabled]}
            onPress={handleDepartures}
            disabled={isLoadingDep}
          >
            {isLoadingDep ? (
              <ActivityIndicator color={Colors.deepNavy} size="small" />
            ) : (
              <Text style={styles.primaryBtnText}>Get Departures</Text>
            )}
          </TouchableOpacity>

          {departures != null && (
            <View style={styles.results}>
              <Text style={styles.resultsTitle}>Departures</Text>
              <Text style={styles.rawResult}>
                {JSON.stringify(departures, null, 2).slice(0, 800)}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { ...GlobalStyles.screen },
  scrollContent: { paddingBottom: Spacing.xl },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.white,
  },
  section: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.gold,
    marginBottom: Spacing.md,
  },
  fieldWrapper: { marginBottom: Spacing.sm },
  fieldLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.lightGray,
    marginBottom: 4,
  },
  fieldInput: {
    color: Colors.white,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
  },
  errorInline: {
    backgroundColor: 'rgba(244,67,54,0.15)',
    borderRadius: 8,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  errorText: {
    color: Colors.error,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
  },
  primaryBtn: {
    backgroundColor: Colors.gold,
    borderRadius: 12,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  primaryBtnDisabled: { backgroundColor: Colors.goldDark },
  primaryBtnText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.deepNavy,
  },
  results: { marginTop: Spacing.md },
  resultsTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.lightGray,
    marginBottom: Spacing.sm,
  },
  journeyCard: {
    padding: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  legText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.offWhite,
    marginBottom: 2,
  },
  rawResult: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.lightGray,
  },
});
