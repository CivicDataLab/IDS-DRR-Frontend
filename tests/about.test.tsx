import React from 'react';
// About component under test
import { About } from '@/app/[locale]/components/about';
import { render, screen } from '@testing-library/react';

// Mock opub-ui components
jest.mock('opub-ui');

// Mock next/image to a basic img and strip unsupported props
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ objectFit, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Mock next/link to render an anchor tag directly
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...rest }: any) => (
    <a href={typeof href === 'string' ? href : href?.pathname} {...rest}>
      {children}
    </a>
  ),
}));

// Mock responsive wrapper to always render children
jest.mock('@/components/media-rendering', () => ({
  MediaRendering: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe('About component', () => {
  it('renders title, description links, buttons, image and Read More link', () => {
    render(<About />);

    // Title text
    expect(screen.getByText('About IDS-DRR')).toBeInTheDocument();

    // Key inline links/buttons text
    expect(screen.getByText('CivicDataLab')).toBeInTheDocument();
    expect(
      screen.getByText('Open Contracting Partnership')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'The Rockefeller Foundation' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Patrick J McGovern Foundation,' })
    ).toBeInTheDocument();

    // Read More link with correct href
    const readMore = screen.getByText('Read More');
    expect(readMore.closest('a')).toHaveAttribute('href', '/about-us');

    // Image alt text should be present (desktop and mobile mocked to render)
    const images = screen.getAllByAltText(
      'An image representing global climate action'
    );
    expect(images.length).toBeGreaterThan(0);
  });
});
