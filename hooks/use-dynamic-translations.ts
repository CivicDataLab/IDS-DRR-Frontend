'use client';

import { useTranslations } from 'next-intl';

// Type-erased wrapper around next-intl's useTranslations, for looking
// up keys not declared in the frontend's locales/en.json (and therefore
// not in IntlMessages). Typical use: branding packages ship their own
// message namespaces. The cast lets calls compile against arbitrary keys.
export function useDynamicTranslations(namespace?: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (useTranslations as any)(namespace);
}
