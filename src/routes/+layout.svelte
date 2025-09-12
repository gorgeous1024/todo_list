<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onDestroy, onMount } from 'svelte';
	import { setupThemeContext } from '$lib/contexts/theme.js';
	import Header from '$lib/components/Header.svelte';
	import { loadTranslations } from '$lib/i18n/index.js';
	import { isLoading } from 'svelte-i18n';

	let { children } = $props();

	// Setup theme context for the entire app
	const themeService = setupThemeContext();

	// Initialize i18n and wait for translations to load
	onMount(async () => {
		await loadTranslations();
	});

	// Cleanup on destroy
	onDestroy(() => {
		themeService.cleanup();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if $isLoading}
	<!-- Loading state while translations are loading -->
	<div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
		<div class="text-center">
			<div class="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
			<p class="text-gray-600 dark:text-gray-400">Loading...</p>
		</div>
	</div>
{:else}
	<div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
		<Header />
		<main class="container mx-auto px-4 py-8">
			{@render children?.()}
		</main>
	</div>
{/if}
