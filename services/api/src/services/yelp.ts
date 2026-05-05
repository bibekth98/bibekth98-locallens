import axios from 'axios';
import Env from '../config/env';

const client = axios.create({
  baseURL: Env.YELP_BASE_URL,
  timeout: 10_000,
  headers: {
    Authorization: `Bearer ${Env.YELP_API_KEY}`,
  },
});

export interface RestaurantSearchParams {
  term?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  limit?: number;
  offset?: number;
}

export async function searchRestaurants(params: RestaurantSearchParams): Promise<unknown> {
  const result = await client.get('/businesses/search', { params });
  return result.data;
}

export async function restaurantDetail(id: string): Promise<unknown> {
  const result = await client.get(`/businesses/${id}`);
  return result.data;
}

export async function restaurantReviews(id: string): Promise<unknown> {
  const result = await client.get(`/businesses/${id}/reviews`);
  return result.data;
}
