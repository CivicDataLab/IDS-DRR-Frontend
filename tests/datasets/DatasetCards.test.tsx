import DatasetCard from '@/app/[locale]/datasets/components/DatasetCards';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('opub-ui');

jest.mock('@/i18n/navigation', () => ({
  Link: ({ href, children }: any) => <a href={href}>{children}</a>,
}));

jest.mock('@/hooks/use-format-period', () => ({
  useFormatPeriod: () => (value: string | null | undefined) =>
    value ? `period-${value}` : 'NA',
}));

const dataset = {
  id: 'flood-dataset',
  title: 'Flood Risk Dataset',
  description: 'A detailed description of flood risk data for the region.',
  created: '2024-01-01',
  modified: '2024-06-01',
  organization: 'Example Organization',
  tags: ['flood'],
  categories: ['Climate', 'Hydrology'],
  formats: ['CSV', 'GeoJSON'],
  metadata: [
    { metadata_item: { label: 'Source' }, value: 'Open Data Portal' },
    { metadata_item: { label: 'Last Updated' }, value: '2024-06-01' },
    { metadata_item: { label: 'Update Frequency' }, value: 'Monthly' },
    { metadata_item: { label: 'Period From' }, value: '2020-01-01' },
    { metadata_item: { label: 'Period To' }, value: '2024-01-01' },
  ],
};

describe('DatasetCards', () => {
  beforeEach(() => {
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
      configurable: true,
      value: 200,
    });
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
      configurable: true,
      value: 40,
    });
  });

  it('renders dataset metadata and links to the detail page', () => {
    render(<DatasetCard data={dataset} />);

    expect(screen.getByText('Flood Risk Dataset')).toBeInTheDocument();
    expect(screen.getByText(/Source: Open Data Portal/)).toBeInTheDocument();
    expect(screen.getByText(/Last Updated: 2024-06-01/)).toBeInTheDocument();
    expect(screen.getByText(/Update Frequency: Monthly/)).toBeInTheDocument();
    expect(
      screen.getByText(/Reference Period: period-2020-01-01 to period-2024-01-01/)
    ).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/datasets/flood-dataset'
    );
  });

  it('renders format tags and categories', () => {
    render(<DatasetCard data={dataset} />);

    expect(screen.getByText('CSV')).toBeInTheDocument();
    expect(screen.getByText('GeoJSON')).toBeInTheDocument();
    expect(screen.getByText('Climate')).toBeInTheDocument();
    expect(screen.getByText('Hydrology')).toBeInTheDocument();
  });

  it('toggles show more on long descriptions', async () => {
    const user = userEvent.setup();
    render(<DatasetCard data={dataset} />);

    const showMore = screen.getByRole('button', { name: 'Show more' });
    await user.click(showMore);
    expect(screen.getByRole('button', { name: 'Show less' })).toBeInTheDocument();
  });

  it('falls back to NA for missing metadata', () => {
    render(
      <DatasetCard
        data={{
          ...dataset,
          metadata: [],
          formats: [],
          categories: [],
        }}
      />
    );

    expect(screen.getAllByText(/NA/).length).toBeGreaterThan(0);
  });
});
