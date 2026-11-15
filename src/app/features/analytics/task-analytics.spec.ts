import { makeTask } from '../../core/utils/task.utils.spec';
import {
  countByPriority,
  countByStatus,
  prioritySlices,
  statusSlices,
  toChartData,
} from './task-analytics';

describe('task analytics', () => {
  const t = (key: string) => key;
  const tasks = [
    makeTask({ id: '1', status: 'todo', priority: 'high' }),
    makeTask({ id: '2', status: 'todo', priority: 'low' }),
    makeTask({ id: '3', status: 'done', priority: 'high' }),
  ];

  it('counts by status, including empty statuses', () => {
    expect(countByStatus(tasks)).toEqual({ todo: 2, in_progress: 0, done: 1 });
  });

  it('counts by priority, including empty priorities', () => {
    expect(countByPriority(tasks)).toEqual({ high: 2, medium: 0, low: 1 });
  });

  it('builds labelled slices in board order', () => {
    expect(statusSlices(tasks, t).map((s) => [s.label, s.value])).toEqual([
      [
        ['status.todo', 2],
        ['status.in_progress', 0],
        ['status.done', 1],
      ],
    ]);
  });

  it('converts slices to chart data', () => {
    const data = toChartData(prioritySlices(tasks, t), 'Tasks');
    expect(data.labels).toEqual(['priority.high', 'priority.medium', 'priority.low']);
    expect(data.datasets[0].data).toEqual([2, 0, 1]);
    expect(data.datasets[0].backgroundColor).toEqual(['#d32f2f', '#ef6c00', '#388e3c']);
  });

  it('handles an empty task list', () => {
    expect(countByStatus([])).toEqual({ todo: 0, in_progress: 0, done: 0 });
  });
});
