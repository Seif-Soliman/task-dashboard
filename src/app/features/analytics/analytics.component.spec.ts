import { ComponentFixture, TestBed } from '@angular/core/testing';
import { makeTask } from '../../core/utils/task.utils.spec';
import { CHART_FACTORY } from '../shared/chart/chart.component';
import { TasksService } from '../task/tasks.service';
import { AnalyticsComponent } from './analytics.component';
import { signal } from '@angular/core';

describe('Analytics', () => {
  let fixture: ComponentFixture<AnalyticsComponent>;
  let tasksServiceMock: { tasks: Record<string, unknown> };

  beforeEach(async () => {
    tasksServiceMock = { tasks: {} };

    await TestBed.configureTestingModule({
      imports: [AnalyticsComponent],
      providers: [
        { provide: TasksService, useValue: tasksServiceMock },
        {
          provide: CHART_FACTORY,
          useValue: () => ({ data: {}, options: {}, update: vi.fn(), destroy: vi.fn() }),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AnalyticsComponent);
  });

  function render(resource: Record<string, unknown>) {
    tasksServiceMock.tasks = resource;
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  const resourceOf = (overrides: Record<string, unknown> = {}) => ({
    value: signal([
      makeTask({ id: '1', status: 'todo', priority: 'high' }),
      makeTask({ id: '2', status: 'done', priority: 'high' }),
      makeTask({ id: '3', status: 'done', priority: 'low' }),
    ]),
    hasValue: signal(true),
    isLoading: signal(false),
    error: signal<unknown>(undefined),
    reload: vi.fn(),
    ...overrides,
  });

  it('shows a card per distribution with its counts', () => {
    const el = render(resourceOf());
    const cards = el.querySelectorAll('app-chart-card');
    const counts = (card: Element) =>
      Array.from(card.querySelectorAll('.legend strong')).map((s) => s.textContent);

    expect(cards.length).toBe(2);
    expect(counts(cards[0])).toEqual(['2', '0', '1']); // priority: high, medium, low
    expect(counts(cards[1])).toEqual(['1', '0', '2']); // status: todo, in progress, done
  });

  it('labels each chart for assistive tech', () => {
    const el = render(resourceOf());
    expect(el.querySelector('canvas')?.getAttribute('aria-label')).toBe(
      'Tasks by priority: High 2, Medium 0, Low 1',
    );
  });

  it('shows skeletons while loading', () => {
    const el = render(resourceOf({ isLoading: signal(true) }));
    expect(el.querySelectorAll('.skeleton').length).toBe(2);
    expect(el.querySelector('app-chart-card')).toBeNull();
  });

  it('shows a retryable error', () => {
    const reload = vi.fn();
    const el = render(
      resourceOf({ error: signal(new Error('boom')), hasValue: signal(false), reload }),
    );

    expect(el.querySelector('[role="alert"]')).not.toBeNull();
    el.querySelector('button')!.click();
    expect(reload).toHaveBeenCalled();
  });

  it('explains when there is nothing to chart', () => {
    const el = render(resourceOf({ value: signal([]) }));
    expect(el.textContent).toContain('There are no tasks to analyze yet.');
  });
});
