<script lang="ts">
	import { page } from '$app/stores';
	import { Plus, Home, Kanban, List, Search } from 'lucide-svelte';
	import ThemeToggle from './ThemeToggle.svelte';
	import LanguageSwitcher from './LanguageSwitcher.svelte';
	import { _ } from 'svelte-i18n';

	// Reactive navigation that updates when language changes
	$: navigation = [
		{ name: $_('navigation.dashboard'), href: '/', icon: Home },
		{ name: $_('navigation.tasks'), href: '/tasks', icon: List },
		{ name: $_('navigation.kanban'), href: '/kanban', icon: Kanban },
	];
</script>

<header class="bg-theme-secondary shadow-sm border-b border-theme transition-colors duration-200">
	<div class="container mx-auto px-4">
		<div class="flex items-center justify-between h-16">
			<!-- Logo and Title -->
			<div class="flex items-center space-x-4">
				<a href="/" class="flex items-center space-x-2">
					<div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
						<span class="text-white font-bold text-sm">T</span>
					</div>
					<span class="text-xl font-semibold text-theme-primary">{$_('app.title')}</span>
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
								: 'text-theme-secondary hover:text-theme-primary hover:bg-theme-tertiary'}"
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
					class="p-2 text-theme-tertiary hover:text-theme-secondary hover:bg-theme-tertiary rounded-md transition-colors"
					title={$_('common.search')}
				>
					<Search size={20} />
				</button>

				<!-- Language Switcher -->
				<LanguageSwitcher />

				<!-- Theme Toggle -->
				<ThemeToggle size={20} variant="compact" />

				<!-- Create Task Button -->
				<a
					href="/task/new"
					class="btn-primary flex items-center space-x-2"
				>
					<Plus size={18} />
					<span class="hidden sm:inline">{$_('common.newTask')}</span>
				</a>
			</div>
		</div>

		<!-- Mobile Navigation -->
		<nav class="md:hidden py-4 border-t border-theme">
			<div class="flex justify-around">
				{#each navigation as item}
					<a
						href={item.href}
						class="flex flex-col items-center space-y-1 p-2 rounded-md text-xs font-medium transition-colors
							{$page.url.pathname === item.href 
								? 'text-primary-700 dark:text-primary-400' 
								: 'text-theme-secondary hover:text-theme-primary'}"
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
