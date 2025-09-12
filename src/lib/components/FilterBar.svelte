<script lang="ts">
	import { filterStore, sortStore, viewActions } from '$lib/stores/tasks.js';
	import { TaskStatus, TaskPriority } from '$lib/types/index.js';
	import { Search, Filter, X, ArrowUpDown } from 'lucide-svelte';
	import { debounce } from '$lib/utils/index.js';
	import { _ } from 'svelte-i18n';

	let searchInput = '';
	let showFilters = false;

	// Debounced search function
	const debouncedSearch = debounce((value: string) => {
		viewActions.setFilter({ search: value });
	}, 300);

	function handleSearchInput(event: Event) {
		const target = event.target as HTMLInputElement;
		searchInput = target.value;
		debouncedSearch(searchInput);
	}

	function clearFilters() {
		viewActions.clearFilter();
		searchInput = '';
		showFilters = false;
	}

	function setSortField(field: string) {
		const currentSort = $sortStore;
		const direction = currentSort.field === field && currentSort.direction === 'desc' ? 'asc' : 'desc';
		viewActions.setSort({ field: field as any, direction });
	}

	$: currentFilter = $filterStore;
	$: currentSort = $sortStore;
	$: hasActiveFilters = Boolean(
		currentFilter.status || 
		currentFilter.priority || 
		currentFilter.completed !== undefined || 
		currentFilter.search
	);
</script>

<div class="space-y-4">
	<!-- Search and Filter Toggle -->
	<div class="flex flex-col sm:flex-row gap-4">
		<!-- Search Input -->
		<div class="relative flex-1">
			<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
			<input
				type="text"
				placeholder={$_('filterBar.searchPlaceholder')}
				bind:value={searchInput}
				on:input={handleSearchInput}
				class="input pl-10 pr-4"
			/>
			{#if searchInput}
				<button
					on:click={() => { searchInput = ''; debouncedSearch(''); }}
					class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
				>
					<X size={16} />
				</button>
			{/if}
		</div>

		<!-- Filter and Sort Controls -->
		<div class="flex items-center space-x-2">
			<button
				on:click={() => showFilters = !showFilters}
				class="btn-secondary flex items-center space-x-2
					{hasActiveFilters ? 'ring-2 ring-primary-500' : ''}"
			>
				<Filter size={16} />
				<span>{$_('filterBar.filters')}</span>
				{#if hasActiveFilters}
					<span class="w-2 h-2 bg-primary-500 rounded-full"></span>
				{/if}
			</button>

			<!-- Sort Dropdown -->
			<div class="relative">
				<select
					value={`${currentSort.field}-${currentSort.direction}`}
					on:change={(e) => {
						const [field, direction] = e.currentTarget.value.split('-');
						viewActions.setSort({ field: field as any, direction: direction as any });
					}}
					class="input pr-8 appearance-none cursor-pointer"
				>
					<option value="created_at-desc">{$_('filterBar.newestFirst')}</option>
					<option value="created_at-asc">{$_('filterBar.oldestFirst')}</option>
					<option value="title-asc">{$_('filterBar.titleAZ')}</option>
					<option value="title-desc">{$_('filterBar.titleZA')}</option>
					<option value="due_date-asc">{$_('filterBar.dueDateNearest')}</option>
					<option value="due_date-desc">{$_('filterBar.dueDateFurthest')}</option>
					<option value="priority-desc">{$_('filterBar.priorityHighToLow')}</option>
					<option value="priority-asc">{$_('filterBar.priorityLowToHigh')}</option>
				</select>
				<ArrowUpDown class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
			</div>
		</div>
	</div>

	<!-- Filter Panel -->
	{#if showFilters}
		<div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<!-- Status Filter -->
				<div>
					<label for="status-filter" class="label">{$_('filterBar.status')}</label>
					<select
						id="status-filter"
						value={currentFilter.status || ''}
						on:change={(e) => viewActions.setFilter({ 
							status: e.currentTarget.value ? e.currentTarget.value as TaskStatus : undefined 
						})}
						class="input"
					>
						<option value="">{$_('filterBar.allStatuses')}</option>
						<option value={TaskStatus.TODO}>{$_('taskForm.toDo')}</option>
						<option value={TaskStatus.IN_PROGRESS}>{$_('taskForm.inProgress')}</option>
						<option value={TaskStatus.DONE}>{$_('taskForm.done')}</option>
					</select>
				</div>

				<!-- Priority Filter -->
				<div>
					<label for="priority-filter" class="label">{$_('filterBar.priority')}</label>
					<select
						id="priority-filter"
						value={currentFilter.priority || ''}
						on:change={(e) => viewActions.setFilter({ 
							priority: e.currentTarget.value ? e.currentTarget.value as TaskPriority : undefined 
						})}
						class="input"
					>
						<option value="">{$_('filterBar.allPriorities')}</option>
						<option value={TaskPriority.HIGH}>{$_('taskForm.highPriority')}</option>
						<option value={TaskPriority.MEDIUM}>{$_('taskForm.mediumPriority')}</option>
						<option value={TaskPriority.LOW}>{$_('taskForm.lowPriority')}</option>
					</select>
				</div>

				<!-- Completion Filter -->
				<div>
					<label for="completion-filter" class="label">{$_('common.completion')}</label>
					<select
						id="completion-filter"
						value={currentFilter.completed !== undefined ? currentFilter.completed.toString() : ''}
						on:change={(e) => viewActions.setFilter({ 
							completed: e.currentTarget.value ? e.currentTarget.value === 'true' : undefined 
						})}
						class="input"
					>
						<option value="">{$_('filterBar.allTasks')}</option>
						<option value="false">{$_('filterBar.incomplete')}</option>
						<option value="true">{$_('filterBar.completed')}</option>
					</select>
				</div>

				<!-- Actions -->
				<div class="flex items-end">
					{#if hasActiveFilters}
						<button
							on:click={clearFilters}
							class="btn-secondary w-full flex items-center justify-center space-x-2"
						>
							<X size={16} />
							<span>{$_('filterBar.clearFilters')}</span>
						</button>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>
