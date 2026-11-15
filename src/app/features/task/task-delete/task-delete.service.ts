import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { Task } from '../../../core/models/task.model';
import { TasksService } from '../tasks.service';
import { ConfirmService } from '../../shared/confirm-dialog/confirm.service';
import { injectT } from '../../../core/i18n/inject-t';

@Injectable({ providedIn: 'root' })
export class TaskDeleteService {
  private readonly t = injectT();
  private readonly confirm = inject(ConfirmService);
  private readonly tasks = inject(TasksService);
  private readonly snackBar = inject(MatSnackBar);

  async delete(task: Task): Promise<void> {
    const confirmed = await this.confirm.ask({
      title: this.t('delete.title'),
      message: this.t('delete.message', { title: task.title }),
      confirmLabel: this.t('delete.confirm'),
      destructive: true,
    });
    if (confirmed) await this.remove(task);
  }

  private async remove(task: Task): Promise<void> {
    try {
      await firstValueFrom(this.tasks.remove(task));
      this.snackBar.open(this.t('delete.done'), this.t('common.dismiss'), { duration: 4000 });
    } catch {
      this.snackBar
        .open(this.t('delete.failed'), this.t('common.retry'), { duration: 8000 })
        .onAction()
        .subscribe(() => void this.remove(task));
    }
  }
}
