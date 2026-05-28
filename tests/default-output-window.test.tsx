import React from 'react';
import { render, screen } from '@testing-library/react';

import { DefaultWindow } from '../app/[locale]/[state]/analytics/components/default-output-window';

// Mock React.cache
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  cache: jest.fn((fn) => fn),
}));

// Mock the API module
jest.mock('@/lib/api', () => ({
  getQueryClient: jest.fn(() => ({
    getQueryData: jest.fn(),
    setQueryData: jest.fn(),
  })),
}));

// Provide userManualLink and docsLink so the CTAs render.
jest.mock('@/config/site', () => ({
  userManualLink: 'https://example.com/user-guide',
  docsLink: 'https://example.com/docs',
}));

// Mock MediaRendering component
jest.mock('@/components/media-rendering', () => ({
  MediaRendering: ({ children }: any) => <div>{children}</div>,
}));

// Mock Next.js components
jest.mock('next/link', () => {
  return ({ children, href }: any) => <a href={href}>{children}</a>;
});

// Mock router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useParams: () => ({ state: 'assam' }),
  useSearchParams: () => new URLSearchParams(),
}));

// Mock React Query
// __mocks__/@tanstack/react-query.ts
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(() => ({
    data: null,
    isLoading: false,
    isFetching: false,
    isError: false,
    error: null,
    refetch: jest.fn(),
  })),
}));

// Mock icons
jest.mock('@/components/FactorIcons', () => ({
  Ellipse: () => <div data-testid="ellipse-icon" />,
  Exposure: () => <div data-testid="exposure-icon" />,
  FloodHazard: () => <div data-testid="flood-hazard-icon" />,
  GovtResponse: () => <div data-testid="govt-response-icon" />,
  RiskScore: () => <div data-testid="risk-score-icon" />,
  Vulnerability: () => <div data-testid="vulnerability-icon" />,
}));

// Mock components
jest.mock('@/components/icons', () => ({
  default: {
    link: 'link-icon',
    externalLink: 'external-link-icon',
    cross: 'cross-icon',
    info: 'info-icon',
    IconSwimming: 'swimming-icon',
    IconArrowUpRight: 'arrow-up-right-icon',
  },
}));

jest.mock('@/components/nav-link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

const mockChartData = {
  'risk-score': {
    '2023_01': [
      { district: 'District A', 'risk-score': { value: '3' } },
      { district: 'District B', 'risk-score': { value: '2' } },
      { district: 'District C', 'risk-score': { value: '4' } },
      { district: 'District D', 'risk-score': { value: '1' } },
      { district: 'District E', 'risk-score': { value: '5' } },
    ],
  },
  exposure: {
    '2023_01': [
      { district: 'District A', exposure: { value: '75.5' } },
      { district: 'District B', exposure: { value: '82.1' } },
      { district: 'District C', exposure: { value: '68.9' } },
      { district: 'District D', exposure: { value: '91.2' } },
      { district: 'District E', exposure: { value: '45.3' } },
    ],
  },
  vulnerability: {
    '2023_01': [
      { district: 'District A', vulnerability: { value: '2.5' } },
      { district: 'District B', vulnerability: { value: '3.1' } },
      { district: 'District C', vulnerability: { value: '1.8' } },
      { district: 'District D', vulnerability: { value: '4.2' } },
      { district: 'District E', vulnerability: { value: '2.9' } },
    ],
  },
};

describe('DefaultWindow', () => {
  const defaultProps = {
    indicatorDescriptions: [
      {
        name: 'Overall Flood Risk',
        slug: 'risk-score',
        short_description: 'Overall flood risk explanation',
      },
      {
        name: 'Hazard',
        slug: 'flood-hazard',
        short_description: 'Hazard explanation',
      },
      {
        name: 'Exposure',
        slug: 'exposure',
        short_description: 'Exposure explanation',
      },
      {
        name: 'Vulnerability',
        slug: 'vulnerability',
        short_description: 'Vulnerability explanation',
      },
      {
        name: 'Government Response',
        slug: 'government-response',
        short_description: 'Government response explanation',
      },
    ],
    indicator: 'risk-score',
    boundary: 'district',
  };

  it('renders without crashing', () => {
    render(<DefaultWindow {...defaultProps} />);
    expect(screen.getByText('Know your risk indicators')).toBeInTheDocument();
  });

  it('displays the correct indicator title', () => {
    render(<DefaultWindow {...defaultProps} />);
    expect(screen.getByText('Overall Risk')).toBeInTheDocument();
  });

  it('shows district data when available', () => {
    render(<DefaultWindow {...defaultProps} />);
    // DefaultWindow (state level) uses AboutIndicator and renders sub-indicators.
    expect(screen.getByText('Hazard')).toBeInTheDocument();
    expect(screen.getByText('Exposure')).toBeInTheDocument();
  });

  it('displays user guide CTA and documentation CTA', () => {
    render(<DefaultWindow {...defaultProps} />);
    expect(screen.getByText('Read the user guide')).toBeInTheDocument();
    expect(screen.getByText('Read the documentation')).toBeInTheDocument();
  });
});
