import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { notFound } from 'next/navigation';

import { AnalyticsMainLayout } from '@/components/analytics/analytics-layout';
import { fetchStatesList } from '@/lib/analytics/fetch-states-list';
import { isValidModuleForState } from '@/lib/analytics/module-config';
import { prefetchAnalyticsPageData } from '@/lib/analytics/prefetch';

export default async function ModuleAnalyticsPage({
  params,
  searchParams,
}: {
  params: Promise<{ state: string; module: string }>;
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const { state: stateSlug, module } = await params;
  const { indicator } = await searchParams;

  // Validate against the backend's authoritative module list (cached, so this
  // reuses the same fetch the layout already issued for this request).
  const statesList = await fetchStatesList(module);
  const currentState = statesList?.find((item) => item.slug === stateSlug);
  if (!currentState || !isValidModuleForState(currentState.modules, module)) {
    notFound();
  }

  const queryClient = await prefetchAnalyticsPageData({
    stateSlug,
    moduleSlug: module,
    indicator,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AnalyticsMainLayout />
    </HydrationBoundary>
  );
}
