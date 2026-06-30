import React from 'react';
import { RasterMapComponent } from '@/components/analytics/raster-map-component';
import { render, screen, waitFor } from '@testing-library/react';

import { makeState } from './fixtures';

const mockFetchRasterMetadata = jest.fn();
const mockSetMap = jest.fn();

jest.mock('@/hooks/use-window-size', () => ({
  useWindowSize: () => ({ width: 1280, height: 800 }),
}));

jest.mock('@/hooks/use-format-number', () => ({
  useFormatNumber: () => (value: number | string) => String(value),
}));

jest.mock('@/lib/analytics/utils', () => ({
  getFactorNameBySlug: () => 'Land Surface Temperature',
  getUnitsBySlug: () => '°C',
}));

jest.mock('@/lib/analytics/module-config', () => ({
  ...jest.requireActual('@/lib/analytics/module-config'),
  hasSubDistrictSupport: () => false,
}));

jest.mock('@/lib/raster', () => ({
  ...jest.requireActual('@/lib/raster'),
  fetchRasterMetadata: (...args: unknown[]) => mockFetchRasterMetadata(...args),
  fetchRasterValue: jest.fn(),
}));

jest.mock('@/components/MapChart', () => ({
  __esModule: true,
  default: ({ setMap }: { setMap?: (map: unknown) => void }) => {
    React.useEffect(() => {
      setMap?.({
        on: jest.fn(),
        off: jest.fn(),
        closePopup: jest.fn(),
        getContainer: () => ({
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
        }),
        createPane: jest.fn(),
        getPane: () => ({ style: {} }),
        removeLayer: jest.fn(),
        fitBounds: jest.fn(),
      });
    }, [setMap]);

    return <div data-testid="map-chart">Raster map chart</div>;
  },
}));

jest.mock('leaflet', () => ({
  __esModule: true,
  default: {
    tileLayer: jest.fn(() => ({ addTo: jest.fn() })),
    popup: jest.fn(() => ({
      setLatLng: jest.fn().mockReturnThis(),
      setContent: jest.fn().mockReturnThis(),
      openOn: jest.fn(),
    })),
  },
}));

const baseProps = {
  module: 'heat',
  indicator: 'land-surface-temperature',
  geographyCode: '21',
  period: '2024_10',
  currentSelectedState: makeState({
    code: '21',
    slug: 'odisha',
    name: 'Odisha',
    center: [85.1, 20.3],
  }),
  setRegion: jest.fn(),
  setRevenueRegion: jest.fn(),
};

const metadata = {
  bounds: [80, 10, 90, 20] as [number, number, number, number],
  minzoom: 6,
  maxzoom: 12,
  center: [85, 15] as [number, number],
  tile_url_template: '/tiles/{z}/{x}/{y}.png',
};

describe('RasterMapComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL = 'http://localhost:8000';
  });

  it('shows loading state while metadata is fetched', () => {
    mockFetchRasterMetadata.mockReturnValue(new Promise(() => {}));

    render(<RasterMapComponent {...baseProps} />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows an error message when metadata fetch fails', async () => {
    mockFetchRasterMetadata.mockRejectedValue(new Error('Raster unavailable'));

    render(<RasterMapComponent {...baseProps} />);

    await waitFor(() => {
      expect(screen.getByText('Unable to load raster layer.')).toBeInTheDocument();
    });
    expect(screen.getByText('Raster unavailable')).toBeInTheDocument();
  });

  it('renders the map chart after metadata loads', async () => {
    mockFetchRasterMetadata.mockResolvedValue(metadata);

    render(<RasterMapComponent {...baseProps} />);

    await waitFor(() => {
      expect(screen.getByTestId('map-chart')).toBeInTheDocument();
    });

    expect(mockFetchRasterMetadata).toHaveBeenCalledWith({
      module: 'heat',
      indicator: 'land-surface-temperature',
      geography_code: '21',
      period: '2024_10',
    });
  });
});
