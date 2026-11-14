import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ErrorStateComponent } from '../shared/error-state/error-state.component';
import { ChartCardComponent } from './chart-card/chart-card.component';
import { ChartConfiguration } from 'chart.js';
import { TasksService } from '../task/tasks.service';
import { prioritySlices, statusSlices, toChartData } from './task-analytics';

const DOUGHNUT_OPTIONS: ChartConfiguration['options'] = {
  responsive: true,
  maintainAspectRatio: false,
  // cutout: '62%',
  plugins: { legend: { display: false } },
};

const BAR_OPTIONS: ChartConfiguration['options'] = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
};

@Component({
  selector: 'app-analytics',
  imports: [ChartCardComponent, ErrorStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss',
})
export class AnalyticsComponent {
  protected readonly tasksResource = inject(TasksService).tasks;

  protected readonly tasks = computed(() =>
    this.tasksResource.hasValue() ? this.tasksResource.value() : [],
  );

  protected readonly prioritySlicesList = computed(() => prioritySlices(this.tasks()));
  protected readonly statusSlicesList = computed(() => statusSlices(this.tasks()));

  protected readonly priorityConfig = computed<ChartConfiguration>(() => ({
    type: 'doughnut',
    data: toChartData(this.prioritySlicesList(), 'Tasks'),
    options: DOUGHNUT_OPTIONS,
  }));

  protected readonly statusConfig = computed<ChartConfiguration>(() => ({
    type: 'bar',
    data: toChartData(this.statusSlicesList(), 'Tasks'),
    options: BAR_OPTIONS,
  }));
}
