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
  Image,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import { searchRestaurants, Restaurant } from '@/services/restaurants';
import {
  Colors,
  FontFamily,
  FontSize,
  GlassStyles,
  Spacing,
  GlobalStyles,
} from '@/theme';

export default function RestaurantsScreen() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (term?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await searchRestaurants({
        q: term ?? 'restaurants',
        location: 'Sydney, NSW, Australia',
        limit: 20,
      });
      const biz = (res.restaurants as { businesses?: Restaurant[] }).businesses ?? [];
      setRestaurants(biz);
    } catch {
      setError('Failed to load restaurants. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleSearch = useCallback(() => {
    void load(searchQuery.trim() || undefined);
  }, [load, searchQuery]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await load(searchQuery.trim() || undefined);
    setRefreshing(false);
  }, [load, searchQuery]);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('screens.restaurants.title')}</Text>
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
          editable={!isLoading}
        />
        <TouchableOpacity
          style={styles.searchBtn}
          onPress={handleSearch}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.deepNavy} size="small" />
          ) : (
            <Text style={styles.searchBtnText}>🔍</Text>
          )}
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={() => void load(searchQuery.trim() || undefined)} style={styles.retryBtn}>
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
        {isLoading && restaurants.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={Colors.gold} size="large" />
            <Text style={styles.loadingText}>{t('common.loading')}</Text>
          </View>
        ) : restaurants.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>{t('common.noResults', 'No restaurants found.')}</Text>
          </View>
        ) : (
          restaurants.map((r) => (
            <View key={r.id ?? r.name} style={[styles.restaurantCard, GlassStyles.card]}>
              {r.image_url != null && (
                <Image source={{ uri: r.image_url }} style={styles.restaurantImage} />
              )}
              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>{r.name}</Text>
                {(r.categories?.length ?? 0) > 0 && (
                  <Text style={styles.restaurantCategory}>
                    {r.categories!.map((c) => c.title).join(', ')}
                  </Text>
                )}
                <View style={styles.restaurantMeta}>
                  {r.rating != null && (
                    <Text style={styles.rating}>⭐ {r.rating.toFixed(1)}</Text>
                  )}
                  {r.price != null && (
                    <Text style={styles.price}>{r.price}</Text>
                  )}
                  {r.distance != null && (
                    <Text style={styles.distance}>{(r.distance / 1000).toFixed(1)} km</Text>
                  )}
                </View>
                {r.location?.display_address != null && (
                  <Text style={styles.address}>{r.location.display_address.join(', ')}</Text>
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
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: Colors.white,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
  },
  searchBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBtnText: { fontSize: 18 },
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
  restaurantCard: {
    marginBottom: Spacing.sm,
    overflow: 'hidden',
  },
  restaurantImage: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  restaurantInfo: {
    padding: Spacing.md,
  },
  restaurantName: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.white,
  },
  restaurantCategory: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.midGray,
    marginTop: 2,
  },
  restaurantMeta: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  rating: {
    color: Colors.gold,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
  },
  price: {
    color: Colors.success,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
  },
  distance: {
    color: Colors.midGray,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
  },
  address: {
    color: Colors.lightGray,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    marginTop: 4,
  },
});
