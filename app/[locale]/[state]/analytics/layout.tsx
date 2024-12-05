import React, { cache } from 'react';
import { useQuery } from '@tanstack/react-query';

import { PLATFORM_STATES_LIST } from '@/config/graphql/analaytics-queries';
import { getQueryClient, GraphQL } from '@/lib/api';
import { AnalyticsSideBarLayout } from './components/analytics-sidebar-layout';

const getStatesList = cache(async () => {
  const queryClient = getQueryClient();

  const statesListData = await queryClient
    .fetchQuery([`states_list`], () =>
      GraphQL(
        `${process.env.DATA_MANAGEMENT_LAYER_URL}/graphql`,
        PLATFORM_STATES_LIST
      )
    )
    .then((res) => res?.getStates)
    .catch(() => {
      return [];
    });

  return statesListData;
});

export default async function AnalyticsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { state: string };
}) {
  const statesListData = await getStatesList();

  return (
    <>
      <AnalyticsSideBarLayout
        currentState={statesListData?.find(
          (item: any) => item.slug === params.state
        )}
        statesList={statesListData}
      >
        {children}
        {/* {React.Children.map(children, child =>
          React.isValidElement(child)
            ? React.cloneElement(child, { statesList: statesListData })
            : child
        )} */}
      </AnalyticsSideBarLayout>
    </>
  );
}
