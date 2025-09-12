import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';
import { tasksStore, filterStore, sortStore, filteredAndSortedTasks, taskStats } from './tasks.js';
import { TaskStatus, TaskPriority } from '../types/index.js';
import type { Task } from '../types/index.js';

// Mock API service
vi.mock('../services/api.js', () => ({
	apiService: {
		getTasks: vi.fn(),
		createTask: vi.fn(),
		updateTask: vi.fn(),
		deleteTask: vi.fn(),
		optimisticUpdate: vi.fn(),
		optimisticDelete: vi.fn(),
		optimisticAdd: vi.fn(),
	}
}));

const mockTasks: Task[] = [
	{
		id: '1',
		title: 'Task 1',
		description: 'Description 1',
		status: TaskStatus.TODO,
		priority: TaskPriority.HIGH,
		completed: false,
		created_at: '2024-01-01T00:00:00Z',
		updated_at: '2024-01-01T00:00:00Z',
		due_date: '2024-12-31T23:59:59Z'
	},
	{
		id: '2',
		title: 'Task 2',
		description: 'Description 2',
		status: TaskStatus.IN_PROGRESS,
		priority: TaskPriority.MEDIUM,
		completed: false,
		created_at: '2024-01-02T00:00:00Z',
		updated_at: '2024-01-02T00:00:00Z'
	},
	{
		id: '3',
		title: 'Task 3',
		description: 'Description 3',
		status: TaskStatus.DONE,
		priority: TaskPriority.LOW,
		completed: true,
		created_at: '2024-01-03T00:00:00Z',
		updated_at: '2024-01-03T00:00:00Z'
	}
];

describe('Task Stores', () => {
	beforeEach(() => {
		// Reset stores
		tasksStore.set([]);
		filterStore.set({
			status: undefined,
			priority: undefined,
			completed: undefined,
			search: '',
		});
		sortStore.set({
			field: 'created_at',
			direction: 'desc'
		});
	});

	describe('tasksStore', () => {
		it('should initialize with empty array', () => {
			expect(get(tasksStore)).toEqual([]);
		});

		it('should update tasks correctly', () => {
			tasksStore.set(mockTasks);
			expect(get(tasksStore)).toEqual(mockTasks);
		});
	});

	describe('filteredAndSortedTasks', () => {
		beforeEach(() => {
			tasksStore.set(mockTasks);
		});

		it('should return all tasks when no filters applied', () => {
			const filtered = get(filteredAndSortedTasks);
			expect(filtered).toHaveLength(3);
		});

		it('should filter by status', () => {
			filterStore.update(f => ({ ...f, status: TaskStatus.TODO }));
			const filtered = get(filteredAndSortedTasks);
			expect(filtered).toHaveLength(1);
			expect(filtered[0].status).toBe(TaskStatus.TODO);
		});

		it('should filter by priority', () => {
			filterStore.update(f => ({ ...f, priority: TaskPriority.HIGH }));
			const filtered = get(filteredAndSortedTasks);
			expect(filtered).toHaveLength(1);
			expect(filtered[0].priority).toBe(TaskPriority.HIGH);
		});

		it('should filter by completion status', () => {
			filterStore.update(f => ({ ...f, completed: true }));
			const filtered = get(filteredAndSortedTasks);
			expect(filtered).toHaveLength(1);
			expect(filtered[0].completed).toBe(true);
		});

		it('should filter by search term', () => {
			filterStore.update(f => ({ ...f, search: 'Task 1' }));
			const filtered = get(filteredAndSortedTasks);
			expect(filtered).toHaveLength(1);
			expect(filtered[0].title).toBe('Task 1');
		});

		it('should sort by title ascending', () => {
			sortStore.set({ field: 'title', direction: 'asc' });
			const sorted = get(filteredAndSortedTasks);
			expect(sorted[0].title).toBe('Task 1');
			expect(sorted[1].title).toBe('Task 2');
			expect(sorted[2].title).toBe('Task 3');
		});

		it('should sort by priority descending', () => {
			sortStore.set({ field: 'priority', direction: 'desc' });
			const sorted = get(filteredAndSortedTasks);
			expect(sorted[0].priority).toBe(TaskPriority.HIGH);
			expect(sorted[1].priority).toBe(TaskPriority.MEDIUM);
			expect(sorted[2].priority).toBe(TaskPriority.LOW);
		});
	});

	describe('taskStats', () => {
		beforeEach(() => {
			tasksStore.set(mockTasks);
		});

		it('should calculate correct statistics', () => {
			const stats = get(taskStats);
			expect(stats.total).toBe(3);
			expect(stats.completed).toBe(1);
			expect(stats.pending).toBe(2);
			expect(stats.completionRate).toBe(33); // 1/3 * 100 = 33.33 -> 33
		});

		it('should handle empty task list', () => {
			tasksStore.set([]);
			const stats = get(taskStats);
			expect(stats.total).toBe(0);
			expect(stats.completed).toBe(0);
			expect(stats.pending).toBe(0);
			expect(stats.completionRate).toBe(0);
		});
	});
});
