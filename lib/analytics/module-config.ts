import type { HazardType, Module } from 'ids-drr-branding-types';

import { getStateBranding } from '@/lib/state-map-config';

/** Fallback module when branding lists no active modules for a state. */
const DEFAULT_MODULE_SLUG: HazardType = 'flood';

/** Active hazard modules configured for a state in branding. */
export function getActiveModules(stateSlug: string | undefined): Module[] {
  return (
    getStateBranding(stateSlug)?.modules?.filter(
      (module) => module.status === 'active'
    ) ?? []
  );
}

/** First active module for a state, or the platform default. */
export function getDefaultModuleSlug(
  stateSlug: string | undefined
): HazardType | string {
  return getActiveModules(stateSlug)[0]?.slug ?? DEFAULT_MODULE_SLUG;
}

export function isValidModuleForState(
  stateSlug: string | undefined,
  moduleSlug: string
): moduleSlug is HazardType {
  const activeModules = getActiveModules(stateSlug);
  if (activeModules.length === 0) {
    return moduleSlug === 'flood' || moduleSlug === 'heat';
  }
  return activeModules.some((module) => module.slug === moduleSlug);
}

export function getModuleBranding(
  stateSlug: string | undefined,
  moduleSlug: string
): Module | undefined {
  return getStateBranding(stateSlug)?.modules?.find(
    (module) => module.slug === moduleSlug
  );
}
