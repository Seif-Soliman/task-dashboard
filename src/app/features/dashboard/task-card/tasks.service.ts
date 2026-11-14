import { httpResource } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Task } from '../../../core/models/task.model';

@Injectable({ providedIn: 'root' })
export class TasksService {
  readonly tasks = httpResource<Task[]>(() => '/api/tasks');
}
