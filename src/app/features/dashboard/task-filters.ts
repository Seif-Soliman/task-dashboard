import { Params } from '@angular/router';
import { TaskStatus, Task, TaskPriority } from '../../core/models/task.model';
import { TASK_STATUSES, TASK_PRIORITIES } from './task-options';

export type StatusFilter = TaskStatus | 'all';
export type PriorityFilter = TaskPriority | 'all';

export interface TaskFilters {
  status: StatusFilter;
  priority: PriorityFilter;
  /** Assignee id, or 'all'. */
  assignee: string;
  search: string;
}

export const DEFAULT_FILTERS: TaskFilters = {
  status: 'all',
  priority: 'all',
  assignee: 'all',
  search: '',
};

/** Returns `value` if it is one of `allowed`, otherwise `fallback`. Keeps URL input type-safe without casts. */
function parseOption<T extends string>(
  value: string | null,
  allowed: readonly T[],
  fallback: T,
): T {
  return allowed.find((option) => option === value) ?? fallback;
}

export const parseStatus = (value: string | null): StatusFilter =>
  parseOption<StatusFilter>(value, ['all', ...TASK_STATUSES], 'all');

export const parsePriority = (value: string | null): PriorityFilter =>
  parseOption<PriorityFilter>(value, ['all', ...TASK_PRIORITIES], 'all');

export function filterTasks(tasks: readonly Task[], filters: TaskFilters): Task[] {
  const term = filters.search.trim().toLowerCase();

  return tasks.filter(
    (task) =>
      (filters.status === 'all' || task.status === filters.status) &&
      (filters.priority === 'all' || task.priority === filters.priority) &&
      (filters.assignee === 'all' || task.assignee.id === filters.assignee) &&
      (!term ||
        task.title.toLowerCase().includes(term) ||
        task.description.toLowerCase().includes(term)),
  );
}

export function hasActiveFilters(filters: TaskFilters): boolean {
  return (Object.keys(DEFAULT_FILTERS) as (keyof TaskFilters)[]).some(
    (key) => filters[key] !== DEFAULT_FILTERS[key],
  );
}

/** Default values map to null so the router removes them from the URL. */
export function toQueryParams(filters: TaskFilters): Params {
  return {
    status: filters.status === 'all' ? null : filters.status,
    priority: filters.priority === 'all' ? null : filters.priority,
    assignee: filters.assignee === 'all' ? null : filters.assignee,
    q: filters.search.trim() || null,
  };
}
