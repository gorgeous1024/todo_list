<script lang="ts">
	import { viewModeStore, viewActions } from '$lib/stores/tasks.js';
	import { List, Grid3x3, Kanban } from 'lucide-svelte';
	import type { ViewMode } from '$lib/types/index.js';

	const viewOptions = [
		{ type: 'list' as const, icon: List, label: 'List' },
		{ type: 'grid' as const, icon: Grid3x3, label: 'Grid' },
		{ type: 'kanban' as const, icon: Kanban, label: 'Board' }
	];

	function setViewMode(type: ViewMode['type']) {
		viewActions.setViewMode({ type, compact: $viewModeStore.compact });
	}

	$: currentView = $viewModeStore.type;
</script>

<div class="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
	{#each viewOptions as option (option.type)}
		<button
			on:click={() => setViewMode(option.type)}
			class="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
				{currentView === option.type 
					? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
					: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'}"
		>
			<svelte:component this={option.icon} size={16} />
			<span class="hidden sm:inline">{option.label}</span>
		</button>
	{/each}
</div>
