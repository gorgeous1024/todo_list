<script lang="ts">
	import type { Task } from '$lib/types/index.js';
	import TaskCard from './TaskCard.svelte';

	export let tasks: Task[];
</script>

<div class="space-y-4">
	{#each tasks as task (task.id)}
		<TaskCard {task} />
	{/each}
</div>
