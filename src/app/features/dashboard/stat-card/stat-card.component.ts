import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Statistic } from '../../../core/models/statistic.model';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [MatCardModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.scss',
})
export class StatCard {
  readonly stat = input.required<Statistic>();
}
