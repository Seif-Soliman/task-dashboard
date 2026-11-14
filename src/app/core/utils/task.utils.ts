import { Task } from '../models/task.model';

export type DueInfo =
  | { kind: 'overdue'; days: number }
  | { kind: 'upcoming'; days: number }
  | { kind: 'completed'; days: number };

const MS_PER_DAY = 86_400_000;

export function parseDateOnly(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function formatDateOnly(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

/** Whole calendar days from `from` to `to` (positive when `to` is later). */
function daysBetween(from: Date, to: Date): number {
  return Math.round((startOfDay(to) - startOfDay(from)) / MS_PER_DAY);
}

export function getDueInfo(task: Task, now = new Date()): DueInfo {
  if (task.status === 'done') {
    const completedAt = task.completedAt ? new Date(task.completedAt) : now;
    return { kind: 'completed', days: Math.max(0, daysBetween(completedAt, now)) };
  }
  const days = daysBetween(now, parseDateOnly(task.dueDate));
  return days < 0 ? { kind: 'overdue', days: -days } : { kind: 'upcoming', days };
}

export function isOverdue(task: Task, now = new Date()): boolean {
  return getDueInfo(task, now).kind === 'overdue';
}

export function sortByOrder(tasks: readonly Task[]): Task[] {
  return [...tasks].sort((a, b) => a.order - b.order);
}

const plural = (count: number, unit: string) => `${count} ${unit}${count === 1 ? '' : 's'}`;

/** English labels for now; this becomes translation keys with params in the i18n branch. */
export function formatDueInfo({ kind, days }: DueInfo): string {
  if (kind === 'overdue') return `Overdue by ${plural(days, 'day')}`;
  if (kind === 'completed') {
    if (days === 0) return 'Completed today';
    return days === 1 ? 'Completed yesterday' : `Completed ${plural(days, 'day')} ago`;
  }
  if (days === 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';
  return days % 7 === 0 ? `Due in ${plural(days / 7, 'week')}` : `Due in ${plural(days, 'day')}`;
}
