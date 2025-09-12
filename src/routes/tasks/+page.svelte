<script lang="ts">
	import { onMount } from 'svelte';
	import { 
		tasksStore, 
		loadingStore, 
		errorStore, 
		taskActions,
		filteredAndSortedTasks
	} from '$lib/stores/tasks.js';
	import TaskList from '$lib/components/TaskList.svelte';
	import FilterBar from '$lib/components/FilterBar.svelte';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import ErrorAlert from '$lib/components/ErrorAlert.svelte';
	import { Plus, List } from 'lucide-svelte';

	onMount(async () => {
		await taskActions.loadTasks();
	});

	$: tasks = $filteredAndSortedTasks;
	$: loading = $loadingStore;
	$: error = $errorStore;
</script>

<svelte:head>
	<title>All Tasks - TodoApp</title>
	<meta name="description" content="View and manage all your tasks in a comprehensive list" />
</svelte:head>

<div class="space-y-8">
	<!-- Page Header -->
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<div class="flex items-center space-x-3">
			<List class="text-primary-600 dark:text-primary-400" size={32} />
			<div>
				<h1 class="text-3xl font-bold text-gray-900 dark:text-white">All Tasks</h1>
				<p class="text-gray-600 dark:text-gray-400 mt-1">
					Comprehensive view of all your tasks with advanced filtering and sorting.
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
	{:else if tasks.length === 0}
		<!-- Empty State -->
		<div class="text-center py-12">
			<List class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
			<h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">No tasks found</h3>
			<p class="mt-2 text-gray-500 dark:text-gray-400">
				Try adjusting your filters or create a new task to get started.
			</p>
			<a href="/task/new" class="btn-primary mt-4 inline-flex items-center space-x-2">
				<Plus size={18} />
				<span>Create your first task</span>
			</a>
		</div>
	{:else}
		<!-- Task Count -->
		<div class="flex items-center justify-between">
			<p class="text-sm text-gray-500 dark:text-gray-400">
				Showing {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
			</p>
		</div>

		<!-- Task List -->
		<TaskList {tasks} />
	{/if}
</div>
