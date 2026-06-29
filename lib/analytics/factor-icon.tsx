import React from 'react';

import {
  Exposure,
  FloodHazard,
  GovtResponse,
  RiskScore,
  Vulnerability,
} from '@/components/FactorIcons';
import { type FactorRole, getFactorRole } from '@/lib/analytics/factor-role';

const ICON_BY_ROLE = {
  'risk-score': RiskScore,
  hazard: FloodHazard,
  exposure: Exposure,
  vulnerability: Vulnerability,
  'government-response': GovtResponse,
} satisfies Record<FactorRole, typeof RiskScore>;

/**
 * Icon for an indicator, keyed by its canonical factor role (hazard-agnostic).
 * Any hazard's `<module>-<factor>` slug resolves automatically; non-factor
 * indicators fall back to the risk-score icon.
 */
export function getFactorIcon(slug: string, color = '#000000') {
  const Icon = ICON_BY_ROLE[getFactorRole(slug) ?? 'risk-score'];
  return <Icon color={color} />;
}
