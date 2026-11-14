import { LiveAnnouncer } from '@angular/cdk/a11y';
import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { makeTask } from '../../../core/utils/task.utils.spec';
import { provideZonelessChangeDetection } from '@angular/core';
import { TasksService } from '../tasks.service';
import { TaskMoveService } from './task-move.service';

describe('TaskMoveService', () => {
  const task = makeTask({ title: 'Fix bug' });

  function setup(request$: unknown) {
    const tasks = {
      move: vi.fn().mockReturnValue(request$),
      moveToEnd: vi.fn().mockReturnValue(request$),
    };
    const announce = vi.fn();
    const open = vi.fn();
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: TasksService, useValue: tasks },
        { provide: LiveAnnouncer, useValue: { announce } },
        { provide: MatSnackBar, useValue: { open } },
      ],
    });
    return { service: TestBed.inject(TaskMoveService), tasks, announce, open };
  }

  it('moves between neighbours and announces the result', async () => {
    const { service, tasks, announce, open } = setup(of(undefined));
    await service.move(task, 'done', 1000, 2000);

    expect(tasks.move).toHaveBeenCalledWith(task, 'done', 1000, 2000);
    expect(announce).toHaveBeenCalledWith('Moved Fix bug to Done');
    expect(open).not.toHaveBeenCalled();
  });

  it('appends to the end of a column', async () => {
    const { service, tasks } = setup(of(undefined));
    await service.moveToEnd(task, 'in_progress');
    expect(tasks.moveToEnd).toHaveBeenCalledWith(task, 'in_progress');
  });

  it('tells the user when the move fails', async () => {
    const { service, announce, open } = setup(throwError(() => new Error('boom')));
    await service.move(task, 'done');

    expect(open).toHaveBeenCalledWith(
      expect.stringContaining('put back'),
      'Dismiss',
      expect.anything(),
    );
    expect(announce).not.toHaveBeenCalled();
  });
});
