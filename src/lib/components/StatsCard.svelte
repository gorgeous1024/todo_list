<script lang="ts">
	import type { ComponentType } from 'svelte';
	import type { Icon } from 'lucide-svelte';

	export let title: string;
	export let value: number | string;
	export let subtitle: string = '';
	export let icon: ComponentType<Icon>;
	export let color: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'indigo' = 'blue';

	const colorClasses = {
		blue: {
			icon: 'text-blue-600 dark:text-blue-400',
			bg: 'bg-blue-50 dark:bg-blue-900/20',
			border: 'border-blue-200 dark:border-blue-800'
		},
		green: {
			icon: 'text-green-600 dark:text-green-400',
			bg: 'bg-green-50 dark:bg-green-900/20',
			border: 'border-green-200 dark:border-green-800'
		},
		yellow: {
			icon: 'text-yellow-600 dark:text-yellow-400',
			bg: 'bg-yellow-50 dark:bg-yellow-900/20',
			border: 'border-yellow-200 dark:border-yellow-800'
		},
		red: {
			icon: 'text-red-600 dark:text-red-400',
			bg: 'bg-red-50 dark:bg-red-900/20',
			border: 'border-red-200 dark:border-red-800'
		},
		purple: {
			icon: 'text-purple-600 dark:text-purple-400',
			bg: 'bg-purple-50 dark:bg-purple-900/20',
			border: 'border-purple-200 dark:border-purple-800'
		},
		indigo: {
			icon: 'text-indigo-600 dark:text-indigo-400',
			bg: 'bg-indigo-50 dark:bg-indigo-900/20',
			border: 'border-indigo-200 dark:border-indigo-800'
		}
	};

	$: classes = colorClasses[color];
</script>

<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
	<div class="flex items-center justify-between">
		<div class="flex-1 min-w-0">
			<p class="text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
				{title}
			</p>
			<p class="text-2xl font-bold text-gray-900 dark:text-white mt-2">
				{value}
			</p>
			{#if subtitle}
				<p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
					{subtitle}
				</p>
			{/if}
		</div>
		<div class="flex-shrink-0">
			<div class="w-12 h-12 {classes.bg} {classes.border} rounded-lg flex items-center justify-center border">
				<svelte:component this={icon} class="{classes.icon}" size={24} />
			</div>
		</div>
	</div>
</div>
