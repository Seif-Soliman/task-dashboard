import { formatRelativeTime } from './relative-time';

describe('formatRelativeTime', () => {
  const now = new Date('2026-11-14T12:00:00.000Z');
  const ago = (ms: number) => new Date(now.getTime() - ms).toISOString();

  it('says "now" for the last minute', () =>
    expect(formatRelativeTime(ago(30_000), now)).toBe('now'));
  it('uses minutes', () => expect(formatRelativeTime(ago(5 * 60_000), now)).toBe('5 minutes ago'));
  it('uses hours', () => expect(formatRelativeTime(ago(2 * 3_600_000), now)).toBe('2 hours ago'));
  it('says yesterday', () => expect(formatRelativeTime(ago(86_400_000), now)).toBe('yesterday'));
  it('uses days', () => expect(formatRelativeTime(ago(3 * 86_400_000), now)).toBe('3 days ago'));
  it('follows the requested locale', () => {
    expect(formatRelativeTime(ago(2 * 3_600_000), now, 'ar')).not.toBe('2 hours ago');
  });
});
