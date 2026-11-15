import { LiveAnnouncer } from '@angular/cdk/a11y';
import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, firstValueFrom } from 'rxjs';
import { Task, TaskStatus } from '../../../core/models/task.model';
import { TasksService } from '../tasks.service';
import { STATUS_KEYS } from '../../task-filter/model/task-options';
import { injectT } from '../../../core/i18n/inject-t';

@Injectable({ providedIn: 'root' })
export class TaskMoveService {
  private readonly t = injectT();
  private readonly tasks = inject(TasksService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly announcer = inject(LiveAnnouncer);

  move(task: Task, status: TaskStatus, prevOrder?: number, nextOrder?: number): Promise<void> {
    return this.run(task, status, this.tasks.move(task, status, prevOrder, nextOrder));
  }

  moveToEnd(task: Task, status: TaskStatus): Promise<void> {
    return this.run(task, status, this.tasks.moveToEnd(task, status));
  }

  private async run(task: Task, status: TaskStatus, request$: Observable<void>): Promise<void> {
    try {
      await firstValueFrom(request$);
      void this.announcer.announce(
        this.t('move.announce', { title: task.title, status: this.t(STATUS_KEYS[status]) }),
      );
    } catch {
      this.snackBar.open(this.t('move.failed'), this.t('common.dismiss'), { duration: 6000 });
    }
  }
}
