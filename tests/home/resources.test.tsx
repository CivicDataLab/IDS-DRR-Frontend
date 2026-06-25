import Resources from '@/app/[locale]/components/resources';
import { render, screen, waitFor } from '@testing-library/react';

jest.mock('opub-ui');

jest.mock('@/i18n/navigation', () => ({
  Link: ({ href, children }: any) => <a href={href}>{children}</a>,
}));

jest.mock('@/hooks/use-format-period', () => ({
  useFormatPeriod: () => (value: string | null | undefined) =>
    value ? `period-${value}` : 'NA',
}));

jest.mock('@/lib/api', () => ({
  fetchDatasets: jest.fn().mockResolvedValue({
    results: [
      {
        id: 'ds-1',
        title: 'Rainfall Dataset',
        formats: ['CSV'],
        metadata: [
          { metadata_item: { label: 'Source' }, value: 'Open Data' },
          { metadata_item: { label: 'Last Updated' }, value: '2024-06-01' },
          { metadata_item: { label: 'Update Frequency' }, value: 'Monthly' },
          { metadata_item: { label: 'Period From' }, value: '2020-01-01' },
          { metadata_item: { label: 'Period To' }, value: '2024-01-01' },
        ],
      },
    ],
  }),
}));

jest.mock('@/config/site', () => ({
  resources: [
    {
      url: '/guide',
      title: 'User Guide',
      source: 'Example Source',
      lastUpdated: '2024-01-01',
      updateFrequency: 'Yearly',
      referencePeriodFrom: '2020-01-01',
      referencePeriodTo: '2024-01-01',
      tags: ['guide'],
    },
  ],
}));

describe('home Resources', () => {
  it('renders featured resources and fetched datasets', async () => {
    render(<Resources />);

    expect(screen.getByText('Resources')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('User Guide')).toBeInTheDocument();
      expect(screen.getByText('Rainfall Dataset')).toBeInTheDocument();
    });
    expect(screen.getByText('CSV')).toBeInTheDocument();
  });
});
