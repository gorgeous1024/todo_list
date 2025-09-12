<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { validateImageFile, formatFileSize } from '$lib/utils/index.js';
	import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-svelte';

	// Props
	export let existingPhotoUrl: string = '';
	export let disabled: boolean = false;
	export let error: string = '';

	// Event dispatcher
	const dispatch = createEventDispatcher<{
		fileSelect: File | null;
	}>();

	// State
	let dragOver = false;
	let fileInput: HTMLInputElement;
	let selectedFile: File | null = null;
	let previewUrl: string = existingPhotoUrl;

	function handleFileSelect(file: File) {
		const validation = validateImageFile(file);
		
		if (!validation.valid) {
			dispatch('fileSelect', null);
			return;
		}

		selectedFile = file;
		
		// Create preview URL
		const reader = new FileReader();
		reader.onload = (e) => {
			previewUrl = e.target?.result as string;
		};
		reader.readAsDataURL(file);

		dispatch('fileSelect', file);
	}

	function handleInputChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		
		if (file) {
			handleFileSelect(file);
		}
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		if (!disabled) {
			dragOver = true;
		}
	}

	function handleDragLeave() {
		dragOver = false;
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		dragOver = false;
		
		if (disabled) return;

		const file = event.dataTransfer?.files[0];
		if (file) {
			handleFileSelect(file);
		}
	}

	function removeFile() {
		selectedFile = null;
		previewUrl = '';
		if (fileInput) {
			fileInput.value = '';
		}
		dispatch('fileSelect', null);
	}

	function openFileDialog() {
		if (!disabled && fileInput) {
			fileInput.click();
		}
	}
</script>

<div class="space-y-4">
	<!-- File Input (Hidden) -->
	<input
		type="file"
		accept="image/*"
		bind:this={fileInput}
		on:change={handleInputChange}
		class="hidden"
		{disabled}
	/>

	<!-- Upload Area -->
	{#if !previewUrl}
		<div
			class="border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
				{dragOver 
					? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
					: 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'}
				{disabled ? 'opacity-50 cursor-not-allowed' : ''}
				{error ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : ''}"
			on:dragover={handleDragOver}
			on:dragleave={handleDragLeave}
			on:drop={handleDrop}
			on:click={openFileDialog}
			role="button"
			tabindex="0"
			on:keydown={(e) => e.key === 'Enter' && openFileDialog()}
		>
			<div class="flex flex-col items-center space-y-2">
				{#if error}
					<AlertCircle class="text-red-500 dark:text-red-400" size={32} />
				{:else}
					<Upload class="text-gray-400 dark:text-gray-600" size={32} />
				{/if}
				
				<div class="text-sm">
					<p class="font-medium text-gray-900 dark:text-white">
						{dragOver ? 'Drop image here' : 'Click to upload or drag and drop'}
					</p>
					<p class="text-gray-500 dark:text-gray-400 mt-1">
						PNG, JPG, GIF, WebP up to 5MB
					</p>
				</div>
			</div>
		</div>
	{:else}
		<!-- Preview -->
		<div class="relative">
			<div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
				<img
					src={previewUrl}
					alt="Preview"
					class="w-full h-48 object-cover rounded-lg"
				/>
			</div>
			
			<!-- Remove Button -->
			<button
				type="button"
				on:click={removeFile}
				{disabled}
				class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors
					{disabled ? 'opacity-50 cursor-not-allowed' : ''}"
				title="Remove image"
			>
				<X size={16} />
			</button>

			<!-- File Info -->
			{#if selectedFile}
				<div class="mt-2 text-sm text-gray-600 dark:text-gray-400">
					<div class="flex items-center space-x-2">
						<ImageIcon size={16} />
						<span>{selectedFile.name}</span>
						<span class="text-xs">({formatFileSize(selectedFile.size)})</span>
					</div>
				</div>
			{/if}
		</div>

		<!-- Change Image Button -->
		<button
			type="button"
			on:click={openFileDialog}
			{disabled}
			class="btn-secondary w-full flex items-center justify-center space-x-2"
		>
			<Upload size={16} />
			<span>Change Image</span>
		</button>
	{/if}

	<!-- Error Message -->
	{#if error}
		<p class="text-red-500 dark:text-red-400 text-sm flex items-center space-x-1">
			<AlertCircle size={14} />
			<span>{error}</span>
		</p>
	{/if}

	<!-- Help Text -->
	<p class="text-xs text-gray-500 dark:text-gray-400">
		Supported formats: JPEG, PNG, GIF, WebP. Maximum file size: 5MB.
	</p>
</div>
