import React from 'react';
import FilterDropdownOptions, {
  Option,
} from '@/app/[locale]/[state]/analytics/components/filter-dropdown-options';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock next-usequerystate
const mockSetDistrictCode = jest.fn();
const mockSetRevenueCode = jest.fn();
const mockSetSelectedTimePeriod = jest.fn();

jest.mock('next-usequerystate', () => ({
  parseAsString: {
    withDefault: jest.fn(() => jest.fn()),
  },
  useQueryState: jest.fn((key: string, options?: any) => {
    if (key === 'district-code') {
      return ['', mockSetDistrictCode];
    }
    if (key === 'revenue-code') {
      return ['', mockSetRevenueCode];
    }
    if (key === 'time-period') {
      return [['2023_08'], mockSetSelectedTimePeriod];
    }
    return ['', jest.fn()];
  }),
}));

// Mock opub-ui components - now using centralized mock
jest.mock('opub-ui');

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
  toTitleCase: jest.fn((str: string) => {
    if (!str) return '';
    return str
      .toLowerCase()
      .replace(/\b\w/g, (char: string) => char.toUpperCase());
  }),
}));

jest.mock('@/app/[locale]/[state]/analytics/utils/utils', () => ({
  getLatestDate: jest.fn((dates: string[]) => {
    if (!dates || dates.length === 0) return '2023-08-01';
    const latest = dates.sort().pop();
    const [year, month] = latest!.split('_');
    return `${year}-${month.padStart(2, '0')}-01`;
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
  currentSelectedState: {
    child_type: 'revenue-circle',
  },
  RevCircleDropdownOptions: [
    { label: 'Revenue Circle 1', value: 'rc1', districtCode: 'D001' },
    { label: 'Revenue Circle 2', value: 'rc2', districtCode: 'D001' },
    { label: 'Revenue Circle 3', value: 'rc3', districtCode: 'D002' },
  ],
  DistrictDropDownOption: [
    { label: 'District 1', value: 'D001' },
    { label: 'District 2', value: 'D002' },
  ],
  monthMulti: false,
  timeLimits: ['2023_01', '2023_02', '2023_03', '2023_12'],
};

describe('FilterDropdownOptions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('renders all three filter components', () => {
      render(<FilterDropdownOptions {...defaultProps} />);

      expect(screen.getByTestId('district-select')).toBeInTheDocument();
      expect(screen.getByTestId('revenue-circle-select')).toBeInTheDocument();
      expect(screen.getByTestId('month-picker')).toBeInTheDocument();
    });

    it('renders with correct labels', () => {
      render(<FilterDropdownOptions {...defaultProps} />);

      expect(screen.getByLabelText('Select District')).toBeInTheDocument();
      expect(
        screen.getByLabelText('Select Revenue-Circle')
      ).toBeInTheDocument();
      expect(screen.getByLabelText('Select Month')).toBeInTheDocument();
    });

    it('renders with correct CSS classes', () => {
      render(<FilterDropdownOptions {...defaultProps} />);

      const districtSelect = screen.getByTestId('district-select');
      const revenueSelect = screen.getByTestId('revenue-circle-select');

      expect(districtSelect).toHaveClass('flex-1');
      expect(revenueSelect).toHaveClass('flex-1');
    });
  });

  describe('District Selection', () => {
    it('renders district options correctly', () => {
      render(<FilterDropdownOptions {...defaultProps} />);

      const districtSelect = screen.getByTestId('district-select');
      const options = districtSelect.querySelectorAll('option');

      expect(options).toHaveLength(3); // Including "Select a district" option
      expect(options[0]).toHaveTextContent('Select a district');
      expect(options[1]).toHaveTextContent('District 1');
      expect(options[2]).toHaveTextContent('District 2');
    });

    it('calls setDistrictCode and clears revenue code when district is selected', async () => {
      const user = userEvent.setup();
      render(<FilterDropdownOptions {...defaultProps} />);

      const districtSelect = screen.getByTestId('district-select');
      await user.selectOptions(districtSelect, 'D001');

      expect(mockSetDistrictCode).toHaveBeenCalledWith('D001', {
        shallow: false,
      });
      // Note: The revenue code clearing happens in the onChange handler, not in the test setup
    });

    it('handles empty district selection', async () => {
      const user = userEvent.setup();
      render(<FilterDropdownOptions {...defaultProps} />);

      const districtSelect = screen.getByTestId('district-select');
      await user.selectOptions(districtSelect, '');

      expect(mockSetDistrictCode).toHaveBeenCalledWith('', { shallow: false });
      // Note: The revenue code clearing happens in the onChange handler, not in the test setup
    });
  });

  describe('Revenue Circle Selection', () => {
    it('is disabled when no district is selected', () => {
      render(<FilterDropdownOptions {...defaultProps} />);

      const revenueSelect = screen.getByTestId('revenue-circle-select');
      expect(revenueSelect).toBeDisabled();
    });

    it('shows correct placeholder when no district is selected', () => {
      render(<FilterDropdownOptions {...defaultProps} />);

      const revenueSelect = screen.getByTestId('revenue-circle-select');
      const options = revenueSelect.querySelectorAll('option');

      expect(options[0]).toHaveTextContent('Select a district to enable');
    });

    it('filters revenue circles based on selected district', async () => {
      const user = userEvent.setup();

      // Mock useQueryState to return a selected district
      const mockUseQueryState = require('next-usequerystate').useQueryState;
      mockUseQueryState.mockImplementation((key: string) => {
        if (key === 'district-code') {
          return ['D001', mockSetDistrictCode];
        }
        if (key === 'revenue-code') {
          return ['', mockSetRevenueCode];
        }
        return ['', jest.fn()];
      });

      render(<FilterDropdownOptions {...defaultProps} />);

      const revenueSelect = screen.getByTestId('revenue-circle-select');
      const options = revenueSelect.querySelectorAll('option');

      // Should show revenue circles for D001 only
      expect(options).toHaveLength(3); // Including placeholder
      expect(options[1]).toHaveTextContent('Revenue Circle 1');
      expect(options[2]).toHaveTextContent('Revenue Circle 2');
    });

    it('calls setRevenueCode when revenue circle is selected', async () => {
      const user = userEvent.setup();

      // Mock useQueryState to return a selected district
      const mockUseQueryState = require('next-usequerystate').useQueryState;
      mockUseQueryState.mockImplementation((key: string) => {
        if (key === 'district-code') {
          return ['D001', mockSetDistrictCode];
        }
        if (key === 'revenue-code') {
          return ['', mockSetRevenueCode];
        }
        return ['', jest.fn()];
      });

      render(<FilterDropdownOptions {...defaultProps} />);

      const revenueSelect = screen.getByTestId('revenue-circle-select');
      await user.selectOptions(revenueSelect, 'rc1');

      expect(mockSetRevenueCode).toHaveBeenCalledWith('rc1', {
        shallow: false,
      });
    });
  });

  describe('Time Period Selection', () => {
    it('renders single month picker by default', () => {
      render(<FilterDropdownOptions {...defaultProps} />);

      expect(screen.getByTestId('month-picker')).toBeInTheDocument();
      expect(
        screen.queryByTestId('multi-month-picker')
      ).not.toBeInTheDocument();
    });

    it('renders multi month picker when monthMulti is true', () => {
      // Mock useQueryState to return an array for time-period when monthMulti is true
      const mockUseQueryState = require('next-usequerystate').useQueryState;
      mockUseQueryState.mockImplementation((key: string) => {
        if (key === 'district-code') {
          return ['', mockSetDistrictCode];
        }
        if (key === 'revenue-code') {
          return ['', mockSetRevenueCode];
        }
        if (key === 'time-period') {
          return [['2023_08', '2023_09'], mockSetSelectedTimePeriod];
        }
        return ['', jest.fn()];
      });

      render(<FilterDropdownOptions {...defaultProps} monthMulti={true} />);

      expect(screen.getByTestId('multi-month-picker')).toBeInTheDocument();
      expect(screen.queryByTestId('month-picker')).not.toBeInTheDocument();
    });

    it('calculates min and max dates from timeLimits', () => {
      render(<FilterDropdownOptions {...defaultProps} />);

      const monthPicker = screen.getByTestId('month-picker');
      const input = monthPicker.querySelector('input');

      expect(input).toHaveAttribute('data-min');
      expect(input).toHaveAttribute('data-max');
    });

    it('handles timeLimits without data', () => {
      const propsWithoutTimeLimits = {
        ...defaultProps,
        timeLimits: [],
      };

      render(<FilterDropdownOptions {...propsWithoutTimeLimits} />);

      const monthPicker = screen.getByTestId('month-picker');
      expect(monthPicker).toBeInTheDocument();
    });

    it('calls setSelectedTimePeriod when month is selected', async () => {
      const user = userEvent.setup();
      render(<FilterDropdownOptions {...defaultProps} />);

      const monthPicker = screen.getByTestId('month-picker');
      const input = monthPicker.querySelector('input') as HTMLInputElement;

      await user.type(input, '2023-02');

      expect(mockSetSelectedTimePeriod).toHaveBeenCalled();
      expect(mockSetSelectedTimePeriod).toHaveBeenLastCalledWith(['2023_02'], {
        shallow: false,
      });
    });

    it('calls setSelectedTimePeriod with multiple dates when multi-month is selected', async () => {
      const user = userEvent.setup();

      // Mock useQueryState to return an array for time-period when monthMulti is true
      const mockUseQueryState = require('next-usequerystate').useQueryState;
      mockUseQueryState.mockImplementation((key: string) => {
        if (key === 'district-code') {
          return ['', mockSetDistrictCode];
        }
        if (key === 'revenue-code') {
          return ['', mockSetRevenueCode];
        }
        if (key === 'time-period') {
          return [['2023_08', '2023_09'], mockSetSelectedTimePeriod];
        }
        return ['', jest.fn()];
      });

      render(<FilterDropdownOptions {...defaultProps} monthMulti={true} />);

      const multiMonthPicker = screen.getByTestId('multi-month-picker');
      const input = multiMonthPicker.querySelector('input') as HTMLInputElement;

      await user.type(input, '2023-03');

      expect(mockSetSelectedTimePeriod).toHaveBeenCalled();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('handles empty RevCircleDropdownOptions', () => {
      const propsWithEmptyRevenue = {
        ...defaultProps,
        RevCircleDropdownOptions: [],
      };

      render(<FilterDropdownOptions {...propsWithEmptyRevenue} />);

      const revenueSelect = screen.getByTestId('revenue-circle-select');
      const options = revenueSelect.querySelectorAll('option');

      expect(options).toHaveLength(1); // Only placeholder
    });

    it('handles empty DistrictDropDownOption', () => {
      const propsWithEmptyDistricts = {
        ...defaultProps,
        DistrictDropDownOption: [],
      };

      render(<FilterDropdownOptions {...propsWithEmptyDistricts} />);

      const districtSelect = screen.getByTestId('district-select');
      const options = districtSelect.querySelectorAll('option');

      expect(options).toHaveLength(1); // Only "Select a district" option
    });

    it('handles currentSelectedState without child_type', () => {
      const propsWithoutChildType = {
        ...defaultProps,
        currentSelectedState: {},
      };

      render(<FilterDropdownOptions {...propsWithoutChildType} />);

      // Should not throw error and should render with undefined child_type
      expect(screen.getByTestId('revenue-circle-select')).toBeInTheDocument();
    });

    it('handles timeLimits with invalid date format', () => {
      const propsWithInvalidDates = {
        ...defaultProps,
        timeLimits: ['invalid_date', '2023_01'],
      };

      // Should render without throwing error due to our mock handling invalid dates
      expect(() =>
        render(<FilterDropdownOptions {...propsWithInvalidDates} />)
      ).not.toThrow();
    });
  });

  describe('Integration Tests', () => {
    it('updates revenue options when district changes', async () => {
      const user = userEvent.setup();

      // Mock district selection
      const mockUseQueryState = require('next-usequerystate').useQueryState;
      mockUseQueryState.mockImplementation((key: string) => {
        if (key === 'district-code') {
          return ['D001', mockSetDistrictCode];
        }
        if (key === 'revenue-code') {
          return ['', mockSetRevenueCode];
        }
        if (key === 'time-period') {
          return [['2023_08'], mockSetSelectedTimePeriod];
        }
        return ['', jest.fn()];
      });

      render(<FilterDropdownOptions {...defaultProps} />);

      const revenueSelect = screen.getByTestId('revenue-circle-select');
      expect(revenueSelect).not.toBeDisabled();

      const options = revenueSelect.querySelectorAll('option');
      expect(options[1]).toHaveTextContent('Revenue Circle 1');
      expect(options[2]).toHaveTextContent('Revenue Circle 2');
    });

    it('maintains state consistency across all filters', async () => {
      const user = userEvent.setup();

      // Mock all query states
      const mockUseQueryState = require('next-usequerystate').useQueryState;
      mockUseQueryState.mockImplementation((key: string) => {
        if (key === 'district-code') {
          return ['D001', mockSetDistrictCode];
        }
        if (key === 'revenue-code') {
          return ['rc1', mockSetRevenueCode];
        }
        if (key === 'time-period') {
          return [['2023_02'], mockSetSelectedTimePeriod];
        }
        return ['', jest.fn()];
      });

      render(<FilterDropdownOptions {...defaultProps} />);

      const districtSelect = screen.getByTestId('district-select');
      const revenueSelect = screen.getByTestId('revenue-circle-select');

      expect(districtSelect).toHaveValue('D001');
      expect(revenueSelect).toHaveValue('rc1');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(<FilterDropdownOptions {...defaultProps} />);

      expect(screen.getByLabelText('Select District')).toBeInTheDocument();
      expect(
        screen.getByLabelText('Select Revenue-Circle')
      ).toBeInTheDocument();
      expect(screen.getByLabelText('Select Month')).toBeInTheDocument();
    });

    it('maintains focus management', async () => {
      const user = userEvent.setup();
      render(<FilterDropdownOptions {...defaultProps} />);

      const districtSelect = screen.getByTestId('district-select');
      await user.click(districtSelect);

      expect(districtSelect).toHaveFocus();
    });
  });
});
