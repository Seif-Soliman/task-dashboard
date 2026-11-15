/** 'Same as yesterday' becomes 'same_as_yesterday', so server text can be mapped to a translation key. */
export function toKeySegment(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}
