import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ErrorStateComponent } from '../shared/error-state/error-state.component';
import { ChartCardComponent } from './chart-card/chart-card.component';
import { ChartConfiguration } from 'chart.js';
import { TasksService } from '../task/tasks.service';
import { prioritySlices, statusSlices, toChartData } from './task-analytics';
import { injectT } from '../../core/i18n/inject-t';
import { LanguageService } from '../../core/i18n/language.service';
import { doughnutOptions, barOptions } from './chart-options';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-analytics',
  imports: [ChartCardComponent, ErrorStateComponent, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss',
})
export class AnalyticsComponent {
  private readonly t = injectT();
  private readonly rtl = inject(LanguageService).dir() === 'rtl';
  protected readonly tasksResource = inject(TasksService).tasks;

  protected readonly prioritySlicesList = computed(() => prioritySlices(this.tasks(), this.t));
  protected readonly statusSlicesList = computed(() => statusSlices(this.tasks(), this.t));

  protected readonly tasks = computed(() =>
    this.tasksResource.hasValue() ? this.tasksResource.value() : [],
  );

  protected readonly priorityConfig = computed<ChartConfiguration>(() => ({
    type: 'doughnut',
    data: toChartData(this.prioritySlicesList(), this.t('analytics.datasetLabel')),
    options: doughnutOptions(this.rtl),
  }));

  protected readonly statusConfig = computed<ChartConfiguration>(() => ({
    type: 'bar',
    data: toChartData(this.statusSlicesList(), this.t('analytics.datasetLabel')),
    options: barOptions(this.rtl),
  }));
}
