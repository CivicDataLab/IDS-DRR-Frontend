import NavLink from '@/components/nav-link';
import { render, screen } from '@testing-library/react';

jest.mock('@/i18n/navigation', () => ({
  usePathname: jest.fn(() => '/datasets'),
}));

jest.mock('@/lib/router-events', () => ({
  Link: ({ href, children, style, className }: any) => (
    <a href={href} style={style} className={className}>
      {children}
    </a>
  ),
}));

describe('NavLink', () => {
  it('bolds the link when pathname matches href', () => {
    render(
      <NavLink href="/datasets" className="nav-item">
        Datasets
      </NavLink>
    );

    const link = screen.getByRole('link', { name: 'Datasets' });
    expect(link).toHaveStyle({ fontWeight: 'bold' });
    expect(link).toHaveClass('nav-item');
  });

  it('does not bold the link for a different path', () => {
    render(<NavLink href="/glossary">Glossary</NavLink>);

    const link = screen.getByRole('link', { name: 'Glossary' });
    expect(link).not.toHaveStyle({ fontWeight: 'bold' });
  });
});
