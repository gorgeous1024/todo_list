<script lang="ts">
	import { filterStore, sortStore, viewActions } from '$lib/stores/tasks.js';
	import { TaskStatus, TaskPriority } from '$lib/types/index.js';
	import { Search, Filter, X, ArrowUpDown } from 'lucide-svelte';
	import { debounce } from '$lib/utils/index.js';

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
				placeholder="Search tasks..."
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
				<span>Filters</span>
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
					<option value="created_at-desc">Newest first</option>
					<option value="created_at-asc">Oldest first</option>
					<option value="title-asc">Title A-Z</option>
					<option value="title-desc">Title Z-A</option>
					<option value="due_date-asc">Due date (nearest)</option>
					<option value="due_date-desc">Due date (furthest)</option>
					<option value="priority-desc">Priority (high to low)</option>
					<option value="priority-asc">Priority (low to high)</option>
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
					<label class="label">Status</label>
					<select
						value={currentFilter.status || ''}
						on:change={(e) => viewActions.setFilter({ 
							status: e.currentTarget.value ? e.currentTarget.value as TaskStatus : undefined 
						})}
						class="input"
					>
						<option value="">All statuses</option>
						<option value={TaskStatus.TODO}>To Do</option>
						<option value={TaskStatus.IN_PROGRESS}>In Progress</option>
						<option value={TaskStatus.DONE}>Done</option>
					</select>
				</div>

				<!-- Priority Filter -->
				<div>
					<label class="label">Priority</label>
					<select
						value={currentFilter.priority || ''}
						on:change={(e) => viewActions.setFilter({ 
							priority: e.currentTarget.value ? e.currentTarget.value as TaskPriority : undefined 
						})}
						class="input"
					>
						<option value="">All priorities</option>
						<option value={TaskPriority.HIGH}>High</option>
						<option value={TaskPriority.MEDIUM}>Medium</option>
						<option value={TaskPriority.LOW}>Low</option>
					</select>
				</div>

				<!-- Completion Filter -->
				<div>
					<label class="label">Completion</label>
					<select
						value={currentFilter.completed !== undefined ? currentFilter.completed.toString() : ''}
						on:change={(e) => viewActions.setFilter({ 
							completed: e.currentTarget.value ? e.currentTarget.value === 'true' : undefined 
						})}
						class="input"
					>
						<option value="">All tasks</option>
						<option value="false">Incomplete</option>
						<option value="true">Completed</option>
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
							<span>Clear filters</span>
						</button>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>
