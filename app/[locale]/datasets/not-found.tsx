'use client';

import { useEffect } from 'react';
import { captureException } from '@sentry/nextjs';
import { Button, Text } from 'opub-ui';

export default function NotFound() {
  useEffect(() => {
    captureException('Not found Page Loaded');
  }, []);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-2">
      <Text variant="heading3xl">404</Text>
      <Text variant="headingMd">Ooops , Something is not right!</Text>
      <div className="mt-2">
        <Button url="/">Return Home</Button>
      </div>
    </div>
  );
}
