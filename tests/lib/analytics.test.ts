import { Factors, isRiskLevel, RiskColorMap } from '@/lib/analytics';

describe('analytics constants', () => {
  it('exports score-style factor slugs', () => {
    expect(Factors).toContain('risk-score');
    expect(Factors).toHaveLength(7);
  });

  it('maps each risk level to colors', () => {
    for (const level of ['1', '2', '3', '4', '5'] as const) {
      expect(RiskColorMap[level].backgroundColor).toBeTruthy();
      expect(RiskColorMap[level].indicatorColor).toBeTruthy();
    }
  });
});

describe('isRiskLevel', () => {
  it('returns true for valid risk levels', () => {
    expect(isRiskLevel('1')).toBe(true);
    expect(isRiskLevel('5')).toBe(true);
  });

  it('returns false for invalid values', () => {
    expect(isRiskLevel('0')).toBe(false);
    expect(isRiskLevel('6')).toBe(false);
    expect(isRiskLevel('high')).toBe(false);
  });
});
