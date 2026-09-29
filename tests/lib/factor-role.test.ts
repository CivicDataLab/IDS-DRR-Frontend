import { getFactorRole, isScoreIndicator } from '@/lib/analytics/factor-role';

describe('getFactorRole', () => {
  it('maps flood legacy bare slugs to roles', () => {
    expect(getFactorRole('risk-score')).toBe('risk-score');
    expect(getFactorRole('flood-hazard')).toBe('hazard');
    expect(getFactorRole('exposure')).toBe('exposure');
    expect(getFactorRole('vulnerability')).toBe('vulnerability');
    expect(getFactorRole('government-response')).toBe('government-response');
  });

  it('maps any hazard prefix to its role', () => {
    expect(getFactorRole('heat-risk-score')).toBe('risk-score');
    expect(getFactorRole('heat-hazard')).toBe('hazard');
    expect(getFactorRole('heat-exposure')).toBe('exposure');
  });

  it('returns null for non-factor (raw metric) indicators', () => {
    expect(getFactorRole('topsis-score')).toBeNull();
    expect(getFactorRole('social-vulnerability-index')).toBeNull();
    expect(getFactorRole('population')).toBeNull();
  });
});

describe('isScoreIndicator', () => {
  it('is true for SENDAI factor pillars, any hazard', () => {
    expect(isScoreIndicator('risk-score')).toBe(true);
    expect(isScoreIndicator('flood-hazard')).toBe(true);
    expect(isScoreIndicator('heat-hazard')).toBe(true);
    expect(isScoreIndicator('exposure')).toBe(true);
    expect(isScoreIndicator('vulnerability')).toBe(true);
    expect(isScoreIndicator('government-response')).toBe(true);
  });

  it('is false for raw-metric and sub-index indicators', () => {
    // Carry score-style units in the DB, but render as raw values (as before).
    expect(isScoreIndicator('topsis-score')).toBe(false);
    expect(isScoreIndicator('composite-vulnerability-index')).toBe(false);
    expect(isScoreIndicator('rainfall')).toBe(false);
  });
});
