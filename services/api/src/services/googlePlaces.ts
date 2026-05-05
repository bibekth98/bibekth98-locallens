import axios from 'axios';
import Env from '../config/env';

const client = axios.create({
  baseURL: 'https://maps.googleapis.com/maps/api/place',
  timeout: 10_000,
});

interface TextSearchResponse {
  results: unknown[];
}

interface PlaceDetailResponse {
  result: unknown;
}

interface NearbySearchResponse {
  results: unknown[];
}

export async function searchPlaces(
  query: string,
  location?: string,
  radius?: number,
): Promise<unknown[]> {
  const params: Record<string, string | number> = {
    query,
    key: Env.GOOGLE_PLACES_API_KEY,
  };
  if (location) params.location = location;
  if (radius !== undefined) params.radius = radius;

  const result = await client.get<TextSearchResponse>('/textsearch/json', { params });
  return result.data.results;
}

export async function nearbyPlaces(
  lat: number,
  lng: number,
  radius: number,
  type?: string,
): Promise<unknown[]> {
  const params: Record<string, string | number> = {
    location: `${lat},${lng}`,
    radius,
    key: Env.GOOGLE_PLACES_API_KEY,
  };
  if (type) params.type = type;

  const result = await client.get<NearbySearchResponse>('/nearbysearch/json', { params });
  return result.data.results;
}

export async function placeDetail(placeId: string): Promise<unknown> {
  const result = await client.get<PlaceDetailResponse>('/details/json', {
    params: {
      place_id: placeId,
      fields: 'name,rating,formatted_address,formatted_phone_number,website,photos,opening_hours,reviews',
      key: Env.GOOGLE_PLACES_API_KEY,
    },
  });
  return result.data.result;
}
