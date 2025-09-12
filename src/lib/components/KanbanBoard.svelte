<script lang="ts">
	import { tasksByStatus, taskActions } from '$lib/stores/tasks.js';
	import { TaskStatus } from '$lib/types/index.js';
	import TaskCard from './TaskCard.svelte';
	import { Plus } from 'lucide-svelte';

	const columns = [
		{ status: TaskStatus.TODO, title: 'To Do', color: 'bg-gray-50 dark:bg-gray-900' },
		{ status: TaskStatus.IN_PROGRESS, title: 'In Progress', color: 'bg-blue-50 dark:bg-blue-900/20' },
		{ status: TaskStatus.DONE, title: 'Done', color: 'bg-green-50 dark:bg-green-900/20' }
	];

	// Drag and drop functionality
	let draggedTask: any = null;

	function handleDragStart(event: DragEvent, task: any) {
		draggedTask = task;
		if (event.dataTransfer) {
			event.dataTransfer.effectAllowed = 'move';
		}
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		if (event.dataTransfer) {
			event.dataTransfer.dropEffect = 'move';
		}
	}

	async function handleDrop(event: DragEvent, status: TaskStatus) {
		event.preventDefault();
		
		if (draggedTask && draggedTask.status !== status) {
			try {
				await taskActions.changeTaskStatus(draggedTask.id, status);
			} catch (error) {
				console.error('Failed to update task status:', error);
			}
		}
		
		draggedTask = null;
	}

	$: taskGroups = $tasksByStatus;
</script>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
	{#each columns as column (column.status)}
		<div class="flex flex-col">
			<!-- Column Header -->
			<div class="flex items-center justify-between mb-4">
				<div class="flex items-center space-x-2">
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
						{column.title}
					</h3>
					<span class="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
						{taskGroups[column.status]?.length || 0}
					</span>
				</div>
				<a
					href="/task/new?status={column.status}"
					class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
					title="Add task to {column.title}"
				>
					<Plus size={16} />
				</a>
			</div>

			<!-- Column Content -->
			<div
				class="flex-1 min-h-96 {column.color} rounded-lg p-4 space-y-4"
				on:dragover={handleDragOver}
				on:drop={(e) => handleDrop(e, column.status)}
			>
				{#each taskGroups[column.status] || [] as task (task.id)}
					<div
						draggable="true"
						on:dragstart={(e) => handleDragStart(e, task)}
						class="cursor-move"
					>
						<TaskCard {task} compact={true} />
					</div>
				{/each}

				{#if !taskGroups[column.status]?.length}
					<div class="text-center py-8 text-gray-500 dark:text-gray-400">
						<p class="text-sm">No tasks in {column.title.toLowerCase()}</p>
						<a
							href="/task/new?status={column.status}"
							class="text-primary-600 dark:text-primary-400 hover:underline text-sm mt-2 inline-block"
						>
							Add a task
						</a>
					</div>
				{/if}
			</div>
		</div>
	{/each}
</div>
