import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { Slice } from '../task-analytics';
import { ChartComponent } from '../../shared/chart/chart.component';
import { injectT } from '../../../core/i18n/inject-t';
import { TranslatePipe } from '@ngx-translate/core';

let nextId = 0;

@Component({
  selector: 'app-chart-card',
  imports: [ChartComponent, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chart-card.component.html',
  styleUrl: './chart-card.component.scss',
})
export class ChartCardComponent {
  private readonly t = injectT();

  readonly title = input.required<string>();
  readonly config = input.required<ChartConfiguration>();
  readonly slices = input.required<readonly Slice[]>();
  protected readonly headingId = `chart-card-${nextId++}`;
  protected readonly summary = computed(
    () =>
      `${this.title()}: ${this.slices()
        .map((s) => `${s.label} ${s.value}`)
        .join(this.t('common.listSeparator'))}`,
  );
}
