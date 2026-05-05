import client from './api/client';

export interface Restaurant {
  id?: string;
  name?: string;
  image_url?: string;
  url?: string;
  review_count?: number;
  categories?: { alias: string; title: string }[];
  rating?: number;
  coordinates?: { latitude: number; longitude: number };
  price?: string;
  location?: { address1?: string; city?: string; display_address?: string[] };
  phone?: string;
  distance?: number;
}

export interface RestaurantSearchResponse {
  restaurants: { businesses?: Restaurant[] };
  total: unknown;
}

export interface RestaurantDetailResponse {
  restaurant: Restaurant;
}

export interface RestaurantReviewsResponse {
  reviews: unknown;
}

export interface SearchParams {
  q?: string;
  lat?: number;
  lng?: number;
  location?: string;
  radius?: number;
  limit?: number;
  offset?: number;
}

export async function searchRestaurants(params: SearchParams): Promise<RestaurantSearchResponse> {
  const query = new URLSearchParams();
  if (params.q) query.set('q', params.q);
  if (params.lat !== undefined) query.set('lat', String(params.lat));
  if (params.lng !== undefined) query.set('lng', String(params.lng));
  if (params.location) query.set('location', params.location);
  if (params.radius !== undefined) query.set('radius', String(params.radius));
  if (params.limit !== undefined) query.set('limit', String(params.limit));
  if (params.offset !== undefined) query.set('offset', String(params.offset));
  return client.get<RestaurantSearchResponse>(`/v1/restaurants/search?${query.toString()}`);
}

export async function fetchRestaurantDetail(id: string): Promise<Restaurant> {
  const data = await client.get<RestaurantDetailResponse>(`/v1/restaurants/${encodeURIComponent(id)}`);
  return data.restaurant;
}

export async function fetchRestaurantReviews(id: string): Promise<unknown> {
  const data = await client.get<RestaurantReviewsResponse>(`/v1/restaurants/${encodeURIComponent(id)}/reviews`);
  return data.reviews;
}
