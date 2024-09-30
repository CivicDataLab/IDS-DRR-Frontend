import { notFound } from 'next/navigation';
import { captureException } from '@sentry/nextjs';
import { getRequestConfig } from 'next-intl/server';

import locales from './config/locales';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.all.includes(locale as any)) {
    captureException('Locale Error');
    notFound();
  }

  return {
    messages: (await import(`./locales/${locale}.json`)).default,
  };
});
