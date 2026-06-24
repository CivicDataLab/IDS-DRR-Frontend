/**
 * Canonical SENDAI factor roles. These are fixed by the framework (not by
 * hazard), so presentation (icons, etc.) keys off the role, never off a
 * hazard-prefixed slug — adding a new hazard needs no change here.
 */
export type FactorRole =
  | 'risk-score'
  | 'hazard'
  | 'exposure'
  | 'vulnerability'
  | 'government-response';

const FACTOR_ROLES: FactorRole[] = [
  'risk-score',
  'hazard',
  'exposure',
  'vulnerability',
  'government-response',
];

/**
 * Map an indicator slug to its canonical factor role by matching the factor
 * suffix, regardless of hazard prefix. Handles both the prefixed convention
 * (`heat-hazard`, `flood-hazard`, `heat-risk-score`) and flood's legacy bare
 * slugs (`risk-score`, `exposure`, `vulnerability`, `government-response`).
 * Returns `null` for non-factor (raw metric) indicators.
 */
export function getFactorRole(slug: string): FactorRole | null {
  return (
    FACTOR_ROLES.find(
      (role) => slug === role || slug.endsWith(`-${role}`)
    ) ?? null
  );
}

/**
 * Whether an indicator is rendered on the 1–5 risk-score scale rather than as
 * a raw metric value. Score-style indicators are exactly the SENDAI factor
 * pillars (any hazard), so this keys off the factor role — language-independent
 * and hazard-agnostic, replacing the former hardcoded `Factors` allowlist.
 */
export function isScoreIndicator(slug: string): boolean {
  return getFactorRole(slug) !== null;
}
