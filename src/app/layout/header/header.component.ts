import { ChangeDetectionStrategy, Component, computed, effect, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { debounceTime, map, filter } from 'rxjs';
import { Assignee } from '../../core/models/task.model';
import { TranslatePipe } from '@ngx-translate/core';
import { LANGUAGES } from '../../core/i18n/language.service';

type Language = 'en' | 'ar';

@Component({
  selector: 'app-header',
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatIconModule, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  readonly user = input.required<Assignee>();
  readonly search = input('');
  readonly showMenuButton = input(false);
  readonly searchChange = output<string>();
  readonly menuToggle = output<void>();

  readonly language = input.required<Language>();
  readonly languageChange = output<Language>();

  readonly other = computed<Language>(() => (this.language() === 'en' ? 'ar' : 'en'));

  readonly otherLabel = computed(() => LANGUAGES[this.other()].label);

  protected readonly searchControl = new FormControl('', { nonNullable: true });

  private lastEmitted = '';

  constructor() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(250),
        map((value) => value.trim()),
        filter((value) => value !== this.lastEmitted),
        takeUntilDestroyed(),
      )
      .subscribe((value) => {
        this.lastEmitted = value;
        this.searchChange.emit(value);
      });

    effect(() => {
      const value = this.search();
      if (value !== this.lastEmitted) {
        this.lastEmitted = value;
        this.searchControl.setValue(value, { emitEvent: false });
      }
    });
  }
}
