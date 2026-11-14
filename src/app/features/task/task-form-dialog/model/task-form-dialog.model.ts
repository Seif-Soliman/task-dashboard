import { Task } from '../../../../core/models/task.model';

export interface TaskFormDialogData {
  task?: Task;
}

export const TITLE_MAX = 100;
export const DESCRIPTION_MAX = 500;
export const TAG_MAX = 20;
export const MAX_TAGS = 5;
