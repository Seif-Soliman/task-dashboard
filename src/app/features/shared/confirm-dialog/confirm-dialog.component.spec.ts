import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogData } from './model/confirm-dialog.model';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let close: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    close = vi.fn();

    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: { close } },
      ],
    }).compileComponents();
  });

  function render(data: ConfirmDialogData) {
    close.mockClear();

    TestBed.overrideProvider(MAT_DIALOG_DATA, {
      useValue: data,
    });

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;

    const button = (label: string) =>
      Array.from(el.querySelectorAll('button')).find((b) => b.textContent?.includes(label))!;

    return { fixture, component, el, close, button };
  }

  it('shows the title, message and custom labels', () => {
    const { el } = render({
      title: 'Delete?',
      message: 'Gone forever',
      confirmLabel: 'Delete',
      cancelLabel: 'Keep',
    });
    expect(el.textContent).toContain('Delete?');
    expect(el.textContent).toContain('Gone forever');
    expect(el.textContent).toContain('Keep');
  });

  it('closes with true on confirm and false on cancel', () => {
    const { button, close } = render({ title: 'T', message: 'M', confirmLabel: 'Yes' });
    button('Yes').click();
    expect(close).toHaveBeenLastCalledWith(true);
    button('Cancel').click();
    expect(close).toHaveBeenLastCalledWith(false);
  });

  it('marks destructive confirmations', () => {
    const { button } = render({
      title: 'T',
      message: 'M',
      confirmLabel: 'Delete',
      destructive: true,
    });
    expect(button('Delete').classList).toContain('destructive');
  });
});
