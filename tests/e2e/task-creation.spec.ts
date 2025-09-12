import { test, expect } from '@playwright/test';

test.describe('Task Creation', () => {
	test.beforeEach(async ({ page }) => {
		// Mock API create endpoint
		await page.route('**/api/tasks/', async (route, request) => {
			if (request.method() === 'POST') {
				await route.fulfill({
					status: 201,
					contentType: 'application/json',
					body: JSON.stringify({
						id: '123',
						title: 'New Task',
						description: 'Task description',
						status: 'todo',
						priority: 'medium',
						completed: false,
						created_at: '2024-01-01T00:00:00Z',
						updated_at: '2024-01-01T00:00:00Z'
					})
				});
			}
		});

		await page.goto('/task/new');
	});

	test('should display create task form', async ({ page }) => {
		await expect(page.getByRole('heading', { name: 'Create New Task' })).toBeVisible();
		await expect(page.getByLabelText('Title')).toBeVisible();
		await expect(page.getByLabelText('Description')).toBeVisible();
		await expect(page.getByLabelText('Due Date')).toBeVisible();
		await expect(page.getByLabelText('Priority')).toBeVisible();
		await expect(page.getByLabelText('Status')).toBeVisible();
	});

	test('should require title field', async ({ page }) => {
		// Try to submit without title
		await page.getByRole('button', { name: 'Create Task' }).click();
		
		// Check that form doesn't submit (should stay on same page)
		await expect(page).toHaveURL('/task/new');
	});

	test('should create task with valid data', async ({ page }) => {
		// Fill out the form
		await page.getByLabelText('Title').fill('Test Task');
		await page.getByLabelText('Description').fill('This is a test task');
		await page.getByLabelText('Priority').selectOption('high');
		await page.getByLabelText('Status').selectOption('todo');

		// Submit the form
		await page.getByRole('button', { name: 'Create Task' }).click();

		// Should redirect to task detail page
		await expect(page).toHaveURL('/task/123');
	});

	test('should validate title length', async ({ page }) => {
		const longTitle = 'a'.repeat(101); // 101 characters
		await page.getByLabelText('Title').fill(longTitle);
		
		// Move focus away to trigger validation
		await page.getByLabelText('Description').click();
		
		// Should show validation error
		await expect(page.getByText('Title must be 100 characters or less')).toBeVisible();
	});

	test('should validate description length', async ({ page }) => {
		const longDescription = 'a'.repeat(501); // 501 characters
		await page.getByLabelText('Description').fill(longDescription);
		
		// Move focus away to trigger validation
		await page.getByLabelText('Title').click();
		
		// Should show validation error
		await expect(page.getByText('Description must be 500 characters or less')).toBeVisible();
	});

	test('should cancel creation and return to dashboard', async ({ page }) => {
		await page.getByRole('button', { name: 'Cancel' }).click();
		await expect(page).toHaveURL('/');
	});

	test('should show character counters', async ({ page }) => {
		await expect(page.getByText('0/100 characters')).toBeVisible();
		await expect(page.getByText('0/500 characters')).toBeVisible();

		await page.getByLabelText('Title').fill('Test');
		await expect(page.getByText('4/100 characters')).toBeVisible();
	});

	test('should set due date', async ({ page }) => {
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		const dateString = tomorrow.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm

		await page.getByLabelText('Due Date').fill(dateString);
		
		// Verify the value was set
		const dateInput = page.getByLabelText('Due Date');
		await expect(dateInput).toHaveValue(dateString);
	});

	test('should handle image upload area', async ({ page }) => {
		// Check that upload area is visible
		await expect(page.getByText('Click to upload or drag and drop')).toBeVisible();
		await expect(page.getByText('PNG, JPG, GIF, WebP up to 5MB')).toBeVisible();
	});
});

test.describe('Task Creation with default status', () => {
	test('should set default status from URL parameter', async ({ page }) => {
		await page.goto('/task/new?status=in_progress');
		
		const statusSelect = page.getByLabelText('Status');
		await expect(statusSelect).toHaveValue('in_progress');
	});
});
