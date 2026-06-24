import React from 'react';
import { ChartView } from '@/components/analytics/chart-view';
import { act, render, screen, waitFor } from '@testing-library/react';

import { makeState } from './fixtures';

// ----------------------
// Helpers
// ----------------------
const mockSetDistrictCode = jest.fn();
const mockSetRevenueCode = jest.fn();
const mockSetIndicatorCode = jest.fn();

const mockUseQuery = jest.fn();

// DRY helper for mocking useQueryState
const setupQueryState = (overrides: Record<string, [any, jest.Mock]> = {}) => {
  const defaults: Record<string, [any, jest.Mock]> = {
    'district-code': ['', mockSetDistrictCode],
    'revenue-code': ['', mockSetRevenueCode],
    indicator: ['risk-score', mockSetIndicatorCode],
  };
  return (key: string) => overrides[key] ?? defaults[key] ?? ['', jest.fn()];
};

// ----------------------
// Mocks
// ----------------------
jest.mock('opub-ui');
jest.mock('@tanstack/react-query', () => ({
  // mock only what you need
  useQuery: (options: { queryKey: any; queryFn: any; [key: string]: any }) =>
    mockUseQuery(options),
  // if you also need QueryClientProvider etc., you can forward them:
  // ...jest.requireActual('@tanstack/react-query'),
}));

jest.mock('next-usequerystate', () => ({
  parseAsString: { withDefault: jest.fn(() => jest.fn()) },
  useQueryState: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useSearchParams: () =>
    new URLSearchParams('indicator=risk-score&time-period=2023_08&view=map'),
}));

jest.mock('@internationalized/date', () => ({
  parseDate: jest.fn(() => ({ year: 2023, month: 8 })),
}));

jest.mock('echarts-for-react', () =>
  React.forwardRef<HTMLDivElement, any>(({ option }, ref) => (
    <div
      data-testid="echarts-component"
      data-option={JSON.stringify(option)}
      ref={ref}
    >
      Mock Chart
    </div>
  ))
);

