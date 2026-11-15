import { AbstractControl } from '@angular/forms';

/** First error on the control that has a message, or null. */
export function getErrorMessage(
  control: AbstractControl,
  messages: Readonly<Record<string, string>>,
): string | null {
  const key = Object.keys(control.errors ?? {}).find((k) => k in messages);
  return key ? messages[key] : null;
}

export function getErrorKey(control: AbstractControl, prefix: string): string | null {
  const code = Object.keys(control.errors ?? {})[0];
  return code ? `${prefix}.${code}` : null;
}
