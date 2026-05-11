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

const mockedStates = [
  { slug: 'assam', latest_time_period: '2025_03' },
  { slug: 'himachal-pradesh', latest_time_period: '2025_06' },
  { slug: 'odisha', latest_time_period: '2024_11' },
  { slug: 'bihar', latest_time_period: '2024_12' },
  { slug: 'uttar-pradesh', latest_time_period: '2025_01' },
];

jest.mock('@/config/site', () => ({
  ...jest.requireActual('@/config/site'),
  states: [
    { name: 'Assam', slug: 'assam', icon: '/assets/logo/states/Assam.svg', status: 'active' },
    { name: 'Himachal Pradesh', slug: 'himachal-pradesh', icon: '/assets/logo/states/Hp.svg', status: 'active' },
    { name: 'Odisha', slug: 'odisha', icon: '/assets/logo/states/Odisha.svg', status: 'active' },
    { name: 'Bihar', slug: 'bihar', icon: '/assets/logo/states/Bihar.svg', status: 'active' },
    { name: 'Uttar Pradesh', slug: 'uttar-pradesh', icon: '/assets/logo/states/Up.svg', status: 'active' },
  ],
}));

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(() => ({
    data: {
      getStates: mockedStates,
    },
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

  it('renders the main section labelled by its heading', () => {
    render(<QuickLinks />);

    // aria-labelledby points at the visible heading's id, so the accessible name matches the heading text.
    const section = screen.getByRole('region', { name: 'Analytics Dashboard' });
    expect(section).toBeInTheDocument();
  });

  it('renders the main heading and description', () => {
    render(<QuickLinks />);

    expect(
      screen.getByRole('heading', { name: 'Analytics Dashboard' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Explore risk profiles across regions, developed using the underlying data model'
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

  it('renders state card icons as decorative', () => {
    render(<QuickLinks />);

    // State icons are decorative (alt=""). The accessible name comes from the adjacent state-name heading,
    // so screen readers don't announce the icon twice.
    const images = screen.getAllByRole('presentation');
    expect(images.length).toBeGreaterThan(0);
    images.forEach((img) => expect(img).toHaveAttribute('alt', ''));
  });

  it('renders state cards with correct navigation links', () => {
    render(<QuickLinks />);

    const stateCards = [
      { name: /Assam/i, slug: 'assam' },
      { name: /Himachal Pradesh/i, slug: 'himachal-pradesh' },
      { name: /Odisha/i, slug: 'odisha' },
      { name: /Bihar/i, slug: 'bihar' },
      { name: /Uttar Pradesh/i, slug: 'uttar-pradesh' },
    ];

    stateCards.forEach(({ name, slug }) => {
      const matchedState = mockedStates.find((state) => state.slug === slug);
      expect(matchedState).toBeDefined();

      const link = screen.getByRole('link', { name });
      expect(link).toHaveAttribute(
        'href',
        `/${slug}/analytics/?indicator=risk-score&view=map&time-period=${matchedState?.latest_time_period}`
      );
    });
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

    // Section uses aria-labelledby pointing at the heading id so the
    // accessible name stays in sync with the heading automatically.
    const section = screen.getByRole('region');
    expect(section).toHaveAttribute('aria-labelledby', 'home-analytics-heading');

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
