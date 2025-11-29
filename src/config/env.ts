/**
 * Environment Configuration
 * Centralized environment variable access with type safety
 */

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key] ?? defaultValue;
  if (value === undefined) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export const env = {
  // Supabase
  supabase: {
    url: getEnvVar("NEXT_PUBLIC_SUPABASE_URL", ""),
    anonKey: getEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY", ""),
  },

  // App
  app: {
    name: "ShareHouse",
    url: getEnvVar("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
  },

  // Feature Flags
  features: {
    useMockData: getEnvVar("NEXT_PUBLIC_USE_MOCK_DATA", "true") === "true",
  },

  // Runtime
  isDev: process.env.NODE_ENV === "development",
  isProd: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",
} as const;

export type Env = typeof env;
