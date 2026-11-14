import { Task, TaskStatus } from '../../../../core/models/task.model';

export interface TaskDrop {
  task: Task;
  status: TaskStatus;
  index: number;
}

export interface TaskMove {
  task: Task;
  status: TaskStatus;
}
