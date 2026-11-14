import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import {
  DEFAULT_FILTERS,
  parsePriority,
  parseStatus,
  TaskFilters,
  toQueryParams,
} from './model/task-filters';

/** Provided per page (not root) so it reads that page's route. The URL is the single source of truth. */
@Injectable()
export class TaskFiltersService {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly params = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  readonly filters = computed<TaskFilters>(() => {
    const params = this.params();
    return {
      status: parseStatus(params.get('status')),
      priority: parsePriority(params.get('priority')),
      assignee: params.get('assignee') ?? DEFAULT_FILTERS.assignee,
      search: params.get('q') ?? DEFAULT_FILTERS.search,
    };
  });

  update(patch: Partial<TaskFilters>): Promise<boolean> {
    return this.router.navigate([], {
      relativeTo: this.route,
      queryParams: toQueryParams({ ...this.filters(), ...patch }),
      queryParamsHandling: 'merge',
      // Typing in the search box must not fill the browser history.
      replaceUrl: patch.search !== undefined,
    });
  }

  clear(): Promise<boolean> {
    return this.update(DEFAULT_FILTERS);
  }
}
