import type { HazardType } from 'ids-drr-branding-types';

import { getModuleBranding } from '@/lib/analytics/module-config';

/** Default root pillar indicator per hazard module (until branding exposes it). */
const DEFAULT_ROOT_INDICATOR_BY_MODULE: Record<HazardType, string> = {
  flood: 'risk-score',
  heat: 'heat-risk-score',
};

/**
 * Root indicator slug for analytics entry URLs and default selection.
 *
 * Today: derived from `moduleSlug` (`flood` → `risk-score`, `heat` → `heat-risk-score`).
 * Later: prefer `rootIndicatorSlug` on branding `Module` in deployment config, keyed by
 * `stateSlug` + `moduleSlug` when states diverge.
 */
export function getRootIndicatorSlug(
  stateSlug: string | undefined,
  moduleSlug: string
): string {
  const brandingModule = getModuleBranding(stateSlug, moduleSlug);
  const fromBranding = (
    brandingModule as { rootIndicatorSlug?: string } | undefined
  )?.rootIndicatorSlug;

  if (fromBranding) return fromBranding;

  if (moduleSlug in DEFAULT_ROOT_INDICATOR_BY_MODULE) {
    return DEFAULT_ROOT_INDICATOR_BY_MODULE[moduleSlug as HazardType];
  }

  return DEFAULT_ROOT_INDICATOR_BY_MODULE.flood;
}

/** Whether the selected indicator is a module root risk score (flood or heat). */
export function isRootRiskIndicator(indicator: string): boolean {
  return (Object.values(DEFAULT_ROOT_INDICATOR_BY_MODULE) as string[]).includes(
    indicator
  );
}
