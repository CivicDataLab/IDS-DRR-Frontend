import { Link } from '@/lib/router-events/patch-router/link';
import { fireEvent, render, screen } from '@testing-library/react';

jest.mock('@/i18n/navigation', () => ({
  Link: ({ href, onClick, children, ...rest }: any) => (
    <a href={href} onClick={onClick} {...rest}>
      {children}
    </a>
  ),
}));

jest.mock('@/lib/router-events/events', () => ({
  onStart: jest.fn(),
}));

jest.mock('@/lib/router-events/patch-router/should-trigger-start-event', () => ({
  shouldTriggerStartEvent: jest.fn(() => true),
}));

import { onStart } from '@/lib/router-events/events';
import { shouldTriggerStartEvent } from '@/lib/router-events/patch-router/should-trigger-start-event';

describe('router-events Link', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders an internal next-intl link and triggers progress on navigation', () => {
    render(<Link href="/datasets">Datasets</Link>);

    fireEvent.click(screen.getByRole('link', { name: 'Datasets' }));

    expect(shouldTriggerStartEvent).toHaveBeenCalled();
    expect(onStart).toHaveBeenCalled();
  });

  it('renders a plain anchor for external URLs', () => {
    render(
      <Link href="https://example.com" data-testid="external">
        External
      </Link>
    );

    const link = screen.getByTestId('external');
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('forwards onClick for internal links', () => {
    const onClick = jest.fn();
    render(
      <Link href="/glossary" onClick={onClick}>
        Glossary
      </Link>
    );

    fireEvent.click(screen.getByRole('link', { name: 'Glossary' }));
    expect(onClick).toHaveBeenCalled();
  });
});
