'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Spinner, Text } from 'opub-ui';

import {
  ANALYTICS_DISTRICT_DATA,
  ANALYTICS_INDICATORS,
  ANALYTICS_REVENUE_TABLE_DATA,
} from '@/config/graphql/analaytics-queries';
import { GraphQL } from '@/lib/api';
import { cn } from '@/lib/utils';
import { SidebarLayout } from './sidebar-layout';
import { SidebarDefaultLayout } from './SidebarDefaultLayout';
import styles from './styles.module.scss';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export function AnalyticsDashboardLayout({ children }: DashboardLayoutProps) {
  const [isClient, setIsClient] = React.useState(false);

  // To prevent a hydration mismatch fix:https://nextjs.org/docs/messages/react-hydration-error.
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <React.Suspense
      fallback={
        <div className="flex h-[100vh] flex-col  place-content-center items-center">
          <Spinner color="highlight" />
          <Text>Loading...</Text>
        </div>
      }
    >
      {isClient ? (
        <div
          className={cn(
            'relative max-h-[calc(100vh_-_60px)] min-h-[calc(100vh_-_60px)] grow gap-1 overflow-y-hidden md:flex'
          )}
        >
          <main className={cn(styles.Main, 'px-4', 'py-6')}>{children}</main>
          <SidePaneLayout />
        </div>
      ) : (
        <div className="flex h-[100vh] flex-col  place-content-center items-center">
          <Spinner color="highlight" />
          <Text>Loading...</Text>
        </div>
      )}
    </React.Suspense>
  );
}

function SidePaneLayout() {
  const searchParams = useSearchParams();
  const indicator = searchParams.get('indicator');
  const time_period = searchParams.get('time-period') || '2023_08';
  const region = searchParams.get('region');
  const boundary = searchParams.get('boundary') || 'district';

  const sidePaneQuery: any =
    boundary === 'district'
      ? ANALYTICS_DISTRICT_DATA
      : ANALYTICS_REVENUE_TABLE_DATA;

  const sidePaneData: any = useQuery(
    [
      `sidePaneData_${indicator}_${region?.split(',')}_${boundary}_${time_period}`,
    ],
    () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        sidePaneQuery,
        {
          indcFilter: { slug: indicator },
          dataFilter: { dataPeriod: time_period },
          ...(region && { geoFilter: { code: region?.split(',') } }),
        }
      ),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const indicatorDescriptions: any = useQuery(
    [`indicators_${indicator}`],
    () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        ANALYTICS_INDICATORS,
        {
          indcFilter: { slug: indicator },
        }
      ),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  if (!sidePaneData.isFetched)
    return (
      <div className="flex min-w-[500px] flex-col place-content-center items-center border-solid border-borderSubdued bg-surfaceDefault shadow-basicMd">
        <Spinner color="highlight" />
        <Text className="text-center">Loading...</Text>
      </div>
    );
  return region !== null && region.length > 0
    ? sidePaneData.isFetched && (
        <SidebarLayout
          data={
            sidePaneData?.data[
              boundary === 'district' ? 'districtViewData' : 'revCircleViewData'
            ]?.table_data
          }
          indicator={indicator}
          boundary={boundary}
        />
      )
    : sidePaneData.isFetched && (
        <SidebarDefaultLayout
          chartData={
            sidePaneData?.data[
              boundary === 'district' ? 'districtViewData' : 'revCircleViewData'
            ]?.table_data
          }
          indicatorDescriptions={indicatorDescriptions?.data?.indicators}
          indicator={indicator}
          boundary={boundary}
        />
      );
}
