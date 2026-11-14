import { Task } from '../models/task.model';
import { formatDateOnly, formatDueInfo, getDueInfo, parseDateOnly, sortTasks } from './task.utils';

const now = new Date(2026, 10, 13, 12);

export const makeTask = (overrides: Partial<Task> = {}): Task => ({
  id: 't1',
  title: 'Task',
  description: 'Description',
  status: 'todo',
  priority: 'medium',
  dueDate: '2026-11-20',
  assignee: { id: 'u1', name: 'John Doe', avatar: 'JD', email: 'john@company.com' },
  tags: ['Design'],
  createdAt: '2026-11-01T00:00:00.000Z',
  updatedAt: '2026-11-01T00:00:00.000Z',
  ...overrides,
});

describe('task utils', () => {
  it('marks past-due open tasks as overdue', () => {
    expect(getDueInfo(makeTask({ dueDate: '2026-11-11' }), now)).toEqual({
      kind: 'overdue',
      days: 2,
    });
  });

  it('treats a task due today as upcoming', () => {
    expect(getDueInfo(makeTask({ dueDate: '2026-11-13' }), now)).toEqual({
      kind: 'upcoming',
      days: 0,
    });
  });

  it('never marks done tasks as overdue', () => {
    const task = makeTask({
      status: 'done',
      dueDate: '2026-11-01',
      completedAt: new Date(2026, 10, 12, 9).toISOString(),
    });
    expect(getDueInfo(task, now)).toEqual({ kind: 'completed', days: 1 });
  });

  it('formats due labels', () => {
    expect(formatDueInfo({ kind: 'overdue', days: 2 })).toBe('Overdue by 2 days');
    expect(formatDueInfo({ kind: 'upcoming', days: 7 })).toBe('Due in 1 week');
    expect(formatDueInfo({ kind: 'completed', days: 0 })).toBe('Completed today');
  });

  it('sorts overdue first, then by priority', () => {
    const sorted = sortTasks(
      [
        makeTask({ id: 'low', priority: 'low' }),
        makeTask({ id: 'high', priority: 'high' }),
        makeTask({ id: 'overdue', priority: 'medium', dueDate: '2026-11-01' }),
      ],
      now,
    );
    expect(sorted.map((t) => t.id)).toEqual(['overdue', 'high', 'low']);
  });

  it('round-trips date-only strings', () => {
    expect(formatDateOnly(parseDateOnly('2026-11-05'))).toBe('2026-11-05');
  });
});
