import { makeTask } from '../../core/utils/task.utils.spec';
import { memberStats } from './team-stats';

describe('memberStats', () => {
  const now = new Date(2026, 10, 14, 12);
  const u1 = makeTask().assignee;
  const u2 = { id: 'u2', name: 'Sarah Smith', avatar: 'SS', email: 's@company.com' };
  const tasks = [
    makeTask({ id: '1', status: 'todo', dueDate: '2026-11-01' }), // overdue
    makeTask({ id: '2', status: 'in_progress', dueDate: '2026-11-30' }),
    makeTask({ id: '3', status: 'done', dueDate: '2026-11-01' }), // done is never overdue
  ];

  it('counts open, done and overdue tasks per member', () => {
    expect(memberStats([u1, u2], tasks, now)).toEqual([
      { user: u1, open: 2, done: 1, overdue: 1 },
      { user: u2, open: 0, done: 0, overdue: 0 },
    ]);
  });

  it('returns nothing without members', () => {
    expect(memberStats([], tasks, now)).toEqual([]);
  });
});
