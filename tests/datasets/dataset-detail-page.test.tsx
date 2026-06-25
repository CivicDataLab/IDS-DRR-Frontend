import DatasetDetailsPage from '@/app/[locale]/datasets/[dataset]/page';
import { render, screen } from '@testing-library/react';

jest.mock('opub-ui');

jest.mock('next/navigation', () => ({
  useParams: () => ({ dataset: 'flood-dataset' }),
}));

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}));

jest.mock('@/app/[locale]/datasets/[dataset]/components/PrimaryData', () => ({
  __esModule: true,
  default: ({ data }: any) => <div data-testid="primary-data">{data?.title}</div>,
}));

jest.mock('@/app/[locale]/datasets/[dataset]/components/Details', () => ({
  __esModule: true,
  default: () => <div data-testid="details">Details</div>,
}));

jest.mock('@/app/[locale]/datasets/[dataset]/components/Resources', () => ({
  __esModule: true,
  default: () => <div data-testid="resources">Resources</div>,
}));

jest.mock('@/app/[locale]/datasets/[dataset]/components/Metadata', () => ({
  __esModule: true,
  default: () => <div data-testid="metadata">Metadata</div>,
}));

import { useQuery } from '@tanstack/react-query';

describe('DatasetDetailsPage', () => {
  it('shows a spinner while loading', () => {
    (useQuery as jest.Mock).mockReturnValue({ data: null, isLoading: true });
    render(<DatasetDetailsPage />);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders dataset sections when loaded', () => {
    (useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      data: { datasets: [{ title: 'Flood Dataset' }] },
    });

    render(<DatasetDetailsPage />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByTestId('primary-data')).toHaveTextContent('Flood Dataset');
    expect(screen.getByTestId('details')).toBeInTheDocument();
    expect(screen.getByTestId('resources')).toBeInTheDocument();
    expect(screen.getByTestId('metadata')).toBeInTheDocument();
  });
});
