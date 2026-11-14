import { TestBed } from '@angular/core/testing';
import { FilterBarComponent } from './filter-bar.component';
import { TaskFilters, DEFAULT_FILTERS } from '../task-filter/model/task-filters';

describe('FilterBarComponent', () => {
  const emitted: Partial<TaskFilters>[] = [];

  function render(filters: TaskFilters = DEFAULT_FILTERS) {
    emitted.length = 0;
    const fixture = TestBed.createComponent(FilterBarComponent);
    fixture.componentRef.setInput('filters', filters);
    fixture.componentInstance.filtersChange.subscribe((v) => emitted.push(v));
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  afterEach(() => vi.useRealTimers());

  it('emits the selected status', () => {
    const el = render();
    el.querySelectorAll<HTMLButtonElement>('.mat-button-toggle-button')[1].click();
    expect(emitted).toEqual([{ status: 'todo' }]);
  });

  it('debounces search input', () => {
    vi.useFakeTimers();
    const el = render();
    const input = el.querySelector('input')!;
    input.value = 'pay';
    input.dispatchEvent(new Event('input'));

    vi.advanceTimersByTime(100);
    expect(emitted).toEqual([]);
    vi.advanceTimersByTime(150);
    expect(emitted).toEqual([{ search: 'pay' }]);
  });

  it('shows the clear button only when a filter is active', () => {
    expect(render().textContent).not.toContain('Clear filters');
    expect(render({ ...DEFAULT_FILTERS, priority: 'high' }).textContent).toContain('Clear filters');
  });
});
