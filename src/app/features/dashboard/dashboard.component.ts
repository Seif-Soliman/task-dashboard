import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { StatisticsService } from './statistics.service';
import { StatCard } from './stat-card/stat-card/stat-card.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [StatCard, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class Dashboard {
  protected readonly statistics = inject(StatisticsService).statistics;
  protected readonly skeletons = [1, 2, 3, 4];
}
