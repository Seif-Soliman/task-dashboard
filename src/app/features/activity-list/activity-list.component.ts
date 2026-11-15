import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Activity } from '../../core/models/activity.model';
import { formatRelativeTime } from '../../core/utils/relative-time';
import { STATUS_KEYS } from '../task-filter/model/task-options';
import { DatePipe } from '@angular/common';
import { injectT } from '../../core/i18n/inject-t';
import { LanguageService } from '../../core/i18n/language.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-activity-list',
  imports: [DatePipe, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './activity-list.component.html',
  styleUrl: './activity-list.component.scss',
})
export class ActivityListComponent {
  private readonly t = injectT();
  private readonly lang = inject(LanguageService).lang();
  readonly activities = input.required<readonly Activity[]>();

  private readonly now = new Date();

  protected readonly rows = computed(() =>
    this.activities().map((activity) => ({
      ...activity,
      message: this.t(`activity.${activity.type}`, {
        task: activity.taskTitle,
        status: activity.to ? this.t(STATUS_KEYS[activity.to]) : '',
      }),
      when: formatRelativeTime(activity.createdAt, this.now, this.lang),
    })),
  );
}
