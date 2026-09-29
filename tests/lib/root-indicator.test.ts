import { getRootIndicatorSlug } from '@/lib/analytics/root-indicator';

describe('getRootIndicatorSlug', () => {
  it('maps flood to risk-score', () => {
    expect(getRootIndicatorSlug('assam', 'flood')).toBe('risk-score');
  });

  it('maps heat to heat-risk-score', () => {
    expect(getRootIndicatorSlug('assam', 'heat')).toBe('heat-risk-score');
  });

  it('derives <module>-risk-score by convention for other modules', () => {
    expect(getRootIndicatorSlug('assam', 'unknown')).toBe('unknown-risk-score');
  });
});

describe('isRootRiskIndicator', () => {
  it('returns true for flood and heat root indicators', () => {
    const { isRootRiskIndicator } = jest.requireActual<
      typeof import('@/lib/analytics/root-indicator')
    >('@/lib/analytics/root-indicator');
    expect(isRootRiskIndicator('risk-score')).toBe(true);
    expect(isRootRiskIndicator('heat-risk-score')).toBe(true);
  });

  it('returns false for contributing indicators', () => {
    const { isRootRiskIndicator } = jest.requireActual<
      typeof import('@/lib/analytics/root-indicator')
    >('@/lib/analytics/root-indicator');
    expect(isRootRiskIndicator('flood-hazard')).toBe(false);
    expect(isRootRiskIndicator('heat-hazard')).toBe(false);
  });
});
