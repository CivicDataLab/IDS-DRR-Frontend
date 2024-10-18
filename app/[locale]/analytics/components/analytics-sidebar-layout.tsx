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
import { MediaRendering } from '@/components/media-rendering';
import { DefaultWindow } from './default-output-window';
import { FactorList } from './factor-list';
import { OutputWindow } from './output-window';
import styles from './styles.module.scss';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export function AnalyticsDashboardLayout({ children }: DashboardLayoutProps) {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

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
      <MediaRendering minWidth="1024" maxWidth={null}>
        {/* DESKTOP  */}{' '}
        {isClient ? (
          <div className="relative max-h-[calc(100vh_-_60px)] min-h-[calc(100vh_-_60px)] grow flex-row-reverse gap-1 overflow-y-hidden md:flex">
            <main className={cn(styles.Main)}>{children}</main>
            <IndicatorListWrapper />
          </div>
        ) : (
          <div className="flex h-[100vh] flex-col  place-content-center items-center">
            <Spinner color="highlight" />
            <Text>Loading...</Text>
          </div>
        )}
      </MediaRendering>
      <MediaRendering minWidth={null} maxWidth="1023">
        {/* Mobile  */}
        {isClient ? (
          <div className="relative max-h-[calc(100vh_-_60px)] min-h-[calc(100vh_-_60px)] grow flex-row-reverse gap-1 overflow-y-hidden md:flex">
            <main className={cn(styles.Main)}>{children}</main>
            <IndicatorListWrapper />
            {/* <OutputWindowComponent /> */}
          </div>
        ) : (
          <div className="flex h-[100vh] flex-col  place-content-center items-center">
            <Spinner color="highlight" />
            <Text>Loading...</Text>
          </div>
        )}
      </MediaRendering>
    </React.Suspense>
  );
}

export function IndicatorListWrapper() {
  const searchParams = useSearchParams();

  const region = searchParams.get('district-code') || '';
  const view = searchParams.get('view') || '';

  return (
    <React.Fragment>
      {/* DESKTOP  */}
      <MediaRendering minWidth="1024" maxWidth={null}>
        <aside
          className={cn(
            'overflow-hidden bg-surfaceDefault pr-0 shadow-basicMd',
            'shadow-inset z-1 hidden shrink-0 basis-[320px] bg-[#F4FBF5] md:block',
            // isCollapsed && 'basis-[32px]',
            'border-r-1 border-solid border-borderSubdued',
            styles.Collapse
          )}
        >
          <div className="h-[90vh] overflow-x-hidden overflow-y-scroll  pt-6">
            <span
              className={cn(
                ' rounded items-center justify-end pl-0'
                // isCollapsed && 'hidden'
              )}
            ></span>
            <div>
              <div className=" mb-5  pl-4">
                <Text className="text-textSubdued" fontWeight="bold">
                  INDICATORS
                </Text>
              </div>

              <FactorList />
            </div>
          </div>
        </aside>
        {region !== null && region.length > 0 && view === 'map' && (
        <OutputWindowComponent />
      </MediaRendering>
      {/* Mobile View */}
      <MediaRendering minWidth={null} maxWidth="1023">
        <OutputWindowComponent />
      </MediaRendering>
      )}
    </React.Fragment>
  );
}

export function OutputWindowComponent() {
  const searchParams = useSearchParams();
  const indicator = searchParams.get('indicator');
  const time_period = searchParams.get('time-period');
  const region =
    searchParams.get('revenue-code') || searchParams.get('district-code');
  const boundary = searchParams.get('revenue-code')
    ? 'revenue-circle'
    : 'district';

  const sidePaneQuery: any = !searchParams.get('revenue-code')
    ? ANALYTICS_DISTRICT_DATA
    : ANALYTICS_REVENUE_TABLE_DATA;

  const sidePaneData: any = useQuery(
    [`sidePaneData_${indicator}_${region}_${boundary}_${time_period}`],
    () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        sidePaneQuery,
        {
          indcFilter: { slug: indicator },
          dataFilter: { dataPeriod: time_period },
          ...(region && { geoFilter: { code: region } }),
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

  return (
    <>
      <MediaRendering minWidth="1024" maxWidth={null}>
        {sidePaneData.isFetched && (
          <OutputWindow
            data={
              sidePaneData?.data[
                !searchParams.get('revenue-code')
                  ? 'districtViewData'
                  : 'revCircleViewData'
              ]
            }
            indicatorDescriptions={indicatorDescriptions?.data?.indicators}
            indicator={indicator}
            boundary={boundary}
          />
        )}
      </MediaRendering>
      <MediaRendering minWidth={null} maxWidth="1023">
        {sidePaneData.isFetched && (
          <OutputWindow
            data={
              sidePaneData?.data[
                !searchParams.get('revenue-code')
                  ? 'districtViewData'
                  : 'revCircleViewData'
              ]
            }
            indicatorDescriptions={indicatorDescriptions?.data?.indicators}
            indicator={indicator}
            boundary={boundary}
          />
        )}
      </MediaRendering>
    </>
  );

  // : sidePaneData.isFetched && (
  //     <DefaultWindow
  //       chartData={
  //         sidePaneData?.data[
  //           boundary === 'district' ? 'districtViewData' : 'revCircleViewData'
  //         ]
  //       }
  //       indicatorDescriptions={indicatorDescriptions?.data?.indicators}
  //       indicator={indicator}
  //       boundary={boundary}
  //     />
  //   );
}
