import { TaskDraft, Task, TaskStatus } from '../../../core/models/task.model';

export function toDraft(task: Task): TaskDraft {
  const { title, description, status, priority, dueDate, assignee, tags } = task;
  return { title, description, status, priority, dueDate, assignee, tags };
}

export function buildNewTask(draft: TaskDraft, order: number, now = new Date()): Omit<Task, 'id'> {
  const iso = now.toISOString();
  return {
    ...draft,
    order,
    createdAt: iso,
    updatedAt: iso,
    ...(draft.status === 'done' ? { completedAt: iso } : {}),
  };
}

export function buildUpdatedTask(
  existing: Task,
  draft: TaskDraft,
  order: number,
  now = new Date(),
): Task {
  const iso = now.toISOString();
  const updated: Task = { ...existing, ...draft, order, updatedAt: iso };
  delete updated.isOverdue;
  if (draft.status === 'done') {
    updated.completedAt = existing.completedAt ?? iso;
  } else {
    delete updated.completedAt;
  }
  return updated;
}

/** A move is an update that only changes status and rank, so completedAt stays consistent. */
export function buildMovedTask(
  task: Task,
  status: TaskStatus,
  order: number,
  now = new Date(),
): Task {
  return buildUpdatedTask(task, { ...toDraft(task), status }, order, now);
}
