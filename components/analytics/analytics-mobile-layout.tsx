'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAnalyticsModule } from '@/hooks/use-analytics-module';
import { useCopyURL } from '@/hooks/use-copy-url';
import { useLockBody } from '@/hooks/use-lock-body';
import { useStateName } from '@/hooks/use-state-name';
import { useTranslations } from 'next-intl';
import { parseAsString, useQueryState } from 'next-usequerystate';
import { Button, Icon, Menu, Text } from 'opub-ui';

import {
  type Indicator,
  type IndicatorCategory,
  type State,
} from '@/config/graphql/analaytics-queries';
import { features } from '@/config/site';
import {
  hasSubDistrictSupport,
  isModuleReportDownloadable,
  isModuleViewEnabled,
} from '@/lib/analytics/module-config';
import { getLatestDate } from '@/lib/analytics/utils';
import { ANALYTICS_VIEWS, routes } from '@/lib/routes';
import { type JsonScalar } from '@/lib/types';
import { cn, downloadStateReport } from '@/lib/utils';
import Icons from '@/components/icons';
import { OutputWindowComponent } from './analytics-layout';
import { ChartView } from './chart-view';
import { AboutIndicator } from './default-output-window';
import { FactorList } from './factor-list';
import { FilterComp } from './filter-component';
import { MapViewPanel } from './map-view-panel';
import { TableComponent } from './table-component';

interface Option {
  disabled?: boolean;
  value: string;
  label: string;
  districtCode?: string;
}

