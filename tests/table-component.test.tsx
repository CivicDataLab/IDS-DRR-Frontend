import React from 'react';
import { TableComponent } from '@/app/[locale]/[state]/analytics/components/table-component';
import { render, screen } from '@testing-library/react';

// Mock opub-ui components
jest.mock('opub-ui');

// Mock utils
jest.mock('@/hooks/use-format-number', () => ({
  useFormatNumber: () => (value: number | string) => `formatted-${value}`,
}));

// Mock config
jest.mock('@/config/consts', () => ({
  Factors: ['risk-score', 'exposure', 'vulnerability'],
}));

describe('TableComponent', () => {
  const mockData = [
    {
      'region-name': 'District A',
      type: 'district',
      'risk-score': { value: '3', title: 'Risk Score' },
      population: { value: 1000000, title: 'Population' },
      exposure: { value: '4', title: 'Exposure' },
    },
    {
      'region-name': 'District B',
      type: 'district',
      'risk-score': { value: '2', title: 'Risk Score' },
      population: { value: 500000, title: 'Population' },
      exposure: { value: '1', title: 'Exposure' },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state when isLoading is true', () => {
    render(<TableComponent data={mockData} isLoading={true} />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders no data message when data is empty', () => {
    render(<TableComponent data={[]} isLoading={false} />);

    expect(screen.getByText('No data available.')).toBeInTheDocument();
  });

  it('renders no data message when data is null', () => {
    render(<TableComponent data={null} isLoading={false} />);

    expect(screen.getByText('No data available.')).toBeInTheDocument();
  });

  it('renders table with correct structure when data is provided', () => {
    render(<TableComponent data={mockData} isLoading={false} />);

    const table = screen.getByTestId('table');
    expect(table).toBeInTheDocument();
    expect(table).toHaveAttribute('data-theme', 'climate');
  });

  it('renders correct table headers', () => {
    render(<TableComponent data={mockData} isLoading={false} />);

    expect(screen.getByTestId('header-region-name')).toBeInTheDocument();
    expect(screen.getByTestId('header-region-type')).toBeInTheDocument();
    expect(screen.getByTestId('header-risk-score')).toBeInTheDocument();
    expect(screen.getByTestId('header-population')).toBeInTheDocument();
    expect(screen.getByTestId('header-exposure')).toBeInTheDocument();
  });

  it('renders correct table rows with formatted data', () => {
    render(<TableComponent data={mockData} isLoading={false} />);

    // Check first row
    expect(screen.getByTestId('row-0')).toBeInTheDocument();
    expect(screen.getByTestId('cell-0-region-name')).toHaveTextContent(
      'District A'
    );
    expect(screen.getByTestId('cell-0-region-type')).toHaveTextContent(
      'district'
    );
    expect(screen.getByTestId('cell-0-risk-score')).toHaveTextContent(
      'Medium Risk'
    );
    expect(screen.getByTestId('cell-0-population')).toHaveTextContent(
      'formatted-1000000'
    );
    expect(screen.getByTestId('cell-0-exposure')).toHaveTextContent(
      'High Risk'
    );

    // Check second row
    expect(screen.getByTestId('row-1')).toBeInTheDocument();
    expect(screen.getByTestId('cell-1-region-name')).toHaveTextContent(
      'District B'
    );
    expect(screen.getByTestId('cell-1-region-type')).toHaveTextContent(
      'district'
    );
    expect(screen.getByTestId('cell-1-risk-score')).toHaveTextContent(
      'Low Risk'
    );
    expect(screen.getByTestId('cell-1-population')).toHaveTextContent(
      'formatted-500000'
    );
    expect(screen.getByTestId('cell-1-exposure')).toHaveTextContent(
      'Very Low Risk'
    );
  });

  it('handles data with missing properties gracefully', () => {
    const incompleteData = [
      {
        'region-name': 'District C',
        type: 'district',
        'risk-score': { value: '5', title: 'Risk Score' },
        // Missing population and exposure
      },
    ];

    render(<TableComponent data={incompleteData} isLoading={false} />);

    expect(screen.getByTestId('cell-0-region-name')).toHaveTextContent(
      'District C'
    );
    expect(screen.getByTestId('cell-0-risk-score')).toHaveTextContent(
      'Very High Risk'
    );
  });

  it('handles data with null values', () => {
    const dataWithNulls = [
      {
        'region-name': 'District D',
        type: 'district',
        'risk-score': null,
        population: { value: 100000, title: 'Population' },
      },
    ];

    render(<TableComponent data={dataWithNulls} isLoading={false} />);

    expect(screen.getByTestId('cell-0-region-name')).toHaveTextContent(
      'District D'
    );
    expect(screen.getByTestId('cell-0-population')).toHaveTextContent(
      'formatted-100000'
    );
  });
});
