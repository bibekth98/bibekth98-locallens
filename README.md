# SydneyGo 🦘

**The mobile tourism super-app for Sydney, Australia.**  
Built with React Native + Expo (TypeScript) and a Node/Express backend.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)
4. [Environment Variables](#environment-variables)
5. [Navigation & Screens](#navigation--screens)
6. [Internationalisation (i18n)](#internationalisation-i18n)
7. [Theming](#theming)
8. [Build-Order Roadmap](#build-order-roadmap)
9. [Contributing](#contributing)

---

## Project Structure

```
sydneygo/
├── apps/
│   └── mobile/               ← Expo + React Native app
│       ├── App.tsx            ← Entry point (fonts, i18n, navigation)
│       ├── app.json           ← Expo config
│       ├── .env.example       ← Environment variable template
│       └── src/
│           ├── navigation/    ← AppNavigator + type definitions
│           ├── screens/       ← All 11 screen components
│           ├── i18n/          ← i18next setup + 9 locale files
│           ├── theme/         ← Colors, typography, glassmorphism
│           ├── config/        ← env.ts + api.ts (endpoint registry)
│           ├── services/api/  ← HTTP client (client.ts)
│           └── components/    ← Reusable UI components
└── services/
    └── api/                  ← Node/Express backend
        ├── src/
        │   ├── index.ts       ← Express app entry point
        │   ├── config/env.ts  ← Server env config
        │   ├── routes/        ← Route handlers (health, ai, places, …)
        │   └── middleware/    ← Async helpers, error handling
        └── .env.example       ← Server environment template
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Mobile | React Native 0.74 + Expo 51 |
| Language | TypeScript (strict mode) |
| Navigation | React Navigation 6 (native stack + bottom tabs) |
| i18n | i18next + react-i18next |
| Fonts | Noto Sans (via `@expo-google-fonts/noto-sans`) |
| Theming | Custom deep-navy + gold palette, glassmorphism utilities |
| Backend | Node.js 20 + Express 4 |
| Live APIs | OpenAI, Google Places, Mapbox GL, Transport NSW, Yelp Fusion |

---

## Getting Started

### Prerequisites

- Node.js ≥ 20
- npm ≥ 10 (or yarn/pnpm)
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator / Android Emulator **or** Expo Go on a physical device

### 1 – Clone and install

```bash
git clone https://github.com/bibekth98/bibekth98-locallens.git
cd bibekth98-locallens

# Install mobile dependencies
cd apps/mobile
npm install

# Install API dependencies
cd ../../services/api
npm install
```

### 2 – Configure environment

```bash
# Mobile
cp apps/mobile/.env.example apps/mobile/.env

# API backend
cp services/api/.env.example services/api/.env
```

Fill in your real API keys (see [Environment Variables](#environment-variables)).

### 3 – Run the mobile app

```bash
cd apps/mobile
npx expo start
```

Press `i` for iOS, `a` for Android, or scan the QR code with Expo Go.

### 4 – Run the backend

```bash
cd services/api
npm run dev
```

The API starts on `http://localhost:3000` by default.

---

## Environment Variables

### Mobile (`apps/mobile/.env`)

| Variable | Description |
|---|---|
| `API_BASE_URL` | Your backend URL (e.g. `https://api.sydneygo.com/v1`) |
| `GOOGLE_MAPS_API_KEY` | Google Maps SDK key |
| `GOOGLE_PLACES_API_KEY` | Google Places API key |
| `OPENAI_API_KEY` | OpenAI API key (AI chat) |
| `OPENAI_MODEL` | Model name (default: `gpt-4o`) |
| `MAPBOX_ACCESS_TOKEN` | Mapbox GL access token (3D map) |
| `TRANSPORT_NSW_API_KEY` | Transport for NSW Open Data key |
| `YELP_API_KEY` | Yelp Fusion API key (restaurants) |
| `FIREBASE_*` | Firebase project credentials (auth + analytics) |
| `SENTRY_DSN` | Sentry DSN (error tracking) |

### Backend (`services/api/.env`)

| Variable | Description |
|---|---|
| `PORT` | Server port (default: `3000`) |
| `JWT_SECRET` | Secret for JWT signing |
| `OPENAI_API_KEY` | OpenAI key (server-side AI calls) |
| `GOOGLE_PLACES_API_KEY` | Places API key |
| `MAPBOX_ACCESS_TOKEN` | Mapbox token |
| `TRANSPORT_NSW_API_KEY` | Transport NSW key |
| `YELP_API_KEY` | Yelp Fusion key |
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string |
| `SENTRY_DSN` | Sentry DSN |

---

## Navigation & Screens

```
Root Stack
├── LanguageSelectionScreen   – choose from 9 languages
├── AiOnboardingChatScreen    – AI-guided onboarding conversation
├── Overview3DScreen          – 3D Sydney cityscape intro
└── Main (Bottom Tabs)
    ├── HomeScreen            – dashboard + AI chat shortcut
    ├── ExploreScreen         – search + categories + nearby places
    │   └── RestaurantsScreen – Yelp-powered restaurant listing
    ├── Map3DScreen           – Mapbox GL 3D interactive map
    ├── ItineraryScreen       – personal trip itinerary manager
    └── ProfileScreen         – user profile + language switcher
```

Additionally, `AiChatScreen` is accessible from `HomeScreen` (nested in the Home stack).  
`TransportScreen` is accessed from `ExploreScreen` or the Home quick-actions.

---

## Internationalisation (i18n)

| Code | Language | RTL |
|---|---|---|
| `en` | English | No |
| `zh` | Chinese (Simplified) | No |
| `ja` | Japanese | No |
| `ko` | Korean | No |
| `hi` | Hindi | No |
| `ar` | Arabic | **Yes** |
| `fr` | French | No |
| `de` | German | No |
| `ne-Latn` | Nepali (Latin / transliterated) | No |

- Locale files live in `apps/mobile/src/i18n/locales/`
- Arabic triggers `I18nManager.forceRTL(true)` at runtime
- Language is persisted and switchable from **Profile → Language**

---

## Theming

### Colour Palette

| Token | Hex | Usage |
|---|---|---|
| `deepNavy` | `#0D1B2A` | Screen backgrounds |
| `navy` | `#1A2E42` | Cards, tab bar |
| `gold` | `#C9A84C` | Accent, CTAs, active states |
| `white` | `#FFFFFF` | Primary text |
| `midGray` | `#8A8A8A` | Secondary text, placeholders |

### Glassmorphism

Pre-built style objects in `src/theme/glassmorphism.ts`:

- `GlassStyles.card` – standard frosted-glass card
- `GlassStyles.cardDark` – navy-tinted glass
- `GlassStyles.pill` – floating button / chip
- `GlassStyles.sheet` – bottom sheet / drawer
- `GlassStyles.input` – text input field

Full blur effect (`backdrop-filter`) requires `@react-native-community/blur`, added in **Step 3**.

### Base Font

Noto Sans is loaded via `@expo-google-fonts/noto-sans` in `App.tsx`.  
Use `FontFamily.regular / medium / semiBold / bold` from `src/theme/typography.ts`.

---

## Build-Order Roadmap

| Step | Scope | Status |
|---|---|---|
| **1** | Project setup, navigation structure, i18n scaffolding, theming | ✅ Done |
| **2** | Live API integrations (OpenAI, Google Places, Transport NSW, Yelp) | ⏳ Pending |
| **3** | 3D rendering (Three.js / Mapbox GL), expo-gl, blur effects | ⏳ Pending |
| **4** | Authentication (Firebase), user profiles, itinerary persistence | ⏳ Pending |
| **5** | Offline support, push notifications, deep linking | ⏳ Pending |
| **6** | Performance tuning, accessibility (a11y), App Store submission | ⏳ Pending |

---

## Contributing

1. Fork the repo and create a feature branch: `git checkout -b feature/your-feature`
2. Commit your changes following [Conventional Commits](https://www.conventionalcommits.org/)
3. Open a Pull Request targeting `main`

---

*SydneyGo is built with ❤️ for travellers discovering the best of Sydney.*