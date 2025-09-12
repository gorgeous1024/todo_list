# Internationalization (i18n) with svelte-i18n

This project uses `svelte-i18n` for internationalization, supporting Czech (CS) and English (EN) languages.

## Setup

The i18n system is initialized in `src/routes/+layout.svelte` by importing and waiting for translations to load:

```typescript
import { loadTranslations } from '$lib/i18n/index.js';
import { isLoading } from 'svelte-i18n';

onMount(async () => {
	await loadTranslations();
});
```

The layout also includes a loading state that prevents components from rendering before translations are loaded, which fixes the "Cannot format a message without first setting the initial locale" error.

## Configuration

The i18n configuration is in `src/lib/i18n/index.ts`:

- **Default locale**: English (en)
- **Fallback locale**: English (en)
- **Initial locale**: Stored preference, browser language, or default
- **Supported locales**: English (en), Czech (cs)
- **Persistence**: Language preference saved in localStorage

## Translation Files

Translation files are located in `src/lib/i18n/locales/`:

- `en.json` - English translations
- `cs.json` - Czech translations

## Usage in Components

### Basic Translation

```svelte
<script lang="ts">
	import { _ } from 'svelte-i18n';
</script>

<h1>{$_('dashboard.title')}</h1>
```

### Reactive Translations

```svelte
<script lang="ts">
	import { _ } from 'svelte-i18n';
	
	// Reactive translation that updates when language changes
	$: title = $_('dashboard.title');
</script>

<h1>{title}</h1>
```

### Language Switching

```svelte
<script lang="ts">
	import { locale } from 'svelte-i18n';
	
	function switchToCzech() {
		locale.set('cs');
	}
	
	function switchToEnglish() {
		locale.set('en');
	}
</script>
```

## Language Switcher Component

The `LanguageSwitcher.svelte` component provides a dropdown to switch between languages. It's included in the header and shows:

- Globe icon
- Current language flag
- Dropdown with available languages
- Visual indicator for current selection

## Features

- ✅ **Automatic language detection** from browser settings
- ✅ **Language persistence** - selection is remembered
- ✅ **Reactive translations** - UI updates immediately when language changes
- ✅ **Fallback support** - falls back to English if translation is missing
- ✅ **Type safety** - TypeScript support
- ✅ **Easy language switching** - one-click language change
- ✅ **Comprehensive coverage** - all UI text is translated

## Adding New Translations

1. Add the new key to both `en.json` and `cs.json`:

**en.json:**
```json
{
  "newSection": {
    "newKey": "English text"
  }
}
```

**cs.json:**
```json
{
  "newSection": {
    "newKey": "Czech text"
  }
}
```

2. Use in components:
```svelte
<span>{$_('newSection.newKey')}</span>
```

## Supported Languages

- **English (en)** - Default language
- **Czech (cs)** - Complete translation support

## Testing

To test the localization:

1. Run the development server: `npm run dev`
2. Click the language switcher (globe icon) in the header
3. Select a different language
4. Observe all text changes immediately
5. Refresh the page to verify language preference is saved

The language preference is automatically saved in the browser and restored on subsequent visits.
