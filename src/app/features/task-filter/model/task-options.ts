import { TaskStatus, TaskPriority } from '../../../core/models/task.model';

export const TASK_STATUSES: readonly TaskStatus[] = ['todo', 'in_progress', 'done'];
export const TASK_PRIORITIES: readonly TaskPriority[] = ['high', 'medium', 'low'];

export const STATUS_KEYS: Record<TaskStatus, string> = {
  todo: 'status.todo',
  in_progress: 'status.in_progress',
  done: 'status.done',
};
export const PRIORITY_KEYS: Record<TaskPriority, string> = {
  high: 'priority.high',
  medium: 'priority.medium',
  low: 'priority.low',
};
