import client from './api/client';

export interface PlaceCategory {
  id: string;
  label: string;
  icon: string;
}

export interface Place {
  place_id?: string;
  name?: string;
  vicinity?: string;
  rating?: number;
  types?: string[];
  geometry?: { location: { lat: number; lng: number } };
  photos?: unknown[];
}

export interface PlacesResponse {
  places: Place[];
}

export interface PlaceDetailResponse {
  place: Record<string, unknown>;
}

export interface CategoriesResponse {
  categories: PlaceCategory[];
}

export async function fetchCategories(): Promise<PlaceCategory[]> {
  const data = await client.get<CategoriesResponse>('/v1/places/categories');
  return data.categories;
}

export async function fetchNearbyPlaces(lat: number, lng: number, radius = 1000, type?: string): Promise<Place[]> {
  const params = new URLSearchParams({ lat: String(lat), lng: String(lng), radius: String(radius) });
  if (type) params.set('type', type);
  const data = await client.get<PlacesResponse>(`/v1/places/nearby?${params.toString()}`);
  return data.places;
}

export async function searchPlaces(query: string, location?: string, radius?: number): Promise<Place[]> {
  const params = new URLSearchParams({ q: query });
  if (location) params.set('location', location);
  if (radius !== undefined) params.set('radius', String(radius));
  const data = await client.get<PlacesResponse>(`/v1/places/search?${params.toString()}`);
  return data.places;
}

export async function fetchPlaceDetail(id: string): Promise<Record<string, unknown>> {
  const data = await client.get<PlaceDetailResponse>(`/v1/places/${encodeURIComponent(id)}`);
  return data.place;
}
