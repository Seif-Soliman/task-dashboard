import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HeaderComponent } from './header.component';
import { makeTask } from '../../core/testing/task.factory';

describe('HeaderComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
    }).compileComponents();
  });

  function setup() {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
    const fixture = TestBed.createComponent(HeaderComponent);
    const emitted: string[] = [];
    fixture.componentInstance.searchChange.subscribe((v) => emitted.push(v));
    fixture.componentRef.setInput('user', makeTask().assignee);
    fixture.detectChanges();
    const input = (fixture.nativeElement as HTMLElement).querySelector('input')!;
    return { fixture, input, emitted };
  }

  afterEach(() => vi.useRealTimers());

  it('emits the trimmed search term after the debounce', () => {
    vi.useFakeTimers();
    const { input, emitted } = setup();
    input.value = ' pay ';
    input.dispatchEvent(new Event('input'));

    vi.advanceTimersByTime(100);
    expect(emitted).toEqual([]);
    vi.advanceTimersByTime(150);
    expect(emitted).toEqual(['pay']);
  });

  it('shows an externally provided search term without emitting it', () => {
    const { fixture, input, emitted } = setup();
    fixture.componentRef.setInput('search', 'payment');
    fixture.detectChanges();

    expect(input.value).toBe('payment');
    expect(emitted).toEqual([]);
  });

  it('shows the menu button only in compact mode', () => {
    const { fixture } = setup();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('[aria-label="Toggle navigation"]')).toBeNull();

    fixture.componentRef.setInput('showMenuButton', true);
    fixture.detectChanges();
    expect(el.querySelector('[aria-label="Toggle navigation"]')).not.toBeNull();
  });

  it('shows the signed-in user', () => {
    const { fixture } = setup();
    const avatar = (fixture.nativeElement as HTMLElement).querySelector('.avatar')!;
    expect(avatar.textContent).toContain('JD');
    expect(avatar.getAttribute('aria-label')).toBe('Signed in as John Doe');
  });
});
