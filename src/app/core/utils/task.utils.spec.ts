import { Task } from '../models/task.model';
import { formatDateOnly, getDueInfo, getDueLabel, parseDateOnly, sortByOrder } from './task.utils';

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
  order: 1000,
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

  it('describes due dates as translation keys', () => {
    expect(getDueLabel({ kind: 'overdue', days: 2 })).toEqual({
      key: 'task.due.overdueDays',
      count: 2,
    });
    expect(getDueLabel({ kind: 'upcoming', days: 7 })).toEqual({
      key: 'task.due.inWeeks',
      count: 1,
    });
    expect(getDueLabel({ kind: 'upcoming', days: 1 })).toEqual({ key: 'task.due.tomorrow' });
    expect(getDueLabel({ kind: 'completed', days: 0 })).toEqual({ key: 'task.due.completedToday' });
  });

  it('sorts by order', () => {
    const sorted = sortByOrder([
      makeTask({ id: 'b', order: 2000 }),
      makeTask({ id: 'a', order: 1000 }),
    ]);
    expect(sorted.map((t) => t.id)).toEqual(['a', 'b']);
  });

  it('round-trips date-only strings', () => {
    expect(formatDateOnly(parseDateOnly('2026-11-05'))).toBe('2026-11-05');
  });
});
