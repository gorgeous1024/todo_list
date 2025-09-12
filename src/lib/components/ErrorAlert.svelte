<script lang="ts">
	import { AlertTriangle, X } from 'lucide-svelte';

	export let message: string;
	export let type: 'error' | 'warning' | 'info' = 'error';
	export let onDismiss: (() => void) | undefined = undefined;

	const typeClasses = {
		error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400',
		warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400',
		info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400'
	};

	const iconClasses = {
		error: 'text-red-500 dark:text-red-400',
		warning: 'text-yellow-500 dark:text-yellow-400',
		info: 'text-blue-500 dark:text-blue-400'
	};
</script>

<div class="rounded-md border p-4 {typeClasses[type]}">
	<div class="flex items-start">
		<div class="flex-shrink-0">
			<AlertTriangle class="{iconClasses[type]}" size={20} />
		</div>
		<div class="ml-3 flex-1">
			<p class="text-sm font-medium">{message}</p>
		</div>
		{#if onDismiss}
			<button
				on:click={onDismiss}
				class="ml-3 flex-shrink-0 rounded-md p-1.5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
			>
				<X size={16} />
			</button>
		{/if}
	</div>
</div>
