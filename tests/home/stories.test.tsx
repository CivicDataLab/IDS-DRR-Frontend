import { Stories } from '@/app/[locale]/components/stories';
import { render, screen } from '@testing-library/react';

jest.mock('opub-ui');

jest.mock('@/i18n/navigation', () => ({
  Link: ({ href, children }: any) => <a href={href}>{children}</a>,
}));

jest.mock('@/config/site', () => ({
  stories: [
    {
      url: 'https://example.com/story',
      title: 'Flood resilience story',
      description: 'How data improved response.',
      image: '/story.png',
      date: '2024-03-01T00:00:00Z',
    },
  ],
}));

describe('Stories', () => {
  it('renders the stories carousel', () => {
    render(<Stories />);

    expect(screen.getByText('Stories')).toBeInTheDocument();
    expect(screen.getByText('Flood resilience story')).toBeInTheDocument();
    expect(screen.getByText('How data improved response.')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      'https://example.com/story'
    );
  });
});
