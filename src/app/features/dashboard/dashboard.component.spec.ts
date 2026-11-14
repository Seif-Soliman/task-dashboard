import { provideZonelessChangeDetection, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { makeTask } from '../../core/utils/task.utils.spec';
import { StatisticsService } from './stat-card/statistics.service';
import { TasksService } from './task-card/tasks.service';
import { Dashboard } from './dashboard.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

const resourceStub = <T>(value: T) => ({
  value: signal(value),
  hasValue: signal(true),
  isLoading: signal(false),
  error: signal<unknown>(undefined),
  reload: vi.fn(),
});

describe('DashboardPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [provideRouter([]), provideHttpClient(), provideZonelessChangeDetection()],
    }).compileComponents();
  });

  it('groups tasks into columns with counts, overdue first', () => {
    const tasks = [
      makeTask({ id: 'a', title: 'Upcoming', status: 'todo', priority: 'high' }),
      makeTask({
        id: 'b',
        title: 'Overdue task',
        status: 'todo',
        priority: 'low',
        dueDate: '2000-01-01',
      }),
      makeTask({ id: 'c', title: 'In flight', status: 'in_progress' }),
    ];
    TestBed.configureTestingModule({
      providers: [
        { provide: StatisticsService, useValue: { statistics: resourceStub([]) } },
        { provide: TasksService, useValue: { tasks: resourceStub(tasks) } },
      ],
    });

    const fixture = TestBed.createComponent(Dashboard);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;

    const counts = Array.from(el.querySelectorAll('.count')).map((c) => c.textContent?.trim());
    expect(counts).toEqual(['2', '1', '0']);
    expect(el.querySelector('app-board-column h3')?.textContent?.trim()).toBe('Overdue task');
  });
});
