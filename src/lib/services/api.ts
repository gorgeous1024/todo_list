import type { Task, CreateTaskData, UpdateTaskData, ApiResponse } from '../types/index.js';
import { API_CONFIG } from '../config/index.js';

class ApiError extends Error {
  constructor(public status: number, message: string, public data?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_CONFIG.BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new ApiError(response.status, errorData.message || `HTTP ${response.status}`, errorData);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }

    return response.text() as any;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const config = { ...defaultOptions, ...options };

    try {
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
      
      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError(408, 'Request timeout', error);
      }
      throw new ApiError(0, 'Network error occurred', error);
    }
  }

  // Task API methods

  async getTasks(): Promise<Task[]> {
    return this.request<Task[]>('/tasks/');
  }

  async getTask(id: string): Promise<Task> {
    return this.request<Task>(`/tasks/${id}/`);
  }

  async createTask(data: CreateTaskData): Promise<Task> {
    const formData = new FormData();
    
    formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.due_date) formData.append('due_date', data.due_date);
    if (data.photo) formData.append('photo', data.photo);
    if (data.priority) formData.append('priority', data.priority);
    if (data.status) formData.append('status', data.status);

    return this.request<Task>('/tasks/', {
      method: 'POST',
      headers: {
        // Remove Content-Type to let browser set boundary for FormData
      },
      body: formData,
    });
  }

  async updateTask(data: UpdateTaskData): Promise<Task> {
    const formData = new FormData();
    
    if (data.title) formData.append('title', data.title);
    if (data.description !== undefined) formData.append('description', data.description);
    if (data.due_date !== undefined) formData.append('due_date', data.due_date || '');
    if (data.photo) formData.append('photo', data.photo);
    if (data.priority) formData.append('priority', data.priority);
    if (data.status) formData.append('status', data.status);
    if (data.completed !== undefined) formData.append('completed', data.completed.toString());

    return this.request<Task>(`/tasks/${data.id}/`, {
      method: 'PUT',
      headers: {
        // Remove Content-Type to let browser set boundary for FormData
      },
      body: formData,
    });
  }

  async deleteTask(id: string): Promise<void> {
    return this.request<void>(`/tasks/${id}/`, {
      method: 'DELETE',
    });
  }

  async getNearestDeadlineTask(): Promise<Task | null> {
    try {
      return await this.request<Task>('/tasks/nearest-deadline/');
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return null;
      }
      throw error;
    }
  }

  // Utility methods for optimistic updates

  optimisticUpdate<T>(
    currentData: T[],
    id: string,
    updater: (item: T) => T,
    identifier: keyof T = 'id' as keyof T
  ): T[] {
    return currentData.map(item => 
      item[identifier] === id ? updater(item) : item
    );
  }

  optimisticDelete<T>(
    currentData: T[],
    id: string,
    identifier: keyof T = 'id' as keyof T
  ): T[] {
    return currentData.filter(item => item[identifier] !== id);
  }

  optimisticAdd<T>(currentData: T[], newItem: T): T[] {
    return [newItem, ...currentData];
  }
}

// Create and export singleton instance
export const apiService = new ApiService();
export { ApiError };
export default apiService;
