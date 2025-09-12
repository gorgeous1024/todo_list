<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { TaskStatus, TaskPriority } from '$lib/types/index.js';
	import type { CreateTaskData, UpdateTaskData } from '$lib/types/index.js';
	import { validateImageFile } from '$lib/utils/index.js';
	import ImageUpload from './ImageUpload.svelte';
	import { Calendar, Save, X, AlertCircle } from 'lucide-svelte';
	import { _ } from 'svelte-i18n';

	// Props
	export let mode: 'create' | 'edit' = 'create';
	export let defaultValues: Partial<CreateTaskData> = {};
	export let isSubmitting: boolean = false;
	export let formErrors: Record<string, string> = {};

	// Event dispatcher
	const dispatch = createEventDispatcher<{
		submit: CreateTaskData | UpdateTaskData;
		cancel: void;
	}>();

	// Form state
	let title = defaultValues.title || '';
	let description = defaultValues.description || '';
	let dueDate = defaultValues.due_date ? new Date(defaultValues.due_date).toISOString().slice(0, 16) : '';
	let priority = defaultValues.priority || TaskPriority.MEDIUM;
	let status = defaultValues.status || TaskStatus.TODO;
	let photo: File | null = null;
	let existingPhotoUrl = '';

	// Validation state
	let touched: Record<string, boolean> = {};
	let localErrors: Record<string, string> = {};

	// Initialize existing photo for edit mode
	if (mode === 'edit' && defaultValues.photo && typeof defaultValues.photo === 'string') {
		existingPhotoUrl = defaultValues.photo;
	}

	function validateField(field: string, value: any) {
		delete localErrors[field];

		switch (field) {
			case 'title':
				if (!value.trim()) {
					localErrors[field] = $_('taskForm.titleRequired');
				} else if (value.length > 100) {
					localErrors[field] = $_('taskForm.titleMaxLength');
				}
				break;
			case 'description':
				if (value && value.length > 500) {
					localErrors[field] = $_('taskForm.descriptionMaxLength');
				}
				break;
			case 'photo':
				if (value) {
					const validation = validateImageFile(value);
					if (!validation.valid) {
						localErrors[field] = validation.error || $_('errors.invalidFileType');
					}
				}
				break;
		}

		localErrors = { ...localErrors };
	}

	function handleFieldBlur(field: string) {
		touched[field] = true;
		
		switch (field) {
			case 'title':
				validateField(field, title);
				break;
			case 'description':
				validateField(field, description);
				break;
		}
	}

	function handlePhotoSelect(event: CustomEvent<File | null>) {
		photo = event.detail;
		if (photo) {
			validateField('photo', photo);
			existingPhotoUrl = ''; // Clear existing photo when new one is selected
		}
	}

	function handleSubmit() {
		// Mark all fields as touched
		touched = { title: true, description: true, photo: true };

		// Validate all fields
		validateField('title', title);
		validateField('description', description);
		if (photo) validateField('photo', photo);

		// Check for errors
		if (Object.keys(localErrors).length > 0) {
			return;
		}

		// Prepare form data
		const formData: CreateTaskData = {
			title: title.trim(),
			description: description.trim() || undefined,
			due_date: dueDate ? new Date(dueDate).toISOString() : undefined,
			priority,
			status,
			photo: photo || undefined,
		};

		dispatch('submit', formData);
	}

	function handleCancel() {
		dispatch('cancel');
	}

	// Get error message for a field (from local validation or form errors)
	function getFieldError(field: string): string | undefined {
		return localErrors[field] || formErrors[field];
	}

	// Format today's date for min attribute
	const today = new Date().toISOString().slice(0, 16);
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-6">
	<!-- General Error -->
	{#if formErrors.general}
		<div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
			<div class="flex items-center">
				<AlertCircle class="text-red-500 dark:text-red-400 mr-2" size={20} />
				<p class="text-red-800 dark:text-red-400 text-sm">{formErrors.general}</p>
			</div>
		</div>
	{/if}

	<!-- Title -->
	<div>
		<label for="title" class="label">
			{$_('taskForm.title')} <span class="text-red-500">*</span>
		</label>
		<input
			id="title"
			type="text"
			bind:value={title}
			on:blur={() => handleFieldBlur('title')}
			disabled={isSubmitting}
			class="input {getFieldError('title') ? 'border-red-500 focus:ring-red-500' : ''}"
			placeholder={$_('taskForm.titlePlaceholder')}
			maxlength="100"
		/>
		{#if getFieldError('title')}
			<p class="text-red-500 dark:text-red-400 text-sm mt-1">{getFieldError('title')}</p>
		{/if}
		<p class="text-gray-500 dark:text-gray-400 text-xs mt-1">{title.length}/100 {$_('common.characters')}</p>
	</div>

	<!-- Description -->
	<div>
		<label for="description" class="label">{$_('taskForm.description')}</label>
		<textarea
			id="description"
			bind:value={description}
			on:blur={() => handleFieldBlur('description')}
			disabled={isSubmitting}
			class="input min-h-24 {getFieldError('description') ? 'border-red-500 focus:ring-red-500' : ''}"
			placeholder={$_('taskForm.descriptionPlaceholder')}
			maxlength="500"
		></textarea>
		{#if getFieldError('description')}
			<p class="text-red-500 dark:text-red-400 text-sm mt-1">{getFieldError('description')}</p>
		{/if}
		<p class="text-gray-500 dark:text-gray-400 text-xs mt-1">{description.length}/500 {$_('common.characters')}</p>
	</div>

	<!-- Due Date -->
	<div>
		<label for="dueDate" class="label">{$_('taskForm.dueDate')}</label>
		<div class="relative">
			<input
				id="dueDate"
				type="datetime-local"
				bind:value={dueDate}
				disabled={isSubmitting}
				min={today}
				class="input pr-10"
			/>
			<Calendar class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
		</div>
	</div>

	<!-- Priority and Status -->
	<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
		<!-- Priority -->
		<div>
			<label for="priority" class="label">{$_('taskForm.priority')}</label>
			<select
				id="priority"
				bind:value={priority}
				disabled={isSubmitting}
				class="input"
			>
				<option value={TaskPriority.LOW}>{$_('taskForm.lowPriority')}</option>
				<option value={TaskPriority.MEDIUM}>{$_('taskForm.mediumPriority')}</option>
				<option value={TaskPriority.HIGH}>{$_('taskForm.highPriority')}</option>
			</select>
		</div>

		<!-- Status -->
		<div>
			<label for="status" class="label">{$_('taskForm.status')}</label>
			<select
				id="status"
				bind:value={status}
				disabled={isSubmitting}
				class="input"
			>
				<option value={TaskStatus.TODO}>{$_('taskForm.toDo')}</option>
				<option value={TaskStatus.IN_PROGRESS}>{$_('taskForm.inProgress')}</option>
				<option value={TaskStatus.DONE}>{$_('taskForm.done')}</option>
			</select>
		</div>
	</div>

	<!-- Photo Upload -->
	<div>
		<div class="label">{$_('taskForm.photoAttachment')}</div>
		<ImageUpload
			{existingPhotoUrl}
			disabled={isSubmitting}
			error={getFieldError('photo')}
			on:fileSelect={handlePhotoSelect}
		/>
	</div>

	<!-- Form Actions -->
	<div class="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
		<button
			type="button"
			on:click={handleCancel}
			disabled={isSubmitting}
			class="btn-secondary flex items-center space-x-2"
		>
			<X size={16} />
			<span>{$_('common.cancel')}</span>
		</button>

		<button
			type="submit"
			disabled={isSubmitting || Object.keys(localErrors).length > 0 || !title.trim()}
			class="btn-primary flex items-center space-x-2"
		>
			{#if isSubmitting}
				<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
			{:else}
				<Save size={16} />
			{/if}
			<span>{mode === 'create' ? $_('taskForm.createTask') : $_('taskForm.saveChanges')}</span>
		</button>
	</div>
</form>
