'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NextTopLoader from 'nextjs-toploader';
import { Toaster, Tooltip } from 'opub-ui';

import { HandleOnComplete } from '@/lib/router-events';

export default function Provider({ children }: { children: React.ReactNode }) {
  const [client] = React.useState(
    new QueryClient({ defaultOptions: { queries: { staleTime: 5000 } } })
  );

  return (
    <QueryClientProvider client={client}>
      <React.Fragment>
        <Tooltip.Provider>
          {children}
          <Toaster />
        </Tooltip.Provider>
        <HandleOnComplete />
      </React.Fragment>
    </QueryClientProvider>
  );
}
