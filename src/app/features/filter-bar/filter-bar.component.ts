import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Assignee } from '../../core/models/task.model';
import {
  TaskFilters,
  hasActiveFilters,
  StatusFilter,
  PriorityFilter,
} from '../dashboard/task-filters';
import {
  TASK_STATUSES,
  STATUS_LABELS,
  TASK_PRIORITIES,
  PRIORITY_LABELS,
} from '../dashboard/task-options';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FilterOption } from '../filter-menu/model/filter-menu.model';
import { FilterMenuComponent } from '../filter-menu/filter-menu.component';

@Component({
  selector: 'app-filter-bar',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    FilterMenuComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.scss',
})
export class FilterBarComponent {
  readonly filters = input.required<TaskFilters>();
  readonly assignees = input<readonly Assignee[]>([]);
  readonly filtersChange = output<Partial<TaskFilters>>();
  readonly clear = output<void>();
  readonly newTask = output<void>();

  protected readonly isFiltered = computed(() => hasActiveFilters(this.filters()));

  protected readonly statusOptions: FilterOption<StatusFilter>[] = [
    { value: 'all', label: 'All' },
    ...TASK_STATUSES.map((status) => ({ value: status, label: STATUS_LABELS[status] })),
  ];
  protected readonly priorityOptions: FilterOption<PriorityFilter>[] = [
    { value: 'all', label: 'All priorities' },
    ...TASK_PRIORITIES.map((priority) => ({ value: priority, label: PRIORITY_LABELS[priority] })),
  ];
  protected readonly assigneeOptions = computed<FilterOption<string>[]>(() => [
    { value: 'all', label: 'All assignees' },
    ...this.assignees().map((user) => ({ value: user.id, label: user.name })),
  ]);
}
