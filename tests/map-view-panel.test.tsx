import React from 'react';
import { MapViewPanel } from '@/components/analytics/map-view-panel';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { makeState } from './fixtures';

jest.mock('@/components/analytics/map-component', () => ({
  MapComponent: () => <div data-testid="map-component">Vector map</div>,
}));

jest.mock('@/components/analytics/raster-map-component', () => ({
  RasterMapComponent: () => <div data-testid="raster-map-component">Raster map</div>,
}));

const mockSetMapLayer = jest.fn();
let mockMapLayer: string = 'vector';

jest.mock('next-usequerystate', () => ({
  parseAsString: { withDefault: jest.fn(() => jest.fn()) },
  useQueryState: jest.fn(() => [mockMapLayer, mockSetMapLayer]),
}));

const baseProps = {
  indicator: 'land-surface-temperature',
  analyticsModule: 'heat',
  timePeriod: '2024_10',
  mapDataloading: false,
  revenueMapDataLoading: false,
  indicatorsData: [],
  mapData: { features: [] },
  revenueMapData: { features: [] },
  setRegion: jest.fn(),
  setRevenueRegion: jest.fn(),
  currentSelectedState: makeState({ code: '21', slug: 'odisha', name: 'Odisha' }),
};

const rasterCategories = [
  {
    slug: 'land-surface-temperature',
    name: 'Land Surface Temperature',
    is_raster_available: true,
    children: [],
  },
];

describe('MapViewPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockMapLayer = 'vector';
  });

  it('renders the vector map when raster is unavailable for the indicator', () => {
    render(<MapViewPanel {...baseProps} indicatorCategories={[]} />);

    expect(screen.getByTestId('map-component')).toBeInTheDocument();
    expect(screen.queryByTestId('raster-map-component')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Aggregated' })).not.toBeInTheDocument();
  });

  it('shows the layer toggle when raster is available', () => {
    render(
      <MapViewPanel {...baseProps} indicatorCategories={rasterCategories} />
    );

    expect(screen.getByRole('button', { name: 'Aggregated' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Localized' })).toBeInTheDocument();
  });

  it('renders the raster map when raster layer is active', () => {
    mockMapLayer = 'raster';

    render(
      <MapViewPanel {...baseProps} indicatorCategories={rasterCategories} />
    );

    expect(screen.getByTestId('raster-map-component')).toBeInTheDocument();
    expect(screen.queryByTestId('map-component')).not.toBeInTheDocument();
  });

  it('falls back to vector map when raster layer is active but geography code is missing', () => {
    mockMapLayer = 'raster';

    render(
      <MapViewPanel
        {...baseProps}
        indicatorCategories={rasterCategories}
        currentSelectedState={makeState({ code: '', slug: 'odisha' })}
      />
    );

    expect(screen.getByTestId('map-component')).toBeInTheDocument();
    expect(screen.queryByTestId('raster-map-component')).not.toBeInTheDocument();
  });

  it('updates map layer query state when the toggle is used', async () => {
    const user = userEvent.setup();

    render(
      <MapViewPanel {...baseProps} indicatorCategories={rasterCategories} />
    );

    await user.click(screen.getByRole('button', { name: 'Localized' }));

    expect(mockSetMapLayer).toHaveBeenCalledWith('raster', { shallow: false });
  });

  it('resets raster layer to vector when raster becomes unavailable', async () => {
    mockMapLayer = 'raster';

    const { rerender } = render(
      <MapViewPanel {...baseProps} indicatorCategories={rasterCategories} />
    );

    rerender(<MapViewPanel {...baseProps} indicatorCategories={[]} />);

    await waitFor(() => {
      expect(mockSetMapLayer).toHaveBeenCalledWith('vector', { shallow: true });
    });
  });
});
