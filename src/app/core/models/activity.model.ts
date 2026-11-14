import { Assignee, TaskStatus } from './task.model';

export type ActivityType = 'created' | 'updated' | 'moved' | 'completed' | 'deleted';

export interface Activity {
  id: string;
  type: ActivityType;
  taskId: string;
  taskTitle: string;
  user: Assignee;
  createdAt: string;
  from?: TaskStatus;
  to?: TaskStatus;
}

export type ActivityDraft = Omit<Activity, 'id'>;
