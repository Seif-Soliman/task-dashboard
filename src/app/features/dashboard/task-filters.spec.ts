import { makeTask } from '../../core/utils/task.utils.spec';
import {
  DEFAULT_FILTERS,
  filterTasks,
  hasActiveFilters,
  parsePriority,
  parseStatus,
  toQueryParams,
} from './task-filters';

describe('task filters', () => {
  const tasks = [
    makeTask({ id: '1', title: 'Fix login bug', status: 'done', priority: 'high' }),
    makeTask({
      id: '2',
      title: 'Write docs',
      description: 'API payment docs',
      status: 'todo',
      priority: 'low',
      assignee: { id: 'u2', name: 'Sarah Smith', avatar: 'SS', email: 's@company.com' },
    }),
  ];
  const ids = (filters: Partial<typeof DEFAULT_FILTERS>) =>
    filterTasks(tasks, { ...DEFAULT_FILTERS, ...filters }).map((t) => t.id);

  it('returns everything by default', () => expect(ids({})).toEqual(['1', '2']));
  it('filters by status', () => expect(ids({ status: 'todo' })).toEqual(['2']));
  it('filters by priority', () => expect(ids({ priority: 'high' })).toEqual(['1']));
  it('filters by assignee', () => expect(ids({ assignee: 'u2' })).toEqual(['2']));
  it('searches titles and descriptions, ignoring case and whitespace', () => {
    expect(ids({ search: '  LOGIN ' })).toEqual(['1']);
    expect(ids({ search: 'payment' })).toEqual(['2']);
  });
  it('combines filters', () => expect(ids({ status: 'done', priority: 'low' })).toEqual([]));

  it('falls back to defaults for invalid URL values', () => {
    expect(parseStatus('bogus')).toBe('all');
    expect(parsePriority(null)).toBe('all');
    expect(parseStatus('in_progress')).toBe('in_progress');
  });

  it('detects active filters and omits defaults from the URL', () => {
    expect(hasActiveFilters(DEFAULT_FILTERS)).toBe(false);
    expect(hasActiveFilters({ ...DEFAULT_FILTERS, search: 'x' })).toBe(true);
    expect(toQueryParams({ ...DEFAULT_FILTERS, priority: 'high' })).toEqual({
      status: null,
      priority: 'high',
      assignee: null,
      q: null,
    });
  });
});
