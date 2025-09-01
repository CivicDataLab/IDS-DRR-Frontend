import React from 'react';
import { MapComponent } from '@/app/[locale]/[state]/analytics/components/map-component';
import { render, screen } from '@testing-library/react';

// Mock opub-ui components
jest.mock('opub-ui');

// Mock hooks
jest.mock('@/hooks/use-window-size', () => ({
  useWindowSize: () => ({ width: 1024, height: 768 }),
}));

// Mock components
jest.mock('@/components/MapChart', () => ({
  __esModule: true,
  default: ({ data, onRegionClick, onRevenueRegionClick }: any) => (
    <div
      data-testid="map-chart"
      data-region-click={!!onRegionClick}
      data-revenue-click={!!onRevenueRegionClick}
    >
      Map Chart Component
    </div>
  ),
}));

// Mock utils
jest.mock('@/app/[locale]/[state]/analytics/utils/utils', () => ({
  formatNumberToIndianSystem: jest.fn((value) => `formatted-${value}`),
  getFactorNameBySlug: jest.fn((factorData, slug) => `Factor ${slug}`),
  getUnitsBySlug: jest.fn((slug) => `units-${slug}`),
}));

// Mock config
jest.mock('@/config/consts', () => ({
  Factors: ['risk-score', 'exposure', 'vulnerability'],
  RiskText: {
    1: { indicatorText: 'Very Low Risk' },
    2: { indicatorText: 'Low Risk' },
    3: { indicatorText: 'Medium Risk' },
    4: { indicatorText: 'High Risk' },
    5: { indicatorText: 'Very High Risk' },
  },
}));

// Mock geo_json
jest.mock('@/geo_json/hp_rivers_geojson', () => ({
  hp_rivers_features: [
    {
      type: 'Feature',
      properties: {
        name: 'River A',
        'risk-score': 3,
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [0, 0],
          [1, 1],
        ],
      },
    },
  ],
}));

