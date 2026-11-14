import {
  TaskStatus,
  TaskPriority,
  Task,
  Assignee,
  TaskDraft,
} from '../../../core/models/task.model';
import { parseDateOnly, formatDateOnly } from '../../../core/utils/task.utils';

export interface TaskFormValue {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date;
  assigneeId: string;
  tags: string[];
}

export function toFormValue(task: Task): TaskFormValue {
  return {
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: parseDateOnly(task.dueDate),
    assigneeId: task.assignee.id,
    tags: [...task.tags],
  };
}

export function toTaskDraft(value: TaskFormValue, assignee: Assignee): TaskDraft {
  return {
    title: value.title.trim(),
    description: value.description.trim(),
    status: value.status,
    priority: value.priority,
    dueDate: formatDateOnly(value.dueDate),
    assignee,
    tags: value.tags.map((tag) => tag.trim()).filter(Boolean),
  };
}
