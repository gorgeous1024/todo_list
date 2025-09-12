import { writable, derived, get } from 'svelte/store';
import type { 
  Task, 
  TaskFilter, 
  TaskSort, 
  AppState, 
  CreateTaskData, 
  UpdateTaskData,
  ViewMode
} from '../types/index.js';
import { TaskStatus, TaskPriority } from '../types/index.js';
import { apiService, ApiError } from '../services/api.js';

// Core state stores
export const tasksStore = writable<Task[]>([]);
export const loadingStore = writable<boolean>(false);
export const errorStore = writable<string | null>(null);

// Filter and sort stores
export const filterStore = writable<TaskFilter>({
  status: undefined,
  priority: undefined,
  completed: undefined,
  search: '',
});

export const sortStore = writable<TaskSort>({
  field: 'created_at',
  direction: 'desc'
});

// View stores  
export const viewModeStore = writable<ViewMode>({
  type: 'list',
  compact: false
});

// Note: Theme management has been moved to the professional theme service
// This store is kept for backward compatibility but should be migrated away from
export const themeModeStore = writable<{mode: 'light' | 'dark' | 'system'}>({
  mode: 'system'
});

// Derived stores for computed values
export const filteredAndSortedTasks = derived(
  [tasksStore, filterStore, sortStore],
  ([$tasks, $filter, $sort]) => {
    let filtered = $tasks;

    // Apply filters
    if ($filter.status !== undefined) {
      filtered = filtered.filter(task => task.status === $filter.status);
    }

    if ($filter.priority !== undefined) {
      filtered = filtered.filter(task => task.priority === $filter.priority);
    }

    if ($filter.completed !== undefined) {
      filtered = filtered.filter(task => task.completed === $filter.completed);
    }

    if ($filter.search && $filter.search.trim()) {
      const searchTerm = $filter.search.toLowerCase().trim();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchTerm) ||
        (task.description && task.description.toLowerCase().includes(searchTerm))
      );
    }

    if ($filter.due_date_from) {
      filtered = filtered.filter(task => 
        task.due_date && task.due_date >= $filter.due_date_from!
      );
    }

    if ($filter.due_date_to) {
      filtered = filtered.filter(task => 
        task.due_date && task.due_date <= $filter.due_date_to!
      );
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      let aValue: any = a[$sort.field];
      let bValue: any = b[$sort.field];

      // Handle different data types
      if ($sort.field === 'priority') {
        const priorityOrder = { [TaskPriority.LOW]: 1, [TaskPriority.MEDIUM]: 2, [TaskPriority.HIGH]: 3 };
        aValue = priorityOrder[a.priority];
        bValue = priorityOrder[b.priority];
      } else if ($sort.field === 'due_date') {
        aValue = a.due_date ? new Date(a.due_date).getTime() : 0;
        bValue = b.due_date ? new Date(b.due_date).getTime() : 0;
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue === bValue) return 0;
      
      const comparison = aValue < bValue ? -1 : 1;
      return $sort.direction === 'asc' ? comparison : -comparison;
    });
  }
);

export const tasksByStatus = derived(
  tasksStore,
  ($tasks) => {
    return {
      [TaskStatus.TODO]: $tasks.filter(task => task.status === TaskStatus.TODO),
      [TaskStatus.IN_PROGRESS]: $tasks.filter(task => task.status === TaskStatus.IN_PROGRESS),
      [TaskStatus.DONE]: $tasks.filter(task => task.status === TaskStatus.DONE),
    };
  }
);

export const taskStats = derived(
  tasksStore,
  ($tasks) => {
    const total = $tasks.length;
    const completed = $tasks.filter(task => task.completed).length;
    const pending = total - completed;
    const overdue = $tasks.filter(task => 
      task.due_date && 
      new Date(task.due_date) < new Date() && 
      !task.completed
    ).length;

    return {
      total,
      completed,
      pending,
      overdue,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }
);

// Action functions
export const taskActions = {
  // Load all tasks
  async loadTasks() {
    loadingStore.set(true);
    errorStore.set(null);
    
    try {
      const tasks = await apiService.getTasks();
      tasksStore.set(tasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
      const message = error instanceof ApiError ? error.message : 'Failed to load tasks';
      errorStore.set(message);
    } finally {
      loadingStore.set(false);
    }
  },

  // Create a new task
  async createTask(data: CreateTaskData) {
    loadingStore.set(true);
    errorStore.set(null);

    try {
      const newTask = await apiService.createTask(data);
      tasksStore.update(tasks => [newTask, ...tasks]);
      return newTask;
    } catch (error) {
      console.error('Failed to create task:', error);
      const message = error instanceof ApiError ? error.message : 'Failed to create task';
      errorStore.set(message);
      throw error;
    } finally {
      loadingStore.set(false);
    }
  },

  // Update an existing task
  async updateTask(data: UpdateTaskData) {
    const currentTasks = get(tasksStore);
    
    // Optimistic update
    const optimisticTasks = apiService.optimisticUpdate(
      currentTasks,
      data.id,
      (task) => ({ 
        ...task, 
        ...data,
        // Handle File objects by keeping the existing photo URL during optimistic update
        photo: data.photo instanceof File ? task.photo : data.photo
      })
    );
    tasksStore.set(optimisticTasks);

    try {
      const updatedTask = await apiService.updateTask(data);
      tasksStore.update(tasks => 
        apiService.optimisticUpdate(tasks, data.id, () => updatedTask)
      );
      return updatedTask;
    } catch (error) {
      // Revert optimistic update on error
      tasksStore.set(currentTasks);
      console.error('Failed to update task:', error);
      const message = error instanceof ApiError ? error.message : 'Failed to update task';
      errorStore.set(message);
      throw error;
    }
  },

  // Delete a task
  async deleteTask(id: string) {
    const currentTasks = get(tasksStore);
    
    // Optimistic update
    const optimisticTasks = apiService.optimisticDelete(currentTasks, id);
    tasksStore.set(optimisticTasks);

    try {
      await apiService.deleteTask(id);
    } catch (error) {
      // Revert optimistic update on error
      tasksStore.set(currentTasks);
      console.error('Failed to delete task:', error);
      const message = error instanceof ApiError ? error.message : 'Failed to delete task';
      errorStore.set(message);
      throw error;
    }
  },

  // Toggle task completion
  async toggleTaskCompletion(id: string) {
    const currentTasks = get(tasksStore);
    const task = currentTasks.find(t => t.id === id);
    
    if (!task) return;

    return this.updateTask({
      id,
      completed: !task.completed,
      status: !task.completed ? TaskStatus.DONE : TaskStatus.TODO
    });
  },

  // Change task status
  async changeTaskStatus(id: string, status: TaskStatus) {
    return this.updateTask({
      id,
      status,
      completed: status === TaskStatus.DONE
    });
  }
};

// Filter and view actions
export const viewActions = {
  setFilter(filter: Partial<TaskFilter>) {
    filterStore.update(current => ({ ...current, ...filter }));
  },

  clearFilter() {
    filterStore.set({
      status: undefined,
      priority: undefined,
      completed: undefined,
      search: '',
    });
  },

  setSort(sort: TaskSort) {
    sortStore.set(sort);
  },

  setViewMode(viewMode: ViewMode) {
    viewModeStore.set(viewMode);
  }
};

// Note: Theme initialization has been moved to the professional theme service
// See: src/lib/services/theme.ts and src/lib/contexts/theme.ts
