import { formats } from '@/i18n/formats';

describe('i18n formats', () => {
  it('defines UTC date-time format presets', () => {
    expect(formats.dateTime.longDate).toMatchObject({
      dateStyle: 'long',
      timeZone: 'UTC',
    });
    expect(formats.dateTime.monthYear).toMatchObject({
      year: 'numeric',
      month: 'long',
      timeZone: 'UTC',
    });
    expect(formats.dateTime.monthYearShort).toMatchObject({
      year: 'numeric',
      month: 'short',
      timeZone: 'UTC',
    });
  });
});
