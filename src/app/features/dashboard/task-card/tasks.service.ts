import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Task, TaskDraft } from '../../../core/models/task.model';
import { Observable, tap } from 'rxjs';
import { buildNewTask, buildUpdatedTask } from '../task-builder/task-builders';

@Injectable({ providedIn: 'root' })
export class TasksService {
  private readonly http = inject(HttpClient);

  readonly tasks = httpResource<Task[]>(() => '/api/tasks');

  create(draft: TaskDraft): Observable<Task> {
    return this.http
      .post<Task>('/api/tasks', buildNewTask(draft))
      .pipe(tap((created) => this.patchLocal((list) => [...list, created])));
  }

  update(existing: Task, draft: TaskDraft): Observable<Task> {
    return this.http
      .put<Task>(`/api/tasks/${existing.id}`, buildUpdatedTask(existing, draft))
      .pipe(
        tap((saved) => this.patchLocal((list) => list.map((t) => (t.id === saved.id ? saved : t)))),
      );
  }

  /** Applies the server-confirmed change to the loaded list, so the board updates without a refetch. */
  private patchLocal(change: (tasks: Task[]) => Task[]): void {
    if (this.tasks.hasValue()) {
      this.tasks.value.update((list) => change(list ?? []));
    }
  }
}
