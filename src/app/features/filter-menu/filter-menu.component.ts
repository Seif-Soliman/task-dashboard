import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { FilterOption } from './model/filter-menu.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-filter-menu',
  imports: [MatButtonModule, MatIconModule, MatMenuModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './filter-menu.component.html',
  styleUrl: './filter-menu.component.scss',
})
export class FilterMenuComponent<T extends string> {
  readonly label = input.required<string>();
  readonly options = input.required<readonly FilterOption<T>[]>();
  readonly value = input.required<T>();
  readonly valueChange = output<T>();

  protected readonly buttonLabel = computed(() => {
    if (this.value() === 'all') return this.label();
    const selected = this.options().find((option) => option.value === this.value());
    return `${this.label()}: ${selected?.label ?? this.value()}`;
  });
}
