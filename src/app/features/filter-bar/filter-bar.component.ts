import { ChangeDetectionStrategy, Component, computed, effect, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Assignee } from '../../core/models/task.model';
import { TaskFilters, hasActiveFilters, StatusFilter } from '../dashboard/task-filters';
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

  protected readonly search = new FormControl('', { nonNullable: true });
  protected readonly isFiltered = computed(() => hasActiveFilters(this.filters()));

  protected readonly statusOptions: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    ...TASK_STATUSES.map((status) => ({ value: status, label: STATUS_LABELS[status] })),
  ];
  protected readonly priorities = TASK_PRIORITIES.map((value) => ({
    value,
    label: PRIORITY_LABELS[value],
  }));

  constructor() {
    this.search.valueChanges
      .pipe(debounceTime(250), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((search) => this.filtersChange.emit({ search }));

    // Keep the input in sync when the URL changes (back button, clear, shared link).
    effect(() => this.search.setValue(this.filters().search, { emitEvent: false }));
  }
}
