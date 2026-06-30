import React from 'react';
import { MapComponent } from '@/components/analytics/map-component';
import { hasSubDistrictSupport } from '@/lib/analytics/module-config';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';

import { makeIndicator, makeState } from './fixtures';

jest.mock('opub-ui');

jest.mock('next/navigation', () => ({
  useParams: () => ({ state: 'assam', module: 'flood' }),
}));

jest.mock('@/hooks/use-window-size', () => ({
  useWindowSize: jest.fn(() => ({ width: 1200, height: 800 })),
}));

jest.mock('@/hooks/use-format-number', () => ({
  useFormatNumber: () => (value: number | string) => `fmt-${value}`,
}));

jest.mock('@/lib/analytics/utils', () => ({
  getFactorNameBySlug: jest.fn((_data, slug) => `Factor ${slug}`),
  getUnitsBySlug: jest.fn(() => 'mm'),
}));

jest.mock('@/lib/analytics/module-config', () => ({
  ...jest.requireActual('@/lib/analytics/module-config'),
  hasSubDistrictSupport: jest.fn(() => true),
}));

jest.mock('@/components/icons', () => ({
  __esModule: true,
  default: { layoutSidebarRightCollapse: 'collapse-icon' },
}));

const mockMap = {
  whenReady: (fn: () => void) => fn(),
  invalidateSize: jest.fn(),
  getSize: () => ({ x: 800, y: 600 }),
  fitBounds: jest.fn(),
  setView: jest.fn(),
  getContainer: () => ({}),
};

function createLayer(overrides: Record<string, unknown> = {}) {
  const layer = {
    feature: {
      properties: {
        name: 'District A',
        code: 'AS-01',
        'risk-score': 4,
        exposure: 1.5,
        'district-code': 'AS-01',
        bounds: [
          [0, 0],
          [1, 1],
        ],
        ...overrides,
      },
    },
    bindPopup: jest.fn().mockReturnThis(),
    openPopup: jest.fn(),
    closePopup: jest.fn(),
    unbindPopup: jest.fn(),
  };
  return layer;
}

jest.mock('@/components/MapChart', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: (props: any) => {
      React.useEffect(() => {
        props.setMap?.(mockMap);
      }, [props.setMap]);

      const sampleValue = props.features?.[0]?.properties?.exposure;
      const scaleColor =
        props.isCustomColor && typeof sampleValue === 'number'
          ? props.customColor?.(sampleValue)
          : undefined;

      return (
        <div
          data-testid="map-chart"
          data-legend-count={props.legendData?.length}
          data-feature-count={props.features?.length ?? 0}
          data-scale-color={scaleColor}
        >
          <button
            type="button"
            data-testid="map-mouseover"
            onClick={() => props.mouseover?.(createLayer())}
          >
            mouseover
          </button>
          <button
            type="button"
            data-testid="map-mouseout"
            onClick={() => props.mouseout?.(createLayer())}
          >
            mouseout
          </button>
          <button
            type="button"
            data-testid="map-click"
            onClick={() => props.click?.(createLayer())}
          >
            click
          </button>
          {props.legendHeading?.heading ? (
            <span data-testid="legend-heading">{props.legendHeading.heading}</span>
          ) : null}
        </div>
      );
    },
  };
});

jest.mock('@/config/site', () => ({
  states: [
    {
      slug: 'assam',
      minZoom: 6,
      maxZoom: 12,
      center: [26.2, 91.7],
      zoom: 7,
      bounds: [
        [0, 0],
        [2, 2],
      ],
      overlay: () =>
        Promise.resolve({
          default: { type: 'FeatureCollection', features: [] },
        }),
    },
  ],
  tileLayers: {
    osm: {
      url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: 'OSM',
    },
  },
}));

const baseProps = {
  mapDataloading: false,
  revenueMapDataLoading: false,
  indicatorsData: [
    makeIndicator({
      name: 'Risk Score',
      slug: 'risk-score',
      unit__name: 'score',
      short_description: 'Risk',
    }),
    makeIndicator({
      name: 'Exposure',
      slug: 'exposure',
      unit__name: 'mm',
      short_description: 'Exposure',
    }),
  ],
  setRegion: jest.fn(),
  setRevenueRegion: jest.fn(),
  currentSelectedState: makeState({
    slug: 'assam',
    code: 'AS',
    bounds: [
      [0, 0],
      [2, 2],
    ],
    center: [26.2, 91.7],
  }),
};

