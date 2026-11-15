import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ConfirmService } from './confirm.service';

describe('ConfirmService', () => {
  let service: ConfirmService;
  let open: ReturnType<typeof vi.fn>;
  let result: unknown;

  beforeEach(() => {
    result = undefined;
    open = vi.fn(() => ({
      afterClosed: () => of(result),
    }));

    TestBed.configureTestingModule({
      providers: [{ provide: MatDialog, useValue: { open } }],
    });

    service = TestBed.inject(ConfirmService);
  });

  it('resolves true only on explicit confirmation', async () => {
    result = true;

    expect(await service.ask({ title: 'T', message: 'M' })).toBe(true);

    expect(open).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ role: 'alertdialog' }),
    );
  });

  it.each([false, undefined])('resolves false when the dialog returns %s', async (dialogResult) => {
    result = dialogResult;

    expect(await service.ask({ title: 'T', message: 'M' })).toBe(false);
  });
});
