import { describe, it, expect } from 'vitest';
import {
	formatDate,
	formatRelativeTime,
	isOverdue,
	getDaysUntilDue,
	getPriorityColor,
	getStatusColor,
	validateImageFile,
	truncateText,
	capitalizeFirst,
	slugify
} from './index.js';
import { TaskPriority, TaskStatus } from '../types/index.js';

describe('Date utilities', () => {
	it('should format date correctly', () => {
		const date = '2024-01-15T10:30:00Z';
		const formatted = formatDate(date);
		expect(formatted).toMatch(/Jan 15, 2024/);
	});

	it('should detect overdue dates', () => {
		const yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		expect(isOverdue(yesterday.toISOString())).toBe(true);

		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		expect(isOverdue(tomorrow.toISOString())).toBe(false);
	});

	it('should calculate days until due correctly', () => {
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		expect(getDaysUntilDue(tomorrow.toISOString())).toBe(1);

		const yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		expect(getDaysUntilDue(yesterday.toISOString())).toBe(-1);
	});
});

describe('Priority utilities', () => {
	it('should return correct colors for priorities', () => {
		expect(getPriorityColor(TaskPriority.HIGH)).toContain('red');
		expect(getPriorityColor(TaskPriority.MEDIUM)).toContain('yellow');
		expect(getPriorityColor(TaskPriority.LOW)).toContain('green');
	});
});

describe('Status utilities', () => {
	it('should return correct colors for statuses', () => {
		expect(getStatusColor(TaskStatus.TODO)).toContain('gray');
		expect(getStatusColor(TaskStatus.IN_PROGRESS)).toContain('blue');
		expect(getStatusColor(TaskStatus.DONE)).toContain('green');
	});
});

describe('File validation', () => {
	it('should validate image files correctly', () => {
		// Mock valid image file
		const validFile = new File([''], 'image.jpg', { type: 'image/jpeg' });
		Object.defineProperty(validFile, 'size', { value: 1024 * 1024 }); // 1MB
		
		const result = validateImageFile(validFile);
		expect(result.valid).toBe(true);
	});

	it('should reject non-image files', () => {
		const textFile = new File([''], 'document.txt', { type: 'text/plain' });
		const result = validateImageFile(textFile);
		expect(result.valid).toBe(false);
		expect(result.error).toContain('image');
	});

	it('should reject files that are too large', () => {
		const largeFile = new File([''], 'image.jpg', { type: 'image/jpeg' });
		Object.defineProperty(largeFile, 'size', { value: 10 * 1024 * 1024 }); // 10MB
		
		const result = validateImageFile(largeFile);
		expect(result.valid).toBe(false);
		expect(result.error).toContain('5MB');
	});
});

describe('Text utilities', () => {
	it('should truncate text correctly', () => {
		const longText = 'This is a very long text that should be truncated';
		expect(truncateText(longText, 10)).toBe('This is a ...');
		expect(truncateText('Short', 10)).toBe('Short');
	});

	it('should capitalize first letter', () => {
		expect(capitalizeFirst('hello')).toBe('Hello');
		expect(capitalizeFirst('HELLO')).toBe('HELLO');
		expect(capitalizeFirst('')).toBe('');
	});

	it('should create slugs correctly', () => {
		expect(slugify('Hello World!')).toBe('hello-world');
		expect(slugify('Test & Title')).toBe('test-title');
		expect(slugify('Multiple   Spaces')).toBe('multiple-spaces');
	});
});
