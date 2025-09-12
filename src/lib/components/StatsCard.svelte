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
			border: 'border-blue-200 dark:border-blue-800'
		},
		green: {
			icon: 'text-green-600 dark:text-green-400',
			border: 'border-green-200 dark:border-green-800'
		},
		yellow: {
			icon: 'text-yellow-600 dark:text-yellow-400',
			border: 'border-yellow-200 dark:border-yellow-800'
		},
		red: {
			icon: 'text-red-600 dark:text-red-400',
			border: 'border-red-200 dark:border-red-800'
		},
		purple: {
			icon: 'text-purple-600 dark:text-purple-400',
			border: 'border-purple-200 dark:border-purple-800'
		},
		indigo: {
			icon: 'text-indigo-600 dark:text-indigo-400',
			border: 'border-indigo-200 dark:border-indigo-800'
		}
	};

	$: classes = colorClasses[color];
</script>

<div class="bg-theme-secondary rounded-lg shadow-sm border border-theme-secondary p-6 hover:shadow-md transition-shadow">
	<div class="flex items-center justify-between">
		<div class="flex-1 min-w-0">
			<p class="text-sm font-medium text-theme-secondary truncate">
				{title}
			</p>
			<p class="text-2xl font-bold text-theme-secondary mt-2">
				{value}
			</p>
			{#if subtitle}
				<p class="text-xs text-theme-secondary mt-1">
					{subtitle}
				</p>
			{/if}
		</div>
		<div class="flex-shrink-0">
			<div class="w-12 h-12 {classes.border} rounded-lg flex items-center justify-center border">
				<svelte:component this={icon} class="{classes.icon}" size={24} />
			</div>
		</div>
	</div>
</div>
