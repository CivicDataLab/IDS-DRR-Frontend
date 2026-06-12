import React from 'react';
import { AnalyticsSideBarLayout } from '@/app/[locale]/[state]/analytics/components/analytics-sidebar-layout';
import { fireEvent, render, screen } from '@testing-library/react';

// Mock opub-ui components
jest.mock('opub-ui');

// The component uses next-intl's locale-aware useRouter via @/i18n/navigation.
const mockPush = jest.fn();
jest.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
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

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(() => ({
    data: { getDataTimePeriods: [{ value: '2023_08' }] },
  })),
}));

describe('AnalyticsSideBarLayout', () => {
  const mockCurrentState = {
    code: 'SA',
    slug: 'state-alpha',
    name: 'Alpha State',
  };

  const mockStatesList = [
    { code: 'SA', slug: 'state-alpha', name: 'Alpha State' },
    { code: 'SB', slug: 'state-beta', name: 'Beta State' },
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

  it('navigates to the selected state on change', () => {
    render(
      <AnalyticsSideBarLayout
        currentState={mockCurrentState}
        statesList={mockStatesList}
      >
        <div>Test Content</div>
      </AnalyticsSideBarLayout>
    );

    const stateSelect = screen.getByRole('combobox');
    fireEvent.change(stateSelect, { target: { value: 'state-beta' } });

    expect(mockPush).toHaveBeenCalledWith(
      '/state-beta/analytics/?indicator=risk-score&view=map'
    );
  });
});
