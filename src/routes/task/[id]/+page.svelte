<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { apiService } from '$lib/services/api.js';
	import { taskActions } from '$lib/stores/tasks.js';
	import { UpdateTaskSchema } from '$lib/schemas/task.js';
	import TaskForm from '$lib/components/TaskForm.svelte';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import ErrorAlert from '$lib/components/ErrorAlert.svelte';
	import TaskDetailView from '$lib/components/TaskDetailView.svelte';
	import { Edit, Trash2, ArrowLeft } from 'lucide-svelte';
	import type { Task, UpdateTaskData } from '$lib/types/index.js';

	// State
	let task: Task | null = null;
	let loading = true;
	let error: string | null = null;
	let isEditing = false;
	let isSubmitting = false;
	let formErrors: Record<string, string> = {};

	// Get task ID from URL
	$: taskId = $page.params.id;

	onMount(async () => {
		await loadTask();
	});

	async function loadTask() {
		if (!taskId) return;
		
		loading = true;
		error = null;

		try {
			task = await apiService.getTask(taskId);
		} catch (err) {
			console.error('Failed to load task:', err);
			error = 'Failed to load task. It may have been deleted.';
		} finally {
			loading = false;
		}
	}

	async function handleUpdate(event: CustomEvent<UpdateTaskData>) {
		if (!task) return;

		const formData = { ...event.detail, id: task.id };
		isSubmitting = true;
		formErrors = {};

		try {
			// Validate the form data
			const validation = UpdateTaskSchema.safeParse(formData);
			
			if (!validation.success) {
				const errors: Record<string, string> = {};
				validation.error.errors.forEach(error => {
					if (error.path.length > 0) {
						errors[error.path[0] as string] = error.message;
					}
				});
				formErrors = errors;
				return;
			}

			// Update the task
			const updatedTask = await taskActions.updateTask(formData);
			task = updatedTask;
			isEditing = false;
		} catch (error) {
			console.error('Failed to update task:', error);
			formErrors = { general: 'Failed to update task. Please try again.' };
		} finally {
			isSubmitting = false;
		}
	}

	async function handleDelete() {
		if (!task) return;
		
		const confirmed = confirm(`Are you sure you want to delete "${task.title}"? This action cannot be undone.`);
		if (!confirmed) return;

		try {
			await taskActions.deleteTask(task.id);
			await goto('/');
		} catch (error) {
			console.error('Failed to delete task:', error);
			alert('Failed to delete task. Please try again.');
		}
	}

	function handleCancel() {
		isEditing = false;
		formErrors = {};
	}

	function goBack() {
		goto('/');
	}
</script>

<svelte:head>
	<title>{task ? `${task.title} - TodoApp` : 'Task - TodoApp'}</title>
	<meta name="description" content={task ? `View and edit task: ${task.title}` : 'Task details and editing'} />
</svelte:head>

<div class="max-w-4xl mx-auto">
	<!-- Back Button -->
	<div class="mb-6">
		<button
			on:click={goBack}
			class="btn-secondary flex items-center space-x-2"
		>
			<ArrowLeft size={16} />
			<span>Back to Dashboard</span>
		</button>
	</div>

	{#if loading}
		<!-- Loading State -->
		<div class="flex justify-center py-12">
			<LoadingSpinner size="lg" />
		</div>
	{:else if error}
		<!-- Error State -->
		<ErrorAlert 
			message={error} 
			onDismiss={() => error = null}
		/>
		<div class="text-center py-8">
			<button on:click={goBack} class="btn-primary">
				Go back to dashboard
			</button>
		</div>
	{:else if task}
		{#if isEditing}
			<!-- Edit Mode -->
			<div class="mb-8">
				<h1 class="text-3xl font-bold text-theme-primary">Edit Task</h1>
				<p class="text-gray-600 dark:text-gray-400 mt-2">
					Make changes to your task details.
				</p>
			</div>

			<TaskForm
				mode="edit"
				defaultValues={task}
				{isSubmitting}
				{formErrors}
				on:submit={handleUpdate}
				on:cancel={handleCancel}
			/>
		{:else}
			<!-- View Mode -->
			<div class="space-y-6">
				<!-- Header -->
				<div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
					<div class="flex-1 min-w-0">
						<h1 class="text-3xl font-bold text-theme-primary">
							{task.title}
						</h1>
						{#if task.description}
							<p class="text-gray-600 dark:text-gray-400 mt-2">
								{task.description}
							</p>
						{/if}
					</div>

					<!-- Actions -->
					<div class="flex items-center space-x-3">
						<button
							on:click={() => isEditing = true}
							class="btn-secondary flex items-center space-x-2"
						>
							<Edit size={16} />
							<span>Edit</span>
						</button>
						
						<button
							on:click={handleDelete}
							class="btn-danger flex items-center space-x-2"
						>
							<Trash2 size={16} />
							<span>Delete</span>
						</button>
					</div>
				</div>

				<!-- Task Detail View -->
				<TaskDetailView {task} />
			</div>
		{/if}
	{:else}
		<!-- Not Found State -->
		<div class="text-center py-12">
			<h2 class="text-2xl font-bold text-theme-primary mb-4">
				Task Not Found
			</h2>
			<p class="text-gray-600 dark:text-gray-400 mb-6">
				The task you're looking for doesn't exist or has been deleted.
			</p>
			<button on:click={goBack} class="btn-primary">
				Go back to dashboard
			</button>
		</div>
	{/if}
</div>
