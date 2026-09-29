import React, { cache } from 'react';
import { notFound } from 'next/navigation';

import { states } from '@/config/site';
import { fetchStatesList } from '@/lib/analytics/fetch-states-list';
import { isValidModuleForState } from '@/lib/analytics/module-config';
import { AnalyticsSideBarLayout } from '@/components/analytics/analytics-sidebar-layout';

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

  const statesListData = await getStatesList(module);

  const isActiveState = (stateSlug: string) =>
    states.some((item) => item.slug === stateSlug && item.status === 'active');

  const availableStates = statesListData.filter(
    (item) =>
      isActiveState(item.slug) && isValidModuleForState(item.modules, module)
  );

  const currentState = statesListData?.find(
    (item) => item.slug === state && isActiveState(item.slug)
  );

  if (!currentState) notFound();
  // The backend's module list for this state is authoritative.
  if (!isValidModuleForState(currentState.modules, module)) notFound();

  return (
    <AnalyticsSideBarLayout
      currentState={currentState}
      statesList={availableStates}
    >
      {children}
    </AnalyticsSideBarLayout>
  );
}
