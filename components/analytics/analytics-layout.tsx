'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useAnalyticsModule } from '@/hooks/use-analytics-module';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { parseAsString, useQueryState } from 'next-usequerystate';
import { Icon, Spinner, Tab, TabList, TabPanel, Tabs, Text } from 'opub-ui';

import {
  ANALYTICS_DISTRICT_DATA,
  ANALYTICS_DISTRICT_MAP_DATA,
  ANALYTICS_GEOGRAPHY_DATA,
  ANALYTICS_INDICATORS,
  ANALYTICS_INDICATORS_BY_CATEGORY,
  ANALYTICS_REVENUE_MAP_DATA,
  ANALYTICS_REVENUE_TABLE_DATA,
  ANALYTICS_TABLE_DATA,
  ANALYTICS_TIME_PERIODS,
  PLATFORM_STATES_LIST,
  type Indicator,
  type IndicatorCategory,
  type State,
} from '@/config/graphql/analaytics-queries';
import { getFactorRole } from '@/lib/analytics/factor-role';
import { getRootIndicatorSlug } from '@/lib/analytics/root-indicator';
import { getFactorNameBySlug, getLatestDate } from '@/lib/analytics/utils';
import {
  hasSubDistrictSupport,
  isModuleViewEnabled,
} from '@/lib/analytics/module-config';
import { GraphQL } from '@/lib/api';
import { ANALYTICS_VIEWS } from '@/lib/routes';
import { type JsonScalar } from '@/lib/types';
import { cn } from '@/lib/utils';
import Icons from '@/components/icons';
import { MediaRendering } from '@/components/media-rendering';
import { AnalyticsMobileLayout } from './analytics-mobile-layout';
import { ChartView } from './chart-view';
import { DefaultWindow } from './default-output-window';
import FilterDropdownOptions from './filter-dropdown-options';
import { MapViewPanel } from './map-view-panel';
import { OutputWindow } from './output-window';
import styles from './styles.module.scss';
import { TableComponent } from './table-component';

interface Option {
  disabled?: boolean;
  value: string;
  label: string;
  districtCode?: string;
}

