import { browser } from '$app/environment';
import { init, register, waitLocale } from 'svelte-i18n';

const defaultLocale = 'en';

register('en', () => import('./locales/en.json'));
register('cs', () => import('./locales/cs.json'));

// Get initial locale from browser or localStorage
function getInitialLocale(): string {
	if (browser) {
		// Check localStorage first
		const stored = localStorage.getItem('svelte-i18n-locale');
		if (stored && (stored === 'en' || stored === 'cs')) {
			return stored;
		}
		
		// Fall back to browser language
		const browserLang = window.navigator.language;
		if (browserLang.startsWith('cs')) {
			return 'cs';
		}
	}
	return defaultLocale;
}

init({
	fallbackLocale: defaultLocale,
	initialLocale: getInitialLocale(),
});

// Wait for the initial locale to be loaded
export const loadTranslations = async () => {
	await waitLocale();
};
