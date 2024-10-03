'use client';

import React from 'react';
import { ErrorBoundary } from '@sentry/nextjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster, Tooltip } from 'opub-ui';

import { HandleOnComplete } from '@/lib/router-events';

export default function Provider({ children }: { children: React.ReactNode }) {
  const [client] = React.useState(
    new QueryClient({ defaultOptions: { queries: { staleTime: 5000 } } })
  );

  return (
    <ErrorBoundary>
      <QueryClientProvider client={client}>
        <React.Fragment>
          <Tooltip.Provider>
            {children}
            <Toaster />
          </Tooltip.Provider>
          <HandleOnComplete />
        </React.Fragment>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
