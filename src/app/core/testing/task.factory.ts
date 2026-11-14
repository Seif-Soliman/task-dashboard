import { Task } from '../models/task.model';

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
