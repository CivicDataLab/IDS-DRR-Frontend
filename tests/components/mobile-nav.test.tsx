import { fireEvent, render, screen } from '@testing-library/react';

import { MobileNav } from '@/components/mobile-nav';

jest.mock('opub-ui');

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img alt={props.alt} />,
}));

jest.mock('@/config/branding', () => ({
  Credits: () => <div data-testid="credits">Credits</div>,
  PartnerLogos: () => <div data-testid="partner-logos">Partners</div>,
}));

jest.mock('@/config/site', () => ({
  logo: '/logo.svg',
  mainNav: [{ key: 'home', href: '/' }],
  languages: [{ label: 'English', value: 'en' }],
  locales: ['en'],
}));

jest.mock('@/components/langSelect/lang-select', () => ({
  TranslateDropdown: () => <div data-testid="translate-dropdown" />,
}));

jest.mock('@/components/icons', () => ({
  __esModule: true,
  default: { menu: 'menu', cross: 'cross' },
}));

describe('MobileNav', () => {
  it('opens the menu and renders navigation links', () => {
    render(<MobileNav />);

    fireEvent.click(screen.getByRole('button', { name: 'Menu' }));

    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByTestId('translate-dropdown')).toBeInTheDocument();
    expect(screen.getByTestId('credits')).toBeInTheDocument();
    expect(screen.getByTestId('partner-logos')).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('hidden');
  });
});
