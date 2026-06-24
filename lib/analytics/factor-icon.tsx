import React from 'react';

import {
  Exposure,
  FloodHazard,
  GovtResponse,
  RiskScore,
  Vulnerability,
} from '@/components/FactorIcons';

export function getFactorIcon(slug: string, color = '#000000') {
  switch (slug) {
    case 'risk-score':
    case 'heat-risk-score':
      return <RiskScore color={color} />;
    case 'vulnerability':
    case 'heat-vulnerability':
      return <Vulnerability color={color} />;
    case 'flood-hazard':
    case 'heat-hazard':
      return <FloodHazard color={color} />;
    case 'exposure':
    case 'heat-exposure':
      return <Exposure color={color} />;
    case 'government-response':
    case 'heat-government-response':
      return <GovtResponse color={color} />;
    default:
      return <RiskScore color={color} />;
  }
}
