import {
  countDistricts,
  countVeryHighRiskDistricts,
} from '@/lib/analytics/module-hub-stats';

describe('module hub stats', () => {
  it('counts districts from geography list', () => {
    expect(countDistricts([{ code: 'A' }, { code: 'B' }])).toBe(2);
    expect(countDistricts([])).toBe(0);
    expect(countDistricts(undefined)).toBeUndefined();
  });

  it('counts very high risk districts from map features', () => {
    const mapData = {
      features: [
        { properties: { 'risk-score': 5 } },
        { properties: { 'risk-score': 4 } },
        { properties: { 'risk-score': 5 } },
        { properties: { 'risk-score': 1 } },
      ],
    };

    expect(countVeryHighRiskDistricts(mapData, 'risk-score')).toBe(2);
    expect(countVeryHighRiskDistricts({ features: [] }, 'risk-score')).toBe(
      undefined
    );
  });

  it('uses the module root indicator property on features', () => {
    const mapData = {
      features: [
        { properties: { 'heat-risk-score': 5 } },
        { properties: { 'risk-score': 5 } },
      ],
    };

    expect(countVeryHighRiskDistricts(mapData, 'heat-risk-score')).toBe(1);
  });
});
