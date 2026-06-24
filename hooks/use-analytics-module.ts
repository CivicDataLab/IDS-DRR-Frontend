'use client';

import { useParams } from 'next/navigation';
import type { HazardType } from 'ids-drr-branding-types';

/** Hazard module slug from the `[module]` analytics route segment. */
export function useAnalyticsModule(): HazardType | string {
  const module = useParams().module;

  if (typeof module !== 'string') {
    throw new Error(
      'useAnalyticsModule: expected [module] route segment (analytics pages only).'
    );
  }

  return module;
}
