import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { NAV_ITEMS } from './model/sidebar.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  protected readonly items = NAV_ITEMS;
  readonly newTask = output<void>();
  readonly navigated = output<void>();
}
