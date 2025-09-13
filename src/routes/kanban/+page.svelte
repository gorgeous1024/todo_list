<script lang="ts">
	import { onMount } from 'svelte';
	import { 
		tasksStore, 
		loadingStore, 
		errorStore, 
		taskActions,
		tasksByStatus
	} from '$lib/stores/tasks.js';
	import KanbanBoard from '$lib/components/KanbanBoard.svelte';
	import FilterBar from '$lib/components/FilterBar.svelte';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import ErrorAlert from '$lib/components/ErrorAlert.svelte';
	import { Plus, Kanban } from 'lucide-svelte';

	onMount(async () => {
		await taskActions.loadTasks();
	});

	$: taskGroups = $tasksByStatus;
	$: loading = $loadingStore;
	$: error = $errorStore;
	$: totalTasks = Object.values(taskGroups).reduce((sum, tasks) => sum + tasks.length, 0);
</script>

<svelte:head>
	<title>Kanban Board - TodoApp</title>
	<meta name="description" content="Visualize and manage your tasks using an interactive Kanban board" />
</svelte:head>

<div class="space-y-8">
	<!-- Page Header -->
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<div class="flex items-center space-x-3">
			<Kanban class="text-primary-600 dark:text-primary-400" size={32} />
			<div>
				<h1 class="text-3xl font-bold text-theme-primary">Kanban Board</h1>
				<p class="text-gray-600 dark:text-gray-400 mt-1">
					Drag and drop tasks between columns to update their status.
				</p>
			</div>
		</div>
		<a href="/task/new" class="btn-primary flex items-center space-x-2 w-fit">
			<Plus size={18} />
			<span>Create Task</span>
		</a>
	</div>

	<!-- Error Alert -->
	{#if error}
		<ErrorAlert message={error} onDismiss={() => errorStore.set(null)} />
	{/if}

	<!-- Filter Bar -->
	<FilterBar />

	<!-- Loading State -->
	{#if loading}
		<div class="flex justify-center py-12">
			<LoadingSpinner size="lg" />
		</div>
	{:else if totalTasks === 0}
		<!-- Empty State -->
		<div class="text-center py-12">
			<Kanban class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
			<h3 class="mt-4 text-lg font-medium text-theme-primary">No tasks to display</h3>
			<p class="mt-2 text-gray-500 dark:text-gray-400">
				Create your first task to start using the Kanban board.
			</p>
			<a href="/task/new" class="btn-primary mt-4 inline-flex items-center space-x-2">
				<Plus size={18} />
				<span>Create your first task</span>
			</a>
		</div>
	{:else}
		<!-- Task Count Summary -->
		<div class="flex items-center justify-between">
			<div class="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
				<span>Total: {totalTasks} tasks</span>
				<span>To Do: {taskGroups.todo?.length || 0}</span>
				<span>In Progress: {taskGroups.in_progress?.length || 0}</span>
				<span>Done: {taskGroups.done?.length || 0}</span>
			</div>
		</div>

		<!-- Kanban Board -->
		<KanbanBoard />

		<!-- Help Text -->
		<div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
			<div class="flex items-start space-x-3">
				<div class="flex-shrink-0">
					<Kanban class="text-blue-600 dark:text-blue-400" size={20} />
				</div>
				<div>
					<h3 class="text-sm font-medium text-blue-900 dark:text-blue-300">How to use the Kanban board</h3>
					<p class="text-blue-700 dark:text-blue-400 text-sm mt-1">
						Drag tasks between columns to change their status. Click on a task to view details or edit. 
						Use the + button in each column header to create a new task with that specific status.
					</p>
				</div>
			</div>
		</div>
	{/if}
</div>
