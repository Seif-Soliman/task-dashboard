const STEP = 1000;

/** Rank for an item dropped between two neighbours. Either may be missing at the ends of a column. */
export function orderBetween(prev?: number, next?: number): number {
  if (prev !== undefined && next !== undefined) return (prev + next) / 2;
  if (prev !== undefined) return prev + STEP;
  if (next !== undefined) return next - STEP;
  return STEP;
}
