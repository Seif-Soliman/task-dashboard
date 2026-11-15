import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
    }).compileComponents();
  });
  it('renders every nav link and emits newTask', () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(SidebarComponent);
    const newTask = vi.fn();
    fixture.componentInstance.newTask.subscribe(newTask);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;

    expect(el.querySelectorAll('nav a').length).toBe(6);
    el.querySelector<HTMLButtonElement>('.new-task')!.click();
    expect(newTask).toHaveBeenCalled();
  });
});
