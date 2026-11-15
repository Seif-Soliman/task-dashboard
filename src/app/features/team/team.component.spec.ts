import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { makeActivity } from '../../core/testing/activity.factory';
import { makeTask } from '../../core/utils/task.utils.spec';
import { UsersService } from '../dashboard/users.service';
import { TasksService } from '../task/tasks.service';
import { TeamComponent } from './team.component';
import { ActivityFeedService } from './activity-feed.service';
import { signal } from '@angular/core';

const resourceOf = <T>(value: T, overrides: Record<string, unknown> = {}) => ({
  value: signal(value),
  hasValue: signal(true),
  isLoading: signal(false),
  error: signal<unknown>(undefined),
  reload: vi.fn(),
  ...overrides,
});

type ResourceType<T> = ReturnType<typeof resourceOf<T>>;

describe('TeamComponent', () => {
  const u1 = makeTask().assignee;
  const u2 = { id: 'u2', name: 'Sarah Smith', avatar: 'SS', email: 's@company.com' };

  let fixture: ComponentFixture<TeamComponent>;
  let usersServiceMock: { users: ResourceType<(typeof u1)[]> };
  let tasksServiceMock: { tasks: ResourceType<ReturnType<typeof makeTask>[]> };
  let activityFeedServiceMock: { activities: ResourceType<ReturnType<typeof makeActivity>[]> };

  beforeEach(async () => {
    usersServiceMock = { users: resourceOf([u1, u2]) };
    tasksServiceMock = {
      tasks: resourceOf([
        makeTask({ id: '1', status: 'todo' }),
        makeTask({ id: '2', status: 'in_progress' }),
        makeTask({ id: '3', status: 'done' }),
      ]),
    };
    activityFeedServiceMock = {
      activities: resourceOf([makeActivity({ taskTitle: 'Fix bug' })]),
    };

    await TestBed.configureTestingModule({
      imports: [TeamComponent],
      providers: [
        provideRouter([]),
        { provide: UsersService, useValue: usersServiceMock },
        { provide: TasksService, useValue: tasksServiceMock },
      ],
    }).compileComponents();

    TestBed.overrideComponent(TeamComponent, {
      set: { providers: [{ provide: ActivityFeedService, useValue: activityFeedServiceMock }] },
    });

    fixture = TestBed.createComponent(TeamComponent);
  });

  function render(
    options: {
      users?: ResourceType<unknown>;
      tasks?: ResourceType<unknown>;
      feed?: ResourceType<unknown>;
    } = {},
  ) {
    const users = options.users ?? resourceOf([u1, u2]);
    const tasks =
      options.tasks ??
      resourceOf([
        makeTask({ id: '1', status: 'todo' }),
        makeTask({ id: '2', status: 'in_progress' }),
        makeTask({ id: '3', status: 'done' }),
      ]);
    const feed = options.feed ?? resourceOf([makeActivity({ taskTitle: 'Fix bug' })]);

    usersServiceMock.users = users as ResourceType<(typeof u1)[]>;
    tasksServiceMock.tasks = tasks as ResourceType<ReturnType<typeof makeTask>[]>;
    activityFeedServiceMock.activities = feed as ResourceType<ReturnType<typeof makeActivity>[]>;

    fixture.detectChanges();
    return { el: fixture.nativeElement as HTMLElement, users, tasks, feed };
  }

  it('lists members with their task counts', () => {
    const { el } = render();
    const cards = el.querySelectorAll('app-member-card');

    expect(cards.length).toBe(2);
    expect(cards[0].textContent).toContain('2 open');
    expect(cards[0].textContent).toContain('1 done');
    expect(cards[1].textContent).toContain('0 open');
  });

  it('shows recent activity', () => {
    const { el } = render();
    expect(el.querySelector('app-activity-list')?.textContent).toContain('Fix bug');
  });

  it('shows skeletons while members load', () => {
    const { el } = render({ users: resourceOf([u1], { isLoading: signal(true) }) });
    expect(el.querySelectorAll('.members .skeleton').length).toBe(4);
    expect(el.querySelector('app-member-card')).toBeNull();
  });

  it('retries loading the members from the error state', () => {
    const users = resourceOf([u1], { error: signal(new Error('boom')), hasValue: signal(false) });
    const tasks = resourceOf([]);
    const { el } = render({ users, tasks });

    el.querySelector<HTMLButtonElement>('app-error-state button')!.click();
    expect(users.reload).toHaveBeenCalled();
    expect(tasks.reload).toHaveBeenCalled();
  });

  it('keeps the members visible when only the feed fails', () => {
    const { el } = render({
      feed: resourceOf([], { error: signal(new Error('boom')), hasValue: signal(false) }),
    });

    expect(el.querySelectorAll('app-member-card').length).toBe(2);
    expect(el.querySelector('.activity [role="alert"]')?.textContent).toContain('recent activity');
  });
});
