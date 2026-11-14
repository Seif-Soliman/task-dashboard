import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { Slice } from '../task-analytics';
import { ChartComponent } from '../../shared/chart/chart.component';

let nextId = 0;

@Component({
  selector: 'app-chart-card',
  imports: [ChartComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chart-card.component.html',
  styleUrl: './chart-card.component.scss',
})
export class ChartCardComponent {
  readonly title = input.required<string>();
  readonly config = input.required<ChartConfiguration>();
  readonly slices = input.required<readonly Slice[]>();
  protected readonly headingId = `chart-card-${nextId++}`;
  protected readonly summary = computed(
    () =>
      `${this.title()}: ${this.slices()
        .map((s) => `${s.label} ${s.value}`)
        .join(', ')}`,
  );
}
