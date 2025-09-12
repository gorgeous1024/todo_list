<script lang="ts">
  import { Sun, Moon, Monitor } from 'lucide-svelte';
  import { useTheme } from '$lib/contexts/theme.js';
  import { THEME_ICONS, THEME_LABELS } from '$lib/services/theme.js';
  
  const { config, toggleTheme } = useTheme();
  
  // Component props
  export let size: number = 20;
  export let variant: 'default' | 'compact' = 'default';
  export let showLabel: boolean = false;
  
  // Icon mapping
  const iconComponents = {
    sun: Sun,
    moon: Moon,
    monitor: Monitor
  };
  
  // Reactive values
  $: currentIcon = THEME_ICONS[$config.mode];
  $: IconComponent = iconComponents[currentIcon];
  $: ariaLabel = `Switch to next theme (current: ${THEME_LABELS[$config.mode]})`;
  console.log(currentIcon);
  
  // Clean button classes
  $: buttonClasses = [
    // Base styles
    'inline-flex items-center justify-center',
    'transition-all duration-200 ease-in-out',
    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
    'dark:focus:ring-offset-gray-800',
    
    // Size variants
    variant === 'compact' 
      ? 'w-9 h-9 rounded-lg' 
      : 'w-10 h-10 rounded-lg',
    
    // Color and hover states
    'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100',
    'bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700',
    'border border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600',
    'shadow-sm hover:shadow-md',
    
    // Transform effects
    'transform hover:scale-105 active:scale-95'
  ].join(' ');
  
  function handleToggle() {
    toggleTheme();
  }
  
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle();
    }
  }
</script>

<button
  class={buttonClasses}
  on:click={handleToggle}
  on:keydown={handleKeydown}
  type="button"
  aria-label={ariaLabel}
  title={ariaLabel}
>
  <!-- Icon with smooth rotation animation -->
  <div class="icon-wrapper transition-transform duration-200 ease-in-out">
    <IconComponent {size} />
  </div>
  
  <!-- Optional label -->
  {#if showLabel}
    <span class="ml-2 text-sm font-medium whitespace-nowrap">
      {THEME_LABELS[$config.mode]}
    </span>
  {/if}
</button>

<style>
  button:hover .icon-wrapper {
    transform: rotate(15deg);
  }
  
  button:active .icon-wrapper {
    transform: rotate(-5deg) scale(0.95);
  }
</style>
