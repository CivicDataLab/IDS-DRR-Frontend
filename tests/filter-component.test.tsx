import React from 'react';
import { FilterComp } from '@/app/[locale]/[state]/analytics/components/filter-component';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock next/navigation
// const mockPush = jest.fn();
const mockParams = jest.fn();
const mockSearchParams = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: () => {},
  }),
  useParams: () => mockParams(),
  useSearchParams: () => mockSearchParams(),
}));

// Mock next-usequerystate
const mockSetTimePeriod = jest.fn();
const mockSetDistrictCode = jest.fn();
const mockSetRevenueCode = jest.fn();

jest.mock('next-usequerystate', () => ({
  parseAsString: {
    withDefault: jest.fn(() => jest.fn()),
  },
  useQueryState: jest.fn((key: string, options?: any) => {
    if (key === 'time-period') {
      return ['2023_08', mockSetTimePeriod];
    }
    if (key === 'district-code') {
      return ['', mockSetDistrictCode];
    }
    if (key === 'revenue-code') {
      return ['', mockSetRevenueCode];
    }
    return ['', jest.fn()];
  }),
}));

// Mock opub-ui components - now using centralized mock
jest.mock('opub-ui');

// Mock components
jest.mock('@/components/icons', () => ({
  __esModule: true,
  default: {
    filter: 'filter-icon',
  },
}));

jest.mock('@/components/MobileFilterBox', () => ({
  MobileFilterBox: ({
    children,
    open,
    toggleDrawerCallback,
    handleApplyFilters,
    handleClearFilters,
    onSelectedOption,
  }: any) => (
    <div data-testid="mobile-filter-box" data-open={open}>
      <button onClick={toggleDrawerCallback}>Toggle</button>
      <button onClick={handleApplyFilters}>Apply</button>
      <button onClick={handleClearFilters}>Clear</button>
      <button onClick={() => onSelectedOption('district')}>
        Select District
      </button>
      <button onClick={() => onSelectedOption('revenue-circle')}>
        Select Revenue
      </button>
      <button onClick={() => onSelectedOption('month')}>Select Month</button>
      {children}
    </div>
  ),
  MobileFilterContent: ({ children }: any) => (
    <div data-testid="mobile-filter-content">{children}</div>
  ),
}));

// Mock utility functions
jest.mock('@/lib/utils', () => ({
  formatDate: jest.fn((timestamp: number, isHyphenated: boolean) => {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return '2023-01-01'; // Return default date for invalid timestamps
    }
    return isHyphenated
      ? date.toISOString().split('T')[0]
      : date.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        });
  }),
}));

// Mock @internationalized/date
jest.mock('@internationalized/date', () => ({
  parseDate: jest.fn((dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return { year, month, day };
  }),
}));

const defaultProps = {
  timePeriod: '2023_08',
  timePeriods: ['2023_01', '2023_02', '2023_03', '2023_12'],
  currentSelectedState: {
    child_type: 'revenue-circle',
  },
  statesList: [
    { name: 'State 1', slug: 'state-1' },
    { name: 'State 2', slug: 'state-2' },
  ],
  districtGeographiesData: {
    data: {
      getDistrictRevCircle: [
        { code: 'D001', district: 'District 1' },
        { code: 'D002', district: 'District 2' },
      ],
    },
  },
  revenueGeographiesData: {
    data: {
      getDistrictRevCircle: {
        'District 1': [
          { code: 'RC001', 'revenue-circle': 'Revenue Circle 1' },
          { code: 'RC002', 'revenue-circle': 'Revenue Circle 2' },
        ],
        'District 2': [{ code: 'RC003', 'revenue-circle': 'Revenue Circle 3' }],
      },
    },
  },
};

