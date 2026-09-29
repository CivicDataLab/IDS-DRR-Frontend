import React from 'react';
import { FactorList } from '@/components/analytics/factor-list';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';

import { makeState } from './fixtures';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useSearchParams: () =>
    new URLSearchParams('?indicator=risk-score&time-period=2023_01'),
}));

// Mock next-usequerystate
jest.mock('next-usequerystate', () => ({
  useQueryState: () => [null, jest.fn()],
}));

// Mock opub-ui
jest.mock('opub-ui', () => ({
  Button: ({ children, monochrome, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
  Icon: ({ source, ...props }: any) => <span data-testid="icon" {...props} />,
  Menu: ({ trigger, items }: any) => (
    <div data-testid="menu">
      {trigger}
      <div data-testid="menu-content">
        {items?.map((item: any, index: number) => (
          <button key={index} onClick={item.onAction}>
            {item.content}
          </button>
        ))}
      </div>
    </div>
  ),
  Select: ({ value, onChange, options, labelInline, ...props }: any) => (
    <select value={value} onChange={(e) => onChange(e.target.value)} {...props}>
      {options?.map((option: any) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ),
  Text: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  Tooltip: ({ children, content }: any) => (
    <div data-testid="tooltip" data-content={content}>
      {children}
    </div>
  ),
}));

// Mock @tanstack/react-query
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}));

// Mock @/lib/api
jest.mock('@/lib/api', () => ({
  GraphQL: jest.fn(),
}));

// Mock @/lib/utils
jest.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
  downloadStateReport: jest.fn(),
}));

jest.mock('@/hooks/use-copy-url', () => ({
  useCopyURL: () => jest.fn(),
}));

// The download button is gated on features.reports; turn it on so the test
// tree includes it.
jest.mock('@/config/site', () => ({
  features: { reports: true },
}));

// Mock @/components/icons
jest.mock('@/components/icons', () => ({
  __esModule: true,
  default: {
    share: 'share-icon',
    download: 'download-icon',
    loader: 'loader-icon',
    up: 'up-icon',
    down: 'down-icon',
    IconBrandFacebook: 'facebook-icon',
    IconBrandLinkedin: 'linkedin-icon',
    IconBrandX: 'twitter-icon',
    link: 'link-icon',
  },
}));

// Mock @/components/media-rendering
jest.mock('@/components/media-rendering', () => ({
  MediaRendering: ({ children, minWidth, maxWidth }: any) => {
    // Mock responsive behavior - show desktop version for testing
    if (minWidth === '1024') {
      return <div data-testid="desktop-view">{children}</div>;
    }
    return <div data-testid="mobile-view">{children}</div>;
  },
}));

// Mock @/components/FactorIcons
jest.mock('@/components/FactorIcons', () => ({
  RiskScore: ({ color }: any) => (
    <div data-testid="risk-score-icon" data-color={color} />
  ),
  Vulnerability: ({ color }: any) => (
    <div data-testid="vulnerability-icon" data-color={color} />
  ),
  FloodHazard: ({ color }: any) => (
    <div data-testid="flood-hazard-icon" data-color={color} />
  ),
  Exposure: ({ color }: any) => (
    <div data-testid="exposure-icon" data-color={color} />
  ),
  GovtResponse: ({ color }: any) => (
    <div data-testid="govt-response-icon" data-color={color} />
  ),
  Ellipse: ({ color }: any) => (
    <div data-testid="ellipse-icon" data-color={color} />
  ),
}));

// Mock RadioButton component
jest.mock('@/components/analytics/RadioButton', () => ({
  __esModule: true,
  default: ({ id, isSelected, changed, label, value }: any) => (
    <div data-testid={id} data-selected={isSelected}>
      <input
        type="radio"
        id={id}
        checked={isSelected}
        onChange={() => changed(value)}
        value={value}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  ),
}));

// Mock utils
jest.mock('@/lib/analytics/utils', () => ({
  getLatestDate: jest.fn(),
}));

