import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskDeleteService } from './task-delete.service';
import { of, throwError } from 'rxjs';
import { makeTask } from '../../core/utils/task.utils.spec';
import { TasksService } from '../dashboard/task-card/tasks.service';
import { ConfirmService } from '../shared/confirm-dialog/confirm.service';
import { provideZonelessChangeDetection } from '@angular/core';

describe('TaskDeleteService', () => {
  const task = makeTask();

  let service: TaskDeleteService;
  let ask: ReturnType<typeof vi.fn>;
  let open: ReturnType<typeof vi.fn>;
  let remove: ReturnType<typeof vi.fn>;
  let confirmed: boolean;

  beforeEach(() => {
    confirmed = false;
    ask = vi.fn().mockImplementation(() => Promise.resolve(confirmed));
    remove = vi.fn();
    open = vi.fn(() => ({ onAction: () => of(undefined) }));

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: ConfirmService, useValue: { ask } },
        { provide: TasksService, useValue: { remove } },
        { provide: MatSnackBar, useValue: { open } },
      ],
    });

    service = TestBed.inject(TaskDeleteService);
  });

  it('does nothing when the user cancels', async () => {
    const remove = vi.fn();
    confirmed = true;
    await service.delete(task);

    expect(remove).not.toHaveBeenCalled();
    expect(open).not.toHaveBeenCalled();
  });

  it('deletes after confirmation and tells the user', async () => {
    const remove = vi.fn().mockReturnValue(of(undefined));
    confirmed = true;
    await service.delete(task);

    expect(ask).toHaveBeenCalledWith(expect.objectContaining({ destructive: true }));
    expect(remove).toHaveBeenCalledWith(task);
    expect(open).toHaveBeenCalledWith('Task deleted', 'Dismiss', expect.anything());
  });

  it('offers a retry that does not ask for confirmation again', async () => {
    const remove = vi
      .fn()
      .mockReturnValueOnce(throwError(() => new Error('boom')))
      .mockReturnValue(of(undefined));
    confirmed = true;
    await service.delete(task);

    await vi.waitFor(() => expect(remove).toHaveBeenCalledTimes(2));
    expect(ask).toHaveBeenCalledTimes(1);
    expect(open).toHaveBeenCalledWith(
      expect.stringContaining('restored'),
      'Retry',
      expect.anything(),
    );
  });
});