export function AnalyticsMainLayout() {
  const t = useTranslations('analytics');
  const tCommon = useTranslations('common');
  const searchParams = useSearchParams();
  const routerParams = useParams();
  const analyticsModule = useAnalyticsModule();
  const stateSlug =
    typeof routerParams.state === 'string' ? routerParams.state : undefined;
  const rootIndicatorSlug = getRootIndicatorSlug(stateSlug, analyticsModule);
  const indicator = searchParams.get('indicator') || rootIndicatorSlug;

  const [districtCode, setDistrictCode] = useQueryState(
    'district-code',
    parseAsString.withDefault('')
  );
  const [, setIndicatorParam] = useQueryState('indicator');
  const [revenueCode, setRevenueCode] = useQueryState('revenue-code');
  const [view, setView] = useQueryState(
    'view',
    parseAsString.withDefault('map')
  );
  const [timePeriodParam, setTimePeriodParam] = useQueryState('time-period');
  const isMapView = !view || view === 'map';

  const [isOutputPaneOpen, setIsOutputPaneOpen] = useState(true);

  const statesListData = useQuery({
    queryKey: [`states_list_${analyticsModule}`],
    queryFn: () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        PLATFORM_STATES_LIST,
        { module: analyticsModule }
      ),
  });

  const currentSelectedState = useMemo(
    () =>
      statesListData?.data?.getStates?.find(
        (item: State) => item.slug === routerParams.state
      ),
    [statesListData?.data?.getStates, routerParams.state]
  );
  const withSubDistrictSupport = hasSubDistrictSupport(
    currentSelectedState?.slug,
    analyticsModule
  );

  const dataTimePeriods = useQuery({
    queryKey: [`timePeriods`, analyticsModule, currentSelectedState?.code],
    queryFn: () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        ANALYTICS_TIME_PERIODS,
        {
          module: analyticsModule,
          stateCode: currentSelectedState?.code ?? undefined,
        }
      ),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const moduleTimePeriods: string[] =
    dataTimePeriods.data?.getDataTimePeriods?.map((p) => p.value) ?? [];

  const stateLatestTimePeriod =
    currentSelectedState?.latest_time_period || null;
  const moduleLatestTimePeriod = moduleTimePeriods[0] ?? null;
  const envDefaultTimePeriod = process.env.NEXT_PUBLIC_TIME_PERIOD || null;
  const stateTimePeriods: string[] = currentSelectedState?.time_periods || [];
  const timeLimitsForPicker: string[] = Array.from(
    new Set(
      [
        ...moduleTimePeriods,
        ...(stateTimePeriods || []),
        moduleLatestTimePeriod,
        stateLatestTimePeriod,
      ].filter(Boolean)
    )
  ) as string[];

  const rawTimePeriodParam = searchParams.get('time-period');
  const resolvedUrlTimePeriod = rawTimePeriodParam
    ? getLatestDate(rawTimePeriodParam?.split(',') || [])
    : null;
  const normalizedUrlTimePeriod = resolvedUrlTimePeriod;
  const hasExplicitTimePeriodParam =
    timePeriodParam !== null && timePeriodParam !== '';

  const indicatorsByCategoryData = useQuery({
    queryKey: [
      `indicatorsByCategory_${currentSelectedState?.code}_${analyticsModule}`,
    ],
    queryFn: () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        ANALYTICS_INDICATORS_BY_CATEGORY,
        {
          parentId: null,
          stateCode: currentSelectedState?.code,
          module: analyticsModule,
        }
      ),
    enabled: Boolean(currentSelectedState?.code),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const monthlyGovtResponseIndicators = React.useMemo(() => {
    const categories =
      indicatorsByCategoryData?.data?.indicatorsByCategory || [];
    const riskScoreRoot = categories.find(
      (item: IndicatorCategory) => item?.slug === rootIndicatorSlug
    );
    const govtResponseNode = riskScoreRoot?.children?.find(
      (item: IndicatorCategory) =>
        getFactorRole(item?.slug ?? '') === 'government-response'
    );
    const children = govtResponseNode?.children || [];
    const monthly = children
      .map((child: IndicatorCategory) => String(child?.slug || ''))
      .filter((slug: string) => slug && !slug.includes('fy-cumsum'));
    return new Set(monthly);
  }, [indicatorsByCategoryData?.data?.indicatorsByCategory, rootIndicatorSlug]);

  const cumsumGovtResponseIndicators = React.useMemo(() => {
    const categories =
      indicatorsByCategoryData?.data?.indicatorsByCategory || [];
    const riskScoreRoot = categories.find(
      (item: IndicatorCategory) => item?.slug === rootIndicatorSlug
    );
    const govtResponseNode = riskScoreRoot?.children?.find(
      (item: IndicatorCategory) =>
        getFactorRole(item?.slug ?? '') === 'government-response'
    );
    const children = govtResponseNode?.children || [];
    const cumulative = children
      .map((child: IndicatorCategory) => String(child?.slug || ''))
      .filter((slug: string) => slug && slug.includes('fy-cumsum'));
    return new Set(cumulative);
  }, [indicatorsByCategoryData?.data?.indicatorsByCategory, rootIndicatorSlug]);

  const isChartViewEnabled = isModuleViewEnabled(
    stateSlug,
    analyticsModule,
    'chart'
  );

  useEffect(() => {
    if (!view || view === 'map') return;
    if (
      isModuleViewEnabled(stateSlug, analyticsModule, view as 'chart' | 'table')
    ) {
      return;
    }
    setView('map', { shallow: true });
  }, [view, stateSlug, analyticsModule, setView]);

  // Keep govt-response subindicator compatible with selected view:
  // - map/table view => cumulative (*-fy-cumsum)
  // - chart view => monthly (without -fy-cumsum)
  useEffect(() => {
    if (view !== null && view !== 'map' && view !== 'chart' && view !== 'table')
      return;
    if (!indicator) return;

    const effectiveView = view || 'map';
    const isCumsumIndicator = indicator.endsWith('-fy-cumsum');
    const cumsumCandidate = `${indicator}-fy-cumsum`;
    const canConvertToCumsum =
      monthlyGovtResponseIndicators.has(indicator) ||
      cumsumGovtResponseIndicators.has(cumsumCandidate);

    let nextIndicator = indicator;
    if (effectiveView === 'map' || effectiveView === 'table') {
      if (!isCumsumIndicator && canConvertToCumsum) {
        nextIndicator = cumsumCandidate;
      }
    } else if (effectiveView === 'chart') {
      // Always de-normalize cumsum in chart view.
      if (isCumsumIndicator) {
        nextIndicator = indicator.replace(/-fy-cumsum$/, '');
      }
    }

    if (nextIndicator !== indicator) {
      setIndicatorParam(nextIndicator, { shallow: false });
    }
  }, [
    view,
    indicator,
    setIndicatorParam,
    monthlyGovtResponseIndicators,
    cumsumGovtResponseIndicators,
  ]);

  const defaultTimePeriod =
    moduleLatestTimePeriod ?? stateLatestTimePeriod ?? envDefaultTimePeriod;

  const timePeriodSelected =
    normalizedUrlTimePeriod ||
    (!hasExplicitTimePeriodParam ? defaultTimePeriod : null);

  const mapData = useQuery({
    queryKey: [
      `mapQuery_district_${currentSelectedState?.code}_${indicator}_${timePeriodSelected}`,
    ],
    queryFn: () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        ANALYTICS_DISTRICT_MAP_DATA,
        {
          indcFilter: { slug: indicator, module: analyticsModule },
          dataFilter: { dataPeriod: timePeriodSelected },
          geoFilter: {
            code: [currentSelectedState!.code],
          },
        }
      ),

    enabled: Boolean(
      isMapView && currentSelectedState?.code && timePeriodSelected
    ),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const revenueMapData = useQuery({
    queryKey: [
      `mapQuery_revenue-circle_${currentSelectedState?.code}_${indicator}_${timePeriodSelected}`,
    ],
    queryFn: () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        ANALYTICS_REVENUE_MAP_DATA,
        {
          indcFilter: { slug: indicator, module: analyticsModule },
          dataFilter: { dataPeriod: timePeriodSelected },
          geoFilter: {
            code: [currentSelectedState!.code],
          },
        }
      ),

    enabled: Boolean(
      withSubDistrictSupport &&
      isMapView &&
      currentSelectedState?.code &&
      timePeriodSelected
    ),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const districtGeographiesData = useQuery({
    queryKey: [`geographies_data_district_${currentSelectedState?.code}`],
    queryFn: () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        ANALYTICS_GEOGRAPHY_DATA,
        {
          geoFilter: {
            type: 'district',
            code: [currentSelectedState!.code],
          },
        }
      ),
    enabled: Boolean(currentSelectedState?.code),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const revenueGeographiesData = useQuery({
    queryKey: [`geographies_data_revenue_${currentSelectedState?.code}`],
    queryFn: () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        ANALYTICS_GEOGRAPHY_DATA,
        {
          geoFilter: {
            type: currentSelectedState?.child_type,
            code: [currentSelectedState!.code],
          },
        }
      ),
    enabled: Boolean(
      withSubDistrictSupport &&
      currentSelectedState?.code &&
      currentSelectedState?.child_type
    ),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // Initialize URL time-period only when it is truly missing (no query param),
  // not when the user has explicitly cleared it (empty string).
  useEffect(() => {
    if (timePeriodParam !== null) return;
    if (statesListData.isFetching || statesListData.isError) return;

    const initialTimePeriod = defaultTimePeriod;
    if (initialTimePeriod) {
      setTimePeriodParam(initialTimePeriod, {
        shallow: true,
      });
    }
  }, [
    statesListData.isFetching,
    statesListData.isError,
    defaultTimePeriod,
    timePeriodParam,
    setTimePeriodParam,
  ]);

  // For map view specifically: if the URL has an explicit empty time-period,
  // normalize it to the latest/default time period so that the data and URL match.
  useEffect(() => {
    if (!isMapView) return;
    if (timePeriodParam !== '') return;
    if (statesListData.isFetching || statesListData.isError) return;

    const initialTimePeriod = defaultTimePeriod;
    if (initialTimePeriod) {
      setTimePeriodParam(initialTimePeriod, {
        shallow: true,
      });
    }
  }, [
    isMapView,
    timePeriodParam,
    statesListData.isFetching,
    statesListData.isError,
    defaultTimePeriod,
    setTimePeriodParam,
  ]);
  // Data used for map legends and factor labels (must match currently selected `indicator`)
  const mapIndicatorsData = useQuery({
    queryKey: [
      `indicators_${indicator}_${currentSelectedState?.code}_${analyticsModule}`,
    ],
    queryFn: () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        ANALYTICS_INDICATORS,
        {
          indcFilter: { slug: indicator, module: analyticsModule },
          stateCode: currentSelectedState?.code,
        }
      ),
    enabled: Boolean(currentSelectedState?.code),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // Delay setting the map's indicator until the relevant queries are fresh.
  // Keep `renderedIndicatorsData` in lockstep so the legend doesn't briefly
  // look the prior slug up in the new indicator's metadata.
  const [renderedIndicator, setRenderedIndicator] = useState(indicator);
  const [renderedIndicatorsData, setRenderedIndicatorsData] = useState(
    mapIndicatorsData?.data?.indicators
  );
  const mapDataReady =
    withSubDistrictSupport && districtCode
      ? !revenueMapData.isPlaceholderData && Boolean(revenueMapData.data)
      : !mapData.isPlaceholderData && Boolean(mapData.data);
  if (
    mapDataReady &&
    !mapIndicatorsData.isPlaceholderData &&
    mapIndicatorsData.data &&
    renderedIndicator !== indicator
  ) {
    setRenderedIndicator(indicator);
    setRenderedIndicatorsData(mapIndicatorsData.data.indicators);
  }
  // Bootstrap when the first response lands (initial mount).
  if (!renderedIndicatorsData && mapIndicatorsData?.data?.indicators) {
    setRenderedIndicatorsData(mapIndicatorsData.data.indicators);
  }

  // Data used for the state-level "About indicator" pane (always root list)
  const aboutIndicatorsData = useQuery({
    queryKey: [
      `indicators_about_${analyticsModule}_${rootIndicatorSlug}_${currentSelectedState?.code}`,
    ],
    queryFn: () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        ANALYTICS_INDICATORS,
        {
          indcFilter: {
            slug: rootIndicatorSlug,
            module: analyticsModule,
          },
          stateCode: currentSelectedState?.code,
        }
      ),
    enabled: Boolean(
      isMapView && indicator !== rootIndicatorSlug && currentSelectedState?.code
    ),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const uniqueAboutIndicators = React.useMemo(() => {
    const raw =
      indicator === rootIndicatorSlug
        ? mapIndicatorsData?.data?.indicators || []
        : aboutIndicatorsData?.data?.indicators || [];
    const map = new Map<string, Indicator>();
    for (const item of raw) {
      if (!item?.slug) continue;
      if (!map.has(item.slug)) map.set(item.slug, item);
    }
    return Array.from(map.values());
  }, [
    indicator,
    rootIndicatorSlug,
    mapIndicatorsData?.data?.indicators,
    aboutIndicatorsData?.data?.indicators,
  ]);

  const tableData = useQuery({
    queryKey: [
      `table_data_${currentSelectedState?.code}_${indicator}_${districtCode}_${timePeriodSelected}_${analyticsModule}`,
    ],
    queryFn: () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        ANALYTICS_TABLE_DATA,
        {
          indcFilter: { slug: indicator, module: analyticsModule },
          dataFilter: { dataPeriod: timePeriodSelected },
          geoFilter: {
            code: [
              districtCode === '' ||
              districtCode === null ||
              typeof districtCode === 'undefined'
                ? currentSelectedState!.code
                : districtCode,
            ],
          },
        }
      ),
    enabled: Boolean(
      view === 'table' && currentSelectedState?.code && timePeriodSelected
    ),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const [filteredTableData, setFilteredTableData] = useState(
    tableData.data?.tableData
  );

  const RevCircleDropdownOptions: Option[] = [];
  const DistrictDropDownOption: Option[] = [];

  if (districtGeographiesData.data && !districtGeographiesData.isFetching) {
    districtGeographiesData.data?.getDistrictRevCircle?.forEach(
      (geography: { district: string; code: string }) => {
        DistrictDropDownOption.push({
          label: geography.district,
          value: geography.code ? geography.code : 'NA',
        });
      }
    );
    DistrictDropDownOption.sort((a, b) => a.label.localeCompare(b.label));
  }

  if (revenueGeographiesData.data && !revenueGeographiesData.isFetching) {
    const rawData = revenueGeographiesData?.data?.getDistrictRevCircle;

    if (rawData) {
      for (const revenueCircle in rawData) {
        const revenueCircles = rawData[revenueCircle];
        revenueCircles.forEach(
          (
            circle: JsonScalar
            // {
            // 'revenue-circle': string;
            // tehsil: string;
            // code: string;
            // district_code: string;
            // }
          ) => {
            RevCircleDropdownOptions.push({
              label:
                circle[currentSelectedState?.child_type ?? ''] ||
                circle['revenue-circle'],
              value: circle.code,
              districtCode: circle.district_code,
            });
          }
        );
      }

      RevCircleDropdownOptions.sort((a, b) => a.label.localeCompare(b.label));
    }
  }

  React.useEffect(() => {
    if (revenueCode !== '' && revenueCode !== null) {
      const filteredTableData = tableData.data?.tableData.filter(
        (item: { [x: string]: string }) =>
          item['revenue-circle-code'] === revenueCode
      );
      setFilteredTableData(filteredTableData);
    } else {
      // Reset to show all district data when revenue circle is deselected
      setFilteredTableData(tableData.data?.tableData);
    }
  }, [revenueCode, tableData.data?.tableData]);

  const region = searchParams.get('district-code') || '';
  const hasAnyRegion =
    (region && region.length > 0) || (withSubDistrictSupport && !!revenueCode);

  useEffect(() => {
    if (!withSubDistrictSupport && revenueCode) {
      setRevenueCode('');
    }
  }, [withSubDistrictSupport, revenueCode, setRevenueCode]);

  // Auto-open the output pane when a district or sub-district is selected in map
  // view (including on indicator or time-period changes). At state level, respect
  // the user's close preference.
  useEffect(() => {
    if (!isMapView) return;
    const hasDistrictOrSubDistrict =
      Boolean(districtCode) || (withSubDistrictSupport && Boolean(revenueCode));
    if (hasDistrictOrSubDistrict) {
      setIsOutputPaneOpen(true);
    }
  }, [
    isMapView,
    districtCode,
    revenueCode,
    withSubDistrictSupport,
    indicator,
    timePeriodSelected,
  ]);

  const indicatorName = getFactorNameBySlug(
    renderedIndicatorsData ?? mapIndicatorsData?.data?.indicators,
    indicator
  );

  const viewTabs = ANALYTICS_VIEWS.filter((tabValue) =>
    isModuleViewEnabled(stateSlug, analyticsModule, tabValue)
  ).map((tabValue) => {
    const icons = {
      map: Icons.IconMap,
      chart: Icons.IconChartBar,
      table: Icons.IconTableAlias,
    } as const;
    const labels = {
      map: t('views.long.map'),
      chart: t('views.long.chart'),
      table: t('views.long.table'),
    } as const;

    return {
      value: tabValue,
      icon: icons[tabValue],
      label: labels[tabValue],
    };
  });

  if (!currentSelectedState) {
    return (
      <div className="flex h-[calc(100dvh_-_140px)] flex-col place-content-center items-center">
        <Spinner color="highlight" />
        <Text>{t('loading')}</Text>
      </div>
    );
  }

  return (
    <>
      <MediaRendering minWidth={null} maxWidth="1023">
        <AnalyticsMobileLayout
          timePeriod={timePeriodSelected || ''}
          indicator={indicator}
          indicatorCategories={
            indicatorsByCategoryData?.data?.indicatorsByCategory
          }
          mapData={mapData}
          revenueMapData={revenueMapData}
          districtGeographiesData={districtGeographiesData}
          revenueGeographiesData={revenueGeographiesData}
          timePeriods={timeLimitsForPicker}
          mapIndicatorsData={mapIndicatorsData}
          aboutIndicators={uniqueAboutIndicators}
          tableData={tableData}
          currentSelectedState={currentSelectedState}
          statesList={statesListData.data?.getStates || []}
        />
      </MediaRendering>
      <MediaRendering minWidth="1024" maxWidth={null}>
        <React.Fragment>
          <Tabs
            value={view || 'map'}
            onValueChange={(value: string) =>
              setView(value, { shallow: false })
            }
          >
            <div className={styles.analyticsHeader}>
              <Text as="h2" className={styles.analyticsIndicatorTitle}>
                {indicatorName}
              </Text>
              <TabList className={styles.analyticsViewTabs}>
                <div className={styles.analyticsViewTabsGroup}>
                  {viewTabs.map((tab) => {
                    const isActive = (view || 'map') === tab.value;
                    return (
                      <Tab
                        key={tab.value}
                        value={tab.value}
                        activeBorder={false}
                        className={cn(
                          styles.analyticsViewTab,
                          isActive && styles.analyticsViewTabActive
                        )}
                      >
                        <span className={styles.analyticsViewTabContent}>
                          <Icon source={tab.icon} size={20} />
                          <span className={styles.analyticsViewTabLabel}>
                            {tab.label}
                          </span>
                        </span>
                      </Tab>
                    );
                  })}
                </div>
              </TabList>
            </div>
            <TabPanel value="map">
              <div className=" mt-2 h-[calc(100dvh_-_140px)]">
                <div>
                  <FilterDropdownOptions
                    currentSelectedState={currentSelectedState}
                    RevCircleDropdownOptions={RevCircleDropdownOptions}
                    DistrictDropDownOption={DistrictDropDownOption}
                    timeLimits={timeLimitsForPicker}
                    withSubDistrictSupport={withSubDistrictSupport}
                  />
                </div>

                {!timePeriodSelected &&
                !hasExplicitTimePeriodParam &&
                statesListData?.isFetching ? (
                  <div className="flex h-full flex-col place-content-center items-center">
                    <Spinner color="highlight" />
                    <Text>{tCommon('loading')}</Text>
                  </div>
                ) : !timePeriodSelected && hasExplicitTimePeriodParam ? (
                  <div className="flex h-[calc(100dvh_-_400px)] flex-col place-content-center items-center">
                    <Text>Please select a time period</Text>
                  </div>
                ) : (
                  <>
                    {(statesListData?.isFetching ||
                      !timePeriodSelected ||
                      !mapData?.data ||
                      (withSubDistrictSupport && !revenueMapData?.data)) && (
                      <div className="flex h-full flex-col place-content-center items-center">
                        <Spinner color="highlight" />
                        <Text>{tCommon('loading')}</Text>
                      </div>
                    )}

                    {mapData?.data &&
                      (!withSubDistrictSupport || revenueMapData?.data) && (
                        <div className="relative">
                          {(mapIndicatorsData?.isFetching ||
                            (withSubDistrictSupport && districtCode
                              ? revenueMapData?.isFetching
                              : mapData?.isFetching)) && (
                            <div className="pointer-events-none absolute inset-x-0 top-4 z-[1000] flex justify-center">
                              <div className="rounded flex items-center gap-2 bg-surfaceDefault px-3 py-1 shadow-basicMd">
                                <Spinner color="highlight" />
                                <Text variant="bodySm">
                                  {tCommon('loading')}
                                </Text>
                              </div>
                            </div>
                          )}
                          <MapViewPanel
                            indicator={renderedIndicator}
                            indicatorCategories={
                              indicatorsByCategoryData?.data
                                ?.indicatorsByCategory
                            }
                            analyticsModule={analyticsModule}
                            timePeriod={timePeriodSelected || ''}
                            districtCode={districtCode}
                            revenueCode={revenueCode}
                            mapDataloading={mapData?.isLoading}
                            revenueMapDataLoading={revenueMapData?.isLoading}
                            indicatorsData={renderedIndicatorsData}
                            setRegion={setDistrictCode}
                            setRevenueRegion={setRevenueCode}
                            revenueMapData={
                              revenueMapData?.data?.revCircleMapData
                            }
                            mapData={mapData?.data?.districtMapData}
                            currentSelectedState={currentSelectedState}
                            isOutputPaneOpen={isOutputPaneOpen}
                            onToggleOutputPane={() =>
                              setIsOutputPaneOpen((prev) => !prev)
                            }
                          />
                        </div>
                      )}

                    {isMapView &&
                      isOutputPaneOpen &&
                      (hasAnyRegion ? (
                        <OutputWindowComponent
                          currentState={currentSelectedState}
                          time_period={timePeriodSelected}
                          onClose={() => setIsOutputPaneOpen(false)}
                        />
                      ) : (
                        <DefaultWindow
                          chartData={[]}
                          indicatorDescriptions={uniqueAboutIndicators}
                          indicator={indicator}
                          boundary="district"
                          onClose={() => setIsOutputPaneOpen(false)}
                        />
                      ))}
                  </>
                )}
              </div>
            </TabPanel>
            <TabPanel value="table">
              <div className=" mt-2 h-[calc(100dvh_-_140px)]">
                <div>
                  <FilterDropdownOptions
                    currentSelectedState={currentSelectedState}
                    RevCircleDropdownOptions={RevCircleDropdownOptions}
                    DistrictDropDownOption={DistrictDropDownOption}
                    timeLimits={timeLimitsForPicker}
                    withSubDistrictSupport={withSubDistrictSupport}
                  />
                </div>
                {!timePeriodSelected ? (
                  <div className="flex h-[calc(100dvh_-_400px)] flex-col place-content-center items-center">
                    <Text>Please select a time period</Text>
                  </div>
                ) : (
                  <TableComponent
                    data={
                      filteredTableData?.length > 0
                        ? filteredTableData
                        : tableData.data?.tableData
                    }
                    isLoading={tableData.isLoading}
                  />
                )}
              </div>
            </TabPanel>
            {isChartViewEnabled && (
              <TabPanel value="chart">
                {/* <div className=" mt-2 h-[calc(100dvh_-_140px)]"> */}
                <div className="mt-2 h-full overflow-hidden">
                  <ChartView
                    currentSelectedState={currentSelectedState}
                    RevCircleDropdownOptions={RevCircleDropdownOptions}
                    DistrictDropDownOption={DistrictDropDownOption}
                    timeLimits={timeLimitsForPicker}
                    withSubDistrictSupport={withSubDistrictSupport}
                  />
                </div>
              </TabPanel>
            )}
          </Tabs>
        </React.Fragment>
      </MediaRendering>
    </>
  );
}

export function OutputWindowComponent({
  currentState,
  time_period,
  onClose,
}: {
  currentState: State;
  time_period: string | null | undefined;
  onClose: () => void;
}) {
  const searchParams = useSearchParams();
  const indicator = searchParams.get('indicator');
  const analyticsModule = useAnalyticsModule();
  const withSubDistrictSupport = hasSubDistrictSupport(
    currentState?.slug,
    analyticsModule
  );
  const revenueCodeParam = withSubDistrictSupport
    ? searchParams.get('revenue-code')
    : null;
  const region = revenueCodeParam || searchParams.get('district-code');
  const boundary = revenueCodeParam ? 'revenue-circle' : 'district';

  const sidePaneQuery: JsonScalar = !searchParams.get('revenue-code')
    ? ANALYTICS_DISTRICT_DATA
    : ANALYTICS_REVENUE_TABLE_DATA;

  const sidePaneData = useQuery<JsonScalar>({
    queryKey: [
      `sidePaneData_${indicator}_${region}_${boundary}_${time_period}_${analyticsModule}`,
    ],
    queryFn: () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        sidePaneQuery,
        {
          indcFilter: { slug: indicator, module: analyticsModule },
          dataFilter: { dataPeriod: time_period },
          geoFilter: {
            code:
              region === null || typeof region === 'undefined' || region === ''
                ? currentState.code
                : region,
          },
        }
      ),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const indicatorDescriptions = useQuery({
    queryKey: [
      `indicators_${indicator}_${currentState?.code}_${analyticsModule}`,
    ],
    queryFn: () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        ANALYTICS_INDICATORS,
        {
          indcFilter: { slug: indicator, module: analyticsModule },
          stateCode: currentState?.code,
        }
      ),
    enabled: Boolean(currentState?.code),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // Delay setting the panel's indicator until both queries are fresh.
  // Keep `renderedIndicatorDescriptions` in lockstep so the panel doesn't
  // briefly look the prior slug up in the new indicator's descriptions.
  const [renderedIndicator, setRenderedIndicator] = useState(indicator);
  const [renderedIndicatorDescriptions, setRenderedIndicatorDescriptions] =
    useState(indicatorDescriptions?.data?.indicators);
  if (
    !sidePaneData.isPlaceholderData &&
    !indicatorDescriptions.isPlaceholderData &&
    sidePaneData.data &&
    indicatorDescriptions.data &&
    renderedIndicator !== indicator
  ) {
    setRenderedIndicator(indicator);
    setRenderedIndicatorDescriptions(indicatorDescriptions.data.indicators);
  }
  if (
    !renderedIndicatorDescriptions &&
    indicatorDescriptions?.data?.indicators
  ) {
    setRenderedIndicatorDescriptions(indicatorDescriptions.data.indicators);
  }

  return (
    <>
      {sidePaneData.isLoading && !sidePaneData.data ? (
        <aside
          className={cn(
            'p-4',
            'bg-surfaceDefault shadow-basicMd',
            'shadow-inset z-1 hidden min-w-[420px] max-w-[450px] shrink-0 md:block',
            'overflow-y-auto border-r-1 border-solid border-borderSubdued',
            styles.Overlay,
            styles.OverlayActive
          )}
        >
          <div className="flex h-full flex-col items-center justify-center gap-2">
            <Spinner color="highlight" />
          </div>
        </aside>
      ) : null}
      {sidePaneData?.data ? (
        <OutputWindow
          // During a district-to-subdistrict transition, the prior boundary's
          // data is still in scope for one render; default to [] so the
          // panel renders empty rather than crashing on the absent key.
          data={
            sidePaneData?.data?.[
              !searchParams?.get('revenue-code')
                ? 'districtViewData'
                : 'revCircleViewData'
            ] ?? []
          }
          indicatorDescriptions={renderedIndicatorDescriptions}
          indicator={renderedIndicator ?? ''}
          boundary={boundary}
          currentState={currentState}
          onClose={onClose}
        />
      ) : null}
    </>
  );
}
