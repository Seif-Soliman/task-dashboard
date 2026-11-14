import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const startOfDay = (date: Date): number =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

/** Rejects whitespace-only text. Empty values are left to `Validators.required`. */
export const notBlank: ValidatorFn = (control) =>
  typeof control.value === 'string' && control.value.length > 0 && control.value.trim() === ''
    ? { blank: true }
    : null;

/**
 * Rejects dates before today.
 */
export function notBeforeToday(exempt: Date | null = null, today = () => new Date()): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: unknown = control.value;
    if (!(value instanceof Date)) return null;
    if (exempt && startOfDay(value) === startOfDay(exempt)) return null;
    return startOfDay(value) < startOfDay(today()) ? { pastDate: true } : null;
  };
}

export function maxItems(max: number): ValidatorFn {
  return (control) => ((control.value as unknown[]).length > max ? { maxItems: { max } } : null);
}

/** Array-level: case- and whitespace-insensitive duplicates. */
export const uniqueValues: ValidatorFn = (control) => {
  const values = (control.value as string[]).map((v) => v.trim().toLowerCase()).filter(Boolean);
  return new Set(values).size === values.length ? null : { duplicate: true };
};
