import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { TaskFiltersService } from './task-filters.service';

describe('TaskFiltersService', () => {
  let service: TaskFiltersService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), TaskFiltersService],
    });
    service = TestBed.inject(TaskFiltersService);
    router = TestBed.inject(Router);
  });

  it('reads filters from the URL and ignores invalid values', async () => {
    await router.navigate([], { queryParams: { status: 'todo', priority: 'bogus', q: 'pay' } });
    expect(service.filters()).toEqual({
      status: 'todo',
      priority: 'all',
      assignee: 'all',
      search: 'pay',
    });
  });

  it('writes changes to the URL and drops defaults', async () => {
    await service.update({ priority: 'high' });
    expect(router.url).toBe('/?priority=high');

    await service.update({ priority: 'all' });
    expect(router.url).toBe('/');
  });

  it('clears every filter', async () => {
    await service.update({ status: 'done', search: 'x' });
    await service.clear();
    expect(router.url).toBe('/');
  });
});
