import type { ChartData } from 'chart.js';
import { TaskStatus, TaskPriority, Task } from '../../core/models/task.model';
import {
  TASK_STATUSES,
  TASK_PRIORITIES,
  STATUS_KEYS,
  PRIORITY_KEYS,
} from '../task-filter/model/task-options';
import { Translate } from '../../core/i18n/inject-t';

export interface Slice {
  label: string;
  value: number;
  color: string;
}

export const PRIORITY_COLORS: Record<TaskPriority, string> = {
  high: '#d32f2f',
  medium: '#ef6c00',
  low: '#388e3c',
};
export const STATUS_COLORS: Record<TaskStatus, string> = {
  todo: '#1976d2',
  in_progress: '#ff6f00',
  done: '#388e3c',
};

export function countByStatus(tasks: readonly Task[]): Record<TaskStatus, number> {
  const counts: Record<TaskStatus, number> = { todo: 0, in_progress: 0, done: 0 };
  for (const task of tasks) counts[task.status]++;
  return counts;
}

export function countByPriority(tasks: readonly Task[]): Record<TaskPriority, number> {
  const counts: Record<TaskPriority, number> = { high: 0, medium: 0, low: 0 };
  for (const task of tasks) counts[task.priority]++;
  return counts;
}

export function statusSlices(tasks: readonly Task[], t: Translate): Slice[] {
  const counts = countByStatus(tasks);
  return TASK_STATUSES.map((status) => ({
    label: t(STATUS_KEYS[status]),
    value: counts[status],
    color: STATUS_COLORS[status],
  }));
}

export function prioritySlices(tasks: readonly Task[], t: Translate): Slice[] {
  const counts = countByPriority(tasks);
  return TASK_PRIORITIES.map((priority) => ({
    label: t(PRIORITY_KEYS[priority]),
    value: counts[priority],
    color: PRIORITY_COLORS[priority],
  }));
}

export function toChartData(slices: readonly Slice[], datasetLabel: string): ChartData {
  return {
    labels: slices.map((slice) => slice.label),
    datasets: [
      {
        label: datasetLabel,
        data: slices.map((slice) => slice.value),
        backgroundColor: slices.map((slice) => slice.color),
        borderWidth: 0,
      },
    ],
  };
}
