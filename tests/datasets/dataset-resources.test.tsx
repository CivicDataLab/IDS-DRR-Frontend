import Resources from '@/app/[locale]/datasets/[dataset]/components/Resources';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('opub-ui');

jest.mock('@/i18n/navigation', () => ({
  Link: ({ href, children }: any) => <a href={href}>{children}</a>,
}));

jest.mock('next/navigation', () => ({
  useParams: () => ({ dataset: 'flood-dataset' }),
}));

jest.mock('@/lib/api', () => ({
  GraphQL: jest.fn(),
}));

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}));

import { useQuery } from '@tanstack/react-query';

const resources = [
  {
    id: 'res-1',
    name: 'Flood GeoJSON',
    description: 'GeoJSON export of flood extents for the region.',
    modified: '2024-06-01T00:00:00Z',
    fileDetails: { format: 'GeoJSON' },
  },
];

describe('dataset Resources', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_BACKEND_URL = 'https://api.example.com';
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
      configurable: true,
      value: 200,
    });
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
      configurable: true,
      value: 40,
    });
  });

  it('renders downloadable resources', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: { datasetResources: resources },
      isLoading: false,
    });

    render(<Resources />);

    expect(screen.getByText('Downloadable Resources')).toBeInTheDocument();
    expect(screen.getByText('Flood GeoJSON')).toBeInTheDocument();
    expect(screen.getByText('GeoJSON')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Download' })).toHaveAttribute(
      'href',
      'https://api.example.com/api/download/resource/res-1'
    );
  });

  it('shows a spinner while loading', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
    });

    render(<Resources />);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('toggles long resource descriptions', async () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: { datasetResources: resources },
      isLoading: false,
    });
    const user = userEvent.setup();

    render(<Resources />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Show more' })).toBeInTheDocument();
    });
    await user.click(screen.getByRole('button', { name: 'Show more' }));
    expect(screen.getByRole('button', { name: 'Show less' })).toBeInTheDocument();
  });
});
