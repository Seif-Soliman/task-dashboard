import { TestBed } from '@angular/core/testing';
import { FilterBarComponent } from './filter-bar.component';
import { TaskFilters, DEFAULT_FILTERS } from '../task-filter/model/task-filters';

describe('FilterBarComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterBarComponent],
    }).compileComponents();
  });

  function setup(filters: TaskFilters = DEFAULT_FILTERS) {
    const fixture = TestBed.createComponent(FilterBarComponent);
    fixture.componentRef.setInput('filters', filters);
    const filterEvents: Partial<TaskFilters>[] = [];
    const newTask = vi.fn();
    fixture.componentInstance.filtersChange.subscribe((v) => filterEvents.push(v));
    fixture.componentInstance.newTask.subscribe(newTask);
    fixture.detectChanges();
    return { el: fixture.nativeElement as HTMLElement, filterEvents, newTask };
  }

  it('emits the selected status', () => {
    const { el, filterEvents } = setup();
    el.querySelectorAll<HTMLButtonElement>('.tab')[1].click();
    expect(filterEvents).toEqual([{ status: 'todo' }]);
  });

  it('marks the active status as pressed', () => {
    const { el } = setup({ ...DEFAULT_FILTERS, status: 'done' });
    const pressed = Array.from(el.querySelectorAll('.tab[aria-pressed="true"]'));
    expect(pressed.map((tab) => tab.textContent?.trim())).toEqual(['Done']);
  });

  it('emits newTask', () => {
    const { el, newTask } = setup();
    const button = Array.from(el.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('New Task'),
    );
    button!.click();
    expect(newTask).toHaveBeenCalled();
  });

  it('shows the clear button only when a filter is active', () => {
    expect(setup().el.textContent).not.toContain('Clear filters');
    expect(setup({ ...DEFAULT_FILTERS, priority: 'high' }).el.textContent).toContain(
      'Clear filters',
    );
  });
});
