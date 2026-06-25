import React, { cache } from 'react';
import { notFound } from 'next/navigation';

import { PLATFORM_STATES_LIST } from '@/config/graphql/analaytics-queries';
import { getQueryClient, GraphQL } from '@/lib/api';
import { AnalyticsSideBarLayout } from './components/analytics-sidebar-layout';

const getStatesList = cache(async () => {
  const queryClient = getQueryClient();

  const statesListData = await queryClient
    .fetchQuery({
      queryKey: ['states_list'],
      queryFn: () =>
        GraphQL(
          `${process.env.DATA_MANAGEMENT_LAYER_URL}/graphql`,
          PLATFORM_STATES_LIST
        ),
    })
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
  params: Promise<{ state: string }>;
}) {
  const resolvedParams = await params;
  const state = resolvedParams.state;
  const statesListData = await getStatesList();
  const currentState = statesListData?.find(
    (item) => item.slug === state
  );

  if (!currentState) notFound();

  return (
    <>
      <AnalyticsSideBarLayout
        currentState={currentState}
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
