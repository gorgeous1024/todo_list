<script lang="ts">
	import { onMount } from 'svelte';
	import { 
		tasksStore, 
		loadingStore, 
		errorStore, 
		taskStats, 
		taskActions,
		filteredAndSortedTasks,
		viewModeStore 
	} from '$lib/stores/tasks.js';
	import { apiService } from '$lib/services/api.js';
	import TaskCard from '$lib/components/TaskCard.svelte';
	import TaskList from '$lib/components/TaskList.svelte';
	import KanbanBoard from '$lib/components/KanbanBoard.svelte';
	import StatsCard from '$lib/components/StatsCard.svelte';
	import ViewToggle from '$lib/components/ViewToggle.svelte';
	import FilterBar from '$lib/components/FilterBar.svelte';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import ErrorAlert from '$lib/components/ErrorAlert.svelte';
	import { Plus, Calendar, TrendingUp, CheckCircle, Clock } from 'lucide-svelte';
	import type { Task } from '$lib/types/index.js';

	let nearestDeadlineTask: Task | null = null;

	onMount(async () => {
		// Load tasks and nearest deadline task
		await taskActions.loadTasks();
		
		try {
			nearestDeadlineTask = await apiService.getNearestDeadlineTask();
		} catch (error) {
			console.error('Failed to load nearest deadline task:', error);
		}
	});

	$: stats = $taskStats;
	$: tasks = $filteredAndSortedTasks;
	$: viewMode = $viewModeStore;
	$: loading = $loadingStore;
	$: error = $errorStore;
</script>

<svelte:head>
	<title>Dashboard - TodoApp</title>
	<meta name="description" content="Manage your tasks efficiently with TodoApp dashboard" />
</svelte:head>

<div class="space-y-8">
	<!-- Page Header -->
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<div>
			<h1 class="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
			<p class="text-gray-600 dark:text-gray-400 mt-1">
				Welcome back! Here's an overview of your tasks.
			</p>
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

	<!-- Stats Cards -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
		<StatsCard
			title="Total Tasks"
			value={stats.total}
			icon={CheckCircle}
			color="blue"
		/>
		<StatsCard
			title="Completed"
			value={stats.completed}
			icon={CheckCircle}
			color="green"
			subtitle="{stats.completionRate}% completion rate"
		/>
		<StatsCard
			title="Pending"
			value={stats.pending}
			icon={Clock}
			color="yellow"
		/>
		<StatsCard
			title="Overdue"
			value={stats.overdue}
			icon={Calendar}
			color="red"
		/>
	</div>

	<!-- Nearest Deadline Task -->
	{#if nearestDeadlineTask}
		<div class="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg p-6 border border-orange-200 dark:border-orange-800">
			<div class="flex items-start justify-between">
				<div class="flex items-start space-x-3">
					<Calendar class="text-orange-600 dark:text-orange-400 mt-1" size={20} />
					<div>
						<h3 class="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Deadline</h3>
						<p class="text-gray-600 dark:text-gray-400 text-sm mt-1">
							Don't forget about this important task
						</p>
					</div>
				</div>
			</div>
			<div class="mt-4">
				<TaskCard task={nearestDeadlineTask} compact={true} />
			</div>
		</div>
	{/if}

	<!-- View Controls -->
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<div class="flex items-center space-x-4">
			<h2 class="text-xl font-semibold text-gray-900 dark:text-white">Your Tasks</h2>
			<span class="text-sm text-gray-500 dark:text-gray-400">
				{tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
			</span>
		</div>
		<ViewToggle />
	</div>

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
			<TrendingUp class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
			<h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">No tasks found</h3>
			<p class="mt-2 text-gray-500 dark:text-gray-400">
				Get started by creating your first task.
			</p>
			<a href="/task/new" class="btn-primary mt-4 inline-flex items-center space-x-2">
				<Plus size={18} />
				<span>Create your first task</span>
			</a>
		</div>
	{:else}
		<!-- Task Views -->
		{#if viewMode.type === 'list'}
			<TaskList {tasks} />
		{:else if viewMode.type === 'kanban'}
			<KanbanBoard />
		{:else if viewMode.type === 'grid'}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each tasks as task (task.id)}
					<TaskCard {task} />
				{/each}
			</div>
		{/if}
	{/if}
</div>
