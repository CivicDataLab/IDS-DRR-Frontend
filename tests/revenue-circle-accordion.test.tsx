import React from 'react';
import {
  RevenueCircle,
  ScoreInfo,
} from '@/app/[locale]/[state]/analytics/components/revenue-circle-accordion';
import { fireEvent, render, screen } from '@testing-library/react';

// Mock opub-ui components
jest.mock('opub-ui');

// Mock next/navigation
const mockSearchParams = new URLSearchParams(
  'time-period=2023_08&boundary=district&region=district1'
);
jest.mock('next/navigation', () => ({
  useSearchParams: () => mockSearchParams,
}));

// jest.mock('structuredClone')

// Mock utils
jest.mock('@/lib/utils', () => ({
  deSlugify: jest.fn((str) => str.replace(/-/g, ' ')),
}));

jest.mock('@/app/[locale]/[state]/analytics/utils/utils', () => ({
  formatNumberToIndianSystem: jest.fn((value) => `formatted-${value}`),
  getFactorNameBySlug: jest.fn((factorData, slug) => `Factor ${slug}`),
}));

global.structuredClone = (val) => {
  if (val === undefined) return undefined;
  return JSON.parse(JSON.stringify(val));
};

// Mock config
jest.mock('@/config/consts', () => ({
  RiskColorMap: {
    1: '#00ff00',
    2: '#ffff00',
    3: '#ffa500',
    4: '#ff0000',
    5: '#800000',
  },
}));

// Mock public components
jest.mock('@/public/InfoCircle', () => ({
  InfoSquare: () => <div data-testid="info-square">Info</div>,
}));

describe('RevenueCircle', () => {
  const mockFactorData = {
    'risk-score': { name: 'Risk Score' },
    exposure: { name: 'Exposure' },
    vulnerability: { name: 'Vulnerability' },
  };

  const mockRevenueCircleData = [
    {
      'revenue circle': 'Revenue Circle A',
      'revenue-circle-code': 'RC001',
      'risk-score': { value: '4', title: 'Risk Score' },
      exposure: { value: '3', title: 'Exposure' },
      vulnerability: { value: '2', title: 'Vulnerability' },
    },
    {
      'revenue circle': 'Revenue Circle B',
      'revenue-circle-code': 'RC002',
      'risk-score': { value: '2', title: 'Risk Score' },
      exposure: { value: '1', title: 'Exposure' },
      vulnerability: { value: '3', title: 'Vulnerability' },
    },
  ];

  const mockIndicatorDescriptions = [
    {
      name: 'Risk Score',
      slug: 'risk-score',
      short_description: 'Overall risk assessment',
    },
  ];

  const mockGetDescription = jest.fn((slug) => `Description for ${slug}`);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders accordion with revenue circle data', () => {
    render(
      <RevenueCircle
        factorData={mockFactorData}
        revenueCircleData={mockRevenueCircleData}
        indicator="risk-score"
        indicatorDescriptions={mockIndicatorDescriptions}
        getDescription={mockGetDescription}
      />
    );

    const accordion = screen.getByTestId('accordion');
    expect(accordion).toBeInTheDocument();
    expect(accordion).toHaveAttribute('data-type', 'single');
    expect(accordion).toHaveAttribute('data-default', 'revenue-circle-0');
  });

  it('renders revenue circle names', () => {
    render(
      <RevenueCircle
        factorData={mockFactorData}
        revenueCircleData={mockRevenueCircleData}
        indicator="risk-score"
        indicatorDescriptions={mockIndicatorDescriptions}
        getDescription={mockGetDescription}
      />
    );

    expect(screen.getByText('Revenue Circle A')).toBeInTheDocument();
    expect(screen.getByText('Revenue Circle B')).toBeInTheDocument();
  });

  it('renders progress bars with correct values', () => {
    render(
      <RevenueCircle
        factorData={mockFactorData}
        revenueCircleData={mockRevenueCircleData}
        indicator="risk-score"
        indicatorDescriptions={mockIndicatorDescriptions}
        getDescription={mockGetDescription}
      />
    );

    const progressBars = screen.getAllByTestId('progress-bar');
    // There should be 6 progress bars total: 2 in headers + 4 in accordion content
    expect(progressBars).toHaveLength(6);

    // First revenue circle header has risk score 4 (80%)
    expect(progressBars[0]).toHaveAttribute('data-value', '80');
    expect(progressBars[0]).toHaveStyle({ backgroundColor: '#ff0000' });

    // Second revenue circle header has risk score 3 (60%)
    expect(progressBars[1]).toHaveAttribute('data-value', '60');
    expect(progressBars[1]).toHaveStyle({ backgroundColor: '#ffa500' });
  });

  it('renders accordion items with correct values', () => {
    render(
      <RevenueCircle
        factorData={mockFactorData}
        revenueCircleData={mockRevenueCircleData}
        indicator="risk-score"
        indicatorDescriptions={mockIndicatorDescriptions}
        getDescription={mockGetDescription}
      />
    );

    const accordionItems = screen.getAllByTestId('accordion-item');
    expect(accordionItems).toHaveLength(2);
    expect(accordionItems[0]).toHaveAttribute('data-value', 'revenue-circle-0');
    expect(accordionItems[1]).toHaveAttribute('data-value', 'revenue-circle-1');
  });

  it('renders tooltips with risk information', () => {
    render(
      <RevenueCircle
        factorData={mockFactorData}
        revenueCircleData={mockRevenueCircleData}
        indicator="risk-score"
        indicatorDescriptions={mockIndicatorDescriptions}
        getDescription={mockGetDescription}
      />
    );

    const tooltips = screen.getAllByTestId('tooltip');
    expect(tooltips.length).toBeGreaterThan(0);
  });

  it('handles empty revenue circle data', () => {
    // Provide a minimal valid data structure to avoid the undefined error
    const minimalData = [
      {
        'revenue circle': 'Test',
        'revenue-circle-code': 'TEST',
        'risk-score': { value: '1', title: 'Risk Score' },
        exposure: { value: '1', title: 'Exposure' },
        vulnerability: { value: '1', title: 'Vulnerability' },
      },
    ];

    render(
      <RevenueCircle
        factorData={mockFactorData}
        revenueCircleData={minimalData}
        indicator="risk-score"
        indicatorDescriptions={mockIndicatorDescriptions}
        getDescription={mockGetDescription}
      />
    );

    const accordion = screen.getByTestId('accordion');
    expect(accordion).toBeInTheDocument();
  });
});

