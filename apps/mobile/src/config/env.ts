/**
 * Environment configuration for SydneyGo.
 *
 * Values are read from Expo's process.env (populated via .env via expo-constants
 * and the app.config.ts `extra` field, or directly from process.env in bare workflow).
 *
 * DO NOT hard-code secrets here. Use .env (gitignored) for local dev and
 * CI/CD environment variables for production builds.
 */

const Env = {
  // Backend
  API_BASE_URL: process.env.API_BASE_URL ?? 'http://localhost:3000/v1',

  // Google
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY ?? '',
  GOOGLE_PLACES_API_KEY: process.env.GOOGLE_PLACES_API_KEY ?? '',

  // AI
  OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? '',
  OPENAI_MODEL: process.env.OPENAI_MODEL ?? 'gpt-4o',

  // Mapbox
  MAPBOX_ACCESS_TOKEN: process.env.MAPBOX_ACCESS_TOKEN ?? '',

  // Transport NSW
  TRANSPORT_NSW_API_KEY: process.env.TRANSPORT_NSW_API_KEY ?? '',
  TRANSPORT_NSW_BASE_URL:
    process.env.TRANSPORT_NSW_BASE_URL ?? 'https://api.transport.nsw.gov.au/v2',

  // Yelp
  YELP_API_KEY: process.env.YELP_API_KEY ?? '',
  YELP_BASE_URL: process.env.YELP_BASE_URL ?? 'https://api.yelp.com/v3',

  // Firebase
  FIREBASE_API_KEY: process.env.FIREBASE_API_KEY ?? '',
  FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN ?? '',
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID ?? '',
  FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET ?? '',
  FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID ?? '',
  FIREBASE_APP_ID: process.env.FIREBASE_APP_ID ?? '',

  // Sentry
  SENTRY_DSN: process.env.SENTRY_DSN ?? '',
} as const;

export default Env;
