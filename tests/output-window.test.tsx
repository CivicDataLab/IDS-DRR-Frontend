import React from 'react';
import { OutputWindow } from '@/app/[locale]/[state]/analytics/components/output-window';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('opub-ui');

jest.mock('@/components/media-rendering', () => ({
  MediaRendering: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

const setDistrictCodeMock = jest.fn();
const setRevenueCodeMock = jest.fn();

jest.mock('next-usequerystate', () => ({
  useQueryState: (key: string) => {
    const nav: { __getParam: (k: string) => string | null } =
      require('next/navigation');
    if (key === 'district-code') {
      return [nav.__getParam('district-code') ?? '', setDistrictCodeMock];
    }
    if (key === 'revenue-code') {
      return [nav.__getParam('revenue-code') ?? '', setRevenueCodeMock];
    }
    return ['', jest.fn()];
  },
}));

jest.mock('next/navigation', () => {
  const params: Record<string, string> = {
    view: 'map',
    'district-code': 'AS-01',
  };
  return {
    useSearchParams: () => ({
      get: (key: string) => params[key] ?? null,
    }),
    __setSearchParams: (updates: Record<string, string>) =>
      Object.assign(params, updates),
    __getParam: (key: string) => params[key] ?? null,
  };
});

const setSearchParams = (updates: Record<string, string>) => {
  const nav = require('next/navigation') as {
    __setSearchParams: (u: Record<string, string>) => void;
  };
  nav.__setSearchParams(updates);
};

jest.mock('@/lib/api', () => ({
  GraphQL: jest.fn(async () => ({
    getDataTimePeriods: [{ value: '2025_03' }],
  })),
}));

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(() => ({
    data: { getDataTimePeriods: [{ value: '2025_03' }] },
    isLoading: false,
  })),
}));

jest.mock('@/config/site', () => ({
  docsLink: 'https://example.com/docs',
}));

jest.mock('@/hooks/use-format-number', () => ({
  useFormatNumber: () => (value: number | string) => `fmt-${value}`,
}));

jest.mock('@/components/FactorIcons', () => ({
  RiskScore: () => <div data-testid="risk-score-icon" />,
  Vulnerability: () => <div data-testid="vulnerability-icon" />,
  FloodHazard: () => <div data-testid="flood-hazard-icon" />,
  Exposure: () => <div data-testid="exposure-icon" />,
  GovtResponse: () => <div data-testid="govt-response-icon" />,
}));

jest.mock('@/components/icons', () => ({
  __esModule: true,
  default: {
    back: 'back-icon',
    cross: 'cross-icon',
    up: 'up-icon',
    down: 'down-icon',
    IconArrowUpRight: 'arrow-icon',
  },
}));

const indicatorDescriptions = [
  {
    slug: 'risk-score',
    name: 'Overall Flood Risk',
    long_description: 'Overall risk description',
    IDS_dataSpace: 'https://example.com/source',
  },
  {
    slug: 'flood-hazard',
    name: 'Hazard',
    long_description: 'Hazard description',
  },
  {
    slug: 'exposure',
    name: 'Exposure',
    long_description: 'Exposure description',
  },
  {
    slug: 'vulnerability',
    name: 'Vulnerability',
    long_description: 'Vulnerability description',
  },
  {
    slug: 'government-response',
    name: 'Government Response',
    long_description: 'Government response description',
  },
];

const districtRow = {
  district: 'Kamrup',
  'district-code': 'AS-01',
  'risk-score': { value: '4' },
  'flood-hazard': { value: '3', title: 'Hazard' },
  exposure: { value: '2', title: 'Exposure' },
  vulnerability: { value: '3', title: 'Vulnerability' },
  'government-response': { value: '2', title: 'Government Response' },
};

describe('OutputWindow', () => {
  const onClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    setSearchParams({
      view: 'map',
      'district-code': 'AS-01',
      'revenue-code': '',
    });
  });

  const renderWindow = (overrides: Record<string, unknown> = {}) =>
    render(
      <OutputWindow
        data={[districtRow]}
        indicatorDescriptions={indicatorDescriptions}
        indicator="risk-score"
        boundary="district"
        currentState={{ child_type: 'Tehsil' }}
        onClose={onClose}
        {...overrides}
      />
    );

  it('renders district heading and risk level for a selected region', () => {
    renderWindow();

    expect(screen.getAllByText('Kamrup Division').length).toBeGreaterThan(0);
    expect(screen.getAllByText('High Risk').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Overall Flood Risk').length).toBeGreaterThan(0);
  });

  it('lists contributing indicators for risk-score', () => {
    renderWindow();

    expect(
      screen.getAllByText(
        /Some of the indicators contributing to Overall Flood Risk/
      ).length
    ).toBeGreaterThan(0);
    expect(screen.getAllByTestId('progress-bar').length).toBeGreaterThan(0);
  });

  it('calls onClose from the desktop close button', async () => {
    const user = userEvent.setup();
    renderWindow();

    await user.click(screen.getAllByLabelText('Close details')[0]);
    expect(onClose).toHaveBeenCalled();
  });

  it('clears district code when back is pressed without a revenue region', async () => {
    const user = userEvent.setup();
    renderWindow();

    await user.click(screen.getAllByRole('button')[0]);
    expect(setDistrictCodeMock).toHaveBeenCalledWith(null);
  });

  it('shows documentation link for parent indicators', () => {
    renderWindow();

    const docsLink = screen.getByRole('link', { name: 'Read the Documentation' });
    expect(docsLink).toHaveAttribute('href', 'https://example.com/docs');
  });

  it('shows source data link for non-parent indicators', () => {
    renderWindow({
      indicator: 'population',
      data: [{ ...districtRow, population: { value: '1000' } }],
      indicatorDescriptions: [
        ...indicatorDescriptions,
        {
          slug: 'population',
          name: 'Population',
          long_description: 'Population description',
          IDS_dataSpace: 'https://example.com/population',
        },
      ],
    });

    const sourceLink = screen.getByRole('link', {
      name: 'Explore Source Data',
    });
    expect(sourceLink).toHaveAttribute('href', 'https://example.com/source');
    expect(screen.getAllByText('fmt-1000').length).toBeGreaterThan(0);
  });

  it('renders mobile overlay controls and toggles expand state', () => {
    renderWindow();

    const expandButtons = screen.getAllByRole('button').filter((btn) => {
      const icon = btn.querySelector('[data-icon="up-icon"]');
      return icon !== null;
    });
    expect(expandButtons.length).toBeGreaterThan(0);

    fireEvent.click(expandButtons[0]);
    expect(
      screen.getAllByRole('button').some((btn) =>
        btn.querySelector('[data-icon="down-icon"]')
      )
    ).toBe(true);
  });

  it('renders subdivision heading in a revenue region', () => {
    setSearchParams({ 'revenue-code': 'REV-01', 'district-code': 'AS-01' });
    const revenueRow = {
      ...districtRow,
      type: 'Revenue Circle',
      'Revenue-Circle': 'North Guwahati',
    };

    renderWindow({ data: [revenueRow] });

    expect(screen.getAllByText('North Guwahati Tehsil').length).toBeGreaterThan(
      0
    );
  });
});
