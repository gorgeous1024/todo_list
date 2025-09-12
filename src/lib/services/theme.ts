/**
 * Professional Theme Service
 * Handles theme management with proper separation of concerns
 */

import { writable, derived, type Writable, type Readable } from 'svelte/store';
import { browser } from '$app/environment';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeConfig {
  mode: ThemeMode;
  systemPreference: 'light' | 'dark';
  isSystemDark: boolean;
  effectiveTheme: 'light' | 'dark';
}

export interface ThemeService {
  // Stores
  config: Readable<ThemeConfig>;
  
  // Actions
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  getNextTheme: () => ThemeMode;
  
  // Utilities
  initialize: () => void;
  cleanup: () => void;
}

class ThemeServiceImpl implements ThemeService {
  private readonly STORAGE_KEY = 'app-theme';
  private readonly DEFAULT_THEME: ThemeMode = 'system';
  
  private _mode: Writable<ThemeMode>;
  private _systemPreference: Writable<'light' | 'dark'>;
  private mediaQuery: MediaQueryList | null = null;
  private mediaQueryListener: ((e: MediaQueryListEvent) => void) | null = null;
  
  public readonly config: Readable<ThemeConfig>;

  constructor() {
    this._mode = writable(this.DEFAULT_THEME);
    this._systemPreference = writable('light');
    
    // Create derived store for complete theme configuration
    this.config = derived(
      [this._mode, this._systemPreference],
      ([$mode, $systemPreference]) => {
        const isSystemDark = $systemPreference === 'dark';
        const effectiveTheme = $mode === 'system' 
          ? $systemPreference 
          : $mode as 'light' | 'dark';
          
        return {
          mode: $mode,
          systemPreference: $systemPreference,
          isSystemDark,
          effectiveTheme
        };
      }
    );

    // Subscribe to theme changes and apply them (only in browser)
    if (browser) {
      this.config.subscribe((config: ThemeConfig) => {
        this.applyTheme(config.effectiveTheme);
        this.persistTheme(config.mode);
      });
    }
  }

  public initialize(): void {
    if (!browser) return;

    // Initialize system preference detection
    this.setupSystemThemeDetection();
    
    // Load saved theme or use default
    const savedTheme = this.loadTheme();
    this._mode.set(savedTheme);
  }

  public cleanup(): void {
    if (this.mediaQuery && this.mediaQueryListener) {
      this.mediaQuery.removeEventListener('change', this.mediaQueryListener);
    }
  }

  public setTheme = (mode: ThemeMode): void => {
    this._mode.set(mode);
  }

  public toggleTheme = (): void => {
    const nextTheme = this.getNextTheme();
    this.setTheme(nextTheme);
  }

  public getNextTheme = (): ThemeMode => {
    const currentMode = this.getCurrentMode();
    const themeOrder: ThemeMode[] = ['light', 'dark', 'system'];
    const currentIndex = themeOrder.indexOf(currentMode);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    return themeOrder[nextIndex];
  }

  private getCurrentMode(): ThemeMode {
    let currentMode: ThemeMode = this.DEFAULT_THEME;
    this._mode.subscribe(mode => currentMode = mode)();
    return currentMode;
  }

  private setupSystemThemeDetection(): void {
    if (!browser) return;

    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Set initial system preference
    this._systemPreference.set(this.mediaQuery.matches ? 'dark' : 'light');
    
    // Listen for system theme changes
    this.mediaQueryListener = (e: MediaQueryListEvent) => {
      this._systemPreference.set(e.matches ? 'dark' : 'light');
    };
    
    this.mediaQuery.addEventListener('change', this.mediaQueryListener);
  }

  private applyTheme(theme: 'light' | 'dark'): void {
    if (!browser) return;

    const htmlElement = document.documentElement;
    
    // Remove existing theme classes first
    htmlElement.classList.remove('dark', 'light');
    
    // Apply new theme class
    htmlElement.classList.add(theme);
    
    // Also ensure body has the right class for any legacy styles
    document.body.classList.remove('dark', 'light');
    document.body.classList.add(theme);

    // Update meta theme-color for mobile browsers
    this.updateMetaThemeColor(theme);
    
    // Force a style recalculation
    htmlElement.style.colorScheme = theme;
  }

  private updateMetaThemeColor(theme: 'light' | 'dark'): void {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    const color = theme === 'dark' ? '#1f2937' : '#ffffff';
    
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', color);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = color;
      document.head.appendChild(meta);
    }
  }

  private loadTheme(): ThemeMode {
    if (!browser) return this.DEFAULT_THEME;

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (this.isValidThemeMode(parsed.mode)) {
          return parsed.mode;
        }
      }
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error);
    }

    return this.DEFAULT_THEME;
  }

  private persistTheme(mode: ThemeMode): void {
    if (!browser) return;

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify({ mode }));
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  }

  private isValidThemeMode(value: any): value is ThemeMode {
    return typeof value === 'string' && ['light', 'dark', 'system'].includes(value);
  }
}

// Export singleton instance
export const themeService: ThemeService = new ThemeServiceImpl();

// Export theme icons mapping
export const THEME_ICONS = {
  light: 'sun',
  dark: 'moon',
  system: 'monitor'
} as const;

// Export theme labels
export const THEME_LABELS = {
  light: 'Light Mode',
  dark: 'Dark Mode', 
  system: 'System Theme'
} as const;
