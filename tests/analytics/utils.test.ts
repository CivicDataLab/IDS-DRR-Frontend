import {
  filterSubIndicatorsForView,
  getFactorNameBySlug,
  getLatestDate,
  getUnitsBySlug,
} from '@/lib/analytics/utils';

import { makeIndicator } from '../fixtures';

const factorData = [
  makeIndicator({ slug: 'risk-score', name: 'Risk Score', unit__name: 'score' }),
  makeIndicator({ slug: 'population', name: 'Population', unit__name: 'people' }),
];

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

describe('filterSubIndicatorsForView', () => {
  const govtResponseChildren = [
    'total-tender-awarded-value',
    'total-tender-awarded-value-fy-cumsum',
    'restoration-measures-tenders-awarded-value',
    'sdrf-sanctions-awarded-value-fy-cumsum',
  ];

  const riskScoreChildren = [
    'flood-hazard',
    'exposure',
    'vulnerability',
    'government-response',
  ];

  it('shows only cumsum variants in map view for government-response', () => {
    expect(
      filterSubIndicatorsForView(govtResponseChildren, 'map', 'government-response')
    ).toEqual([
      'total-tender-awarded-value-fy-cumsum',
      'restoration-measures-tenders-awarded-value',
      'sdrf-sanctions-awarded-value-fy-cumsum',
    ]);
  });

  it('shows only monthly variants in chart view for government-response', () => {
    expect(
      filterSubIndicatorsForView(
        govtResponseChildren,
        'chart',
        'government-response'
      )
    ).toEqual([
      'total-tender-awarded-value',
      'restoration-measures-tenders-awarded-value',
      'sdrf-sanctions-awarded-value-fy-cumsum',
    ]);
  });

  it('does not filter pillars when parent is risk-score', () => {
    expect(
      filterSubIndicatorsForView(riskScoreChildren, 'map', 'risk-score')
    ).toEqual(riskScoreChildren);
  });
});

describe('getLatestDate', () => {
  const originalEnv = process.env.NEXT_PUBLIC_TIME_PERIOD;

  afterEach(() => {
    process.env.NEXT_PUBLIC_TIME_PERIOD = originalEnv;
  });

  it('returns the latest valid period as YYYY_MM', () => {
    expect(getLatestDate(['2024_11', '2025_03', '2024_12'])).toBe('2025_03');
  });

  it('ignores malformed date strings', () => {
    expect(getLatestDate(['invalid', '2025_06', 'bad'])).toBe('2025_06');
  });

  it('falls back to env when no valid dates exist', () => {
    process.env.NEXT_PUBLIC_TIME_PERIOD = '2024_01';
    expect(getLatestDate([])).toBe('2024_01');
    expect(getLatestDate(['bad-date'])).toBe('2024_01');
  });
});
