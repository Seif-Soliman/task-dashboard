import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Task, TaskStatus } from '../../../core/models/task.model';
import { getDueInfo, formatDueInfo } from '../../../core/utils/task.utils';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { STATUS_LABELS, TASK_STATUSES } from '../../task-filter/model/task-options';

const DUE_ICONS = { overdue: 'warning', upcoming: 'event', completed: 'check_circle' } as const;

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatMenuModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
})
export class TaskCardComponent {
  readonly task = input.required<Task>();
  readonly edit = output<Task>();
  readonly remove = output<Task>();
  readonly moveTo = output<TaskStatus>();

  protected readonly due = computed(() => getDueInfo(this.task()));
  protected readonly dueLabel = computed(() => formatDueInfo(this.due()));
  protected readonly dueIcon = computed(() => DUE_ICONS[this.due().kind]);
  protected readonly firstName = computed(() => this.task().assignee.name.split(' ')[0]);
  protected readonly moveTargets = computed(() =>
    TASK_STATUSES.filter((status) => status !== this.task().status).map((status) => ({
      status,
      label: STATUS_LABELS[status],
    })),
  );
}
