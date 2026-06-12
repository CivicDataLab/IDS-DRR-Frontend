import PrimaryData from '@/app/[locale]/datasets/[dataset]/components/PrimaryData';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('opub-ui');

jest.mock('@/i18n/navigation', () => ({
  Link: ({ href, children, onClick }: any) => (
    <a href={href} onClick={onClick}>
      {children}
    </a>
  ),
}));

jest.mock('@/hooks/use-copy-url', () => ({
  useCopyURL: () => jest.fn(),
}));

jest.mock('@/components/icons', () => ({
  __esModule: true,
  default: {
    info: 'info',
    link: 'link',
    share: 'share',
    IconBrandFacebook: 'fb',
    IconBrandLinkedin: 'li',
    IconBrandX: 'x',
  },
}));

jest.mock(
  '@/app/[locale]/datasets/[dataset]/components/Metadata',
  () => ({
    __esModule: true,
    default: () => <div data-testid="metadata-panel">Metadata panel</div>,
  })
);

const data = {
  title: 'Flood Dataset',
  description: 'Detailed flood dataset description.',
  metadata: [
    { metadataItem: { label: 'Source' }, value: 'Open Data Portal' },
    { metadataItem: { label: 'Source Website' }, value: 'https://source.example' },
    { metadataItem: { label: 'Github Repo Link' }, value: 'https://github.example/repo' },
  ],
};

describe('PrimaryData', () => {
  beforeEach(() => {
    window.open = jest.fn();
    window.confirm = jest.fn(() => true);
  });

  it('renders dataset summary and external links', async () => {
    const user = userEvent.setup();
    render(<PrimaryData data={data} isLoading={false} />);

    expect(screen.getByText('Flood Dataset')).toBeInTheDocument();
    expect(screen.getByText('Detailed flood dataset description.')).toBeInTheDocument();
    expect(screen.getByText('Source:')).toBeInTheDocument();
    expect(screen.getByText('Open Data Portal')).toBeInTheDocument();

    await user.click(screen.getByText('Visit Source Website'));
    expect(window.confirm).toHaveBeenCalled();
    expect(window.open).toHaveBeenCalledWith('https://source.example', '_blank');

    await user.click(screen.getByText('Go to Github Repo'));
    expect(window.open).toHaveBeenCalledWith('https://github.example/repo', '_blank');
  });

  it('opens metadata tray on mobile', async () => {
    const user = userEvent.setup();
    render(<PrimaryData data={data} isLoading={false} />);

    await user.click(screen.getByRole('button', { name: /Metadata/i }));
    expect(screen.getByTestId('metadata-panel')).toBeInTheDocument();
  });
});
