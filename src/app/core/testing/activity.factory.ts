import { Activity } from '../models/activity.model';
import { makeTask } from './task.factory';

export const makeActivity = (overrides: Partial<Activity> = {}): Activity => ({
  id: 'a1',
  type: 'created',
  taskId: 't1',
  taskTitle: 'Task',
  user: makeTask().assignee,
  createdAt: '2026-11-14T10:00:00.000Z',
  ...overrides,
});
