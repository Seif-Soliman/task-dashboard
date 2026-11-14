import { Injectable, signal } from '@angular/core';
import { Assignee } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class CurrentUserService {
  readonly user = signal<Assignee>({
    id: 'user-001',
    name: 'John Doe',
    avatar: 'JD',
    email: 'john.doe@company.com',
  }).asReadonly();
}
