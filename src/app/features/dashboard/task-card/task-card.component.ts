import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Task } from '../../../core/models/task.model';
import { getDueInfo, formatDueInfo } from '../../../core/utils/task.utils';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

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

  protected readonly due = computed(() => getDueInfo(this.task()));
  protected readonly dueLabel = computed(() => formatDueInfo(this.due()));
  protected readonly dueIcon = computed(() => DUE_ICONS[this.due().kind]);
  protected readonly firstName = computed(() => this.task().assignee.name.split(' ')[0]);
}
