import { getModuleBranding } from '@/lib/analytics/module-config';

/**
 * Root pillar indicator slug for a module, by convention: `<module>-risk-score`
 * (e.g. `heat` → `heat-risk-score`). The original flood module predates the
 * prefix convention and uses the bare `risk-score`.
 */
function conventionalRootSlug(moduleSlug: string): string {
  return moduleSlug === 'flood' ? 'risk-score' : `${moduleSlug}-risk-score`;
}

/**
 * Root indicator slug for analytics entry URLs and default selection.
 *
 * Prefers `rootIndicatorSlug` on the branding `Module` (deployment override);
 * otherwise derives it from the module slug by convention. New hazards need no
 * code change — they follow the `<module>-risk-score` convention automatically.
 */
export function getRootIndicatorSlug(
  stateSlug: string | undefined,
  moduleSlug: string
): string {
  const fromBranding = (
    getModuleBranding(stateSlug, moduleSlug) as
      | { rootIndicatorSlug?: string }
      | undefined
  )?.rootIndicatorSlug;

  return fromBranding ?? conventionalRootSlug(moduleSlug);
}

/** Whether the selected indicator is a module root risk score. */
export function isRootRiskIndicator(indicator: string): boolean {
  return indicator === 'risk-score' || indicator.endsWith('-risk-score');
}
