import { notFound } from 'next/navigation';
import { captureException } from '@sentry/nextjs';
import { getRequestConfig } from 'next-intl/server';

import locales from './config/locales';

export default getRequestConfig(async ({ requestLocale }) => {
  // Validate that the incoming `locale` parameter is valid
  const locale = await requestLocale;

  if (!locale || !locales.all.includes(locale as any)) {
    captureException('Locale Error');
    notFound();
  }

  return {
    locale,
    messages: (await import(`./locales/${locale}.json`)).default,
  };
});
