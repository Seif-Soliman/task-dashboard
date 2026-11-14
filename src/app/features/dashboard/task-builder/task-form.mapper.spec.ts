import { makeTask } from '../../../core/utils/task.utils.spec';
import { toFormValue, toTaskDraft } from './task-form.mapper';

describe('task form mapper', () => {
  it('maps a task to form values and back', () => {
    const task = makeTask({ dueDate: '2026-11-20', tags: ['Design', 'UI'] });
    const draft = toTaskDraft(toFormValue(task), task.assignee);
    expect(draft).toMatchObject({
      title: task.title,
      dueDate: '2026-11-20',
      tags: ['Design', 'UI'],
    });
  });

  it('trims text and drops empty tags', () => {
    const task = makeTask();
    const value = { ...toFormValue(task), title: '  Spaced  ', tags: [' a ', '  '] };
    expect(toTaskDraft(value, task.assignee)).toMatchObject({ title: 'Spaced', tags: ['a'] });
  });
});
