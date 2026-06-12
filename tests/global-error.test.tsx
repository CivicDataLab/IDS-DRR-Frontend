import GlobalError from '@/app/global-error';
import { render } from '@testing-library/react';

jest.mock('next/error', () => ({
  __esModule: true,
  default: ({ statusCode }: { statusCode: number }) => (
    <div data-testid="next-error">{statusCode}</div>
  ),
}));

jest.mock('@sentry/nextjs', () => ({
  captureException: jest.fn(),
}));

import { captureException } from '@sentry/nextjs';

describe('GlobalError', () => {
  it('reports the error and renders the fallback page', () => {
    const error = new Error('global failure');
    const { getByTestId } = render(<GlobalError error={error} />);

    expect(getByTestId('next-error')).toHaveTextContent('0');
    expect(captureException).toHaveBeenCalledWith(error);
  });
});