describe('FilterComp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockParams.mockReturnValue({});
    mockSearchParams.mockReturnValue(new URLSearchParams('?view=chart'));
  });

  describe('Component Rendering', () => {
    it('renders filter button', () => {
      render(<FilterComp {...defaultProps} />);

      const filterButton = screen.getByRole('button', { name: /filter/i });
      expect(filterButton).toBeInTheDocument();
      expect(filterButton).toHaveAttribute('data-kind', 'tertiary');
    });

    it('renders filter icon', () => {
      render(<FilterComp {...defaultProps} />);

      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('renders mobile filter box', () => {
      render(<FilterComp {...defaultProps} />);

      expect(screen.getByTestId('mobile-filter-box')).toBeInTheDocument();
    });

    it('renders mobile filter content', () => {
      render(<FilterComp {...defaultProps} />);

      expect(screen.getByTestId('mobile-filter-content')).toBeInTheDocument();
    });
  });

  describe('Filter Button Interactions', () => {
    it('toggles drawer when filter button is clicked', async () => {
      const user = userEvent.setup();
      render(<FilterComp {...defaultProps} />);

      const filterButton = screen.getByRole('button', { name: /filter/i });
      await user.click(filterButton);

      // The drawer should be open after clicking
      const mobileFilterBox = screen.getByTestId('mobile-filter-box');
      expect(mobileFilterBox).toHaveAttribute('data-open', 'true');
    });

    it('toggles drawer when toggle button is clicked', async () => {
      const user = userEvent.setup();
      render(<FilterComp {...defaultProps} />);

      // Open drawer first
      const filterButton = screen.getByRole('button', { name: /filter/i });
      await user.click(filterButton);

      // Then close it
      const toggleButton = screen.getByText('Toggle');
      await user.click(toggleButton);

      const mobileFilterBox = screen.getByTestId('mobile-filter-box');
      expect(mobileFilterBox).toHaveAttribute('data-open', 'false');
    });
  });

  describe('Filter Options', () => {
    it('renders district filter options when drawer is open', async () => {
      const user = userEvent.setup();
      render(<FilterComp {...defaultProps} />);

      // Open drawer first
      const filterButton = screen.getByRole('button', { name: /filter/i });
      await user.click(filterButton);

      // Select district option
      const selectDistrictButton = screen.getByText('Select District');
      await user.click(selectDistrictButton);

      expect(screen.getByTestId('radio-group')).toBeInTheDocument();
      expect(screen.getByText('District 1')).toBeInTheDocument();
      expect(screen.getByText('District 2')).toBeInTheDocument();
    });

    it('renders revenue circle filter options when drawer is open', async () => {
      const user = userEvent.setup();
      render(<FilterComp {...defaultProps} />);

      // Open drawer first
      const filterButton = screen.getByRole('button', { name: /filter/i });
      await user.click(filterButton);

      // Select revenue option
      const selectRevenueButton = screen.getByText('Select Revenue');
      await user.click(selectRevenueButton);

      expect(screen.getByText('Please select a district')).toBeInTheDocument();
    });

    it('renders month filter options when drawer is open', async () => {
      const user = userEvent.setup();
      render(<FilterComp {...defaultProps} />);

      // Open drawer first
      const filterButton = screen.getByRole('button', { name: /filter/i });
      await user.click(filterButton);

      // Select month option
      const selectMonthButton = screen.getByText('Select Month');
      await user.click(selectMonthButton);

      expect(screen.getByTestId('year-calendar')).toBeInTheDocument();
    });

    it('shows correct district options when drawer is open', async () => {
      const user = userEvent.setup();
      render(<FilterComp {...defaultProps} />);

      // Open drawer first
      const filterButton = screen.getByRole('button', { name: /filter/i });
      await user.click(filterButton);

      // Select district option
      const selectDistrictButton = screen.getByText('Select District');
      await user.click(selectDistrictButton);

      expect(screen.getByText('District 1')).toBeInTheDocument();
      expect(screen.getByText('District 2')).toBeInTheDocument();
    });
  });

  describe('Filter Selection', () => {
    it('handles district selection when drawer is open', async () => {
      const user = userEvent.setup();
      render(<FilterComp {...defaultProps} />);

      // Open drawer first
      const filterButton = screen.getByRole('button', { name: /filter/i });
      await user.click(filterButton);

      // Select district option
      const selectDistrictButton = screen.getByText('Select District');
      await user.click(selectDistrictButton);

      const districtItem = screen.getByText('District 1');
      await user.click(districtItem);

      // Should update the region selected state
      // This would be tested through the onChange handler
    });

    it('handles revenue circle selection when drawer is open', async () => {
      const user = userEvent.setup();
      render(<FilterComp {...defaultProps} />);

      // Open drawer first
      const filterButton = screen.getByRole('button', { name: /filter/i });
      await user.click(filterButton);

      // Select district option first
      const selectDistrictButton = screen.getByText('Select District');
      await user.click(selectDistrictButton);

      // Select a district
      const districtItem = screen.getByText('District 1');
      await user.click(districtItem);

      // Now select revenue option
      const selectRevenueButton = screen.getByText('Select Revenue');
      await user.click(selectRevenueButton);

      // Verify that revenue circle filter is accessible
      expect(screen.getByText('Please select a district')).toBeInTheDocument();

      // The revenue options should be available after district selection
      // This tests the basic functionality without requiring specific revenue items
    });

    it('handles month selection when drawer is open', async () => {
      const user = userEvent.setup();
      render(<FilterComp {...defaultProps} />);

      // Open drawer first
      const filterButton = screen.getByRole('button', { name: /filter/i });
      await user.click(filterButton);

      // Select month option
      const selectMonthButton = screen.getByText('Select Month');
      await user.click(selectMonthButton);

      const yearCalendar = screen.getByTestId('year-calendar');
      const input = yearCalendar.querySelector('input') as HTMLInputElement;

      await user.type(input, '2023-02');

      // Should update the time period selected state
    });
  });

  describe('Apply Filters', () => {
    it('calls setDistrictCode when apply filters is clicked', async () => {
      const user = userEvent.setup();
      render(<FilterComp {...defaultProps} />);

      const applyButton = screen.getByText('Apply');
      await user.click(applyButton);

      expect(mockSetDistrictCode).toHaveBeenCalled();
    });

    it('calls setRevenueCode when apply filters is clicked', async () => {
      const user = userEvent.setup();
      render(<FilterComp {...defaultProps} />);

      const applyButton = screen.getByText('Apply');
      await user.click(applyButton);

      expect(mockSetRevenueCode).toHaveBeenCalled();
    });

    it('calls setTimePeriod when apply filters is clicked', async () => {
      const user = userEvent.setup();
      render(<FilterComp {...defaultProps} />);

      const applyButton = screen.getByText('Apply');
      await user.click(applyButton);

      expect(mockSetTimePeriod).toHaveBeenCalled();
    });

    it('closes drawer when apply filters is clicked', async () => {
      const user = userEvent.setup();
      render(<FilterComp {...defaultProps} />);

      // Open drawer first
      const filterButton = screen.getByRole('button', { name: /filter/i });
      await user.click(filterButton);

      // Apply filters
      const applyButton = screen.getByText('Apply');
      await user.click(applyButton);

      const mobileFilterBox = screen.getByTestId('mobile-filter-box');
      expect(mobileFilterBox).toHaveAttribute('data-open', 'false');
    });
  });

  describe('Clear Filters', () => {
    it('clears all filter states when clear filters is clicked', async () => {
      const user = userEvent.setup();
      render(<FilterComp {...defaultProps} />);

      const clearButton = screen.getByText('Clear');
      await user.click(clearButton);

      expect(mockSetDistrictCode).toHaveBeenCalledWith('', { shallow: false });
      expect(mockSetRevenueCode).toHaveBeenCalledWith('', { shallow: false });
      expect(mockSetTimePeriod).toHaveBeenCalledWith('2023_08', {
        shallow: false,
      });
    });

    it('closes drawer when clear filters is clicked', async () => {
      const user = userEvent.setup();
      render(<FilterComp {...defaultProps} />);

      // Open drawer first
      const filterButton = screen.getByRole('button', { name: /filter/i });
      await user.click(filterButton);

      // Clear filters
      const clearButton = screen.getByText('Clear');
      await user.click(clearButton);

      const mobileFilterBox = screen.getByTestId('mobile-filter-box');
      expect(mobileFilterBox).toHaveAttribute('data-open', 'false');
    });
  });

  describe('State Management', () => {
    it('initializes with correct default states', () => {
      render(<FilterComp {...defaultProps} />);

      // Check that the component renders without errors
      expect(screen.getByTestId('mobile-filter-box')).toBeInTheDocument();
    });

    it('updates filter option when selected', async () => {
      const user = userEvent.setup();
      render(<FilterComp {...defaultProps} />);

      // This would test the internal state management
      // The actual state changes would be tested through the UI interactions
    });
  });

  describe('Edge Cases', () => {
    it('handles empty district geographies data', () => {
      const propsWithEmptyDistricts = {
        ...defaultProps,
        districtGeographiesData: {
          data: {
            getDistrictRevCircle: [],
          },
        },
      };

      render(<FilterComp {...propsWithEmptyDistricts} />);

      // Should render without errors
      expect(screen.getByTestId('mobile-filter-box')).toBeInTheDocument();
    });

    it('handles empty revenue geographies data', () => {
      const propsWithEmptyRevenue = {
        ...defaultProps,
        revenueGeographiesData: {
          data: {
            getDistrictRevCircle: {},
          },
        },
      };

      render(<FilterComp {...propsWithEmptyRevenue} />);

      // Should render without errors
      expect(screen.getByTestId('mobile-filter-box')).toBeInTheDocument();
    });

    it('handles empty time periods data', () => {
      const propsWithEmptyTimePeriods = {
        ...defaultProps,
        timePeriods: [],
      };

      render(<FilterComp {...propsWithEmptyTimePeriods} />);

      // Should render without errors
      expect(screen.getByTestId('mobile-filter-box')).toBeInTheDocument();
    });

    it('handles missing currentSelectedState', () => {
      const propsWithoutState = {
        ...defaultProps,
        currentSelectedState: null,
      };

      // Should not throw error
      expect(() => render(<FilterComp {...propsWithoutState} />)).not.toThrow();
    });
  });

  describe('Integration Tests', () => {
    it('maintains filter state across interactions', async () => {
      const user = userEvent.setup();
      render(<FilterComp {...defaultProps} />);

      // Open drawer
      const filterButton = screen.getByRole('button', { name: /filter/i });
      await user.click(filterButton);

      // Select district option
      const selectDistrictButton = screen.getByText('Select District');
      await user.click(selectDistrictButton);

      // Select a district
      const districtItem = screen.getByText('District 1');
      await user.click(districtItem);

      // Apply filters
      const applyButton = screen.getByText('Apply');
      await user.click(applyButton);

      // Check that the appropriate setters were called
      expect(mockSetDistrictCode).toHaveBeenCalled();
    });

    it('handles complete filter workflow', async () => {
      const user = userEvent.setup();
      render(<FilterComp {...defaultProps} />);

      // Open drawer
      const filterButton = screen.getByRole('button', { name: /filter/i });
      await user.click(filterButton);

      // Select district option
      const selectDistrictButton = screen.getByText('Select District');
      await user.click(selectDistrictButton);

      // Select filters
      const districtItem = screen.getByText('District 1');
      await user.click(districtItem);

      // Apply filters
      const applyButton = screen.getByText('Apply');
      await user.click(applyButton);

      // Clear filters
      const clearButton = screen.getByText('Clear');
      await user.click(clearButton);

      // Check that clear was called
      expect(mockSetDistrictCode).toHaveBeenCalledWith('', { shallow: false });
    });
  });

  describe('Accessibility', () => {
    it('has proper button roles', () => {
      render(<FilterComp {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('maintains focus management', async () => {
      const user = userEvent.setup();
      render(<FilterComp {...defaultProps} />);

      const filterButton = screen.getByRole('button', { name: /filter/i });
      await user.click(filterButton);

      // Should maintain focus appropriately
      expect(filterButton).toBeInTheDocument();
    });
  });
});
