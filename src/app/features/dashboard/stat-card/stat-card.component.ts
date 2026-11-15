import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Statistic } from '../../../core/models/statistic.model';
import { MatCardModule } from '@angular/material/card';
import { injectT } from '../../../core/i18n/inject-t';
import { toKeySegment } from '../../../core/i18n/translation-keys';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [MatCardModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.scss',
})
export class StatCard {
  private readonly t = injectT();

  readonly stat = input.required<Statistic>();

  protected readonly title = computed(() =>
    this.translateOr(`dashboard.stats.titles.${this.stat().id}`, this.stat().title),
  );
  protected readonly changeLabel = computed(() =>
    this.translateOr(
      `dashboard.stats.changeLabels.${toKeySegment(this.stat().changeLabel)}`,
      this.stat().changeLabel,
    ),
  );

  private translateOr(key: string, fallback: string): string {
    const text = this.t(key);
    return text === key ? fallback : text;
  }
}
