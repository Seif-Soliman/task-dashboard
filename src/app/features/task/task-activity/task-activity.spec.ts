import { makeTask } from '../../../core/utils/task.utils.spec';
import { activityForChange, activityForCreate, activityForDelete } from './task-activity';

describe('task activity', () => {
  const now = new Date('2026-11-14T10:00:00.000Z');
  const user = makeTask().assignee;
  const task = makeTask({ id: 't1', title: 'Fix bug', status: 'todo' });

  it('logs creation', () => {
    expect(activityForCreate(task, user, now)).toEqual({
      type: 'created',
      taskId: 't1',
      taskTitle: 'Fix bug',
      user,
      createdAt: now.toISOString(),
    });
  });

  it('logs deletion', () => {
    expect(activityForDelete(task, user, now).type).toBe('deleted');
  });

  it('logs an edit that keeps the status as updated', () => {
    const activity = activityForChange(task, { ...task, title: 'Renamed' }, user, now);
    expect(activity).toMatchObject({ type: 'updated', taskTitle: 'Renamed' });
    expect(activity.from).toBeUndefined();
  });

  it('logs a status change as moved with from and to', () => {
    expect(activityForChange(task, { ...task, status: 'in_progress' }, user, now)).toMatchObject({
      type: 'moved',
      from: 'todo',
      to: 'in_progress',
    });
  });

  it('logs moving to done as completed', () => {
    expect(activityForChange(task, { ...task, status: 'done' }, user, now)).toMatchObject({
      type: 'completed',
      from: 'todo',
      to: 'done',
    });
  });
});
