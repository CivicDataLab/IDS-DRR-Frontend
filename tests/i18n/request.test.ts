jest.mock('next-intl/server', () => ({
  getRequestConfig: (fn: unknown) => fn,
}));

jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => {
    throw new Error('notFound');
  }),
}));

jest.mock('@sentry/nextjs', () => ({
  captureException: jest.fn(),
}));

import getRequestConfig from '@/i18n/request';

describe('i18n request config', () => {
  it('returns locale messages and formats for a valid locale', async () => {
    const config = await (getRequestConfig as any)({
      requestLocale: Promise.resolve('en'),
    });

    expect(config.locale).toBe('en');
    expect(config.messages.nav).toBeDefined();
    expect(config.formats.dateTime.monthYear).toBeDefined();
  });

  it('rejects invalid locales', async () => {
    await expect(
      (getRequestConfig as any)({ requestLocale: Promise.resolve('invalid') })
    ).rejects.toThrow('notFound');
  });
});
