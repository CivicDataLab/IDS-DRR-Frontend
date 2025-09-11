import React from 'react';
import {
  AnalyticsSideBarLayout,
  IndicatorListWrapper,
} from '@/app/[locale]/[state]/analytics/components/analytics-sidebar-layout';
import { fireEvent, render, screen } from '@testing-library/react';

// Mock opub-ui components
jest.mock('opub-ui');

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock components
jest.mock('@/components/media-rendering', () => ({
  MediaRendering: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

jest.mock('@/app/[locale]/[state]/analytics/components/factor-list', () => ({
  FactorList: ({ currentState }: any) => (
    <div data-testid="factor-list" data-state={currentState?.code}>
      Factor List Component
    </div>
  ),
}));

// Mock utils
jest.mock('@/lib/utils', () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(' '),
}));

describe('AnalyticsSideBarLayout', () => {
  const mockCurrentState = {
    code: 'AS',
    slug: 'assam',
    name: 'Assam',
  };

  const mockStatesList = [
    { code: 'AS', slug: 'assam', name: 'Assam' },
    { code: 'HP', slug: 'himachal-pradesh', name: 'Himachal Pradesh' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children after client-side hydration', () => {
    render(
      <AnalyticsSideBarLayout
        currentState={mockCurrentState}
        statesList={mockStatesList}
      >
        <div data-testid="test-content">Test Content</div>
      </AnalyticsSideBarLayout>
    );

    // After hydration, should show content
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });

  it('renders sidebar with correct structure', () => {
    render(
      <AnalyticsSideBarLayout
        currentState={mockCurrentState}
        statesList={mockStatesList}
      >
        <div>Test Content</div>
      </AnalyticsSideBarLayout>
    );

    expect(screen.getByText('ANALYTICS DASHBOARD')).toBeInTheDocument();
    expect(screen.getByText('INDICATORS')).toBeInTheDocument();
    expect(screen.getByTestId('factor-list')).toBeInTheDocument();
  });
});

describe('IndicatorListWrapper', () => {
  const mockCurrentState = {
    code: 'AS',
    slug: 'assam',
    name: 'Assam',
  };

  const mockStatesList = [
    { code: 'AS', slug: 'assam', name: 'Assam' },
    { code: 'HP', slug: 'himachal-pradesh', name: 'Himachal Pradesh' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders state selector with correct options', () => {
    render(
      <IndicatorListWrapper
        currentState={mockCurrentState}
        statesList={mockStatesList}
      />
    );

    const stateSelect = screen.getByRole('combobox');
    expect(stateSelect).toBeInTheDocument();

    // Check if options are rendered
    expect(screen.getByText('Assam')).toBeInTheDocument();
    expect(screen.getByText('Himachal Pradesh')).toBeInTheDocument();
  });

  it('handles state selection change', () => {
    render(
      <IndicatorListWrapper
        currentState={mockCurrentState}
        statesList={mockStatesList}
      />
    );

    const stateSelect = screen.getByRole('combobox');
    fireEvent.change(stateSelect, { target: { value: 'himachal-pradesh' } });

    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining('/himachal-pradesh/analytics/')
    );
  });

  it('renders factor list with current state', () => {
    render(
      <IndicatorListWrapper
        currentState={mockCurrentState}
        statesList={mockStatesList}
      />
    );

    const factorList = screen.getByTestId('factor-list');
    expect(factorList).toBeInTheDocument();
    expect(factorList).toHaveAttribute('data-state', 'AS');
  });
});
