import { config } from 'ids-drr-branding';
import type { Module, State } from 'ids-drr-branding-types';

/** Branding config for a state, matched by analytics route slug. */
export function getStateBranding(slug: string | undefined): State | undefined {
  if (!slug) return undefined;
  return (config.states ?? []).find((state) => state.slug === slug);
}

function getStateModule(
  stateSlug: string | undefined,
  moduleSlug: string = 'flood'
): Module | undefined {
  return getStateBranding(stateSlug)?.modules?.find(
    (hazardModule) => hazardModule.slug === moduleSlug
  );
}

/**
 * Whether the active hazard module supports sub-district map drill-down.
 * When true, district clicks load revCircleMapData. When false, district
 * clicks only update the output pane while the map stays at state level.
 */
export function hasSubDistrictSupport(
  stateSlug: string | undefined,
  moduleSlug: string = 'flood'
): boolean {
  const hazardModule = getStateModule(stateSlug, moduleSlug);
  return hazardModule?.withSubDistrictSupport ?? true;
}
