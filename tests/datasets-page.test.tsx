import React from 'react';
import DatasetsListing from '@/app/[locale]/datasets/page';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('opub-ui');

const pushMock = jest.fn();

jest.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
  Link: ({ href, children }: any) => <a href={href}>{children}</a>,
}));

jest.mock('@/lib/api', () => ({
  fetchDatasets: jest.fn(),
}));

jest.mock('@sentry/nextjs', () => ({
  captureException: jest.fn(),
}));

jest.mock('@/app/[locale]/datasets/components/Filter', () => ({
  __esModule: true,
  default: ({ setSelectedOptions, selectedOptions }: any) => (
    <div data-testid="filter">
      <button
        type="button"
        onClick={() => setSelectedOptions('categories', ['climate'])}
      >
        apply-filter
      </button>
      <span data-testid="selected-filters">
        {JSON.stringify(selectedOptions)}
      </span>
    </div>
  ),
}));

jest.mock('@/app/[locale]/datasets/components/DatasetCards', () => ({
  __esModule: true,
  default: ({ data }: any) => (
    <article data-testid="dataset-card">{data.title}</article>
  ),
}));

jest.mock('@/app/[locale]/datasets/components/GraphqlPagination', () => ({
  __esModule: true,
  default: ({ children, onPageChange, onPageSizeChange }: any) => (
    <div data-testid="pagination">
      <button type="button" onClick={() => onPageChange(2)}>
        next-page
      </button>
      <button type="button" onClick={() => onPageSizeChange(10)}>
        page-size-10
      </button>
      {children}
    </div>
  ),
}));

import { fetchDatasets } from '@/lib/api';

const mockFacets = {
  total: 2,
  results: [
    { id: '1', title: 'Flood Dataset' },
    { id: '2', title: 'Rainfall Dataset' },
  ],
  aggregations: {
    categories: {
      buckets: [{ key: 'climate', doc_count: 2 }],
    },
  },
};

describe('DatasetsListing page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.history.pushState({}, '', '/datasets?size=5&page=1&sort=recent');
    (fetchDatasets as jest.Mock).mockResolvedValue(mockFacets);
  });

  it('renders breadcrumbs and dataset results after fetch', async () => {
    render(<DatasetsListing />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Datasets')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Flood Dataset')).toBeInTheDocument();
    });
    expect(screen.getByText('Rainfall Dataset')).toBeInTheDocument();
    expect(fetchDatasets).toHaveBeenCalled();
  });

  it('shows dataset count summary', async () => {
    render(<DatasetsListing />);

    await waitFor(() => {
      expect(
        screen.getByText('Showing 2 of 2 Datasets')
      ).toBeInTheDocument();
    });
  });

  it('submits a search query', async () => {
    const user = userEvent.setup();
    render(<DatasetsListing />);

    await waitFor(() => expect(fetchDatasets).toHaveBeenCalled());
    await user.click(screen.getByRole('button', { name: 'search' }));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith(
        expect.stringContaining('query=flood')
      );
    });
  });

  it('applies filters from the filter panel', async () => {
    const user = userEvent.setup();
    render(<DatasetsListing />);

    await waitFor(() => expect(fetchDatasets).toHaveBeenCalled());
    await user.click(screen.getByRole('button', { name: 'apply-filter' }));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith(
        expect.stringContaining('categories=climate')
      );
    });
  });

  it('changes sort order', async () => {
    const user = userEvent.setup();
    render(<DatasetsListing />);

    await waitFor(() => expect(fetchDatasets).toHaveBeenCalled());
    await user.selectOptions(screen.getByTestId('select'), 'alphabetical');

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith(
        expect.stringContaining('sort=alphabetical')
      );
    });
  });

  it('handles pagination changes', async () => {
    const user = userEvent.setup();
    render(<DatasetsListing />);

    await waitFor(() => screen.getByTestId('pagination'));
    await user.click(screen.getByRole('button', { name: 'next-page' }));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith(expect.stringContaining('page=2'));
    });
  });
});
