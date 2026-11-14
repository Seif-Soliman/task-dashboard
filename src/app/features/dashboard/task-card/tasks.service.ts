import { HttpClient, HttpErrorResponse, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Task, TaskDraft } from '../../../core/models/task.model';
import { catchError, defer, map, Observable, of, tap, throwError } from 'rxjs';
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

  /**
   * Removes the task from the board immediately and rolls it back if the server fails.
   */
  remove(task: Task): Observable<void> {
    return defer(() => {
      const index = this.tasks.hasValue()
        ? this.tasks.value().findIndex((t) => t.id === task.id)
        : -1;
      this.patchLocal((list) => list.filter((t) => t.id !== task.id));

      return this.http.delete(`/api/tasks/${task.id}`).pipe(
        map(() => undefined),
        catchError((error: unknown) => {
          if (error instanceof HttpErrorResponse && error.status === 404) return of(undefined);

          this.patchLocal((list) => insertAt(list, task, index));
          return throwError(() => error);
        }),
      );
    });
  }
}

function insertAt(list: Task[], task: Task, index: number): Task[] {
  if (list.some((t) => t.id === task.id)) return list;
  const position = index < 0 ? list.length : Math.min(index, list.length);
  return [...list.slice(0, position), task, ...list.slice(position)];
}
