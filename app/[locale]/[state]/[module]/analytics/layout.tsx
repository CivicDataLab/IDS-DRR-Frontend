import React, { cache } from 'react';
import { notFound } from 'next/navigation';

import { AnalyticsSideBarLayout } from '@/components/analytics/analytics-sidebar-layout';
import { fetchStatesList } from '@/lib/analytics/fetch-states-list';
import { isValidModuleForState } from '@/lib/analytics/module-config';

const getStatesList = cache(async (moduleSlug: string) =>
  fetchStatesList(moduleSlug)
);

export default async function ModuleAnalyticsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ state: string; module: string }>;
}) {
  const { state, module } = await params;

  if (!isValidModuleForState(state, module)) notFound();

  const statesListData = await getStatesList(module);
  const currentState = statesListData?.find((item) => item.slug === state);

  if (!currentState) notFound();

  return (
    <AnalyticsSideBarLayout
      currentState={currentState}
      statesList={statesListData}
    >
      {children}
    </AnalyticsSideBarLayout>
  );
}
