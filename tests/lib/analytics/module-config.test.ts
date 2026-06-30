import {
  isModuleReportDownloadable,
  isModuleViewEnabled,
} from '@/lib/analytics/module-config';

jest.mock('@/config/site', () => ({
  features: { chart: true },
}));

jest.mock('@/lib/state-map-config', () => ({
  getStateBranding: (slug: string) => {
    if (slug !== 'assam') return undefined;
    return {
      modules: [
        {
          slug: 'flood',
          views: { map: 'active', chart: 'active', table: 'active' },
          isReportDownloadable: true,
        },
        {
          slug: 'heat',
          views: { map: 'active', chart: 'inactive', table: 'active' },
          isReportDownloadable: false,
        },
      ],
    };
  },
}));

describe('isModuleViewEnabled', () => {
  it('returns true for fully enabled flood module views', () => {
    expect(isModuleViewEnabled('assam', 'flood', 'chart')).toBe(true);
  });

  it('returns false for inactive heat chart', () => {
    expect(isModuleViewEnabled('assam', 'heat', 'chart')).toBe(false);
  });

  it('defaults map and table to enabled when views are unset', () => {
    expect(isModuleViewEnabled('unknown', 'flood', 'map')).toBe(true);
    expect(isModuleViewEnabled('unknown', 'flood', 'table')).toBe(true);
  });
});

describe('isModuleReportDownloadable', () => {
  it('respects module branding', () => {
    expect(isModuleReportDownloadable('assam', 'flood')).toBe(true);
    expect(isModuleReportDownloadable('assam', 'heat')).toBe(false);
  });

  it('defaults to true when branding is missing', () => {
    expect(isModuleReportDownloadable('unknown', 'flood')).toBe(true);
  });
});
