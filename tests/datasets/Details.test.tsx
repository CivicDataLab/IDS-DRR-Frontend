import Details from '@/app/[locale]/datasets/[dataset]/components/Details';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('opub-ui');

jest.mock('next/navigation', () => ({
  useParams: () => ({ dataset: 'flood-dataset' }),
}));

jest.mock('@/hooks/use-copy-url', () => ({
  useCopyURL: () => jest.fn(),
}));

jest.mock('@/components/icons', () => ({
  __esModule: true,
  default: {
    share: 'share',
    link: 'link',
    IconBrandFacebook: 'fb',
    IconBrandLinkedin: 'li',
    IconBrandX: 'x',
  },
}));

jest.mock('echarts-for-react', () => ({
  __esModule: true,
  default: () => <div data-testid="echarts">chart</div>,
}));

jest.mock('echarts/core', () => ({
  registerMap: jest.fn(),
}));

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}));

import { useQuery } from '@tanstack/react-query';

const lineChart = {
  name: 'Rainfall Trend',
  description: 'Monthly rainfall trend',
  id: 'chart-1',
  chart: { series: [{ type: 'line' }] },
};

const mapChart = {
  name: 'Flood Map',
  description: 'District flood map',
  id: 'chart-2',
  chartType: 'district-map',
  chart: { series: [{ type: 'map', map: 'assam' }] },
};

describe('dataset Details visualizations', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_BACKEND_URL = 'https://api.example.com';
    process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL = 'https://data.example.com';
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ type: 'FeatureCollection', features: [] }),
    });
  });

  it('renders chart carousel for loaded data', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: { chartsDetails: [lineChart] },
      isLoading: false,
    });

    render(<Details />);

    expect(screen.getByText('Visualizations')).toBeInTheDocument();
    expect(screen.getByText('Rainfall Trend')).toBeInTheDocument();
    expect(screen.getByTestId('echarts')).toBeInTheDocument();
    expect(screen.getByText('Facebook')).toBeInTheDocument();
  });

  it('shows spinner while charts are loading', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
    });

    render(<Details />);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders map error when map series lacks map name', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: {
        chartsDetails: [
          {
            ...mapChart,
            chart: { series: [{ type: 'map' }] },
          },
        ],
      },
      isLoading: false,
    });

    render(<Details />);
    expect(screen.getByText('Unable to load map.')).toBeInTheDocument();
  });

  it('loads map charts when geojson is available', async () => {
    (useQuery as jest.Mock).mockImplementation(({ queryKey }) => {
      if (queryKey[0] === 'chartdata_flood-dataset') {
        return {
          data: { chartsDetails: [mapChart] },
          isLoading: false,
        };
      }
      return {
        data: { type: 'FeatureCollection', features: [] },
        isLoading: false,
        isError: false,
      };
    });

    render(<Details />);
    expect(await screen.findByTestId('echarts')).toBeInTheDocument();
  });
});
