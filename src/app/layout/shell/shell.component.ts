import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router, ActivatedRoute, RouterOutlet } from '@angular/router';
import { map } from 'rxjs';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TaskFormDialogService } from '../../features/task/task-form-dialog/task-form-dialog.service';

const COMPACT_QUERY = '(max-width: 959.98px)';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, MatSidenavModule, HeaderComponent, SidebarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly breakpoints = inject(BreakpointObserver);
  private readonly taskDialog = inject(TaskFormDialogService);

  protected onNewTask(): void {
    this.menuOpen.set(false);
    void this.taskDialog.create();
  }

  protected readonly menuOpen = signal(false);

  protected readonly isCompact = toSignal(
    this.breakpoints.observe(COMPACT_QUERY).pipe(map((state) => state.matches)),
    { initialValue: this.breakpoints.isMatched(COMPACT_QUERY) },
  );

  /** Query params are global to the router, so the shell sees the dashboard's `q` too. */
  private readonly queryParams = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });
  protected readonly search = computed(() => this.queryParams().get('q') ?? '');

  protected onSearch(term: string): void {
    void this.router.navigate(['/dashboard'], {
      queryParams: { q: term || null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
