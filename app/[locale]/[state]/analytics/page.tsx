import { captureException } from '@sentry/nextjs';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import {
  ANALYTICS_INDICATORS,
  PLATFORM_STATES_LIST,
} from '@/config/graphql/analaytics-queries';
import { getQueryClient, GraphQL } from '@/lib/api';
import { AnalyticsMainLayout } from './components/analytics-layout';

export default async function Home({
  params,
  searchParams,
}: {
  params: Promise<{ state: string }>;
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const { state: stateSlug } = await params;
  const { indicator } = await searchParams;
  const queryClient = getQueryClient();
  const graphqlUrl = `${process.env.DATA_MANAGEMENT_LAYER_URL}/graphql`;

  try {
    const statesData = await queryClient.fetchQuery<any>({
      queryKey: [`states_list`],
      queryFn: () => GraphQL(graphqlUrl, PLATFORM_STATES_LIST),
    });

    const stateCode = statesData?.getStates?.find(
      (s: any) => s.slug === stateSlug
    )?.code;

    if (stateCode) {
      await Promise.all(
        [indicator, indicator !== 'risk-score' ? 'risk-score' : null]
          .filter((slug): slug is string => Boolean(slug))
          .map((slug) =>
            queryClient.prefetchQuery({
              queryKey: [`indicators_${slug}_${stateCode}`],
              queryFn: () =>
                GraphQL(graphqlUrl, ANALYTICS_INDICATORS, {
                  indcFilter: { slug },
                  stateCode: Number(stateCode),
                }),
            })
          )
      );
    }
  } catch (error) {
    captureException(error);
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <AnalyticsMainLayout />
    </HydrationBoundary>
  );
}
