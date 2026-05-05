import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import { fetchCategories, fetchNearbyPlaces, searchPlaces, PlaceCategory, Place } from '@/services/places';
import {
  Colors,
  FontFamily,
  FontSize,
  GlassStyles,
  Spacing,
  GlobalStyles,
} from '@/theme';

export default function ExploreScreen() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<PlaceCategory[]>([]);
  const [nearbyPlaces, setNearbyPlaces] = useState<Place[]>([]);
  const [searchResults, setSearchResults] = useState<Place[] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoadingCats, setIsLoadingCats] = useState(true);
  const [isLoadingNearby, setIsLoadingNearby] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Sydney CBD coords as default
  const LAT = -33.8688;
  const LNG = 151.2093;

  const loadCategories = useCallback(async () => {
    try {
      const cats = await fetchCategories();
      setCategories(cats);
    } catch {
      // non-fatal, keep empty
    } finally {
      setIsLoadingCats(false);
    }
  }, []);

  const loadNearby = useCallback(async (type?: string) => {
    setIsLoadingNearby(true);
    setError(null);
    try {
      const places = await fetchNearbyPlaces(LAT, LNG, 1500, type);
      setNearbyPlaces(places);
    } catch {
      setError('Failed to load nearby places.');
    } finally {
      setIsLoadingNearby(false);
    }
  }, []);

  useEffect(() => {
    void loadCategories();
    void loadNearby();
  }, [loadCategories, loadNearby]);

  const handleCategoryPress = useCallback((catId: string) => {
    const next = selectedCategory === catId ? null : catId;
    setSelectedCategory(next);
    setSearchResults(null);
    void loadNearby(next ?? undefined);
  }, [selectedCategory, loadNearby]);

  const handleSearch = useCallback(async () => {
    const q = searchQuery.trim();
    if (!q) return;
    setIsSearching(true);
    setError(null);
    try {
      const results = await searchPlaces(q, 'Sydney, NSW');
      setSearchResults(results);
    } catch {
      setError('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([loadCategories(), loadNearby(selectedCategory ?? undefined)]);
    setRefreshing(false);
  }, [loadCategories, loadNearby, selectedCategory]);

  const displayPlaces = searchResults ?? nearbyPlaces;

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('screens.explore.title')}</Text>
      </View>

      <View style={styles.searchWrapper}>
        <TextInput
          style={[styles.searchInput, GlassStyles.input]}
          placeholder={t('common.search')}
          placeholderTextColor={Colors.midGray}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          editable={!isSearching}
        />
        {isSearching && (
          <ActivityIndicator color={Colors.gold} style={styles.searchSpinner} />
        )}
      </View>

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={() => void loadNearby(selectedCategory ?? undefined)} style={styles.retryBtn}>
            <Text style={styles.retryText}>{t('common.retry', 'Retry')}</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={Colors.gold} />
        }
      >
        <Text style={styles.sectionLabel}>{t('screens.explore.categories')}</Text>
        {isLoadingCats ? (
          <ActivityIndicator color={Colors.gold} style={{ marginVertical: Spacing.sm }} />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesRow}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryChip,
                  GlassStyles.card,
                  selectedCategory === cat.id && styles.categoryChipSelected,
                ]}
                onPress={() => handleCategoryPress(cat.id)}
              >
                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                <Text style={styles.categoryLabel}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <Text style={styles.sectionLabel}>
          {searchResults ? t('screens.explore.searchResults', 'Search Results') : t('screens.explore.nearby')}
        </Text>

        {isLoadingNearby ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={Colors.gold} size="large" />
            <Text style={styles.loadingText}>{t('common.loading')}</Text>
          </View>
        ) : displayPlaces.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>{t('common.noResults', 'No places found.')}</Text>
          </View>
        ) : (
          displayPlaces.map((place, idx) => (
            <View key={place.place_id ?? String(idx)} style={[styles.placeCard, GlassStyles.card]}>
              <Text style={styles.placeName}>{place.name ?? 'Unknown'}</Text>
              {place.vicinity != null && (
                <Text style={styles.placeAddress}>{place.vicinity}</Text>
              )}
              <View style={styles.placeFooter}>
                {place.rating != null && (
                  <Text style={styles.placeRating}>⭐ {place.rating.toFixed(1)}</Text>
                )}
                {(place.types?.length ?? 0) > 0 && (
                  <Text style={styles.placeType}>{place.types![0].replace(/_/g, ' ')}</Text>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { ...GlobalStyles.screen },
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
  searchWrapper: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    color: Colors.white,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
  },
  searchSpinner: { marginLeft: Spacing.sm },
  errorBanner: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    backgroundColor: 'rgba(244,67,54,0.2)',
    borderWidth: 1,
    borderColor: Colors.error,
    borderRadius: 12,
    padding: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  errorText: {
    color: Colors.error,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    flex: 1,
    marginRight: Spacing.sm,
  },
  retryBtn: {
    backgroundColor: Colors.error,
    borderRadius: 8,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  retryText: {
    color: Colors.white,
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
  },
  content: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl },
  sectionLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.gold,
    marginVertical: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  categoriesRow: { marginBottom: Spacing.sm },
  categoryChip: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginRight: Spacing.sm,
    minWidth: 72,
  },
  categoryChipSelected: {
    borderColor: Colors.gold,
    backgroundColor: 'rgba(201,168,76,0.15)',
  },
  categoryIcon: { fontSize: 24 },
  categoryLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.lightGray,
    marginTop: 4,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  loadingText: {
    color: Colors.midGray,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    marginTop: Spacing.sm,
  },
  emptyState: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.midGray,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
  },
  placeCard: {
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  placeName: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.white,
  },
  placeAddress: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.lightGray,
    marginTop: 2,
  },
  placeFooter: {
    flexDirection: 'row',
    marginTop: Spacing.xs,
    gap: Spacing.sm,
  },
  placeRating: {
    color: Colors.gold,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
  },
  placeType: {
    color: Colors.midGray,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    textTransform: 'capitalize',
  },
});
