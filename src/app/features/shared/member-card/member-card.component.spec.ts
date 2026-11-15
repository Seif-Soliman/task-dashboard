import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MemberCardComponent } from './member-card.component';
import { makeTask } from '../../../core/utils/task.utils.spec';

describe('MemberCardComponent', () => {
  function render(stats: { open: number; done: number; overdue: number }) {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
    const fixture = TestBed.createComponent(MemberCardComponent);
    fixture.componentRef.setInput('member', { user: makeTask().assignee, ...stats });
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('shows the member and their task counts', () => {
    const el = render({ open: 3, done: 1, overdue: 2 });
    expect(el.textContent).toContain('John Doe');
    expect(el.textContent).toContain('3 open');
    expect(el.textContent).toContain('1 done');
    expect(el.querySelector('.alert')?.textContent).toContain('2 overdue');
  });

  it('does not flag overdue when there is none', () => {
    expect(render({ open: 1, done: 0, overdue: 0 }).querySelector('.alert')).toBeNull();
  });

  it('links to the dashboard filtered by this assignee', () => {
    const link = render({ open: 0, done: 0, overdue: 0 }).querySelector('a[mat-stroked-button]')!;
    expect(link.getAttribute('href')).toBe('/dashboard?assignee=user-001');
    expect(link.getAttribute('aria-label')).toBe('View tasks assigned to John Doe');
  });
});
