'use client';

import { useEffect } from 'react';
import { captureException } from '@sentry/nextjs';
import { useTranslations } from 'next-intl';
import { Button, Text } from 'opub-ui';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const t = useTranslations('errors.generic');
  useEffect(() => {
    console.error(error);
    captureException(error);
  }, [error]);

  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center gap-3">
      <Text variant="headingMd" as="h2">
        {t('heading')}
      </Text>
      <Button onClick={() => reset()}>{t('retry')}</Button>
    </div>
  );
}
