import { FormArray, FormControl } from '@angular/forms';
import { maxItems, notBeforeToday, notBlank, uniqueValues } from './validators';

describe('validators', () => {
  const today = () => new Date(2026, 10, 14, 12);

  it('notBlank flags whitespace-only text but not empty text', () => {
    expect(notBlank(new FormControl('   '))).toEqual({ blank: true });
    expect(notBlank(new FormControl(''))).toBeNull();
    expect(notBlank(new FormControl(' a '))).toBeNull();
  });

  it('notBeforeToday rejects past dates and accepts today', () => {
    const validate = notBeforeToday(null, today);
    expect(validate(new FormControl(new Date(2026, 10, 13)))).toEqual({ pastDate: true });
    expect(validate(new FormControl(new Date(2026, 10, 14)))).toBeNull();
    expect(validate(new FormControl(null))).toBeNull();
  });

  it('notBeforeToday exempts the original date', () => {
    const original = new Date(2026, 10, 1);
    expect(notBeforeToday(original, today)(new FormControl(new Date(2026, 10, 1)))).toBeNull();
    expect(notBeforeToday(original, today)(new FormControl(new Date(2026, 10, 2)))).toEqual({
      pastDate: true,
    });
  });

  it('maxItems limits array length', () => {
    const tags = new FormArray([new FormControl('a'), new FormControl('b')]);
    expect(maxItems(1)(tags)).toEqual({ maxItems: { max: 1 } });
    expect(maxItems(2)(tags)).toBeNull();
  });

  it('uniqueValues ignores case and spacing', () => {
    expect(uniqueValues(new FormArray([new FormControl('UI'), new FormControl(' ui ')]))).toEqual({
      duplicate: true,
    });
    expect(uniqueValues(new FormArray([new FormControl('UI'), new FormControl('API')]))).toBeNull();
  });
});
