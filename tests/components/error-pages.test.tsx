import ErrorPage from '@/app/[locale]/error';
import NotFound from '@/app/[locale]/not-found';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('opub-ui');

jest.mock('@sentry/nextjs', () => ({
  captureException: jest.fn(),
}));

import { captureException } from '@sentry/nextjs';

describe('ErrorPage', () => {
  it('renders the error message and retries', async () => {
    const reset = jest.fn();
    const error = new Error('boom');
    const user = userEvent.setup();

    render(<ErrorPage error={error} reset={reset} />);

    expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(reset).toHaveBeenCalled();
    expect(captureException).toHaveBeenCalledWith(error);
  });
});

describe('NotFound', () => {
  it('renders the 404 page and reports to Sentry', () => {
    render(<NotFound />);

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page not found')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Return Home' })).toBeInTheDocument();
    expect(captureException).toHaveBeenCalled();
  });
});
