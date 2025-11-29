/**
 * Environment Configuration
 * Centralized environment variable access with type safety
 */

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key];
  if (value !== undefined) return value;
  if (defaultValue !== undefined) return defaultValue;
  throw new Error(`Missing environment variable: ${key}`);
};

const maybeEnvVar = (key: string): string | null => {
  return process.env[key] ?? null;
};

const supabaseUrl = maybeEnvVar("NEXT_PUBLIC_SUPABASE_URL");
const supabaseAnonKey = maybeEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY");
const hasSupabaseEnv = !!supabaseUrl && !!supabaseAnonKey;

// Default to mock data. Only disable mocks if explicitly requested AND Supabase is configured.
const requestedMockFlag = process.env.NEXT_PUBLIC_USE_MOCK_DATA;
const useMockData =
  requestedMockFlag === undefined
    ? true
    : requestedMockFlag === "true" || !hasSupabaseEnv;

export const env = {
  // Supabase
  supabase: {
    url: supabaseUrl,
    anonKey: supabaseAnonKey,
  },

  // App
  app: {
    name: "ShareHouse",
    url: getEnvVar("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
  },

  // Feature Flags
  features: {
    useMockData,
    supabaseAvailable: hasSupabaseEnv,
  },

  // Runtime
  isDev: process.env.NODE_ENV === "development",
  isProd: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",
} as const;

export type Env = typeof env;
