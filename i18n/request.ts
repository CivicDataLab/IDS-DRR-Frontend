import { notFound } from 'next/navigation';
import { captureException } from '@sentry/nextjs';
import { messagesEn } from 'ids-drr-branding';
import { getRequestConfig } from 'next-intl/server';

import locales from '../config/locales';

// Recursive merge: values from `overrides` replace keys in `base` at any depth.
// Plain objects are merged; everything else (strings, arrays, primitives) overrides.
function deepMerge(
  base: Record<string, any>,
  overrides: Record<string, any>
): Record<string, any> {
  const out: Record<string, any> = { ...base };
  for (const [key, value] of Object.entries(overrides)) {
    const existing = out[key];
    if (
      existing &&
      typeof existing === 'object' &&
      !Array.isArray(existing) &&
      value &&
      typeof value === 'object' &&
      !Array.isArray(value)
    ) {
      out[key] = deepMerge(existing, value);
    } else {
      out[key] = value;
    }
  }
  return out;
}

const brandingMessagesByLocale: Record<string, Record<string, unknown>> = {
  en: messagesEn,
};

// Messages for the fallback locale, resolved once at module load.
// A partially translated locale inherits any missing keys from these.
const fallback = locales.default;
const fallbackMessages = deepMerge(
  (await import(`../locales/${fallback}.json`)).default,
  brandingMessagesByLocale[fallback] ?? {}
);

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  if (!locale || !locales.all.includes(locale as any)) {
    captureException(new Error(`Invalid locale: ${locale}`));
    notFound();
  }

  // Precedence (highest wins): branding override > repo default >
  // fallback-locale branding > fallback-locale repo default.
  let messages = fallbackMessages;
  if (locale !== fallback) {
    const defaults = (await import(`../locales/${locale}.json`)).default;
    const branding = brandingMessagesByLocale[locale as string] ?? {};
    messages = deepMerge(deepMerge(messages, defaults), branding);
  }

  return { locale, messages };
});
