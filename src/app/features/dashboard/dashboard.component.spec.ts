import { TestBed } from '@angular/core/testing';
import { makeTask } from '../../core/utils/task.utils.spec';
import { StatisticsService } from './stat-card/statistics.service';
import { TasksService } from '../task/tasks.service';
import { Dashboard } from './dashboard.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { TaskDeleteService } from '../task/task-delete/task-delete.service';
import { BoardColumnComponent } from './board-column/board-column.component';
import { UsersService } from './users.service';
import { signal } from '@angular/core';

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
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();
  });

  it('groups tasks into columns with counts, overdue first', () => {
    const tasks = [
      makeTask({ id: 'a', title: 'Upcoming', status: 'todo', priority: 'high', order: 2000 }),
      makeTask({
        id: 'b',
        title: 'Overdue task',
        status: 'todo',
        priority: 'low',
        dueDate: '2000-01-01',
        order: 1000,
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

  it('asks the delete service to delete a task when a column requests removal', () => {
    const task = makeTask({ id: 'a' });
    const taskDelete = { delete: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: StatisticsService, useValue: { statistics: resourceStub([]) } },
        { provide: TasksService, useValue: { tasks: resourceStub([task]) } },
        { provide: UsersService, useValue: { users: resourceStub([]) } },
        { provide: TaskDeleteService, useValue: taskDelete },
      ],
    });
    const fixture = TestBed.createComponent(Dashboard);
    fixture.detectChanges();

    const column = fixture.debugElement.query(By.directive(BoardColumnComponent));
    (column.componentInstance as BoardColumnComponent).remove.emit(task);

    expect(taskDelete.delete).toHaveBeenCalledWith(task);
  });
});
