import type { Module, State } from 'ids-drr-branding-types';

import { stateQuickLink } from '@/lib/analytics/build-route';
import { getStateBranding } from '@/lib/state-map-config';

jest.mock('@/lib/state-map-config', () => ({
  getStateBranding: jest.fn(),
}));

const mockedGetStateBranding = jest.mocked(getStateBranding);

const testIcon = { src: '/test.svg', width: 1, height: 1 };

const floodModule: Module = {
  slug: 'flood',
  status: 'active',
  name: 'Flood',
  description: 'Flood risk analytics',
  icon: testIcon,
  withSubDistrictSupport: true,
};

const heatModule: Module = {
  slug: 'heat',
  status: 'inactive',
  name: 'Heat',
  description: 'Heat risk analytics',
  icon: testIcon,
  withSubDistrictSupport: true,
};

function stateBranding(modules: Module[]): State {
  return {
    name: 'Odisha',
    slug: 'odisha',
    icon: testIcon,
    status: 'active',
    modules,
  };
}

describe('stateQuickLink', () => {
  it('links to analytics when a state has one module', () => {
    mockedGetStateBranding.mockReturnValue(stateBranding([floodModule]));

    expect(stateQuickLink('odisha')).toBe(
      '/odisha/flood/analytics/?indicator=risk-score&view=map'
    );
  });

  it('links to the state hub when a state has multiple modules', () => {
    mockedGetStateBranding.mockReturnValue(
      stateBranding([floodModule, heatModule])
    );

    expect(stateQuickLink('odisha')).toBe('/odisha');
  });

  it('links to the state hub when no modules are configured', () => {
    mockedGetStateBranding.mockReturnValue(stateBranding([]));

    expect(stateQuickLink('odisha')).toBe('/odisha');
  });
});
