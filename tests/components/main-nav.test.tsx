import { render, screen } from '@testing-library/react';

import { MainNav } from '@/components/main-nav';

jest.mock('opub-ui');

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img alt={props.alt} />,
}));

jest.mock('@/config/site', () => ({
  logo: '/logo.svg',
  mainNav: [
    { key: 'home', href: '/' },
    { key: 'datasets', href: '/datasets' },
  ],
  languages: [],
  locales: ['en', 'hi'],
}));

jest.mock('@/components/langSelect/lang-select', () => ({
  TranslateDropdown: () => <div data-testid="translate-dropdown" />,
}));

jest.mock('@/components/langSelect/locale-select', () => ({
  LocaleDropdown: () => <div data-testid="locale-dropdown" />,
}));

describe('MainNav', () => {
  it('renders logo, navigation links, and locale dropdown', () => {
    render(<MainNav />);

    expect(screen.getByRole('img')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Datasets' })).toBeInTheDocument();
    expect(screen.getByTestId('locale-dropdown')).toBeInTheDocument();
  });
});
