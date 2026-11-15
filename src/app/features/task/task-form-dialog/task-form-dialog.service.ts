import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { Task } from '../../../core/models/task.model';
import { TaskFormDialogData } from './model/task-form-dialog.model';
import { injectT } from '../../../core/i18n/inject-t';

@Injectable({ providedIn: 'root' })
export class TaskFormDialogService {
  private readonly t = injectT();
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  create(): Promise<void> {
    return this.open(undefined, 'form.created');
  }

  edit(task: Task): Promise<void> {
    return this.open(task, 'form.updated');
  }

  private async open(task: Task | undefined, message: string): Promise<void> {
    const { TaskFormDialogComponent } = await import('./task-form-dialog.component');

    const ref = this.dialog.open(TaskFormDialogComponent, {
      data: { task } satisfies TaskFormDialogData,
      width: '560px',
      maxWidth: '95vw',
    });

    const saved: Task | undefined = await firstValueFrom(ref.afterClosed());
    if (saved) {
      this.snackBar.open(this.t(message), this.t('common.dismiss'), { duration: 4000 });
    }
  }
}
