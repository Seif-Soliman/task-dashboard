import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Assignee } from '../../core/models/task.model';
import {
  TaskFilters,
  hasActiveFilters,
  StatusFilter,
  PriorityFilter,
} from '../task-filter/model/task-filters';
import {
  TASK_STATUSES,
  TASK_PRIORITIES,
  PRIORITY_KEYS,
  STATUS_KEYS,
} from '../task-filter/model/task-options';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FilterOption } from '../filter-menu/model/filter-menu.model';
import { FilterMenuComponent } from '../filter-menu/filter-menu.component';
import { injectT } from '../../core/i18n/inject-t';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    FilterMenuComponent,
    TranslatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.scss',
})
export class FilterBarComponent {
  private readonly t = injectT();

  readonly filters = input.required<TaskFilters>();
  readonly assignees = input<readonly Assignee[]>([]);
  readonly filtersChange = output<Partial<TaskFilters>>();
  readonly clear = output<void>();
  readonly newTask = output<void>();

  protected readonly isFiltered = computed(() => hasActiveFilters(this.filters()));

  protected readonly statusOptions: FilterOption<StatusFilter>[] = [
    { value: 'all', label: this.t('dashboard.filters.all') },
    ...TASK_STATUSES.map((status) => ({ value: status, label: this.t(STATUS_KEYS[status]) })),
  ];
  protected readonly priorityOptions: FilterOption<PriorityFilter>[] = [
    { value: 'all', label: this.t('dashboard.filters.allPriorities') },
    ...TASK_PRIORITIES.map((priority) => ({
      value: priority,
      label: this.t(PRIORITY_KEYS[priority]),
    })),
  ];
  protected readonly assigneeOptions = computed<FilterOption<string>[]>(() => [
    { value: 'all', label: this.t('dashboard.filters.allAssignees') },
    ...this.assignees().map((user) => ({ value: user.id, label: user.name })),
  ]);
  protected readonly priorityLabel = this.t('dashboard.filters.priority');
  protected readonly assigneeLabel = this.t('dashboard.filters.assignee');
}
