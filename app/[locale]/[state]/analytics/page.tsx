import { captureException } from '@sentry/nextjs';
import { dehydrate, Hydrate } from '@tanstack/react-query';

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
  searchParams: { [key: string]: string };
}) {
  const queryClient = getQueryClient();

  try {
    await queryClient.prefetchQuery([`timePeriods`], () =>
      GraphQL(
        `${process.env.DATA_MANAGEMENT_LAYER_URL}/graphql`,
        ANALYTICS_TIME_PERIODS
      )
    );

    await queryClient.prefetchQuery(
      [`indicators_${searchParams?.['indicator']}`],
      () =>
        GraphQL(
          `${process.env.DATA_MANAGEMENT_LAYER_URL}/graphql`,
          ANALYTICS_INDICATORS,
          { indcFilter: { slug: searchParams?.['indicator'] } }
        )
    );

    await queryClient.prefetchQuery([`states_list`], () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        PLATFORM_STATES_LIST
      )
    );
  } catch (error) {
    captureException(error);
  }

  // if (Object.keys(searchParams).length === 0) {
  //   redirect(AnalyticsURL);
  // }

  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <AnalyticsMainLayout />
    </Hydrate>
  );
}
