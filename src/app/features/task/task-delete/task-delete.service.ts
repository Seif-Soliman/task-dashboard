import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { Task } from '../../../core/models/task.model';
import { TasksService } from '../tasks.service';
import { ConfirmService } from '../../shared/confirm-dialog/confirm.service';

@Injectable({ providedIn: 'root' })
export class TaskDeleteService {
  private readonly confirm = inject(ConfirmService);
  private readonly tasks = inject(TasksService);
  private readonly snackBar = inject(MatSnackBar);

  async delete(task: Task): Promise<void> {
    const confirmed = await this.confirm.ask({
      title: 'Delete task?',
      message: `“${task.title}” will be permanently deleted. This can’t be undone.`,
      confirmLabel: 'Delete',
      destructive: true,
    });
    if (confirmed) await this.remove(task);
  }

  private async remove(task: Task): Promise<void> {
    try {
      await firstValueFrom(this.tasks.remove(task));
      this.snackBar.open('Task deleted', 'Dismiss', { duration: 4000 });
    } catch {
      // The board has already restored the task. Retrying doesn't ask for confirmation again.
      this.snackBar
        .open('Couldn’t delete the task. It was restored.', 'Retry', { duration: 8000 })
        .onAction()
        .subscribe(() => void this.remove(task));
    }
  }
}
