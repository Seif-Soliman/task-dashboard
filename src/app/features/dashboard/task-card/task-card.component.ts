import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { Task, TaskStatus } from '../../../core/models/task.model';
import { getDueInfo, getDueLabel } from '../../../core/utils/task.utils';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { PRIORITY_KEYS, STATUS_KEYS, TASK_STATUSES } from '../../task-filter/model/task-options';
import { TranslatePipe } from '@ngx-translate/core';
import { injectT } from '../../../core/i18n/inject-t';
import { LanguageService } from '../../../core/i18n/language.service';
import { translatePlural } from '../../../core/i18n/translate-plural';

const DUE_ICONS = { overdue: 'warning', upcoming: 'event', completed: 'check_circle' } as const;

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatMenuModule, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
})
export class TaskCardComponent {
  private readonly t = injectT();
  private readonly lang = inject(LanguageService).lang();

  readonly task = input.required<Task>();
  readonly edit = output<Task>();
  readonly remove = output<Task>();
  readonly moveTo = output<TaskStatus>();

  protected readonly due = computed(() => getDueInfo(this.task()));
  protected readonly dueIcon = computed(() => DUE_ICONS[this.due().kind]);
  protected readonly firstName = computed(() => this.task().assignee.name.split(' ')[0]);
  protected readonly priorityLabel = computed(() => this.t(PRIORITY_KEYS[this.task().priority]));
  protected readonly dueLabel = computed(() => {
    const { key, count } = getDueLabel(this.due());
    return count === undefined ? this.t(key) : translatePlural(this.t, key, count, this.lang);
  });
  protected readonly moveTargets = computed(() =>
    TASK_STATUSES.filter((status) => status !== this.task().status).map((status) => ({
      status,
      label: this.t(STATUS_KEYS[status]),
    })),
  );
}
