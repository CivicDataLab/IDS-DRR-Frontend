import React from 'react';

import { AnalyticsSideBarLayout } from './components/analytics-sidebar-layout';

export default async function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AnalyticsSideBarLayout>{children}</AnalyticsSideBarLayout>
    </>
  );
}
