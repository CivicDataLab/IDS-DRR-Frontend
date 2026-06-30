import { config } from 'ids-drr-branding';
import type { State } from 'ids-drr-branding-types';

/** Branding config for a state, matched by analytics route slug. */
export function getStateBranding(slug: string | undefined): State | undefined {
  if (!slug) return undefined;
  return (config.states ?? []).find((state) => state.slug === slug);
}
