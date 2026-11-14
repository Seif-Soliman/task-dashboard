import { Assignee, Task } from '../../core/models/task.model';
import { isOverdue } from '../../core/utils/task.utils';

export interface MemberStats {
  user: Assignee;
  open: number;
  done: number;
  overdue: number;
}

export function memberStats(
  users: readonly Assignee[],
  tasks: readonly Task[],
  now = new Date(),
): MemberStats[] {
  return users.map((user) => {
    const mine = tasks.filter((task) => task.assignee.id === user.id);
    return {
      user,
      open: mine.filter((task) => task.status !== 'done').length,
      done: mine.filter((task) => task.status === 'done').length,
      overdue: mine.filter((task) => isOverdue(task, now)).length,
    };
  });
}
