import React from 'react';
import { dehydrate, Hydrate } from '@tanstack/react-query';

import {
  ANALYTICS_INDICATORS,
  ANALYTICS_TIME_PERIODS,
} from '@/config/graphql/analaytics-queries';
import { deployment, serverUrl } from '@/config/site';
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

  await queryClient.prefetchQuery([`timePeriods`], () =>
    GraphQL(
      `${serverUrl['data-management-url']}/graphql`,
      ANALYTICS_TIME_PERIODS
    )
  );

  await queryClient.prefetchQuery(
    [`indicators_${searchParams?.['indicator']}`],
    () =>
      GraphQL(
        `${serverUrl['data-management-url']}/graphql`,
        ANALYTICS_INDICATORS,
        {
          indcFilter: { slug: searchParams?.['indicator'] },
        }
      )
  );

  const dehydratedState = dehydrate(queryClient);
  return (
    <Hydrate state={dehydratedState}>
      <MediaRendering minWidth={null} maxWidth="1023">
        <AnalyticsMobileLayout
          timePeriod={searchParams['time-period']}
          indicator={searchParams?.indicator}
          boundary={searchParams?.boundary}
        />
      </MediaRendering>
      <MediaRendering minWidth="1024" maxWidth={null}>
        <Content
          timePeriod={searchParams['time-period']}
          indicator={searchParams?.indicator}
        />
      </MediaRendering>
    </Hydrate>
  );
}