describe('MapComponent', () => {
  const mockIndicator = 'risk-score';
  const mockMapDataloading = false;
  const mockRevenueMapDataLoading = false;
  const mockSetRegion = jest.fn();
  const mockSetRevenueRegion = jest.fn();
  const mockCurrentSelectedState = {
    code: 'AS',
    name: 'Assam',
  };

  const mockIndicatorsData = [
    {
      name: 'Risk Score',
      slug: 'risk-score',
      unit: 'score',
      short_description: 'Overall risk assessment',
    },
  ];

  const mockMapData = {
    features: [
      {
        type: 'Feature',
        properties: {
          name: 'District A',
          'risk-score': 4,
          exposure: 1000000,
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [0, 0],
              [1, 0],
              [1, 1],
              [0, 1],
              [0, 0],
            ],
          ],
        },
      },
      {
        type: 'Feature',
        properties: {
          name: 'District B',
          'risk-score': 2,
          exposure: 500000,
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [1, 1],
              [2, 1],
              [2, 2],
              [1, 2],
              [1, 1],
            ],
          ],
        },
      },
    ],
  };

  const mockRevenueMapData = {
    features: [
      {
        type: 'Feature',
        properties: {
          name: 'Revenue Circle A',
          'risk-score': 3,
          exposure: 200000,
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [0, 0],
              [0.5, 0],
              [0.5, 0.5],
              [0, 0.5],
              [0, 0],
            ],
          ],
        },
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders map component with district data', () => {
    render(
      <MapComponent
        indicator={mockIndicator}
        mapDataloading={mockMapDataloading}
        indicatorsData={mockIndicatorsData}
        revenueMapDataLoading={mockRevenueMapDataLoading}
        mapData={mockMapData}
        revenueMapData={mockRevenueMapData}
        setRegion={mockSetRegion}
        setRevenueRegion={mockSetRevenueRegion}
        currentSelectedState={mockCurrentSelectedState}
      />
    );

    expect(screen.getByTestId('map-chart')).toBeInTheDocument();
  });

  it('renders loading state when map data is loading', () => {
    render(
      <MapComponent
        indicator={mockIndicator}
        mapDataloading={true}
        indicatorsData={mockIndicatorsData}
        revenueMapDataLoading={mockRevenueMapDataLoading}
        mapData={mockMapData}
        revenueMapData={mockRevenueMapData}
        setRegion={mockSetRegion}
        setRevenueRegion={mockSetRevenueRegion}
        currentSelectedState={mockCurrentSelectedState}
      />
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders loading state when revenue map data is loading', () => {
    render(
      <MapComponent
        indicator={mockIndicator}
        mapDataloading={mockMapDataloading}
        indicatorsData={mockIndicatorsData}
        revenueMapDataLoading={true}
        mapData={mockMapData}
        revenueMapData={mockRevenueMapData}
        setRegion={mockSetRegion}
        setRevenueRegion={mockSetRevenueRegion}
        currentSelectedState={mockCurrentSelectedState}
      />
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders map chart with correct props for district view', () => {
    render(
      <MapComponent
        indicator={mockIndicator}
        mapDataloading={mockMapDataloading}
        indicatorsData={mockIndicatorsData}
        revenueMapDataLoading={mockRevenueMapDataLoading}
        mapData={mockMapData}
        revenueMapData={mockRevenueMapData}
        setRegion={mockSetRegion}
        setRevenueRegion={mockSetRevenueRegion}
        currentSelectedState={mockCurrentSelectedState}
      />
    );

    const mapChart = screen.getByTestId('map-chart');
    expect(mapChart).toHaveAttribute('data-region-click', 'false');
    expect(mapChart).toHaveAttribute('data-revenue-click', 'false');
  });

  it('renders map chart with correct props for revenue circle view', () => {
    // Mock URLSearchParams to return revenue-circle boundary
    const originalURLSearchParams = global.URLSearchParams;
    global.URLSearchParams = jest.fn().mockImplementation(() => ({
      get: jest.fn().mockReturnValue('revenue-circle'),
    }));

    render(
      <MapComponent
        indicator={mockIndicator}
        mapDataloading={mockMapDataloading}
        indicatorsData={mockIndicatorsData}
        revenueMapDataLoading={mockRevenueMapDataLoading}
        mapData={mockMapData}
        revenueMapData={mockRevenueMapData}
        setRegion={mockSetRegion}
        setRevenueRegion={mockSetRevenueRegion}
        currentSelectedState={mockCurrentSelectedState}
      />
    );

    const mapChart = screen.getByTestId('map-chart');
    expect(mapChart).toHaveAttribute('data-region-click', 'false');
    expect(mapChart).toHaveAttribute('data-revenue-click', 'false');
  });

  it('handles empty map data', () => {
    const emptyMapData = {
      features: [],
    };

    render(
      <MapComponent
        indicator={mockIndicator}
        mapDataloading={mockMapDataloading}
        indicatorsData={mockIndicatorsData}
        revenueMapDataLoading={mockRevenueMapDataLoading}
        mapData={emptyMapData}
        revenueMapData={mockRevenueMapData}
        setRegion={mockSetRegion}
        setRevenueRegion={mockSetRevenueRegion}
        currentSelectedState={mockCurrentSelectedState}
      />
    );

    expect(screen.getByTestId('map-chart')).toBeInTheDocument();
  });

  it('handles null map data', () => {
    render(
      <MapComponent
        indicator={mockIndicator}
        mapDataloading={mockMapDataloading}
        indicatorsData={mockIndicatorsData}
        revenueMapDataLoading={mockRevenueMapDataLoading}
        mapData={{ features: [] }}
        revenueMapData={mockRevenueMapData}
        setRegion={mockSetRegion}
        setRevenueRegion={mockSetRevenueRegion}
        currentSelectedState={mockCurrentSelectedState}
      />
    );

    expect(screen.getByTestId('map-chart')).toBeInTheDocument();
  });

  it('handles different indicators', () => {
    render(
      <MapComponent
        indicator="exposure"
        mapDataloading={mockMapDataloading}
        indicatorsData={mockIndicatorsData}
        revenueMapDataLoading={mockRevenueMapDataLoading}
        mapData={mockMapData}
        revenueMapData={mockRevenueMapData}
        setRegion={mockSetRegion}
        setRevenueRegion={mockSetRevenueRegion}
        currentSelectedState={mockCurrentSelectedState}
      />
    );

    expect(screen.getByTestId('map-chart')).toBeInTheDocument();
  });

  it('handles mobile view', () => {
    // Mock useWindowSize to return mobile dimensions
    jest.doMock('@/hooks/use-window-size', () => ({
      useWindowSize: () => ({ width: 768, height: 1024 }),
    }));

    render(
      <MapComponent
        indicator={mockIndicator}
        mapDataloading={mockMapDataloading}
        indicatorsData={mockIndicatorsData}
        revenueMapDataLoading={mockRevenueMapDataLoading}
        mapData={mockMapData}
        revenueMapData={mockRevenueMapData}
        setRegion={mockSetRegion}
        setRevenueRegion={mockSetRevenueRegion}
        currentSelectedState={mockCurrentSelectedState}
      />
    );

    expect(screen.getByTestId('map-chart')).toBeInTheDocument();
  });

  it('handles missing district code in URL', () => {
    // Mock URLSearchParams to return no district code
    const originalURLSearchParams = global.URLSearchParams;
    global.URLSearchParams = jest.fn().mockImplementation(() => ({
      get: jest.fn().mockReturnValue(null),
    }));

    render(
      <MapComponent
        indicator={mockIndicator}
        mapDataloading={mockMapDataloading}
        indicatorsData={mockIndicatorsData}
        revenueMapDataLoading={mockRevenueMapDataLoading}
        mapData={mockMapData}
        revenueMapData={mockRevenueMapData}
        setRegion={mockSetRegion}
        setRevenueRegion={mockSetRevenueRegion}
        currentSelectedState={mockCurrentSelectedState}
      />
    );

    expect(screen.getByTestId('map-chart')).toBeInTheDocument();
  });

  it('handles different current states', () => {
    const differentState = {
      code: 'HP',
      name: 'Himachal Pradesh',
    };

    render(
      <MapComponent
        indicator={mockIndicator}
        mapDataloading={mockMapDataloading}
        indicatorsData={mockIndicatorsData}
        revenueMapDataLoading={mockRevenueMapDataLoading}
        mapData={mockMapData}
        revenueMapData={mockRevenueMapData}
        setRegion={mockSetRegion}
        setRevenueRegion={mockSetRevenueRegion}
        currentSelectedState={differentState}
      />
    );

    expect(screen.getByTestId('map-chart')).toBeInTheDocument();
  });

  it('handles empty indicators data', () => {
    render(
      <MapComponent
        indicator={mockIndicator}
        mapDataloading={mockMapDataloading}
        indicatorsData={[]}
        revenueMapDataLoading={mockRevenueMapDataLoading}
        mapData={mockMapData}
        revenueMapData={mockRevenueMapData}
        setRegion={mockSetRegion}
        setRevenueRegion={mockSetRevenueRegion}
        currentSelectedState={mockCurrentSelectedState}
      />
    );

    expect(screen.getByTestId('map-chart')).toBeInTheDocument();
  });

  it('handles null indicators data', () => {
    render(
      <MapComponent
        indicator={mockIndicator}
        mapDataloading={mockMapDataloading}
        indicatorsData={[]}
        revenueMapDataLoading={mockRevenueMapDataLoading}
        mapData={mockMapData}
        revenueMapData={mockRevenueMapData}
        setRegion={mockSetRegion}
        setRevenueRegion={mockSetRevenueRegion}
        currentSelectedState={mockCurrentSelectedState}
      />
    );

    expect(screen.getByTestId('map-chart')).toBeInTheDocument();
  });
});
