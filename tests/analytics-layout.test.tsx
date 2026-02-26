import React from 'react';
// Component under test
import { AnalyticsMainLayout } from '@/app/[locale]/[state]/analytics/components/analytics-layout';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock next/navigation hooks
jest.mock('next/navigation', () => {
  const params: Record<string, string> = {};
  return {
    useParams: () => ({ state: 'assam' }),
    useSearchParams: () => ({
      get: (key: string) => params[key] ?? null,
    }),
    __setSearchParams: (updates: Record<string, string>) =>
      Object.assign(params, updates),
    __getParam: (key: string) => params[key],
  };
});

// Helper to override search params in tests
const setSearchParams = (updates: Record<string, string>) => {
  const nav: any = require('next/navigation');
  nav.__setSearchParams(updates);
};

// Mock next-usequerystate
const setViewMock = jest.fn();
const setDistrictCodeMock = jest.fn();
const setRevenueCodeMock = jest.fn();
jest.mock('next-usequerystate', () => ({
  parseAsString: { withDefault: (def: string) => def },
  useQueryState: (key: string) => {
    const nav: any = require('next/navigation');
    if (key === 'district-code') return ['', setDistrictCodeMock];
    if (key === 'revenue-code') return ['', setRevenueCodeMock];
    if (key === 'view') return [nav.__getParam('view') || 'map', setViewMock];
    return ['', jest.fn()];
  },
}));

// Mock opub-ui components used
jest.mock('opub-ui');

// Mock MediaRendering to always render children
jest.mock('@/components/media-rendering', () => ({
  MediaRendering: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// Mock lib/api to avoid React.cache usage in tests
jest.mock('@/lib/api', () => ({
  GraphQL: jest.fn(async () => ({})),
}));

// Mock heavy child components to simple placeholders
jest.mock(
  '@/app/[locale]/[state]/analytics/components/filter-dropdown-options',
  () => ({
    __esModule: true,
    default: () => (
      <div data-testid="filter-dropdown">FilterDropdownOptions</div>
    ),
  })
);
jest.mock('@/app/[locale]/[state]/analytics/components/map-component', () => ({
  MapComponent: () => <div data-testid="map-component">MapComponent</div>,
}));
jest.mock(
  '@/app/[locale]/[state]/analytics/components/table-component',
  () => ({
    TableComponent: () => (
      <div data-testid="table-component">TableComponent</div>
    ),
  })
);
jest.mock('@/app/[locale]/[state]/analytics/components/chart-view', () => ({
  ChartView: () => <div data-testid="chart-view">ChartView</div>,
}));
jest.mock(
  '@/app/[locale]/[state]/analytics/components/analytics-mobile-layout',
  () => ({
    AnalyticsMobileLayout: () => (
      <div data-testid="mobile-layout">MobileLayout</div>
    ),
  })
);
jest.mock('@/app/[locale]/[state]/analytics/components/output-window', () => ({
  OutputWindow: () => <div data-testid="output-window">OutputWindow</div>,
}));

// Mock getLatestDate utility
jest.mock('@/app/[locale]/[state]/analytics/utils/utils', () => ({
  getLatestDate: (arr: string[]) =>
    arr[arr.length - 1]?.replace('_', '-') || null,
}));

// Mock GraphQL queries usage via react-query useQuery
const mockStatesListQuery = {
  data: {
    getStates: [
      {
        slug: 'assam',
        code: 'AS',
        child_type: 'tehsil',
        latest_time_period: '2023_02',
      },
    ],
  },
  isFetching: false,
  isError: false,
};

const mockDistrictMapQuery = {
  data: { districtMapData: [{ code: 'AS-01' }] },
  isFetching: false,
} as any;

const mockRevenueMapQuery = {
  data: { revCircleMapData: [{ code: 'RC-01' }] },
  isFetching: false,
} as any;

const mockDistrictGeoQuery = {
  data: { getDistrictRevCircle: [{ district: 'X', code: 'AS-01' }] },
  isFetching: false,
} as any;

const mockRevenueGeoQuery = {
  data: {
    getDistrictRevCircle: {
      test: [{ tehsil: 'T1', code: 'RC-01', district_code: 'AS-01' }],
    },
  },
  isFetching: false,
} as any;

const mockTimePeriodsQuery = {
  data: { timePeriods: ['2023_01', '2023_02'] },
  isFetching: false,
} as any;

const mockIndicatorsQuery = {
  data: { indicators: [{ slug: 'risk-score' }] },
  isFetching: false,
} as any;

const mockTableQuery = {
  data: { tableData: [{ 'revenue-circle-code': 'RC-01' }] },
  isLoading: false,
  isFetching: false,
} as any;

const mockSidePaneQuery = {
  data: { districtViewData: [], revCircleViewData: [] },
  isFetched: true,
} as any;

jest.mock('@tanstack/react-query', () => ({
  useQuery: (q: { queryKey: any; queryFn?: any; [key: string]: any }) => {
    const k = Array.isArray(q.queryKey) ? q.queryKey[0] : q.queryKey;

    if (typeof k === 'string' && k.startsWith('states_list')) {
      return mockStatesListQuery;
    }

    if (typeof k === 'string' && k.startsWith('mapQuery_district')) {
      return mockDistrictMapQuery;
    }

    if (typeof k === 'string' && k.startsWith('mapQuery_revenue-circle')) {
      return mockRevenueMapQuery;
    }

    if (typeof k === 'string' && k.startsWith('geographies_data_district')) {
      return mockDistrictGeoQuery;
    }

    if (typeof k === 'string' && k.startsWith('geographies_data_revenue')) {
      return mockRevenueGeoQuery;
    }

    if (typeof k === 'string' && k.startsWith('timePeriods')) {
      return mockTimePeriodsQuery;
    }

    if (typeof k === 'string' && k.startsWith('indicators_')) {
      return mockIndicatorsQuery;
    }

    if (typeof k === 'string' && k.startsWith('table_data_')) {
      return mockTableQuery;
    }

    if (typeof k === 'string' && k.startsWith('sidePaneData_')) {
      return mockSidePaneQuery;
    }

    return { data: undefined, isFetching: false } as any;
  },
}));

describe('AnalyticsMainLayout', () => {
  beforeEach(() => {
    // default params
    setSearchParams({
      indicator: 'risk-score',
      'time-period': '2023_01,2023_02',
      view: 'map',
    });
  });

  it('renders map view with filter and map component', () => {
    render(<AnalyticsMainLayout />);
    expect(screen.getAllByTestId('filter-dropdown')[0]).toBeInTheDocument();
    expect(screen.getByTestId('map-component')).toBeInTheDocument();
    // OutputWindow not shown when no region
    expect(screen.queryByTestId('output-window')).not.toBeInTheDocument();
  });

  it('renders table view with table component', () => {
    setSearchParams({ view: 'table' });
    render(<AnalyticsMainLayout />);
    expect(screen.getAllByTestId('filter-dropdown')[0]).toBeInTheDocument();
    expect(screen.getByTestId('table-component')).toBeInTheDocument();
  });

  it('renders chart view with chart component', () => {
    setSearchParams({ view: 'chart' });
    render(<AnalyticsMainLayout />);
    expect(screen.getByTestId('chart-view')).toBeInTheDocument();
  });

  it('renders output window when region is selected', () => {
    setSearchParams({ view: 'map', 'district-code': 'AS-01' });
    render(<AnalyticsMainLayout />);
    expect(screen.getByTestId('output-window')).toBeInTheDocument();
  });
});
