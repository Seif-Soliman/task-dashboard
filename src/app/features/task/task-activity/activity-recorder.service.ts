import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';
import { activityForChange, activityForCreate, activityForDelete } from './task-activity';
import { CurrentUserService } from '../../../core/auth/current-user.service';
import { ActivityDraft } from '../../../core/models/activity.model';
import { Task } from '../../../core/models/task.model';

@Injectable({ providedIn: 'root' })
export class ActivityRecorder {
  private readonly http = inject(HttpClient);
  private readonly user = inject(CurrentUserService).user;

  created(task: Task): void {
    this.send(activityForCreate(task, this.user()));
  }

  changed(previous: Task, next: Task): void {
    this.send(activityForChange(previous, next, this.user()));
  }

  deleted(task: Task): void {
    this.send(activityForDelete(task, this.user()));
  }

  /** Fire and forget: a failed log entry must never break or undo the user's action. */
  private send(activity: ActivityDraft): void {
    this.http
      .post('/api/activities', activity)
      .pipe(catchError(() => EMPTY))
      .subscribe();
  }
}
