<script lang="ts">
	import { locale, locales } from 'svelte-i18n';
	import { _ } from 'svelte-i18n';
	import { Globe } from 'lucide-svelte';

	let isOpen = false;

	const languages = [
		{ code: 'en', name: 'English', flag: '🇺🇸' },
		{ code: 'cs', name: 'Čeština', flag: '🇨🇿' },
	];

	function handleLanguageChange(languageCode: string) {
		locale.set(languageCode);
		// Save language preference to localStorage
		if (typeof window !== 'undefined') {
			localStorage.setItem('svelte-i18n-locale', languageCode);
		}
		isOpen = false;
	}

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	// Close dropdown when clicking outside
	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.language-switcher')) {
			isOpen = false;
		}
	}
</script>

<svelte:window on:click={handleClickOutside} />

<div class="language-switcher relative">
	<button
		on:click={toggleDropdown}
		class="flex items-center space-x-2 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
		title={$_('languageSwitcher.title')}
	>
		<Globe size={20} />
		<span class="hidden sm:inline text-sm font-medium">
			{$locale === 'en' ? '🇺🇸' : '🇨🇿'}
		</span>
	</button>

	{#if isOpen}
		<div class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
			<div class="py-1">
				{#each languages as language}
					<button
						on:click={() => handleLanguageChange(language.code)}
						class="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
							{$locale === language.code ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400' : ''}"
					>
						<span class="text-lg">{language.flag}</span>
						<span class="font-medium">{language.name}</span>
						{#if $locale === language.code}
							<svg class="ml-auto h-4 w-4 text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
							</svg>
						{/if}
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>
