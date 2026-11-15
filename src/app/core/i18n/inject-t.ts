import { inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type Translate = (key: string, params?: Record<string, unknown>) => string;

/** Imperative translation for strings built in TypeScript. Safe because the language is fixed per session. */
export function injectT(): Translate {
  const translate = inject(TranslateService);
  return (key, params) => translate.instant(key, params) as string;
}
