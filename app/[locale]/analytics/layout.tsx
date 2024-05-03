import React from 'react';

import { MediaRendering } from '@/components/media-rendering';
import { AnalyticsDashboardLayout } from './components/analytics-sidebar-layout';

export default async function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MediaRendering minWidth={null} maxWidth="1023">
        {children}
      </MediaRendering>
      <MediaRendering minWidth="1024" maxWidth={null}>
        <AnalyticsDashboardLayout>{children}</AnalyticsDashboardLayout>
      </MediaRendering>
    </>
  );
}
