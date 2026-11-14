import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Activity, ActivityType } from '../../core/models/activity.model';
import { formatRelativeTime } from '../../core/utils/relative-time';
import { STATUS_LABELS } from '../task-filter/model/task-options';
import { DatePipe } from '@angular/common';

const VERBS: Record<ActivityType, string> = {
  created: 'created',
  updated: 'updated',
  moved: 'moved',
  completed: 'completed',
  deleted: 'deleted',
};

@Component({
  selector: 'app-activity-list',
  imports: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './activity-list.component.html',
  styleUrl: './activity-list.component.scss',
})
export class ActivityListComponent {
  readonly activities = input.required<readonly Activity[]>();

  private readonly now = new Date();

  protected readonly rows = computed(() =>
    this.activities().map((activity) => ({
      ...activity,
      verb: VERBS[activity.type],
      target: activity.to ? STATUS_LABELS[activity.to] : null,
      when: formatRelativeTime(activity.createdAt, this.now),
    })),
  );
}
