import React from 'react';
import { redirect } from 'next/navigation';
import { captureException } from '@sentry/nextjs';
import { dehydrate, Hydrate } from '@tanstack/react-query';

import { AnalyticsURL } from '@/config/consts';
import {
  ANALYTICS_INDICATORS,
  ANALYTICS_TIME_PERIODS,
} from '@/config/graphql/analaytics-queries';
import { getQueryClient, GraphQL } from '@/lib/api';
import { MediaRendering } from '@/components/media-rendering';
import { Content } from './components/analytics-layout';
import { AnalyticsMobileLayout } from './components/analytics-mobile-layout';

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const queryClient = getQueryClient();

  const boundary = searchParams['revenue-code'] ? 'revenue-circle' : 'district';

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
  } catch (error) {
    captureException(error);
  }

  if (Object.keys(searchParams).length === 0) {
    redirect(AnalyticsURL);
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <MediaRendering minWidth={null} maxWidth="1023">
        <AnalyticsMobileLayout
          timePeriod={searchParams['time-period']}
          indicator={searchParams?.indicator}
          boundary={boundary}
        />
      </MediaRendering>
      <MediaRendering minWidth="1024" maxWidth={null}>
        <Content />
      </MediaRendering>
    </Hydrate>
  );
}
