'use client';

import { useDynamicTranslations } from './use-dynamic-translations';

// Look up a translated state name by slug, falling back to the literal
// name from branding config when no translation exists. Deployments
// supply translations under `messages.states.{slug}` per locale.
export function useStateName() {
  const t = useDynamicTranslations();
  return (slug: string, fallback: string): string =>
    t.has(`states.${slug}`) ? t(`states.${slug}`) : fallback;
}
