import { httpResource } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Assignee } from '../../core/models/task.model';

@Injectable({ providedIn: 'root' })
export class UsersService {
  readonly users = httpResource<Assignee[]>(() => '/api/users');
}
