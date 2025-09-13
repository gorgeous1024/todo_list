<script lang="ts">
	import type { Task } from '$lib/types/index.js';
	import { taskActions } from '$lib/stores/tasks.js';
	import { 
		formatDate, 
		formatDateTime,
		formatRelativeTime,
		getPriorityColor, 
		getPriorityLabel,
		getStatusColor,
		getStatusLabel,
		isOverdue,
		getDaysUntilDue
	} from '$lib/utils/index.js';
	import { 
		Calendar, 
		Clock, 
		Flag, 
		CheckCircle, 
		Circle,
		Image as ImageIcon,
		User,
		Edit3
	} from 'lucide-svelte';
	import { TaskStatus } from '$lib/types/index.js';

	export let task: Task;

	let isUpdating = false;

	async function toggleCompletion() {
		if (isUpdating) return;
		isUpdating = true;
		
		try {
			await taskActions.toggleTaskCompletion(task.id);
			// Update local task object
			task = { ...task, completed: !task.completed };
		} catch (error) {
			console.error('Failed to toggle task completion:', error);
		} finally {
			isUpdating = false;
		}
	}

	async function changeStatus(status: TaskStatus) {
		if (isUpdating) return;
		isUpdating = true;

		try {
			await taskActions.changeTaskStatus(task.id, status);
			// Update local task object
			task = { ...task, status, completed: status === TaskStatus.DONE };
		} catch (error) {
			console.error('Failed to change task status:', error);
		} finally {
			isUpdating = false;
		}
	}

	$: isTaskOverdue = task.due_date && !task.completed && isOverdue(task.due_date);
	$: daysUntilDue = task.due_date ? getDaysUntilDue(task.due_date) : null;
</script>