export function AnalyticsMobileLayout({
  timePeriod,
  indicator,
  indicatorCategories,
  mapData,
  revenueMapData,
  districtGeographiesData,
  revenueGeographiesData,
  timePeriods,
  mapIndicatorsData,
  aboutIndicators,
  tableData,
  currentSelectedState,
  statesList,
}: {
  timePeriod: string;
  indicator: string;
  indicatorCategories?: IndicatorCategory[];
  mapData: JsonScalar;
  revenueMapData: JsonScalar;
  districtGeographiesData: JsonScalar;
  revenueGeographiesData: JsonScalar;
  timePeriods: string[];
  mapIndicatorsData: { data?: { indicators: Indicator[] } } | undefined;
  aboutIndicators?: Indicator[];
  tableData: JsonScalar;
  currentSelectedState: State;
  statesList: State[];
}) {
  const t = useTranslations('analytics');
  const tCommon = useTranslations('common');
  const stateName = useStateName();
  const analyticsModule = useAnalyticsModule();
  const withSubDistrictSupport = hasSubDistrictSupport(
    currentSelectedState?.slug,
    analyticsModule
  );
  const downloadReportEnabled = isModuleReportDownloadable(
    currentSelectedState.slug,
    analyticsModule
  );
  const copyURL = useCopyURL();
  //Remove default page scroll to make only the content scrollable
  useLockBody();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const unusedStatesList = statesList;

  const [, setDistrictCode] = useQueryState('district-code');
  const [, setRevenueCode] = useQueryState('revenue-code');
  const [timePeriodSelected, setTimePeriod] = useQueryState(
    'time-period',
    parseAsString.withDefault(timePeriod)
  );

  const viewButtonConfig = {
    map: { icon: Icons.IconMap, title: t('views.map') },
    chart: { icon: Icons.IconChartBar, title: t('views.chart') },
    table: { icon: Icons.IconTableAlias, title: t('views.table') },
  } as const;

  const buttons = [
    ...ANALYTICS_VIEWS.filter((tabValue) =>
      isModuleViewEnabled(currentSelectedState.slug, analyticsModule, tabValue)
    ).map((tabValue) => ({
      ...viewButtonConfig[tabValue],
      value: tabValue,
    })),
    {
      icon: Icons.IconDots,
      title: t('views.more'),
      value: 'more',
    },
  ];

  const [view, setView] = useQueryState(
    'view',
    parseAsString.withDefault('map')
  );

  React.useEffect(() => {
    if (!view || view === 'map' || view === 'more') return;
    if (
      isModuleViewEnabled(
        currentSelectedState.slug,
        analyticsModule,
        view as 'chart' | 'table'
      )
    ) {
      return;
    }
    setView('map', { shallow: true });
  }, [view, currentSelectedState.slug, analyticsModule, setView]);

  const searchParams = useSearchParams();
  const isMapView = !view || view === 'map';
  const districtCode = searchParams.get('district-code');
  const revenueCode = searchParams.get('revenue-code');
  const region = revenueCode || districtCode;

  // Initialize dropdown options
  const RevCircleDropdownOptions: Option[] = [{ label: '', value: '' }];
  const DistrictDropDownOption: Option[] = [{ label: '', value: '' }];

  // Populate district dropdown options
  if (districtGeographiesData.data && !districtGeographiesData.isFetching) {
    districtGeographiesData.data?.getDistrictRevCircle?.forEach(
      (geography: { district: string; code: string }) => {
        DistrictDropDownOption.push({
          label: geography.district,
          value: geography.code ? geography.code : 'NA',
        });
      }
    );
  }

  // Populate revenue circle dropdown options
  if (revenueGeographiesData.data && !revenueGeographiesData.isFetching) {
    const rawData = revenueGeographiesData?.data?.getDistrictRevCircle;
    if (rawData) {
      for (const revenueCircle in rawData) {
        const revenueCircles = rawData[revenueCircle];
        revenueCircles.forEach(
          (
            circle: JsonScalar
            //   {
            //   'revenue-circle': string;
            //   code: string;
            //   district_code: string;
            // }
          ) => {
            RevCircleDropdownOptions.push({
              label:
                circle[currentSelectedState.child_type ?? ''] ||
                circle['revenue-circle'],
              value: circle.code,
              districtCode: circle.district_code,
            });
          }
        );
      }
    }
  }

  // Sync time period from URL on component mount
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const timePeriod =
      getLatestDate(params.get('time-period')?.split(',') || []) ||
      process.env.NEXT_PUBLIC_TIME_PERIOD;

    if (timePeriod) {
      setTimePeriod(timePeriod);
    }
  }, [setTimePeriod]);

  const [activeButton, setActiveButton] = useState(view);
  // const [activeButton, setActiveButton] = useState(''); // State for managing active buttons
  const [filteredTableData] = useState(tableData.data?.tableData);
  const [isOutputPaneOpen, setIsOutputPaneOpen] = useState(true);

  const indicatorListForAbout = React.useMemo(() => {
    const raw = aboutIndicators ?? [];

    return raw.map((item) => ({
      title: item?.name,
      slug: item?.slug,
      description:
        item?.short_description || item?.long_description || tCommon('na'),
    }));
  }, [aboutIndicators, tCommon]);

  // Auto-open mobile output pane when a district or sub-district is selected in
  // map view (including on indicator or time-period changes). At state level,
  // respect the user's close preference.
  React.useEffect(() => {
    if (view !== 'map') return;
    const hasDistrictOrSubDistrict =
      Boolean(districtCode) || (withSubDistrictSupport && Boolean(revenueCode));
    if (hasDistrictOrSubDistrict) {
      setIsOutputPaneOpen(true);
    }
  }, [
    view,
    districtCode,
    revenueCode,
    withSubDistrictSupport,
    indicator,
    timePeriodSelected,
  ]);

  const RenderView = ({ selectedView }: { selectedView: string }) => {
    switch (selectedView) {
      case 'map':
        return (
          <MapViewPanel
            indicator={indicator}
            indicatorCategories={indicatorCategories}
            analyticsModule={analyticsModule}
            timePeriod={timePeriod}
            districtCode={districtCode}
            revenueCode={revenueCode}
            mapDataloading={mapData?.isFetching}
            revenueMapDataLoading={revenueMapData?.isFetching}
            indicatorsData={mapIndicatorsData?.data?.indicators}
            setRegion={setDistrictCode}
            setRevenueRegion={setRevenueCode}
            revenueMapData={revenueMapData?.data?.revCircleMapData}
            mapData={mapData?.data?.districtMapData}
            currentSelectedState={currentSelectedState}
            isOutputPaneOpen={isOutputPaneOpen}
          />
        );

      case 'chart':
        if (
          !isModuleViewEnabled(
            currentSelectedState.slug,
            analyticsModule,
            'chart'
          )
        ) {
          return null;
        }
        return (
          <div className="pt-[84px]">
            <ChartView
              currentSelectedState={currentSelectedState}
              RevCircleDropdownOptions={RevCircleDropdownOptions}
              DistrictDropDownOption={DistrictDropDownOption}
              timeLimits={timePeriods}
              withSubDistrictSupport={withSubDistrictSupport}
            />
          </div>
        );

      case 'table':
        return (
          <div className="pt-[84px]">
            <TableComponent
              data={
                filteredTableData?.length > 0
                  ? filteredTableData
                  : tableData.data?.tableData
              }
              isLoading={tableData.isLoading}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="flex h-full flex-col items-center justify-center gap-2 bg-[#FFFF]">
      <div
        className={cn(
          'relative h-[calc(100dvh_-_15vh)] w-full flex-grow flex-col gap-3 overflow-y-scroll',
          'sm:h-[calc(100dvh_-_120px)] md:h-[calc(100dvh_-_100px)]'
        )}
      >
        {/* <div className="flex w-full flex-grow flex-col overflow-y-scroll"> */}
        <div className="fixed top-[56px] z-9 flex h-[8vh] min-h-[56px] w-full items-center bg-[#FFFF] px-4 sm:h-[6%] sm:px-6 md:h-[5%] md:px-8">
          <FactorList currentState={currentSelectedState} />
          <FilterComp
            timePeriod={timePeriod}
            timePeriods={timePeriods}
            districtGeographiesData={districtGeographiesData}
            revenueGeographiesData={revenueGeographiesData}
            currentSelectedState={currentSelectedState}
            monthMulti={view === 'chart'}
            // getDistrictOptions={getDistrictOptions}
          />
        </div>

        {mapData.isLoading ? (
          <div className="p-4 text-center">{t('map.loading')}</div>
        ) : mapData.isError ||
          (withSubDistrictSupport && revenueMapData.isError) ? (
          <div className="text-red-500 p-4 text-center">{t('map.error')}</div>
        ) : (
          <RenderView selectedView={view} />
        )}
      </div>

      {/* <OutputWindowComponent /> */}
      {isMapView && !isOutputPaneOpen && (
        <div className="absolute right-6 top-[140px] z-[1001]">
          <Button
            kind="tertiary"
            onClick={() => setIsOutputPaneOpen(true)}
            className="border flex h-8 w-8 items-center justify-center border-borderSubdued bg-surfaceDefault shadow-basicSm"
            aria-label={t('detail.open')}
          >
            <Icon source={Icons.info} />
          </Button>
        </div>
      )}

      {isMapView &&
        isOutputPaneOpen &&
        (region !== null && region.length > 0 ? (
          <OutputWindowComponent
            currentState={currentSelectedState}
            time_period={timePeriodSelected}
            onClose={() => setIsOutputPaneOpen(false)}
          />
        ) : (
          <div className="fixed bottom-[8vh] left-0 right-0 z-[10050] max-h-[70vh] overflow-y-auto border-t-1 border-solid border-borderSubdued bg-surfaceDefault px-4 py-3">
            <div className="mb-2 flex justify-end">
              <Button
                onClick={() => setIsOutputPaneOpen(false)}
                kind="tertiary"
                aria-label={t('detail.close')}
              >
                <Icon source={Icons.cross} />
              </Button>
            </div>
            <AboutIndicator IndicatorData={indicatorListForAbout} />
          </div>
        ))}

      <div className="sticky bottom-0 flex h-[8vh] w-full flex-row justify-between gap-1 bg-baseIndigoSolid1 p-1 sm:p-2 md:p-3">
        {buttons.map((button, index) =>
          button.value === 'more' ? (
            // Render Menu for 'More' button
            <Menu
              key={index}
              trigger={
                <Button
                  size="slim"
                  className="basis-1/3 border-t-1 py-4"
                  kind="tertiary"
                >
                  <div className="flex flex-col items-center justify-center gap-1 bg-baseIndigoSolid1 ">
                    <Icon
                      source={button.icon}
                      size={24}
                      stroke={activeButton === button.value ? 3 : 2}
                    />
                    <Text
                      variant="headingMd"
                      fontWeight={
                        activeButton === button.value ? 'bold' : 'medium'
                      }
                      className="text-textSubdued"
                    >
                      {button.title}
                    </Text>
                  </div>
                </Button>
              }
              items={[
                {
                  content: t('actions.share.label'),
                  icon: Icons.share,
                  // onAction: toggleShareOptions,
                  onAction: () => copyURL(),
                },
                ...(features.reports
                  ? [
                      {
                        content: t('actions.download.label'),
                        icon: Icons.download,
                        disabled: !downloadReportEnabled,
                        onAction: () => {
                          const confirmation = window.confirm(
                            t('actions.download.confirm', {
                              name: stateName(
                                currentSelectedState.slug,
                                currentSelectedState.name
                              ),
                            })
                          );
                          if (confirmation) {
                            downloadStateReport(
                              routes.report(
                                currentSelectedState.code,
                                timePeriodSelected
                              ),
                              `${currentSelectedState.name}-Report`
                            );
                          }
                        },
                      },
                    ]
                  : []),
              ]}
            />
          ) : (
            // Render regular Button for other buttons
            <Button
              key={index}
              size="slim"
              className="basis-1/3 border-t-1 py-4"
              kind="tertiary"
              onClick={() => {
                setActiveButton(button.value);
                setView(button.value, { shallow: false });
              }}
            >
              <div className="flex flex-col items-center justify-center gap-1 bg-baseIndigoSolid1 ">
                <Icon
                  source={button.icon}
                  size={24}
                  stroke={activeButton === button.value ? 3 : 2}
                />
                <Text
                  variant="headingMd"
                  fontWeight={activeButton === button.value ? 'bold' : 'medium'}
                  className="text-textSubdued"
                >
                  {button.title}
                </Text>
              </div>
            </Button>
          )
        )}
      </div>
    </section>
  );
}
