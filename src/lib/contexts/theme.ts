/**
 * Theme Context for Svelte
 * Provides theme functionality throughout the component tree
 */

import { getContext, setContext } from 'svelte';
import { themeService, type ThemeService } from '$lib/services/theme.js';

const THEME_CONTEXT_KEY = Symbol('theme');

/**
 * Sets up the theme context for the application
 * Should be called in the root layout or app component
 */
export function setupThemeContext(): ThemeService {
  setContext(THEME_CONTEXT_KEY, themeService);
  
  // Initialize the theme service
  themeService.initialize();
  
  return themeService;
}

/**
 * Gets the theme service from context
 * @throws {Error} If theme context is not available
 */
export function getThemeContext(): ThemeService {
  const context = getContext<ThemeService>(THEME_CONTEXT_KEY);
  
  if (!context) {
    throw new Error(
      'Theme context not found. Make sure to call setupThemeContext() in a parent component.'
    );
  }
  
  return context;
}

/**
 * Hook for using theme in components
 * Provides a convenient way to access theme functionality
 */
export function useTheme() {
  const theme = getThemeContext();
  
  return {
    config: theme.config,
    setTheme: theme.setTheme,
    toggleTheme: theme.toggleTheme,
    getNextTheme: theme.getNextTheme
  };
}