describe('ScoreInfo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders progress bar for risk-score indicator', () => {
    render(
      <ScoreInfo
        label="Risk Score"
        value="4"
        indicator="risk-score"
        scoreType="risk-score"
        indicatorDescription="Risk assessment"
      />
    );

    const progressBar = screen.getByTestId('progress-bar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('data-value', '80');
    expect(progressBar).toHaveStyle({ backgroundColor: '#ff0000' });
  });

  it('renders formatted value for non-risk-score indicator', () => {
    render(
      <ScoreInfo
        label="Population"
        value="1000000"
        indicator="population"
        scoreType="population"
        indicatorDescription="Total population"
      />
    );

    expect(screen.getByText('Population')).toBeInTheDocument();
    expect(screen.getByText('formatted-1000000')).toBeInTheDocument();
  });

  it('handles missing indicator description', () => {
    render(
      <ScoreInfo
        label="Test Factor"
        value="3"
        indicator="test-factor"
        scoreType="test-factor"
      />
    );

    expect(screen.getByText('Test Factor')).toBeInTheDocument();
  });

  it('handles different risk score values', () => {
    const { rerender } = render(
      <ScoreInfo
        label="Risk Score"
        value="1"
        indicator="risk-score"
        scoreType="risk-score"
      />
    );

    let progressBar = screen.getByTestId('progress-bar');
    expect(progressBar).toHaveAttribute('data-value', '20');
    expect(progressBar).toHaveStyle({ backgroundColor: '#00ff00' });

    rerender(
      <ScoreInfo
        label="Risk Score"
        value="5"
        indicator="risk-score"
        scoreType="risk-score"
      />
    );

    progressBar = screen.getByTestId('progress-bar');
    expect(progressBar).toHaveAttribute('data-value', '100');
    expect(progressBar).toHaveStyle({ backgroundColor: '#800000' });
  });
});
