// Type definitions for the Todo application

export interface Task {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  photo?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  status: TaskStatus;
  priority: TaskPriority;
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done'
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export interface CreateTaskData {
  title: string;
  description?: string;
  due_date?: string;
  photo?: File;
  priority?: TaskPriority;
  status?: TaskStatus;
}

export interface UpdateTaskData extends Partial<CreateTaskData> {
  id: string;
  completed?: boolean;
}

export interface TaskFilter {
  status?: TaskStatus;
  priority?: TaskPriority;
  completed?: boolean;
  search?: string;
  due_date_from?: string;
  due_date_to?: string;
}

export interface TaskSort {
  field: 'title' | 'created_at' | 'updated_at' | 'due_date' | 'priority';
  direction: 'asc' | 'desc';
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface ViewMode {
  type: 'list' | 'kanban' | 'grid';
  compact?: boolean;
}

export interface ThemeMode {
  mode: 'light' | 'dark' | 'system';
}

export interface AppState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  filter: TaskFilter;
  sort: TaskSort;
  viewMode: ViewMode;
  theme: ThemeMode;
}
