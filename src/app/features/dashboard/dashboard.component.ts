import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { StatisticsService } from './stat-card/statistics.service';
import { StatCard } from './stat-card/stat-card.component';
import { BoardColumnComponent } from './board-column/board-column.component';
import { sortByOrder } from '../../core/utils/task.utils';
import { TasksService } from '../task/tasks.service';
import { FilterBarComponent } from '../filter-bar/filter-bar.component';
import { TaskFiltersService } from '../task-filter/task-filters.service';
import { filterTasks } from '../task-filter/model/task-filters';
import { UsersService } from './users.service';
import { STATUS_LABELS, TASK_STATUSES } from '../task-filter/model/task-options';
import { TaskFormDialogService } from '../task/task-form-dialog/task-form-dialog.service';
import { TaskDeleteService } from '../task/task-delete/task-delete.service';
import { CdkDropListGroup } from '@angular/cdk/drag-drop';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { TaskDrop } from './board-column/model/board-column.model';
import { TaskMoveService } from '../task/task-move/task-move.service';
import { ErrorStateComponent } from '../shared/error-state/error-state.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    StatCard,
    BoardColumnComponent,
    FilterBarComponent,
    CdkDropListGroup,
    CdkScrollable,
    ErrorStateComponent,
  ],
  providers: [TaskFiltersService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class Dashboard {
  protected readonly statistics = inject(StatisticsService).statistics;
  protected readonly tasksResource = inject(TasksService).tasks;
  protected readonly filtersService = inject(TaskFiltersService);
  private readonly usersResource = inject(UsersService).users;
  protected readonly taskDialog = inject(TaskFormDialogService);
  protected readonly taskDelete = inject(TaskDeleteService);
  protected readonly taskMove = inject(TaskMoveService);

  protected readonly statsSkeletons = [1, 2, 3, 4];
  protected readonly boardSkeletons = [1, 2, 3];

  protected readonly assignees = computed(() =>
    this.usersResource.hasValue() ? this.usersResource.value() : [],
  );

  protected readonly columns = computed(() => {
    const filters = this.filtersService.filters();
    const tasks = this.tasksResource.hasValue()
      ? sortByOrder(filterTasks(this.tasksResource.value(), filters))
      : [];
    // A status tab shows only that column; "All" shows the full board.
    const statuses = filters.status === 'all' ? TASK_STATUSES : [filters.status];

    return statuses.map((status) => ({
      status,
      title: STATUS_LABELS[status],
      tasks: tasks.filter((task) => task.status === status),
    }));
  });

  protected onDrop({ task, status, index }: TaskDrop): void {
    const column = this.columns().find((c) => c.status === status);
    const others = (column?.tasks ?? []).filter((t) => t.id !== task.id);
    void this.taskMove.move(task, status, others[index - 1]?.order, others[index]?.order);
  }
}
