<script lang="ts">
	import { page } from '$app/stores';
	import { Plus, Home, Kanban, List, Search } from 'lucide-svelte';
	import ThemeToggle from './ThemeToggle.svelte';

	const navigation = [
		{ name: 'Dashboard', href: '/', icon: Home },
		{ name: 'Tasks', href: '/tasks', icon: List },
		{ name: 'Kanban', href: '/kanban', icon: Kanban },
	];
</script>

<header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
	<div class="container mx-auto px-4">
		<div class="flex items-center justify-between h-16">
			<!-- Logo and Title -->
			<div class="flex items-center space-x-4">
				<a href="/" class="flex items-center space-x-2">
					<div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
						<span class="text-white font-bold text-sm">T</span>
					</div>
					<span class="text-xl font-semibold text-gray-900 dark:text-white">TodoApp</span>
				</a>
			</div>

			<!-- Navigation -->
			<nav class="hidden md:flex items-center space-x-6">
				{#each navigation as item}
					<a
						href={item.href}
						class="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
							{$page.url.pathname === item.href 
								? 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400' 
								: 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'}"
					>
						<svelte:component this={item.icon} size={18} />
						<span>{item.name}</span>
					</a>
				{/each}
			</nav>

			<!-- Actions -->
			<div class="flex items-center space-x-4">
				<!-- Search Button -->
				<button
					class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
					title="Search tasks"
				>
					<Search size={20} />
				</button>

				<!-- Theme Toggle -->
				<ThemeToggle size={20} variant="compact" />

				<!-- Create Task Button -->
				<a
					href="/task/new"
					class="btn-primary flex items-center space-x-2"
				>
					<Plus size={18} />
					<span class="hidden sm:inline">New Task</span>
				</a>
			</div>
		</div>

		<!-- Mobile Navigation -->
		<nav class="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
			<div class="flex justify-around">
				{#each navigation as item}
					<a
						href={item.href}
						class="flex flex-col items-center space-y-1 p-2 rounded-md text-xs font-medium transition-colors
							{$page.url.pathname === item.href 
								? 'text-primary-700 dark:text-primary-400' 
								: 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}"
					>
						<svelte:component this={item.icon} size={20} />
						<span>{item.name}</span>
					</a>
				{/each}
			</div>
		</nav>
	</div>
	
	<!-- Debug Panel (temporary) -->
	<!-- <ThemeDebug /> -->
</header>
