<script lang="ts">
	import type { Task } from '$lib/types/index.js';
	import { taskActions } from '$lib/stores/tasks.js';
	import { 
		formatDate, 
		formatRelativeTime, 
		getPriorityColor, 
		getPriorityLabel,
		getStatusColor,
		getStatusLabel,
		isOverdue,
		getDaysUntilDue,
		truncateText
	} from '$lib/utils/index.js';
	import { Calendar, Clock, Image as ImageIcon, Edit, Trash2, Check, MoreHorizontal } from 'lucide-svelte';
	import { TaskStatus } from '$lib/types/index.js';

	export let task: Task;
	export let compact: boolean = false;

	let showMenu = false;
	let isUpdating = false;

	async function toggleCompletion() {
		if (isUpdating) return;
		isUpdating = true;
		
		try {
			await taskActions.toggleTaskCompletion(task.id);
		} catch (error) {
			console.error('Failed to toggle task completion:', error);
		} finally {
			isUpdating = false;
		}
	}

	async function deleteTask() {
		if (!confirm('Are you sure you want to delete this task?')) return;
		
		try {
			await taskActions.deleteTask(task.id);
		} catch (error) {
			console.error('Failed to delete task:', error);
		}
	}

	async function changeStatus(status: TaskStatus) {
		if (isUpdating) return;
		isUpdating = true;

		try {
			await taskActions.changeTaskStatus(task.id, status);
			showMenu = false;
		} catch (error) {
			console.error('Failed to change task status:', error);
		} finally {
			isUpdating = false;
		}
	}

	$: isTaskOverdue = task.due_date && !task.completed && isOverdue(task.due_date);
	$: daysUntilDue = task.due_date ? getDaysUntilDue(task.due_date) : null;
</script>

<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all duration-200 group">
	<!-- Header -->
	<div class="flex items-start justify-between mb-3">
		<div class="flex-1 min-w-0">
			<div class="flex items-center space-x-2 mb-2">
				<!-- Completion Checkbox -->
				<button
					on:click={toggleCompletion}
					disabled={isUpdating}
					class="flex-shrink-0 w-5 h-5 rounded border-2 transition-colors
						{task.completed 
							? 'bg-green-500 border-green-500 text-white' 
							: 'border-gray-300 dark:border-gray-600 hover:border-green-500'}"
				>
					{#if task.completed}
						<Check size={14} class="m-auto" />
					{/if}
				</button>

				<!-- Priority Badge -->
				<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border {getPriorityColor(task.priority)}">
					{getPriorityLabel(task.priority)}
				</span>

				<!-- Status Badge -->
				<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border {getStatusColor(task.status)}">
					{getStatusLabel(task.status)}
				</span>
			</div>

			<!-- Title -->
			<h3 class="text-lg font-semibold text-theme-primary mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors
				{task.completed ? 'line-through opacity-60' : ''}">
				<a href="/task/{task.id}" class="hover:underline">
					{compact ? truncateText(task.title, 50) : task.title}
				</a>
			</h3>

			<!-- Description -->
			{#if task.description && !compact}
				<p class="text-gray-600 dark:text-gray-400 text-sm mb-3">
					{truncateText(task.description, 120)}
				</p>
			{/if}
		</div>

		<!-- Menu -->
		<div class="relative flex-shrink-0">
			<button
				on:click={() => showMenu = !showMenu}
				class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded opacity-0 group-hover:opacity-100 transition-opacity"
			>
				<MoreHorizontal size={16} />
			</button>

			{#if showMenu}
				<div class="absolute right-0 top-8 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
					<div class="py-1">
						<a
							href="/task/{task.id}"
							class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
						>
							<Edit size={14} class="mr-2" />
							Edit task
						</a>
						
						{#if task.status !== TaskStatus.TODO}
							<button
								on:click={() => changeStatus(TaskStatus.TODO)}
								class="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
							>
								<Clock size={14} class="mr-2" />
								Mark as To Do
							</button>
						{/if}

						{#if task.status !== TaskStatus.IN_PROGRESS}
							<button
								on:click={() => changeStatus(TaskStatus.IN_PROGRESS)}
								class="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
							>
								<Clock size={14} class="mr-2" />
								Mark as In Progress
							</button>
						{/if}

						{#if task.status !== TaskStatus.DONE}
							<button
								on:click={() => changeStatus(TaskStatus.DONE)}
								class="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
							>
								<Check size={14} class="mr-2" />
								Mark as Done
							</button>
						{/if}

						<div class="border-t border-gray-200 dark:border-gray-700 my-1"></div>
						
						<button
							on:click={deleteTask}
							class="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
						>
							<Trash2 size={14} class="mr-2" />
							Delete task
						</button>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- Photo -->
	{#if task.photo && !compact}
		<div class="mb-3">
			<img
				src={task.photo}
				alt="Task attachment"
				class="w-full h-32 object-cover rounded-md border border-gray-200 dark:border-gray-700"
			/>
		</div>
	{:else if task.photo && compact}
		<div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
			<ImageIcon size={14} class="mr-1" />
			Has attachment
		</div>
	{/if}

	<!-- Footer -->
	<div class="flex items-center justify-between text-sm">
		<div class="flex items-center space-x-4 text-gray-500 dark:text-gray-400">
			<!-- Due Date -->
			{#if task.due_date}
				<div class="flex items-center space-x-1
					{isTaskOverdue ? 'text-red-600 dark:text-red-400' : ''}">
					<Calendar size={14} />
					<span>
						{formatDate(task.due_date)}
						{#if daysUntilDue !== null}
							{#if daysUntilDue < 0}
								(overdue)
							{:else if daysUntilDue === 0}
								(today)
							{:else if daysUntilDue === 1}
								(tomorrow)
							{:else}
								({daysUntilDue} days)
							{/if}
						{/if}
					</span>
				</div>
			{/if}

			<!-- Created Time -->
			<div class="flex items-center space-x-1">
				<Clock size={14} />
				<span>{formatRelativeTime(task.created_at)}</span>
			</div>
		</div>
	</div>
</div>

<!-- Click outside to close menu -->
{#if showMenu}
	<div class="fixed inset-0 z-0" on:click={() => showMenu = false}></div>
{/if}
