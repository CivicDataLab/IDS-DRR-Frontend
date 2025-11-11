import { captureException } from '@sentry/nextjs';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import {
  ANALYTICS_INDICATORS,
  ANALYTICS_TIME_PERIODS,
  PLATFORM_STATES_LIST,
} from '@/config/graphql/analaytics-queries';
import { getQueryClient, GraphQL } from '@/lib/api';
import { AnalyticsMainLayout } from './components/analytics-layout';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const searchParamsHome = await searchParams;
  const queryClient = getQueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: [`timePeriods`],
      queryFn: () =>
        GraphQL(
          `${process.env.DATA_MANAGEMENT_LAYER_URL}/graphql`,
          ANALYTICS_TIME_PERIODS
        ),
    });

    await queryClient.prefetchQuery({
      queryKey: [`indicators_${searchParamsHome?.['indicator']}`],
      queryFn: () =>
        GraphQL(
          `${process.env.DATA_MANAGEMENT_LAYER_URL}/graphql`,
          ANALYTICS_INDICATORS,
          { indcFilter: { slug: searchParamsHome?.['indicator'] } }
        ),
    });

    await queryClient.prefetchQuery({
      queryKey: [`states_list`],
      queryFn: () =>
        GraphQL(
          `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
          PLATFORM_STATES_LIST
        ),
    });
  } catch (error) {
    captureException(error);
  }

  // if (Object.keys(searchParams).length === 0) {
  //   redirect(AnalyticsURL);
  // }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <AnalyticsMainLayout />
    </HydrationBoundary>
  );
}
