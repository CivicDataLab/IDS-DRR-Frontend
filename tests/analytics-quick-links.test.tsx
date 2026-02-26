import React from 'react';
import { QuickLinks } from '@/app/[locale]/components/analytics-quick-links';
import { render, screen } from '@testing-library/react';

// Mock opub-ui components
jest.mock('opub-ui');

// Mock next/image to a basic img and strip unsupported props
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, width, height, className, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        {...props}
      />
    );
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

// Mock the constants
jest.mock('@/config/consts', () => ({
  AnalyticsQuickLinksText:
    'Explore flood-risk profiles at the district and sub-district level across states in India, developed using the IDS-DRR data model',
  AnalyticsURL: '/analytics/?indicator=risk-score&view=map',
}));

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(() => ({
    data: { getDataTimePeriods: [{ value: '2023_08' }] },
  })),
}));

describe('QuickLinks Component', () => {
  // beforeEach(() => {
  //   // Set environment variable for consistent testing
  //   process.env.TIME_PERIOD = '2024';
  // });

  // afterEach(() => {
  //   delete process.env.TIME_PERIOD;
  // });

  it('renders the main section with correct aria-label', () => {
    render(<QuickLinks />);

    const section = screen.getByRole('region', {
      name: 'Quick links to deep dive into different states',
    });
    expect(section).toBeInTheDocument();
  });

  it('renders the main heading and description', () => {
    render(<QuickLinks />);

    expect(
      screen.getByRole('heading', { name: 'Analytics Dashboard' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Explore flood-risk profiles at the district and sub-district level across states in India, developed using the IDS-DRR data model'
      )
    ).toBeInTheDocument();
  });

  it('renders the carousel with navigation buttons', () => {
    render(<QuickLinks />);

    expect(screen.getByTestId('carousel')).toBeInTheDocument();
    expect(screen.getByTestId('carousel-previous')).toBeInTheDocument();
    expect(screen.getByTestId('carousel-next')).toBeInTheDocument();
  });

  it('renders all state cards with correct information', () => {
    render(<QuickLinks />);

    // Check for all state names
    expect(screen.getByText('Assam')).toBeInTheDocument();
    expect(screen.getByText('Himachal Pradesh')).toBeInTheDocument();
    expect(screen.getByText('Odisha')).toBeInTheDocument();
    expect(screen.getByText('Bihar')).toBeInTheDocument();
    expect(screen.getByText('Uttar Pradesh')).toBeInTheDocument();
  });

  it('renders state cards with correct images and alt text', () => {
    render(<QuickLinks />);

    // Check for state images with correct alt text
    expect(
      screen.getByAltText('assam state boundary image')
    ).toBeInTheDocument();
    expect(screen.getByAltText('HP state boundary image')).toBeInTheDocument();
    expect(
      screen.getByAltText('Odisha state boundary image')
    ).toBeInTheDocument();
    expect(
      screen.getByAltText('Bihar state boundary image')
    ).toBeInTheDocument();
    expect(screen.getByAltText('UP state boundary image')).toBeInTheDocument();
  });

  it('renders state cards with correct navigation links', () => {
    render(<QuickLinks />);

    // Check for correct navigation links
    const assamLink = screen.getByRole('link', { name: /Assam/i });
    expect(assamLink).toHaveAttribute(
      'href',
      '/assam/analytics/?indicator=risk-score&view=map'
    );

    const hpLink = screen.getByRole('link', { name: /Himachal Pradesh/i });
    expect(hpLink).toHaveAttribute(
      'href',
      '/himachal-pradesh/analytics/?indicator=risk-score&view=map'
    );

    const odishaLink = screen.getByRole('link', { name: /Odisha/i });
    expect(odishaLink).toHaveAttribute(
      'href',
      '/odisha/analytics/?indicator=risk-score&view=map'
    );

    const biharLink = screen.getByRole('link', { name: /Bihar/i });
    expect(biharLink).toHaveAttribute(
      'href',
      'bihar/analytics/?indicator=risk-score&view=map'
    );

    const upLink = screen.getByRole('link', { name: /Uttar Pradesh/i });
    expect(upLink).toHaveAttribute(
      'href',
      'uttar-pradesh/analytics/?indicator=risk-score&view=map'
    );
  });

  it('renders all state cards as active (clickable)', () => {
    render(<QuickLinks />);

    // All state cards should be clickable links
    const stateLinks = screen.getAllByRole('link');
    expect(stateLinks).toHaveLength(5);

    // Each link should have the stateCard class
    stateLinks.forEach((link) => {
      expect(link).toHaveClass('stateCard');
    });
  });

  it('renders carousel items with correct structure', () => {
    render(<QuickLinks />);

    const carouselItems = screen.getAllByTestId('carousel-item');
    expect(carouselItems).toHaveLength(5);

    // Each carousel item should contain a state card
    carouselItems.forEach((item) => {
      expect(item).toBeInTheDocument();
    });
  });

  //   it('renders state cards with correct dimensions and styling', () => {
  //     render(<QuickLinks />);

  //     // Check that state cards have the expected structure
  //     const stateCards = screen.getAllByRole('link');
  //     stateCards.forEach((card) => {
  //       const cardContent = card.querySelector('div');
  //       expect(cardContent).toHaveClass(
  //         'flex',
  //         'h-48',
  //         'w-56',
  //         'flex-col',
  //         'items-center',
  //         'justify-between',
  //         'rounded-2',
  //         'bg-surfaceDefault',
  //         'p-4',
  //         'text-center',
  //         'shadow-elementCard'
  //       );
  //     });
  //   });

  //   it('renders state icons with correct dimensions and styling', () => {
  //     render(<QuickLinks />);

  //     const stateImages = screen.getAllByAltText(/state boundary image$/);
  //     stateImages.forEach((image) => {
  //       expect(image).toHaveAttribute('width', '200');
  //       expect(image).toHaveAttribute('height', '160');
  //       expect(image).toHaveClass(
  //         'h-32',
  //         'w-32',
  //         'object-contain',
  //         'px-3',
  //         'stateIcon'
  //       );
  //     });
  //   });

  //   it('renders state names with correct typography', () => {
  //     render(<QuickLinks />);

  //     const stateNames = screen.getAllByRole('heading', { level: 3 });
  //     expect(stateNames).toHaveLength(5);

  //     stateNames.forEach((name) => {
  //       expect(name).toHaveClass('whitespace-nowrap');
  //     });
  //   });

  //   it('has correct semantic structure', () => {
  //     render(<QuickLinks />);

  //     // Main section should be a region landmark
  //     expect(screen.getByRole('region')).toBeInTheDocument();

  //     // Should have main heading
  //     expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();

  //     // Should have sub-headings for each state
  //     const stateHeadings = screen.getAllByRole('heading', { level: 3 });
  //     expect(stateHeadings).toHaveLength(5);
  //   });

  it('maintains accessibility with proper ARIA labels', () => {
    render(<QuickLinks />);

    // Main section should have descriptive aria-label
    const section = screen.getByRole('region');
    expect(section).toHaveAttribute(
      'aria-label',
      'Quick links to deep dive into different states'
    );

    // Navigation buttons should be accessible
    expect(screen.getByTestId('carousel-previous')).toBeInTheDocument();
    expect(screen.getByTestId('carousel-next')).toBeInTheDocument();
  });

  //   it('renders with correct responsive classes', () => {
  //     render(<QuickLinks />);

  //     // Check for responsive classes in the main section
  //     const section = screen.getByRole('region');
  //     expect(section).toHaveClass('px-5', 'py-6', 'lg:px-6', 'lg:py-20');

  //     // Check for responsive classes in carousel items
  //     const carouselItems = screen.getAllByTestId('carousel-item');
  //     carouselItems.forEach((item) => {
  //       expect(item).toHaveClass(
  //         'lg',
  //         'md:basis-1/2',
  //         'lg:basis-1/3',
  //         'xl:basis-1/4',
  //         '2xl:basis-1/5'
  //       );
  //     });
  //   });
});