jest.mock('@/components/media-rendering', () => ({
  MediaRendering: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

jest.mock(
  '@/components/analytics/filter-dropdown-options',
  () => ({
    __esModule: true,
    default: () => (
      <div data-testid="filter-dropdown-options">Filter Options</div>
    ),
  })
);

jest.mock('@/lib/utils', () => ({
  toTitleCase: jest.fn((str) => str.charAt(0).toUpperCase() + str.slice(1)),
}));

jest.mock('@/lib/analytics', () => ({
  Factors: ['risk-score', 'exposure', 'vulnerability'],
}));

jest.mock('@/config/graphql/analaytics-queries', () => ({
  ANALYTICS_INDICATORS_BY_CATEGORY: 'mock-query',
}));

jest.mock('@/lib/api', () => ({
  GraphQL: jest.fn(() => Promise.resolve({ data: 'mock-data' })),
}));

// ----------------------
// Test Suite
// ----------------------
describe('ChartView', () => {
  const mockCurrentSelectedState = makeState({ code: 'AS', name: 'Assam' });
  const mockRevCircleDropdownOptions = [
    { label: 'Revenue Circle A', value: 'RC001' },
  ];
  const mockDistrictDropDownOption = [
    { label: 'District 1', value: 'DIST001' },
  ];
  const mockTimeLimits = ['2023_08'];

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseQuery.mockReturnValue({ data: { indicatorsByCategory: [] } });

    jest
      .requireMock('next-usequerystate')
      .useQueryState.mockImplementation(setupQueryState());

    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: async () => ({}),
    } as Response);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders chart view with filters', async () => {
    await act(async () => {
      render(
        <ChartView
          currentSelectedState={mockCurrentSelectedState}
          RevCircleDropdownOptions={mockRevCircleDropdownOptions}
          DistrictDropDownOption={mockDistrictDropDownOption}
          timeLimits={mockTimeLimits}
        />
      );
    });
    expect(screen.getByTestId('filter-dropdown-options')).toBeInTheDocument();
  });

  it('renders echarts when data available', async () => {
    jest
      .requireMock('next-usequerystate')
      .useQueryState.mockImplementation(
        setupQueryState({ 'district-code': ['DIST001', mockSetDistrictCode] })
      );
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => ({ xAxis: { data: [] }, yAxis: {}, series: [] }),
    });

    await act(async () => {
      render(
        <ChartView
          currentSelectedState={mockCurrentSelectedState}
          RevCircleDropdownOptions={mockRevCircleDropdownOptions}
          DistrictDropDownOption={mockDistrictDropDownOption}
          timeLimits={mockTimeLimits}
        />
      );
    });
    expect(await screen.findByTestId('echarts-component')).toBeInTheDocument();
  });

  it('shows loading state', async () => {
    jest
      .requireMock('next-usequerystate')
      .useQueryState.mockImplementation(
        setupQueryState({ 'district-code': ['DIST001', mockSetDistrictCode] })
      );
    (global.fetch as jest.Mock).mockImplementation(
      () => new Promise(() => undefined)
    );

    await act(async () => {
      render(
        <ChartView
          currentSelectedState={mockCurrentSelectedState}
          RevCircleDropdownOptions={mockRevCircleDropdownOptions}
          DistrictDropDownOption={mockDistrictDropDownOption}
          timeLimits={mockTimeLimits}
        />
      );
    });
    expect(await screen.findByText(/Loading.../i)).toBeInTheDocument();
  });

  it('shows error state', async () => {
    // The component logs the failure via console.error; silence that in
    // this test since we're exercising the failure path deliberately.
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    jest
      .requireMock('next-usequerystate')
      .useQueryState.mockImplementation(
        setupQueryState({ 'district-code': ['DIST001', mockSetDistrictCode] })
      );
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => {
        throw new Error('failed');
      },
    });

    await act(async () => {
      render(
        <ChartView
          currentSelectedState={mockCurrentSelectedState}
          RevCircleDropdownOptions={mockRevCircleDropdownOptions}
          DistrictDropDownOption={mockDistrictDropDownOption}
          timeLimits={mockTimeLimits}
        />
      );
    });
    expect(
      await screen.findByText(/Error: Failed to fetch/i)
    ).toBeInTheDocument();
    errorSpy.mockRestore();
  });

  it('sends correct payload in fetch', async () => {
    jest
      .requireMock('next-usequerystate')
      .useQueryState.mockImplementation(
        setupQueryState({ 'district-code': ['DIST001', mockSetDistrictCode] })
      );

    await act(async () => {
      render(
        <ChartView
          currentSelectedState={mockCurrentSelectedState}
          RevCircleDropdownOptions={mockRevCircleDropdownOptions}
          DistrictDropDownOption={mockDistrictDropDownOption}
          timeLimits={mockTimeLimits}
        />
      );
    });

    expect(global.fetch).toHaveBeenCalled();
    const [, init] = (global.fetch as jest.Mock).mock.calls[0];
    const body = JSON.parse(init.body);
    expect(body.filters.some((f: any) => f.value === 'DIST001')).toBe(true);
    expect(body.filters.some((f: any) => f.value === '2023_08')).toBe(true);
  });

  it('handles missing search params gracefully', async () => {
    jest.doMock('next/navigation', () => ({
      useSearchParams: () => new URLSearchParams(),
    }));

    await act(async () => {
      render(
        <ChartView
          currentSelectedState={mockCurrentSelectedState}
          RevCircleDropdownOptions={mockRevCircleDropdownOptions}
          DistrictDropDownOption={mockDistrictDropDownOption}
          timeLimits={mockTimeLimits}
        />
      );
    });
    expect(screen.getByTestId('filter-dropdown-options')).toBeInTheDocument();
  });
});
