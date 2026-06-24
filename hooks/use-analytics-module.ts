'use client';

import { useParams } from 'next/navigation';

/** Hazard module slug from the `[module]` analytics route segment. */
export function useAnalyticsModule(): string {
  const module = useParams().module;

  if (typeof module !== 'string') {
    throw new Error(
      'useAnalyticsModule: expected [module] route segment (analytics pages only).'
    );
  }

  return module;
}
