import Env from './env';

/**
 * Centralised API endpoint registry.
 * Consume these in service files — never construct URLs inline.
 */

export const ApiEndpoints = {
  // ── Internal Backend ──────────────────────────────────────────────────────
  base: Env.API_BASE_URL,

  auth: {
    login: `${Env.API_BASE_URL}/auth/login`,
    register: `${Env.API_BASE_URL}/auth/register`,
    refresh: `${Env.API_BASE_URL}/auth/refresh`,
    logout: `${Env.API_BASE_URL}/auth/logout`,
  },

  user: {
    profile: `${Env.API_BASE_URL}/users/me`,
    updateProfile: `${Env.API_BASE_URL}/users/me`,
    preferences: `${Env.API_BASE_URL}/users/me/preferences`,
  },

  itinerary: {
    list: `${Env.API_BASE_URL}/itineraries`,
    create: `${Env.API_BASE_URL}/itineraries`,
    detail: (id: string) => `${Env.API_BASE_URL}/itineraries/${id}`,
    update: (id: string) => `${Env.API_BASE_URL}/itineraries/${id}`,
    delete: (id: string) => `${Env.API_BASE_URL}/itineraries/${id}`,
  },

  // ── AI (proxied through backend) ──────────────────────────────────────────
  ai: {
    chat: `${Env.API_BASE_URL}/ai/chat`,
    onboarding: `${Env.API_BASE_URL}/ai/onboarding`,
    recommendations: `${Env.API_BASE_URL}/ai/recommendations`,
  },

  // ── Places / Explore ──────────────────────────────────────────────────────
  places: {
    search: `${Env.API_BASE_URL}/places/search`,
    detail: (id: string) => `${Env.API_BASE_URL}/places/${id}`,
    nearby: `${Env.API_BASE_URL}/places/nearby`,
    categories: `${Env.API_BASE_URL}/places/categories`,
  },

  // ── Restaurants (Yelp proxied) ────────────────────────────────────────────
  restaurants: {
    search: `${Env.API_BASE_URL}/restaurants/search`,
    detail: (id: string) => `${Env.API_BASE_URL}/restaurants/${id}`,
    reviews: (id: string) => `${Env.API_BASE_URL}/restaurants/${id}/reviews`,
  },

  // ── Transport NSW ──────────────────────────────────────────────────────────
  transport: {
    tripPlanner: `${Env.API_BASE_URL}/transport/trip`,
    departures: `${Env.API_BASE_URL}/transport/departures`,
    alerts: `${Env.API_BASE_URL}/transport/alerts`,
  },

  // ── Maps / 3D ──────────────────────────────────────────────────────────────
  map: {
    tiles: `https://api.mapbox.com/styles/v1/mapbox/dark-v11/tiles/{z}/{x}/{y}?access_token=${Env.MAPBOX_ACCESS_TOKEN}`,
    geocode: `https://api.mapbox.com/geocoding/v5/mapbox.places`,
  },
} as const;

export default ApiEndpoints;
