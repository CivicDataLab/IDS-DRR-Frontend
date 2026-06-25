import { HeroSection } from '@/app/[locale]/components/hero-section';
import { render, screen } from '@testing-library/react';

import messages from '../../locales/en.json';

jest.mock('opub-ui');

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img alt={props.alt} data-testid="hero-image" />,
}));

jest.mock('@/config/site', () => ({
  heroBackground: '/hero-bg.jpg',
  heroForeground: { src: '/hero.png', width: 400, height: 200 },
}));

describe('HeroSection', () => {
  it('renders the site name, hero image, and tagline', () => {
    render(<HeroSection />);

    expect(
      screen.getByRole('heading', { name: messages.site.name })
    ).toBeInTheDocument();
    expect(screen.getByTestId('hero-image')).toBeInTheDocument();
    expect(screen.getByText(messages.home.hero.tagline)).toBeInTheDocument();
  });
});
