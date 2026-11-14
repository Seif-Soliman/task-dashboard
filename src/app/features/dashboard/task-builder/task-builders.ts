import { TaskDraft, Task } from '../../../core/models/task.model';

export function buildNewTask(draft: TaskDraft, now = new Date()): Omit<Task, 'id'> {
  const iso = now.toISOString();
  return {
    ...draft,
    createdAt: iso,
    updatedAt: iso,
    ...(draft.status === 'done' ? { completedAt: iso } : {}),
  };
}

/**
 * Full replacement body for PUT. Drops the stale `isOverdue` seed field (overdue is computed on the client)
 * and keeps `completedAt` in sync with the status.
 */
export function buildUpdatedTask(existing: Task, draft: TaskDraft, now = new Date()): Task {
  const iso = now.toISOString();
  const updated: Task = { ...existing, ...draft, updatedAt: iso };
  delete updated.isOverdue;
  if (draft.status === 'done') {
    updated.completedAt = existing.completedAt ?? iso;
  } else {
    delete updated.completedAt;
  }
  return updated;
}
