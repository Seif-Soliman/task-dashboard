import { TaskDraft } from '../../../core/models/task.model';
import { makeTask } from '../../../core/utils/task.utils.spec';
import { buildNewTask, buildUpdatedTask } from './task-builders';

const now = new Date('2026-11-14T10:00:00.000Z');
const iso = now.toISOString();

function draftOf(overrides: Partial<TaskDraft> = {}): TaskDraft {
  const t = makeTask();
  return {
    title: t.title,
    description: t.description,
    status: t.status,
    priority: t.priority,
    dueDate: t.dueDate,
    assignee: t.assignee,
    tags: t.tags,
    ...overrides,
  };
}

describe('task builders', () => {
  it('stamps new tasks with timestamps', () => {
    const task = buildNewTask(draftOf(), now);
    expect(task).toMatchObject({ createdAt: iso, updatedAt: iso });
    expect(task.completedAt).toBeUndefined();
  });

  it('sets completedAt for tasks created as done', () => {
    expect(buildNewTask(draftOf({ status: 'done' }), now).completedAt).toBe(iso);
  });

  it('keeps identity and creation time on update and drops the stale isOverdue flag', () => {
    const existing = makeTask({ id: 'x', isOverdue: true, createdAt: '2026-01-01T00:00:00.000Z' });
    const updated = buildUpdatedTask(existing, draftOf({ title: 'Renamed' }), now);
    expect(updated).toMatchObject({
      id: 'x',
      title: 'Renamed',
      createdAt: existing.createdAt,
      updatedAt: iso,
    });
    expect('isOverdue' in updated).toBe(false);
  });

  it('keeps the original completedAt while the task stays done', () => {
    const existing = makeTask({ status: 'done', completedAt: '2026-11-01T00:00:00.000Z' });
    expect(buildUpdatedTask(existing, draftOf({ status: 'done' }), now).completedAt).toBe(
      '2026-11-01T00:00:00.000Z',
    );
  });

  it('clears completedAt when a done task is reopened', () => {
    const existing = makeTask({ status: 'done', completedAt: '2026-11-01T00:00:00.000Z' });
    expect('completedAt' in buildUpdatedTask(existing, draftOf({ status: 'todo' }), now)).toBe(
      false,
    );
  });
});
