import { ActivityDraft } from '../../../core/models/activity.model';
import { Task, Assignee } from '../../../core/models/task.model';

function base(task: Task, user: Assignee, now: Date) {
  return { taskId: task.id, taskTitle: task.title, user, createdAt: now.toISOString() };
}

export const activityForCreate = (task: Task, user: Assignee, now = new Date()): ActivityDraft => ({
  ...base(task, user, now),
  type: 'created',
});

export const activityForDelete = (task: Task, user: Assignee, now = new Date()): ActivityDraft => ({
  ...base(task, user, now),
  type: 'deleted',
});

/** A status change is a move (or a completion); anything else is a plain update. */
export function activityForChange(
  previous: Task,
  next: Task,
  user: Assignee,
  now = new Date(),
): ActivityDraft {
  if (previous.status === next.status) {
    return { ...base(next, user, now), type: 'updated' };
  }
  return {
    ...base(next, user, now),
    type: next.status === 'done' ? 'completed' : 'moved',
    from: previous.status,
    to: next.status,
  };
}
