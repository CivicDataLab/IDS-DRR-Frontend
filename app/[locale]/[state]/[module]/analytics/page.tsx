import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { notFound } from 'next/navigation';

import { AnalyticsMainLayout } from '@/components/analytics/analytics-layout';
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

  if (!isValidModuleForState(stateSlug, module)) notFound();

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
