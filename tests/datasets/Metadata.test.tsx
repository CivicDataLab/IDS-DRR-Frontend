import Metadata from '@/app/[locale]/datasets/[dataset]/components/Metadata';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { makeDataset } from '../fixtures';

jest.mock('opub-ui');

jest.mock('@/i18n/navigation', () => ({
  Link: ({ href, children }: any) => <a href={href}>{children}</a>,
}));

const data = makeDataset({
  metadata: [
    { metadataItem: { id: '1', label: 'Source' }, value: 'Gov' },
    {
      metadataItem: { id: '2', label: 'Source Website' },
      value: 'https://source.example',
    },
    { metadataItem: { id: '3', label: 'Update Frequency' }, value: 'Monthly' },
  ],
  formats: ['CSV'],
  categories: [{ name: 'Climate' }],
});

describe('Metadata', () => {
  it('renders filtered metadata, formats, and categories', () => {
    render(<Metadata data={data} />);

    expect(screen.getByText('Metadata')).toBeInTheDocument();
    expect(screen.getByText('Update Frequency:')).toBeInTheDocument();
    expect(screen.getByText('Monthly')).toBeInTheDocument();
    expect(screen.getByText('CSV')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Climate' })).toHaveAttribute(
      'href',
      '/datasets?categories=Climate'
    );
    expect(screen.queryByText('Source:')).not.toBeInTheDocument();
  });

  it('closes the mobile tray when requested', async () => {
    const setOpen = jest.fn();
    const user = userEvent.setup();

    render(<Metadata data={data} setOpen={setOpen} />);
    await user.click(screen.getByTestId('icon').closest('button')!);
    expect(setOpen).toHaveBeenCalledWith(false);
  });
});
