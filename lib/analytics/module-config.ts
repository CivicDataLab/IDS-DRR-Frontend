import type { Module } from 'ids-drr-branding-types';

import { getStateBranding } from '@/lib/state-map-config';

/**
 * Last-resort module when a state's branding lists no modules at all.
 * Preserves single-hazard (flood) deployments that predate module config.
 */
const DEFAULT_MODULE_SLUG = 'flood';

/** Active hazard modules configured for a state in branding. */
export function getActiveModules(stateSlug: string | undefined): Module[] {
  return (
    getStateBranding(stateSlug)?.modules?.filter(
      (module) => module.status === 'active'
    ) ?? []
  );
}

/** First active module for a state, or the platform default. */
export function getDefaultModuleSlug(stateSlug: string | undefined): string {
  return getActiveModules(stateSlug)[0]?.slug ?? DEFAULT_MODULE_SLUG;
}

/**
 * Whether a module route is valid for a state, per the backend's authoritative
 * module list (`State.modules`, derived from imported indicators). Branding
 * only decorates modules for display; the backend decides which modules
 * actually have data, so route guards validate against it.
 */
export function isValidModuleForState(
  stateModules: readonly string[] | undefined,
  moduleSlug: string
): boolean {
  const modules = stateModules ?? [];
  // No modules reported: accept only the default (legacy single-hazard data).
  if (modules.length === 0) {
    return moduleSlug === DEFAULT_MODULE_SLUG;
  }
  return modules.includes(moduleSlug);
}

export function getModuleBranding(
  stateSlug: string | undefined,
  moduleSlug: string
): Module | undefined {
  return getStateBranding(stateSlug)?.modules?.find(
    (module) => module.slug === moduleSlug
  );
}
