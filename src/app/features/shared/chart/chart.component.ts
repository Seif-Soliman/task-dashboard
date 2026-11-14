import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  InjectionToken,
  input,
  viewChild,
} from '@angular/core';
import {
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  type ChartConfiguration,
  DoughnutController,
  LinearScale,
  Tooltip,
} from 'chart.js';

Chart.register(
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  DoughnutController,
  LinearScale,
  Tooltip,
);

export type ChartHandle = Pick<Chart, 'data' | 'options' | 'update' | 'destroy'>;
export type ChartFactory = (canvas: HTMLCanvasElement, config: ChartConfiguration) => ChartHandle;

/** Test seam: jsdom has no canvas, so specs provide a fake factory. */
export const CHART_FACTORY = new InjectionToken<ChartFactory>('CHART_FACTORY', {
  providedIn: 'root',
  factory: () => (canvas, config) => new Chart(canvas, config),
});

function withMotionPreference(config: ChartConfiguration): ChartConfiguration {
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  return reduceMotion ? { ...config, options: { ...config.options, animation: false } } : config;
}

@Component({
  selector: 'app-chart',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
})
export class ChartComponent {
  readonly config = input.required<ChartConfiguration>();
  readonly ariaLabel = input.required<string>();

  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly createChart = inject(CHART_FACTORY);
  private chart?: ChartHandle;

  constructor() {
    afterNextRender(() => {
      this.chart = this.createChart(
        this.canvas().nativeElement,
        withMotionPreference(this.config()),
      );
    });

    effect(() => {
      // Read the signal before the early return, so the effect keeps tracking it.
      const config = withMotionPreference(this.config());
      if (!this.chart) return;

      this.chart.data = config.data;
      this.chart.options = config.options ?? {};
      this.chart.update();
    });

    inject(DestroyRef).onDestroy(() => this.chart?.destroy());
  }
}
