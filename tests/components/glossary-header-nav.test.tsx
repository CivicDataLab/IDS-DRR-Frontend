import GlossaryHeaderNav from '@/components/glossary/glossary-header-nav';
import { render, screen } from '@testing-library/react';

jest.mock('opub-ui');

jest.mock('@/i18n/navigation', () => ({
  Link: ({ href, children }: any) => <a href={href}>{children}</a>,
}));

jest.mock('@/config/site', () => ({
  userManualLink: 'https://example.com/manual',
  docsLink: 'https://example.com/docs',
}));

jest.mock('@/components/icons', () => ({
  __esModule: true,
  default: { externalLink: 'external' },
}));

describe('GlossaryHeaderNav', () => {
  it('renders manual and documentation links', () => {
    render(<GlossaryHeaderNav />);

    expect(screen.getByRole('link', { name: /User Manual/i })).toHaveAttribute(
      'href',
      'https://example.com/manual'
    );
    expect(screen.getByRole('link', { name: /Full Documentation/i })).toHaveAttribute(
      'href',
      'https://example.com/docs'
    );
  });
});