describe('FactorList', () => {
  const mockCurrentState = makeState({
    code: 'AS',
    name: 'Assam',
  });

  const mockIndicatorData = [
    {
      slug: 'risk-score',
      name: 'Risk Score',
      description: 'Overall risk assessment',
      children: [
        {
          slug: 'exposure',
          name: 'Exposure',
          description: 'Population exposure to hazards',
          children: [],
        },
        {
          slug: 'vulnerability',
          name: 'Vulnerability',
          description: 'Community vulnerability factors',
          children: [],
        },
      ],
    },
    {
      slug: 'flood-hazard',
      name: 'Flood Hazard',
      description: 'Flood risk assessment',
      children: [],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    window.confirm = jest.fn(() => true); // always confirm
  });

  it('renders desktop view with indicator data', () => {
    const { useQuery } = require('@tanstack/react-query');
    useQuery.mockReturnValue({
      data: { indicatorsByCategory: mockIndicatorData },
      isFetched: true,
      isLoading: false,
      error: null,
    });

    render(<FactorList currentState={mockCurrentState} />);

    expect(screen.getByTestId('desktop-view')).toBeInTheDocument();
    expect(screen.getByText('ACTIONS')).toBeInTheDocument();
  });

  it('renders mobile view with select dropdown', () => {
    const { useQuery } = require('@tanstack/react-query');
    useQuery.mockReturnValue({
      data: { indicatorsByCategory: mockIndicatorData },
      isFetched: true,
      isLoading: false,
      error: null,
    });

    render(<FactorList currentState={mockCurrentState} />);

    expect(screen.getByTestId('mobile-view')).toBeInTheDocument();
  });

  it('renders share and download buttons', () => {
    const { useQuery } = require('@tanstack/react-query');
    useQuery.mockReturnValue({
      data: { indicatorsByCategory: mockIndicatorData },
      isFetched: true,
      isLoading: false,
      error: null,
    });

    render(<FactorList currentState={mockCurrentState} />);

    expect(screen.getByText('Share')).toBeInTheDocument();
    expect(screen.getByText('Download Report')).toBeInTheDocument();
  });

  it('renders loading state when query is loading', async () => {
    const { useQuery } = require('@tanstack/react-query');
    useQuery.mockReturnValue({
      data: null,
      isFetched: false,
      isLoading: true,
      error: null,
    });

    render(<FactorList currentState={mockCurrentState} />);
    // we should click on button to download report
    const downloadButton = screen.getByText(/Download Report/i);
    fireEvent.click(downloadButton);

    // Should not render the main content when loading
    // we should get icon with classname 'opub-icon-loader'
    // can we take Icon component and check if it has classname 'opub-icon-loader'
    const IconComponent = screen.getByTestId('loader-icon');
    await waitFor(() => {
      expect(IconComponent).toHaveClass('animate-spin');
    });
    // expect(screen.queryByText(/ACTIONS/i)).not.toBeInTheDocument();
  });

  // it('renders error state when query has error', async () => {
  //   const { useQuery } = require('@tanstack/react-query');
  //   useQuery.mockReturnValue({
  //     data: null,
  //     isFetched: false,
  //     isLoading: false,
  //     error: new Error('Failed to fetch'),
  //   });

  //   render(<FactorList currentState={mockCurrentState} />);

  //   const button = screen.getByText(/Download Report/i);
  //   fireEvent.click(button);
  //   //the nested sidebar has options and if its option props is empty array then the error condition passes
  //   const nestedSidebar = screen.getByTestId('NestedSidebar');

  //   await waitFor(() => {
  //     expect(nestedSidebar).toBeInTheDocument();
  //     expect(nestedSidebar.children).toHaveLength(0);
  //   });

  //   // Should not render the main content when there's an error
  //   // expect(screen.queryByText(/ACTIONS/i)).not.toBeInTheDocument();
  // });

  it('handles empty indicator data', () => {
    const { useQuery } = require('@tanstack/react-query');
    useQuery.mockReturnValue({
      data: { indicatorsByCategory: [] },
      isFetched: true,
      isLoading: false,
      error: null,
    });

    render(<FactorList currentState={mockCurrentState} />);

    // Should still render the actions section
    expect(screen.getByText('ACTIONS')).toBeInTheDocument();
  });

  it('handles null indicator data', () => {
    const { useQuery } = require('@tanstack/react-query');
    useQuery.mockReturnValue({
      data: { indicatorsByCategory: null },
      isFetched: true,
      isLoading: false,
      error: null,
    });

    render(<FactorList currentState={mockCurrentState} />);

    // Should still render the actions section even with null data
    expect(screen.getByText('ACTIONS')).toBeInTheDocument();
  });

  it('shows category labels only when multiple distinct categories exist', () => {
    const { useQuery } = require('@tanstack/react-query');
    useQuery.mockReturnValue({
      data: {
        indicatorsByCategory: [
          {
            slug: 'vulnerability',
            name: 'Vulnerability',
            description: 'Community vulnerability factors',
            children: [
              {
                slug: 'coping-1',
                name: 'Coping Indicator 1',
                description: 'Coping 1',
                category: 'COPING CAPACITY',
                children: [],
              },
              {
                slug: 'coping-2',
                name: 'Coping Indicator 2',
                description: 'Coping 2',
                category: 'COPING CAPACITY',
                children: [],
              },
              {
                slug: 'sensitivity-1',
                name: 'Sensitivity Indicator',
                description: 'Sensitivity',
                category: 'SENSITIVITY',
                children: [],
              },
            ],
          },
        ],
      },
      isFetched: true,
      isLoading: false,
      error: null,
    });

    render(<FactorList currentState={mockCurrentState} />);
    const desktop = screen.getByTestId('desktop-view');
    fireEvent.click(within(desktop).getByText('Vulnerability'));

    expect(within(desktop).getByText('COPING CAPACITY')).toBeInTheDocument();
    expect(within(desktop).getByText('SENSITIVITY')).toBeInTheDocument();
  });

  it('hides category labels when all indicators share one category', () => {
    const { useQuery } = require('@tanstack/react-query');
    useQuery.mockReturnValue({
      data: {
        indicatorsByCategory: [
          {
            slug: 'vulnerability',
            name: 'Vulnerability',
            description: 'Community vulnerability factors',
            children: [
              {
                slug: 'coping-1',
                name: 'Coping Indicator 1',
                description: 'Coping 1',
                category: 'COPING CAPACITY',
                children: [],
              },
              {
                slug: 'coping-2',
                name: 'Coping Indicator 2',
                description: 'Coping 2',
                category: 'COPING CAPACITY',
                children: [],
              },
            ],
          },
        ],
      },
      isFetched: true,
      isLoading: false,
      error: null,
    });

    render(<FactorList currentState={mockCurrentState} />);
    const desktop = screen.getByTestId('desktop-view');
    fireEvent.click(within(desktop).getByText('Vulnerability'));

    expect(within(desktop).queryByText('COPING CAPACITY')).not.toBeInTheDocument();
    expect(within(desktop).getByText('Coping Indicator 1')).toBeInTheDocument();
    expect(within(desktop).getByText('Coping Indicator 2')).toBeInTheDocument();
  });

  it('calls useQuery with correct parameters', () => {
    const { useQuery } = require('@tanstack/react-query');
    useQuery.mockReturnValue({
      data: { indicatorsByCategory: mockIndicatorData },
      isFetched: true,
      isLoading: false,
      error: null,
    });

    render(<FactorList currentState={mockCurrentState} />);

    expect(useQuery).toHaveBeenCalledWith({
      queryKey: [`indicatorsByCategory_${mockCurrentState.code}_flood`],
      queryFn: expect.any(Function),
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    });
  });

  it('handles different current states', () => {
    const { useQuery } = require('@tanstack/react-query');
    useQuery.mockReturnValue({
      data: { indicatorsByCategory: mockIndicatorData },
      isFetched: true,
      isLoading: false,
      error: null,
    });

    const differentState = makeState({ code: 'HP', name: 'Himachal Pradesh' });
    render(<FactorList currentState={differentState} />);

    expect(screen.getByText('ACTIONS')).toBeInTheDocument();
  });

  it('handles missing search params gracefully', () => {
    const { useQuery } = require('@tanstack/react-query');
    useQuery.mockReturnValue({
      data: { indicatorsByCategory: mockIndicatorData },
      isFetched: true,
      isLoading: false,
      error: null,
    });

    // Mock useSearchParams to return empty params
    jest.doMock('next/navigation', () => ({
      useSearchParams: () => new URLSearchParams(),
    }));

    render(<FactorList currentState={mockCurrentState} />);

    // Should still render without throwing errors
    expect(screen.getByText('ACTIONS')).toBeInTheDocument();
  });
});

