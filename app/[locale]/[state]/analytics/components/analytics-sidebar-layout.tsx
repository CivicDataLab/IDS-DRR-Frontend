'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Select, Spinner, Text } from 'opub-ui';

import { useStateName } from '@/hooks/use-state-name';
import { routes } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { MediaRendering } from '@/components/media-rendering';
import { FactorList } from './factor-list';
import styles from './styles.module.scss';

interface DashboardLayoutProps {
  children?: React.ReactNode;
  currentState: any;
  statesList: any;
}

export function AnalyticsSideBarLayout({
  children,
  currentState,
  statesList,
}: DashboardLayoutProps) {
  const tCommon = useTranslations('common');
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
          <Text>{tCommon('loading')}</Text>
        </div>
      }
    >
      {' '}
      {isClient ? (
        <div className="relative max-h-[calc(100vh_-_60px)] min-h-[calc(100vh_-_60px)] grow flex-row gap-1 overflow-y-hidden md:flex">
          <IndicatorListWrapper
            statesList={statesList}
            currentState={currentState}
          />
          <main className={cn(styles.Main)}>{children}</main>
        </div>
      ) : (
        <div className="flex h-[100vh] flex-col  place-content-center items-center">
          <Spinner color="highlight" />
          <Text>{tCommon('loading')}</Text>
        </div>
      )}
    </React.Suspense>
  );
}

function IndicatorListWrapper({ statesList, currentState }: any) {
  const t = useTranslations('analytics.sidebar');
  const router = useRouter();
  const stateName = useStateName();

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
                  {t('heading')}
                </Text>
              </div>

              <div className="mb-5 px-3">
                <Select
                  name={'State'}
                  label={''}
                  value={currentState?.slug}
                  options={statesList.map((state: any) => {
                    return {
                      label: stateName(state.slug, state.name),
                      value: state.slug,
                    };
                  })}
                  onChange={(slug) => {
                    router.push(routes.analytics(slug));
                  }}
                />
              </div>

              <div className="mb-5 pl-4">
                <Text className="text-textSubdued" fontWeight="bold">
                  {t('indicators')}
                </Text>
              </div>

              <FactorList currentState={currentState} />
            </div>
          </div>
        </aside>
      </MediaRendering>
    </React.Fragment>
  );
}
