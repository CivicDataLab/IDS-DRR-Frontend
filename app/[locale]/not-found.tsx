'use client';

import { useEffect } from 'react';
import { captureException } from '@sentry/nextjs';
import { useTranslations } from 'next-intl';
import { Button, Text } from 'opub-ui';

export default function NotFound() {
  const t = useTranslations('errors.notFound');
  useEffect(() => {
    captureException(
      new Error(`Not found: ${window.location.pathname}`)
    );
  }, []);

  return (
    <div className="flex flex-col gap-2 items-center justify-center h-full">
      <Text variant="heading3xl">404</Text>
      <Text variant="headingMd">{t('heading')}</Text>
      <div className="mt-2">
        <Button url="/">{t('home')}</Button>
      </div>
    </div>
  );
}
