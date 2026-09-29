import { captureException } from '@sentry/nextjs';

import {
  ANALYTICS_INDICATORS,
  PLATFORM_STATES_LIST,
} from '@/config/graphql/analaytics-queries';
import { getRootIndicatorSlug } from '@/lib/analytics/root-indicator';
import { getQueryClient, GraphQL } from '@/lib/api';

export async function prefetchAnalyticsPageData({
  stateSlug,
  moduleSlug,
  indicator,
}: {
  stateSlug: string;
  moduleSlug: string;
  indicator?: string;
}) {
  const queryClient = getQueryClient();
  const graphqlUrl = `${process.env.DATA_MANAGEMENT_LAYER_URL}/graphql`;

  try {
    const statesData = await queryClient.fetchQuery({
      queryKey: [`states_list_${moduleSlug}`],
      queryFn: () =>
        GraphQL(graphqlUrl, PLATFORM_STATES_LIST, { module: moduleSlug }),
    });

    const stateCode = statesData?.getStates?.find(
      (s) => s.slug === stateSlug
    )?.code;

    if (stateCode) {
      const rootIndicator = getRootIndicatorSlug(stateSlug, moduleSlug);
      const indicatorSlugs = [
        indicator,
        indicator !== rootIndicator ? rootIndicator : null,
      ].filter((slug): slug is string => Boolean(slug));

      await Promise.all(
        indicatorSlugs.map((slug) =>
          queryClient.prefetchQuery({
            queryKey: [`indicators_${slug}_${stateCode}_${moduleSlug}`],
            queryFn: () =>
              GraphQL(graphqlUrl, ANALYTICS_INDICATORS, {
                indcFilter: { slug, module: moduleSlug },
                stateCode,
              }),
          })
        )
      );
    }
  } catch (error) {
    captureException(error);
  }

  return queryClient;
}
