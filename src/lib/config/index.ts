/**
 * Application Configuration
 * Centralized configuration management using environment variables
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.PUBLIC_API_BASE_URL || 'http://localhost:8000/api',
  TIMEOUT: parseInt(import.meta.env.PUBLIC_API_TIMEOUT || '10000', 10),
} as const;

// Application Configuration
export const APP_CONFIG = {
  NAME: import.meta.env.PUBLIC_APP_NAME || 'Todo List',
  VERSION: import.meta.env.PUBLIC_APP_VERSION || '1.0.0',
  DESCRIPTION: import.meta.env.PUBLIC_APP_DESCRIPTION || 'A modern task management application',
} as const;

// Development Configuration
export const DEV_CONFIG = {
  MODE: import.meta.env.PUBLIC_DEV_MODE === 'true',
  NODE_ENV: import.meta.env.NODE_ENV || 'development',
} as const;

// Feature Flags
export const FEATURE_FLAGS = {
  ANALYTICS: import.meta.env.PUBLIC_ENABLE_ANALYTICS === 'true',
  DEBUG_LOGS: import.meta.env.PUBLIC_ENABLE_DEBUG_LOGS === 'true',
  OFFLINE_MODE: import.meta.env.PUBLIC_ENABLE_OFFLINE_MODE === 'true',
  LAZY_LOADING: import.meta.env.PUBLIC_ENABLE_LAZY_LOADING === 'true',
} as const;

// UI Configuration
export const UI_CONFIG = {
  DEFAULT_THEME: import.meta.env.PUBLIC_DEFAULT_THEME || 'system',
  DEFAULT_LANGUAGE: import.meta.env.PUBLIC_DEFAULT_LANGUAGE || 'en',
  ITEMS_PER_PAGE: parseInt(import.meta.env.PUBLIC_ITEMS_PER_PAGE || '10', 10),
} as const;

// Security Configuration
export const SECURITY_CONFIG = {
  ENABLE_CSP: import.meta.env.PUBLIC_ENABLE_CSP === 'true',
  ENABLE_HSTS: import.meta.env.PUBLIC_ENABLE_HSTS === 'true',
} as const;

// Performance Configuration
export const PERFORMANCE_CONFIG = {
  CACHE_DURATION: parseInt(import.meta.env.PUBLIC_CACHE_DURATION || '300000', 10),
} as const;

// Testing Configuration
export const TEST_CONFIG = {
  CI: import.meta.env.CI === 'true',
} as const;

// Utility function to check if we're in development mode
export const isDevelopment = (): boolean => {
  return DEV_CONFIG.NODE_ENV === 'development' || DEV_CONFIG.MODE;
};

// Utility function to check if we're in production mode
export const isProduction = (): boolean => {
  return DEV_CONFIG.NODE_ENV === 'production' && !DEV_CONFIG.MODE;
};

// Utility function to get environment-specific configuration
export const getEnvironmentConfig = () => {
  return {
    api: API_CONFIG,
    app: APP_CONFIG,
    dev: DEV_CONFIG,
    features: FEATURE_FLAGS,
    ui: UI_CONFIG,
    security: SECURITY_CONFIG,
    performance: PERFORMANCE_CONFIG,
    test: TEST_CONFIG,
  };
};

// Export all configurations as a single object for convenience
export const config = getEnvironmentConfig();
