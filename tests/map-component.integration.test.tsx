import React from 'react';
import { MapComponent } from '@/app/[locale]/[state]/analytics/components/map-component';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';

jest.mock('opub-ui');

jest.mock('@/hooks/use-window-size', () => ({
  useWindowSize: jest.fn(() => ({ width: 1200, height: 800 })),
}));

jest.mock('@/hooks/use-format-number', () => ({
  useFormatNumber: () => (value: number | string) => `fmt-${value}`,
}));

jest.mock('@/app/[locale]/[state]/analytics/utils/utils', () => ({
  getFactorNameBySlug: jest.fn((_data, slug) => `Factor ${slug}`),
  getUnitsBySlug: jest.fn(() => 'mm'),
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

      return (
        <div data-testid="map-chart" data-legend-count={props.legendData?.length}>
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
    {
      name: 'Risk Score',
      slug: 'risk-score',
      unit: 'score',
      short_description: 'Risk',
    },
    {
      name: 'Exposure',
      slug: 'exposure',
      unit: 'mm',
      short_description: 'Exposure',
    },
  ],
  setRegion: jest.fn(),
  setRevenueRegion: jest.fn(),
  currentSelectedState: {
    slug: 'assam',
    code: 'AS',
    bounds: [
      [0, 0],
      [2, 2],
    ],
    center: [26.2, 91.7],
  },
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
    jest.useFakeTimers();
    window.history.pushState({}, '', '/assam/analytics');
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
    window.history.pushState({}, '', '/assam/analytics?district-code=AS-01');
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
    window.history.pushState({}, '', '/assam/analytics?district-code=AS-01');

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
});
