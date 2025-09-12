<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onDestroy } from 'svelte';
	import { setupThemeContext } from '$lib/contexts/theme.js';
	import Header from '$lib/components/Header.svelte';

	let { children } = $props();

	// Setup theme context for the entire app
	const themeService = setupThemeContext();

	// Cleanup on destroy
	onDestroy(() => {
		themeService.cleanup();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
	<Header />
	<main class="container mx-auto px-4 py-8">
		{@render children?.()}
	</main>
</div>
