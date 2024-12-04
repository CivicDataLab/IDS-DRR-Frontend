'use client';

import React from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Select, Spinner, Text } from 'opub-ui';

import { STATE_CODES, STATE_CODES_DROPDOWN } from '@/config/consts';
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
      {' '}
      {isClient ? (
        <div className="relative max-h-[calc(100vh_-_60px)] min-h-[calc(100vh_-_60px)] grow flex-row gap-1 overflow-y-hidden md:flex">
          <IndicatorListWrapper />
          <main className={cn(styles.Main)}>{children}</main>
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

export function IndicatorListWrapper() {
  const searchParams = useSearchParams();
  const routerParams = useParams();
  const router = useRouter();

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
          <div className="h-full overflow-x-hidden overflow-y-scroll  pt-6">
            <span
              className={cn(
                ' rounded items-center justify-end pl-0'
                // isCollapsed && 'hidden'
              )}
            ></span>
            <div>
              <div className="mb-5 pl-4">
                <Text className="text-textSubdued" fontWeight="bold">
                  ANALYTICS DASHBOARD
                </Text>
              </div>

              <div className="mb-5 px-3">
                <Select
                  name={'State'}
                  label={''}
                  value={
                    STATE_CODES_DROPDOWN.find(
                      (item) => item.value === routerParams.state
                    )?.value
                  }
                  options={STATE_CODES_DROPDOWN}
                  onChange={(e) => {
                    router.push(
                      `/${e}/analytics/?indicator=risk-score&time-period=${process.env.TIME_PERIOD || process.env.NEXT_PUBLIC_TIME_PERIOD}&view=map`
                    );
                  }}
                />
              </div>

              <div className="mb-5 pl-4">
                <Text className="text-textSubdued" fontWeight="bold">
                  INDICATORS
                </Text>
              </div>

              <FactorList />
            </div>
          </div>
        </aside>
      </MediaRendering>
    </React.Fragment>
  );
}
