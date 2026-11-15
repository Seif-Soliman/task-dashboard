import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { TaskFormDialogService } from './task-form-dialog.service';
import { makeTask } from '../../../core/utils/task.utils.spec';

describe('TaskFormDialogService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  function setup(result: unknown) {
    const open = vi.fn(() => ({ afterClosed: () => of(result) }));
    const snackOpen = vi.fn();
    TestBed.configureTestingModule({
      providers: [
        { provide: MatDialog, useValue: { open } },
        { provide: MatSnackBar, useValue: { open: snackOpen } },
      ],
    });
    return { service: TestBed.inject(TaskFormDialogService), open, snackOpen };
  }

  it('confirms with a snackbar after a task is created', async () => {
    const { service, snackOpen } = setup(makeTask());
    await service.create();
    expect(snackOpen).toHaveBeenCalledWith('Task created', 'Dismiss', expect.anything());
  });

  it('passes the task to the dialog when editing', async () => {
    const task = makeTask();
    const { service, open } = setup(task);
    await service.edit(task);
    expect(open).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ data: { task } }),
    );
  });

  it('stays quiet when the dialog is dismissed', async () => {
    const { service, snackOpen } = setup(undefined);
    await service.create();
    expect(snackOpen).not.toHaveBeenCalled();
  });
});
