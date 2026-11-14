import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { StatisticsService } from './stat-card/statistics.service';
import { StatCard } from './stat-card/stat-card.component';
import { MatButtonModule } from '@angular/material/button';
import { BoardColumnComponent } from './board-column/board-column.component';
import { sortTasks } from '../../core/utils/task.utils';
import { TasksService } from './task-card/tasks.service';
import { TaskStatus } from '../../core/models/task.model';

const COLUMNS: readonly { status: TaskStatus; title: string }[] = [
  { status: 'todo', title: 'To Do' },
  { status: 'in_progress', title: 'In Progress' },
  { status: 'done', title: 'Done' },
];

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [StatCard, MatButtonModule, BoardColumnComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class Dashboard {
  protected readonly statistics = inject(StatisticsService).statistics;
  protected readonly tasksResource = inject(TasksService).tasks;

  protected readonly statsSkeletons = [1, 2, 3, 4];
  protected readonly boardSkeletons = [1, 2, 3];

  protected readonly columns = computed(() => {
    const tasks = this.tasksResource.hasValue() ? sortTasks(this.tasksResource.value()) : [];
    return COLUMNS.map((column) => ({
      ...column,
      tasks: tasks.filter((task) => task.status === column.status),
    }));
  });
}
