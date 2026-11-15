import { TestBed } from '@angular/core/testing';
import { FilterMenuComponent } from './filter-menu.component';

describe('FilterMenuComponent', () => {
  const options = [
    { value: 'all', label: 'All priorities' },
    { value: 'high', label: 'High' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterMenuComponent],
    }).compileComponents();
  });

  function render(value: string) {
    const fixture = TestBed.createComponent<FilterMenuComponent<string>>(FilterMenuComponent);
    fixture.componentRef.setInput('label', 'Priority');
    fixture.componentRef.setInput('options', options);
    fixture.componentRef.setInput('value', value);
    fixture.detectChanges();
    return (fixture.nativeElement as HTMLElement).querySelector('button')!.textContent!;
  }

  it('shows only the label when nothing is selected', () => {
    expect(render('all')).toContain('Priority');
    expect(render('all')).not.toContain(':');
  });

  it('shows the selected option next to the label', () => {
    expect(render('high')).toContain('Priority: High');
  });
});
