import { orderBetween } from './task-order';

describe('orderBetween', () => {
  it('averages the neighbours', () => expect(orderBetween(1000, 2000)).toBe(1500));
  it('appends after the last item', () => expect(orderBetween(3000, undefined)).toBe(4000));
  it('prepends before the first item', () => expect(orderBetween(undefined, 1000)).toBe(0));
  it('starts an empty column', () => expect(orderBetween()).toBe(1000));
});
