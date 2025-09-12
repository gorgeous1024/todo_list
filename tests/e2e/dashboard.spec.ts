import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
	test.beforeEach(async ({ page }) => {
		// Mock API responses
		await page.route('**/api/tasks/', async route => {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify([
					{
						id: '1',
						title: 'Sample Task',
						description: 'This is a sample task',
						status: 'todo',
						priority: 'medium',
						completed: false,
						created_at: '2024-01-01T00:00:00Z',
						updated_at: '2024-01-01T00:00:00Z'
					}
				])
			});
		});

		await page.route('**/api/tasks/nearest-deadline/', async route => {
			await route.fulfill({
				status: 404,
				contentType: 'application/json',
				body: JSON.stringify({ message: 'No tasks with deadlines found' })
			});
		});

		await page.goto('/');
	});

	test('should display dashboard title', async ({ page }) => {
		await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
	});

	test('should display stats cards', async ({ page }) => {
		await expect(page.getByText('Total Tasks')).toBeVisible();
		await expect(page.getByText('Completed')).toBeVisible();
		await expect(page.getByText('Pending')).toBeVisible();
		await expect(page.getByText('Overdue')).toBeVisible();
	});

	test('should display create task button', async ({ page }) => {
		await expect(page.getByRole('link', { name: 'Create Task' })).toBeVisible();
	});

	test('should display tasks when available', async ({ page }) => {
		await expect(page.getByText('Sample Task')).toBeVisible();
	});

	test('should navigate to task creation', async ({ page }) => {
		await page.getByRole('link', { name: 'Create Task' }).click();
		await expect(page).toHaveURL('/task/new');
	});

	test('should switch between view modes', async ({ page }) => {
		// Test view toggle buttons
		await expect(page.getByRole('button', { name: 'List' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Grid' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Board' })).toBeVisible();

		// Click grid view
		await page.getByRole('button', { name: 'Grid' }).click();
		// Verify the view changed (should still show the task)
		await expect(page.getByText('Sample Task')).toBeVisible();
	});

	test('should open filter panel', async ({ page }) => {
		await page.getByRole('button', { name: 'Filters' }).click();
		await expect(page.getByText('Status')).toBeVisible();
		await expect(page.getByText('Priority')).toBeVisible();
	});

	test('should search tasks', async ({ page }) => {
		const searchInput = page.getByPlaceholder('Search tasks...');
		await expect(searchInput).toBeVisible();
		
		await searchInput.fill('Sample');
		await expect(page.getByText('Sample Task')).toBeVisible();
		
		await searchInput.fill('Nonexistent');
		await expect(page.getByText('No tasks found')).toBeVisible();
	});
});

test.describe('Dark mode', () => {
	test('should toggle dark mode', async ({ page }) => {
		await page.goto('/');
		
		// Find and click the theme toggle button
		const themeButton = page.locator('button[title*="Toggle theme"]');
		await expect(themeButton).toBeVisible();
		
		// Check initial state (should be light by default)
		await expect(page.locator('html')).not.toHaveClass(/dark/);
		
		// Toggle to dark mode
		await themeButton.click();
		await expect(page.locator('html')).toHaveClass(/dark/);
		
		// Toggle back to light mode
		await themeButton.click();
		await expect(page.locator('html')).not.toHaveClass(/dark/);
	});
});

test.describe('Navigation', () => {
	test('should navigate between pages', async ({ page }) => {
		// Mock API for all pages
		await page.route('**/api/tasks/', async route => {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify([])
			});
		});

		await page.goto('/');

		// Navigate to Tasks page
		await page.getByRole('link', { name: 'Tasks' }).click();
		await expect(page).toHaveURL('/tasks');
		await expect(page.getByRole('heading', { name: 'All Tasks' })).toBeVisible();

		// Navigate to Kanban page
		await page.getByRole('link', { name: 'Kanban' }).click();
		await expect(page).toHaveURL('/kanban');
		await expect(page.getByRole('heading', { name: 'Kanban Board' })).toBeVisible();

		// Navigate back to Dashboard
		await page.getByRole('link', { name: 'Dashboard' }).click();
		await expect(page).toHaveURL('/');
		await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
	});
});
