import Provider from '@/components/provider';
import { render, screen } from '@testing-library/react';

jest.mock('opub-ui');

jest.mock('@sentry/nextjs', () => ({
  ErrorBoundary: ({ children }: any) => <>{children}</>,
}));

jest.mock('@/lib/router-events', () => ({
  HandleOnComplete: () => <div data-testid="route-complete" />,
}));

describe('Provider', () => {
  it('wraps children with query, i18n, and router helpers', () => {
    render(
      <Provider locale="en">
        <div>App content</div>
      </Provider>
    );

    expect(screen.getByText('App content')).toBeInTheDocument();
    expect(screen.getByTestId('toaster')).toBeInTheDocument();
    expect(screen.getByTestId('route-complete')).toBeInTheDocument();
  });
});
