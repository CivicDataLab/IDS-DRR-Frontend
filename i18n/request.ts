import { notFound } from 'next/navigation';
import { captureException } from '@sentry/nextjs';
import { getRequestConfig } from 'next-intl/server';

import { FALLBACK_LOCALE, locales, messages } from '../config/site';
import defaultMessages from '../locales/en.json';
import { formats } from './formats';

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

// Messages for the fallback locale, resolved once at module load.
// A partially translated locale inherits any missing keys from these.
const fallbackMessages = deepMerge(defaultMessages, messages[FALLBACK_LOCALE] ?? {});

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  if (!locale || !locales.includes(locale as any)) {
    captureException(new Error(`Invalid locale: ${locale}`));
    notFound();
  }

  // The frontend ships English defaults only. Non-English translations
  // come from the branding package, deep-merged on top of the English
  // fallback, so that missing keys at least resolve to English text.
  //
  // Precedence:
  // - Non-"en" messages from branding package
  // - "en" messages from branding package
  // - Fallback "en" messages from repo
  let merged = fallbackMessages;
  if (locale !== FALLBACK_LOCALE) {
    const branding = messages[locale as string] ?? {};
    merged = deepMerge(merged, branding);
  }

  return { locale, messages: merged, formats };
});
