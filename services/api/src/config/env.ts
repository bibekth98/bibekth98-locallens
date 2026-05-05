import dotenv from 'dotenv';
dotenv.config();

const Env = {
  PORT: parseInt(process.env.PORT ?? '3000', 10),
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  ALLOWED_ORIGINS: (process.env.ALLOWED_ORIGINS ?? '').split(',').filter(Boolean),

  JWT_SECRET: process.env.JWT_SECRET ?? '',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '7d',

  OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? '',
  OPENAI_MODEL: process.env.OPENAI_MODEL ?? 'gpt-4o',

  GOOGLE_PLACES_API_KEY: process.env.GOOGLE_PLACES_API_KEY ?? '',

  MAPBOX_ACCESS_TOKEN: process.env.MAPBOX_ACCESS_TOKEN ?? '',

  TRANSPORT_NSW_API_KEY: process.env.TRANSPORT_NSW_API_KEY ?? '',
  TRANSPORT_NSW_BASE_URL:
    process.env.TRANSPORT_NSW_BASE_URL ?? 'https://api.transport.nsw.gov.au/v2',

  YELP_API_KEY: process.env.YELP_API_KEY ?? '',
  YELP_BASE_URL: process.env.YELP_BASE_URL ?? 'https://api.yelp.com/v3',

  DATABASE_URL: process.env.DATABASE_URL ?? '',
  REDIS_URL: process.env.REDIS_URL ?? 'redis://localhost:6379',

  SENTRY_DSN: process.env.SENTRY_DSN ?? '',
} as const;

export default Env;
