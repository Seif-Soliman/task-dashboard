import { TestBed } from '@angular/core/testing';
import { makeActivity } from '../../core/testing/activity.factory';
import { ActivityListComponent } from './activity-list.component';
import { Activity } from '../../core/models/activity.model';

describe('ActivityListComponent', () => {
  function render(activities: Activity[]) {
    const fixture = TestBed.createComponent(ActivityListComponent);
    fixture.componentRef.setInput('activities', activities);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('describes who did what to which task', () => {
    const text = render([makeActivity({ type: 'created', taskTitle: 'Fix bug' })]).textContent;
    expect(text).toContain('John Doe');
    expect(text).toContain('created');
    expect(text).toContain('Fix bug');
  });

  it('names the destination for moves', () => {
    const text = render([
      makeActivity({ type: 'moved', from: 'todo', to: 'in_progress' }),
    ]).textContent;
    expect(text).toContain('moved');
    expect(text).toContain('to In Progress');
  });

  it('marks up the time for assistive tech', () => {
    const time = render([makeActivity()]).querySelector('time')!;
    expect(time.getAttribute('datetime')).toBe('2026-11-14T10:00:00.000Z');
  });

  it('shows an empty state', () => {
    expect(render([]).textContent).toContain('No activity yet.');
  });
});
