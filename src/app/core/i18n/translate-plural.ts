import { Translate } from './inject-t';

/** Picks `<base>.<CLDR category>` for the count (Arabic has six forms), falling back to `<base>.other`. */
export function translatePlural(t: Translate, base: string, count: number, locale: string): string {
  const key = `${base}.${new Intl.PluralRules(locale).select(count)}`;
  const text = t(key, { count });
  return text === key ? t(`${base}.other`, { count }) : text;
}
