<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { taskActions } from '$lib/stores/tasks.js';
	import { CreateTaskSchema } from '$lib/schemas/task.js';
	import { TaskStatus, TaskPriority } from '$lib/types/index.js';
	import TaskForm from '$lib/components/TaskForm.svelte';
	import type { CreateTaskData } from '$lib/types/index.js';

	let isSubmitting = false;
	let formErrors: Record<string, string> = {};

	// Get default status from URL params
	const defaultStatus = $page.url.searchParams.get('status') as TaskStatus || TaskStatus.TODO;

	async function handleSubmit(event: CustomEvent<CreateTaskData>) {
		const formData = event.detail;
		isSubmitting = true;
		formErrors = {};

		try {
			// Validate the form data
			const validation = CreateTaskSchema.safeParse(formData);
			
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

			// Create the task
			const newTask = await taskActions.createTask(formData);
			
			// Redirect to the task detail page
			await goto(`/task/${newTask.id}`);
		} catch (error) {
			console.error('Failed to create task:', error);
			formErrors = { general: 'Failed to create task. Please try again.' };
		} finally {
			isSubmitting = false;
		}
	}

	function handleCancel() {
		goto('/');
	}
</script>

<svelte:head>
	<title>Create New Task - TodoApp</title>
	<meta name="description" content="Create a new task to manage your work efficiently" />
</svelte:head>

<div class="max-w-2xl mx-auto">
	<!-- Page Header -->
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-gray-900 dark:text-white">Create New Task</h1>
		<p class="text-gray-600 dark:text-gray-400 mt-2">
			Add a new task to your todo list with all the details you need.
		</p>
	</div>

	<!-- Form -->
	<TaskForm
		mode="create"
		defaultValues={{ status: defaultStatus, priority: TaskPriority.MEDIUM }}
		{isSubmitting}
		{formErrors}
		on:submit={handleSubmit}
		on:cancel={handleCancel}
	/>
</div>
