import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { ShellComponent } from './shell.component';

describe('ShellComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShellComponent],
    }).compileComponents();
  });

  it('sends the header search to the dashboard url', async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: 'dashboard', children: [] }])],
    });
    const fixture = TestBed.createComponent(ShellComponent);
    fixture.detectChanges();

    const header = fixture.debugElement.query(By.directive(HeaderComponent))
      .componentInstance as HeaderComponent;
    header.searchChange.emit('pay');
    await fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe('/dashboard?q=pay');
  });
});
