import { DOCUMENT } from '@angular/common';
import { computed, inject, Injectable, InjectionToken, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

export type Language = 'en' | 'ar';
export type Direction = 'ltr' | 'rtl';

export const LANGUAGES: Record<Language, { label: string; dir: Direction }> = {
  en: { label: 'English', dir: 'ltr' },
  ar: { label: 'العربية', dir: 'rtl' },
};

const STORAGE_KEY = 'task-dashboard.language';

export const isLanguage = (value: unknown): value is Language => value === 'en' || value === 'ar';

export function resolveInitialLanguage(
  stored: string | null,
  browserLanguages: readonly string[],
): Language {
  if (isLanguage(stored)) return stored;
  return browserLanguages.map((l) => l.toLowerCase().split('-')[0]).find(isLanguage) ?? 'en';
}

export const RELOAD_PAGE = new InjectionToken<() => void>('RELOAD_PAGE', {
  providedIn: 'root',
  factory: () => () => window.location.reload(),
});

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly translate = inject(TranslateService);
  private readonly document = inject(DOCUMENT);
  private readonly reload = inject(RELOAD_PAGE);

  private readonly current = signal<Language>('en');
  readonly lang = this.current.asReadonly();
  readonly dir = computed(() => LANGUAGES[this.current()].dir);

  async init(): Promise<void> {
    const view = this.document.defaultView;
    const lang = resolveInitialLanguage(this.read(), view?.navigator.languages ?? []);

    await firstValueFrom(this.translate.use(lang));
    this.current.set(lang);

    const root = this.document.documentElement;
    root.lang = lang;
    root.dir = LANGUAGES[lang].dir;
  }

  switchTo(lang: Language): void {
    if (lang === this.current()) return;
    this.write(lang);
    this.reload();
  }

  private read(): string | null {
    try {
      return this.document.defaultView?.localStorage.getItem(STORAGE_KEY) ?? null;
    } catch {
      return null;
    }
  }

  private write(lang: Language): void {
    try {
      this.document.defaultView?.localStorage.setItem(STORAGE_KEY, lang);
    } catch (error) {
      console.warn('Failed to persist language preference:', error);
    }
  }
}
