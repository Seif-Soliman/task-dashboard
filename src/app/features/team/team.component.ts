import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivityListComponent } from '../activity-list/activity-list.component';
import { ErrorStateComponent } from '../shared/error-state/error-state.component';
import { MemberCardComponent } from '../shared/member-card/member-card.component';
import { ActivityFeedService } from './activity-feed.service';
import { UsersService } from '../dashboard/users.service';
import { TasksService } from '../task/tasks.service';
import { memberStats } from './team-stats';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-team',
  imports: [MemberCardComponent, ActivityListComponent, ErrorStateComponent, TranslatePipe],
  providers: [ActivityFeedService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './team.component.html',
  styleUrl: './team.component.scss',
})
export class TeamComponent {
  private readonly users = inject(UsersService).users;
  private readonly tasks = inject(TasksService).tasks;
  protected readonly feed = inject(ActivityFeedService).activities;

  protected readonly skeletons = [1, 2, 3, 4];

  protected readonly membersLoading = computed(
    () => this.users.isLoading() || this.tasks.isLoading(),
  );
  protected readonly membersError = computed(() => !!(this.users.error() || this.tasks.error()));

  protected readonly members = computed(() =>
    this.users.hasValue() && this.tasks.hasValue()
      ? memberStats(this.users.value(), this.tasks.value())
      : [],
  );

  protected readonly activities = computed(() => (this.feed.hasValue() ? this.feed.value() : []));

  protected reloadMembers(): void {
    this.users.reload();
    this.tasks.reload();
  }
}
