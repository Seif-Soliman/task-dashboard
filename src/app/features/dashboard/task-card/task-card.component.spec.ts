import { TestBed } from '@angular/core/testing';

import { TaskCardComponent } from './task-card.component';
import { makeTask } from '../../../core/utils/task.utils.spec';
import { provideZonelessChangeDetection } from '@angular/core';

describe('TaskCardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskCardComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
  });

  function render(overrides = {}) {
    const fixture = TestBed.createComponent(TaskCardComponent);
    fixture.componentRef.setInput('task', makeTask(overrides));
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('flags overdue tasks', () => {
    const el = render({ dueDate: '2000-01-01' });
    expect(el.querySelector('.card')?.classList).toContain('overdue');
    expect(el.textContent).toContain('Overdue by');
  });

  it('shows priority and the assignee first name', () => {
    const el = render({ priority: 'high' });
    expect(el.querySelector('.priority')?.textContent).toContain('high');
    expect(el.textContent).toContain('@John');
  });
});