const districtFeatures = {
  features: [
    {
      type: 'Feature',
      properties: {
        name: 'District A',
        code: 'AS-01',
        'risk-score': 4,
        exposure: 1.5,
        bounds: [
          [0, 0],
          [1, 1],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        name: 'District B',
        code: 'AS-02',
        'risk-score': 2,
        exposure: 0.8,
        bounds: [
          [1, 1],
          [2, 2],
        ],
      },
    },
  ],
};

const revenueFeatures = {
  features: [
    {
      type: 'Feature',
      properties: {
        name: 'Revenue A',
        code: 'RC-01',
        'district-code': 'AS-01',
        'risk-score': 3,
        exposure: 0,
      },
    },
  ],
};

describe('MapComponent integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(hasSubDistrictSupport).mockReturnValue(true);
    jest.useFakeTimers();
    window.history.pushState({}, '', '/assam/flood/analytics');
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders risk-score legend and handles district click', async () => {
    const setRegion = jest.fn();
    render(
      <MapComponent
        {...baseProps}
        indicator="risk-score"
        mapData={districtFeatures}
        revenueMapData={revenueFeatures}
        setRegion={setRegion}
      />
    );

    expect(screen.getByTestId('map-chart')).toHaveAttribute('data-legend-count', '5');
    fireEvent.click(screen.getByTestId('map-click'));
    expect(setRegion).toHaveBeenCalledWith('AS-01');

    fireEvent.click(screen.getByTestId('map-mouseover'));
    fireEvent.click(screen.getByTestId('map-mouseout'));
  });

  it('renders custom legend for non-risk indicators without data', () => {
    render(
      <MapComponent
        {...baseProps}
        indicator="population"
        mapData={{ features: [{ type: 'Feature', properties: { name: 'X', code: 'X' } }] }}
        revenueMapData={revenueFeatures}
      />
    );

    expect(screen.getByTestId('legend-heading')).toHaveTextContent('Factor population');
    expect(screen.getByTestId('map-chart')).toHaveAttribute('data-legend-count', '1');
  });

  it('filters revenue features when a district is selected', () => {
    window.history.pushState({}, '', '/assam/flood/analytics?district-code=AS-01');
    const setRevenueRegion = jest.fn();
    const setRegion = jest.fn();

    render(
      <MapComponent
        {...baseProps}
        indicator="risk-score"
        mapData={districtFeatures}
        revenueMapData={revenueFeatures}
        setRevenueRegion={setRevenueRegion}
        setRegion={setRegion}
      />
    );

    fireEvent.click(screen.getByTestId('map-click'));
    expect(setRevenueRegion).toHaveBeenCalledWith('AS-01');
    expect(setRegion).toHaveBeenCalledWith('AS-01');
  });

  it('shows toggle button and fits bounds when output pane opens', async () => {
    const onToggleOutputPane = jest.fn();
    window.history.pushState({}, '', '/assam/flood/analytics?district-code=AS-01');

    render(
      <MapComponent
        {...baseProps}
        indicator="risk-score"
        mapData={districtFeatures}
        revenueMapData={revenueFeatures}
        isOutputPaneOpen={false}
        onToggleOutputPane={onToggleOutputPane}
      />
    );

    fireEvent.click(screen.getByTestId('icon').closest('button')!);
    expect(onToggleOutputPane).toHaveBeenCalled();

    await waitFor(() => {
      expect(mockMap.fitBounds).toHaveBeenCalled();
    });
  });

  it('schedules popup close after mouseout delay', () => {
    render(
      <MapComponent
        {...baseProps}
        indicator="risk-score"
        mapData={districtFeatures}
        revenueMapData={revenueFeatures}
      />
    );

    fireEvent.click(screen.getByTestId('map-mouseover'));
    fireEvent.click(screen.getByTestId('map-mouseout'));

    act(() => {
      jest.advanceTimersByTime(150);
    });

    expect(screen.getByTestId('map-chart')).toBeInTheDocument();
  });

  it('zooms to district bounds when sub-district drill-down is disabled', async () => {
    jest.mocked(hasSubDistrictSupport).mockReturnValue(false);
    window.history.pushState(
      {},
      '',
      '/assam/heat/analytics?district-code=AS-01'
    );

    render(
      <MapComponent
        {...baseProps}
        indicator="heat-risk-score"
        mapData={districtFeatures}
        revenueMapData={revenueFeatures}
      />
    );

    await waitFor(() => {
      expect(mockMap.fitBounds).toHaveBeenCalledWith(
        [
          [0, 0],
          [1, 1],
        ],
        undefined
      );
    });
    expect(mockMap.fitBounds).not.toHaveBeenCalledWith(
      [
        [0, 0],
        [2, 2],
      ],
      expect.anything()
    );
  });

  it('shows only the selected district when sub-district drill-down is disabled', () => {
    jest.mocked(hasSubDistrictSupport).mockReturnValue(false);
    window.history.pushState(
      {},
      '',
      '/assam/heat/analytics?district-code=AS-01'
    );

    render(
      <MapComponent
        {...baseProps}
        indicator="heat-risk-score"
        mapData={districtFeatures}
        revenueMapData={revenueFeatures}
      />
    );

    expect(screen.getByTestId('map-chart')).toHaveAttribute(
      'data-feature-count',
      '1'
    );
  });

  it('keeps choropleth colors stable when focusing a district without sub-district support', () => {
    jest.mocked(hasSubDistrictSupport).mockReturnValue(false);

    const { unmount } = render(
      <MapComponent
        {...baseProps}
        indicator="exposure"
        mapData={districtFeatures}
        revenueMapData={revenueFeatures}
      />
    );

    const fullMapColor = screen.getByTestId('map-chart').getAttribute(
      'data-scale-color'
    );
    unmount();

    window.history.pushState(
      {},
      '',
      '/assam/heat/analytics?district-code=AS-01'
    );

    render(
      <MapComponent
        {...baseProps}
        indicator="exposure"
        mapData={districtFeatures}
        revenueMapData={revenueFeatures}
      />
    );

    expect(screen.getByTestId('map-chart')).toHaveAttribute(
      'data-feature-count',
      '1'
    );
    expect(screen.getByTestId('map-chart').getAttribute('data-scale-color')).toBe(
      fullMapColor
    );
  });

  it('hides map legend on mobile when the output overlay is open', () => {
    const useWindowSize = jest.requireMock('@/hooks/use-window-size')
      .useWindowSize as jest.Mock;
    useWindowSize.mockReturnValue({ width: 800, height: 600 });

    render(
      <MapComponent
        {...baseProps}
        indicator="risk-score"
        mapData={districtFeatures}
        revenueMapData={revenueFeatures}
        isOutputPaneOpen
      />
    );

    expect(screen.getByTestId('map-chart')).not.toHaveAttribute(
      'data-legend-count'
    );

    useWindowSize.mockReturnValue({ width: 1200, height: 800 });
  });
});