<div class="space-y-8">
	<!-- Task Status and Actions -->
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
		<div class="flex items-center justify-between mb-6">
			<h2 class="text-xl font-semibold text-theme-primary">Task Status</h2>
			
			<!-- Quick Completion Toggle -->
			<button
				on:click={toggleCompletion}
				disabled={isUpdating}
				class="flex items-center space-x-2 px-4 py-2 rounded-md transition-colors
					{task.completed 
						? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/30' 
						: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}"
			>
				{#if task.completed}
					<CheckCircle size={18} />
					<span>Mark as Incomplete</span>
				{:else}
					<Circle size={18} />
					<span>Mark as Complete</span>
				{/if}
			</button>
		</div>

		<!-- Status Info Grid -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			<!-- Status -->
			<div class="flex items-center space-x-3">
				<div class="w-12 h-12 rounded-lg border flex items-center justify-center {getStatusColor(task.status)}">
					{#if task.status === TaskStatus.TODO}
						<Circle size={20} />
					{:else if task.status === TaskStatus.IN_PROGRESS}
						<Clock size={20} />
					{:else}
						<CheckCircle size={20} />
					{/if}
				</div>
				<div>
					<p class="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
					<p class="text-lg font-semibold text-theme-primary">
						{getStatusLabel(task.status)}
					</p>
				</div>
			</div>

			<!-- Priority -->
			<div class="flex items-center space-x-3">
				<div class="w-12 h-12 rounded-lg border flex items-center justify-center {getPriorityColor(task.priority)}">
					<Flag size={20} />
				</div>
				<div>
					<p class="text-sm font-medium text-gray-500 dark:text-gray-400">Priority</p>
					<p class="text-lg font-semibold text-theme-primary">
						{getPriorityLabel(task.priority)}
					</p>
				</div>
			</div>

			<!-- Completion -->
			<div class="flex items-center space-x-3">
				<div class="w-12 h-12 rounded-lg border flex items-center justify-center
					{task.completed 
						? 'bg-green-50 border-green-200 text-green-600 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400'
						: 'bg-gray-50 border-gray-200 text-gray-600 dark:bg-gray-900/20 dark:border-gray-800 dark:text-gray-400'}">
					<CheckCircle size={20} />
				</div>
				<div>
					<p class="text-sm font-medium text-gray-500 dark:text-gray-400">Completion</p>
					<p class="text-lg font-semibold text-theme-primary">
						{task.completed ? 'Completed' : 'Pending'}
					</p>
				</div>
			</div>
		</div>

		<!-- Status Change Buttons -->
		{#if !task.completed}
			<div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
				<p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Change Status:</p>
				<div class="flex flex-wrap gap-2">
					{#if task.status !== TaskStatus.TODO}
						<button
							on:click={() => changeStatus(TaskStatus.TODO)}
							disabled={isUpdating}
							class="btn-sm bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
						>
							Move to To Do
						</button>
					{/if}
					{#if task.status !== TaskStatus.IN_PROGRESS}
						<button
							on:click={() => changeStatus(TaskStatus.IN_PROGRESS)}
							disabled={isUpdating}
							class="btn-sm bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
						>
							Move to In Progress
						</button>
					{/if}
					{#if task.status !== TaskStatus.DONE}
						<button
							on:click={() => changeStatus(TaskStatus.DONE)}
							disabled={isUpdating}
							class="btn-sm bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
						>
							Move to Done
						</button>
					{/if}
				</div>
			</div>
		{/if}
	</div>

	<!-- Task Details -->
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
		<h2 class="text-xl font-semibold text-theme-primary mb-6">Task Details</h2>
		
		<div class="space-y-6">
			<!-- Description -->
			{#if task.description}
				<div>
					<h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</h3>
					<div class="prose prose-sm dark:prose-invert max-w-none">
						<p class="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">{task.description}</p>
					</div>
				</div>
			{/if}

			<!-- Due Date -->
			{#if task.due_date}
				<div>
					<h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Due Date</h3>
					<div class="flex items-center space-x-2">
						<Calendar class="{isTaskOverdue ? 'text-red-500' : 'text-gray-400'}" size={16} />
						<span class="text-gray-900 dark:text-gray-100 {isTaskOverdue ? 'text-red-600 dark:text-red-400 font-medium' : ''}">
							{formatDateTime(task.due_date)}
						</span>
						{#if daysUntilDue !== null}
							<span class="text-sm text-gray-500 dark:text-gray-400 {isTaskOverdue ? 'text-red-500 dark:text-red-400' : ''}">
								{#if daysUntilDue < 0}
									(overdue by {Math.abs(daysUntilDue)} {Math.abs(daysUntilDue) === 1 ? 'day' : 'days'})
								{:else if daysUntilDue === 0}
									(due today)
								{:else if daysUntilDue === 1}
									(due tomorrow)
								{:else}
									(due in {daysUntilDue} days)
								{/if}
							</span>
						{/if}
					</div>
				</div>
			{/if}

			<!-- Photo Attachment -->
			{#if task.photo}
				<div>
					<h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Attachment</h3>
					<div class="max-w-md">
						<img
							src={task.photo}
							alt="Task attachment"
							class="w-full rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
						/>
					</div>
				</div>
			{/if}

			<!-- Timestamps -->
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-gray-200 dark:border-gray-700">
				<div>
					<h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Created</h3>
					<div class="flex items-center space-x-2">
						<Edit3 class="text-gray-400" size={16} />
						<div>
							<p class="text-gray-900 dark:text-gray-100">{formatDateTime(task.created_at)}</p>
							<p class="text-sm text-gray-500 dark:text-gray-400">{formatRelativeTime(task.created_at)}</p>
						</div>
					</div>
				</div>

				<div>
					<h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Updated</h3>
					<div class="flex items-center space-x-2">
						<Edit3 class="text-gray-400" size={16} />
						<div>
							<p class="text-gray-900 dark:text-gray-100">{formatDateTime(task.updated_at)}</p>
							<p class="text-sm text-gray-500 dark:text-gray-400">{formatRelativeTime(task.updated_at)}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
