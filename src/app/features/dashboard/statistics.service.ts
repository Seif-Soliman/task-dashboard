import { httpResource } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Statistic } from '../../core/models/statistic.model';

@Injectable({ providedIn: 'root' })
export class StatisticsService {
  /** Reactive request: exposes value(), isLoading(), error() and reload(). */
  readonly statistics = httpResource<Statistic[]>(() => '/api/statistics');
}
