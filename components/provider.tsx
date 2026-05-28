'use client';

import React from 'react';
import { I18nProvider } from 'react-aria';
import { ErrorBoundary } from '@sentry/nextjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster, Tooltip } from 'opub-ui';

import { HandleOnComplete } from '@/lib/router-events';

export default function Provider({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  const [client] = React.useState(
    new QueryClient({ defaultOptions: { queries: { staleTime: 5000 } } })
  );

  return (
    <ErrorBoundary>
      <QueryClientProvider client={client}>
        <I18nProvider locale={locale}>
          <React.Fragment>
            <Tooltip.Provider>
              {children}
              <Toaster />
            </Tooltip.Provider>
            <HandleOnComplete />
          </React.Fragment>
        </I18nProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
