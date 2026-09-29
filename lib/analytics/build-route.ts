import { getDefaultModuleSlug } from '@/lib/analytics/module-config';
import { routes, type AnalyticsView } from '@/lib/routes';
import { getStateBranding } from '@/lib/state-map-config';

type AnalyticsRouteOptions = {
  view?: AnalyticsView;
  timePeriod?: string;
};

/** Build module-aware analytics URL for a state. */
export function analyticsRouteForState(
  stateSlug: string,
  moduleSlug: string | undefined,
  opts: AnalyticsRouteOptions = {}
) {
  const resolvedModule = moduleSlug ?? getDefaultModuleSlug(stateSlug);
  return routes.analytics(stateSlug, resolvedModule, opts);
}

/** Home quick-link: analytics when one module, state hub otherwise. */
export function stateQuickLink(stateSlug: string) {
  const modules = getStateBranding(stateSlug)?.modules ?? [];
  if (modules.length === 1) {
    return routes.analytics(stateSlug, modules[0].slug);
  }
  return routes.state(stateSlug);
}
