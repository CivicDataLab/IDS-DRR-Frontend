import {
  getFactorNameBySlug,
  getLatestDate,
  getUnitsBySlug,
  safeParseDate,
} from '@/app/[locale]/[state]/analytics/utils/utils';

const factorData = [
  { slug: 'risk-score', name: 'Risk Score', unit__name: 'score' },
  { slug: 'population', name: 'Population', unit__name: 'people' },
];

describe('safeParseDate', () => {
  it('parses valid ISO date strings', () => {
    const result = safeParseDate('2025-03-01');
    expect(result?.year).toBe(2025);
    expect(result?.month).toBe(3);
    expect(result?.day).toBe(1);
  });

  it('returns undefined for invalid dates', () => {
    expect(safeParseDate('not-a-date')).toBeUndefined();
  });
});

describe('getFactorNameBySlug', () => {
  it('returns the factor name when found', () => {
    expect(getFactorNameBySlug(factorData, 'population')).toBe('Population');
  });

  it('falls back to the slug when not found', () => {
    expect(getFactorNameBySlug(factorData, 'unknown')).toBe('unknown');
    expect(getFactorNameBySlug(undefined, 'risk-score')).toBe('risk-score');
  });
});

describe('getUnitsBySlug', () => {
  it('returns the unit name when found', () => {
    expect(getUnitsBySlug(factorData, 'population')).toBe('people');
  });

  it('returns empty string when not found', () => {
    expect(getUnitsBySlug(factorData, 'unknown')).toBe('');
    expect(getUnitsBySlug(undefined, 'risk-score')).toBe('');
  });
});

describe('getLatestDate', () => {
  const originalEnv = process.env.NEXT_PUBLIC_TIME_PERIOD;

  afterEach(() => {
    process.env.NEXT_PUBLIC_TIME_PERIOD = originalEnv;
  });

  it('returns the latest valid period as YYYY-MM-01', () => {
    expect(getLatestDate(['2024_11', '2025_03', '2024_12'])).toBe(
      '2025-03-01'
    );
  });

  it('ignores malformed date strings', () => {
    expect(getLatestDate(['invalid', '2025_06', 'bad'])).toBe('2025-06-01');
  });

  it('falls back to env when no valid dates exist', () => {
    process.env.NEXT_PUBLIC_TIME_PERIOD = '2024_01';
    expect(getLatestDate([])).toBe('2024_01');
    expect(getLatestDate(['bad-date'])).toBe('2024_01');
  });
});
