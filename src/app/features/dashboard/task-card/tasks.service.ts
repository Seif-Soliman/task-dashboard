import { HttpClient, HttpErrorResponse, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Task, TaskDraft, TaskStatus } from '../../../core/models/task.model';
import { catchError, defer, map, Observable, of, tap, throwError } from 'rxjs';
import { buildMovedTask, buildNewTask, buildUpdatedTask } from '../task-builder/task-builders';
import { orderBetween } from '../../task/task-order';

@Injectable({ providedIn: 'root' })
export class TasksService {
  private readonly http = inject(HttpClient);

  readonly tasks = httpResource<Task[]>(() => '/api/tasks');

  create(draft: TaskDraft): Observable<Task> {
    return this.http
      .post<Task>('/api/tasks', buildNewTask(draft, this.nextOrder(draft.status)))
      .pipe(tap((created) => this.patchLocal((list) => [...list, created])));
  }

  update(existing: Task, draft: TaskDraft): Observable<Task> {
    // Changing status via the form appends to the bottom of the new column.
    const order = draft.status === existing.status ? existing.order : this.nextOrder(draft.status);
    return this.http
      .put<Task>(`/api/tasks/${existing.id}`, buildUpdatedTask(existing, draft, order))
      .pipe(
        tap((saved) => this.patchLocal((list) => list.map((t) => (t.id === saved.id ? saved : t)))),
      );
  }

  private loaded(): Task[] {
    return this.tasks.hasValue() ? this.tasks.value() : [];
  }

  private lastOrder(status: TaskStatus, excludeId?: string): number | undefined {
    const orders = this.loaded()
      .filter((t) => t.status === status && t.id !== excludeId)
      .map((t) => t.order);
    return orders.length ? Math.max(...orders) : undefined;
  }

  private nextOrder(status: TaskStatus): number {
    return orderBetween(this.lastOrder(status));
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

  /**
   * Moves a task to `status`, ranked between two neighbours (their `order` values).
   */
  move(task: Task, status: TaskStatus, prevOrder?: number, nextOrder?: number): Observable<void> {
    return defer(() => {
      const moved = buildMovedTask(task, status, orderBetween(prevOrder, nextOrder));
      this.patchLocal((list) => list.map((t) => (t.id === task.id ? moved : t)));

      return this.http.put(`/api/tasks/${task.id}`, moved).pipe(
        map(() => undefined),
        catchError((error: unknown) => {
          // Only revert our own change; leave it if something newer replaced it meanwhile.
          this.patchLocal((list) => list.map((t) => (t === moved ? task : t)));
          return throwError(() => error);
        }),
      );
    });
  }

  /** Menu-driven move: appends to the bottom of the target column. */
  moveToEnd(task: Task, status: TaskStatus): Observable<void> {
    return this.move(task, status, this.lastOrder(status, task.id));
  }
}

function insertAt(list: Task[], task: Task, index: number): Task[] {
  if (list.some((t) => t.id === task.id)) return list;
  const position = index < 0 ? list.length : Math.min(index, list.length);
  return [...list.slice(0, position), task, ...list.slice(position)];
}
