'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { parseAsString, useQueryState } from 'next-usequerystate';
import { useTranslations } from 'next-intl';
import { Spinner, Tab, TabList, TabPanel, Tabs, Text } from 'opub-ui';

import {
  ANALYTICS_DISTRICT_DATA,
  ANALYTICS_DISTRICT_MAP_DATA,
  ANALYTICS_GEOGRAPHY_DATA,
  ANALYTICS_INDICATORS,
  ANALYTICS_INDICATORS_BY_CATEGORY,
  ANALYTICS_REVENUE_MAP_DATA,
  ANALYTICS_REVENUE_TABLE_DATA,
  ANALYTICS_TABLE_DATA,
  type IndicatorCategory,
  PLATFORM_STATES_LIST,
  type State,
} from '@/config/graphql/analaytics-queries';
import { features } from '@/config/site';
import { GraphQL } from '@/lib/api';
import { MediaRendering } from '@/components/media-rendering';
import { getLatestDate } from '../utils/utils';
import { AnalyticsMobileLayout } from './analytics-mobile-layout';
import { ChartView } from './chart-view';
import { DefaultWindow } from './default-output-window';
import FilterDropdownOptions from './filter-dropdown-options';
import { MapComponent } from './map-component';
import { OutputWindow } from './output-window';
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
  // Default to overall flood risk when URL doesn't specify an indicator.
  const indicator = searchParams.get('indicator') || 'risk-score';

  const [districtCode, setDistrictCode] = useQueryState(
    'district-code',
    parseAsString.withDefault('')
  );
  const [, setIndicatorParam] = useQueryState('indicator');
  const [revenueCode, setRevenueCode] = useQueryState('revenue-code');
  const [view, setView] = useQueryState('view');
  const [timePeriodParam, setTimePeriodParam] = useQueryState('time-period');
  const routerParams = useParams();
  const isMapView = !view || view === 'map';

  const [isOutputPaneOpen, setIsOutputPaneOpen] = useState(true);

  const statesListData = useQuery({
    queryKey: [`states_list`],
    queryFn: () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        PLATFORM_STATES_LIST
      ),
  });

  const currentSelectedState = useMemo(
    () =>
      statesListData?.data?.getStates?.find(
        (item: State) => item.slug === routerParams.state
      ),
    [statesListData?.data?.getStates, routerParams.state]
  );

  const stateLatestTimePeriod =
    currentSelectedState?.latest_time_period || null;
  const envDefaultTimePeriod = process.env.NEXT_PUBLIC_TIME_PERIOD || null;
  const stateTimePeriods: string[] = currentSelectedState?.time_periods || [];
  const timeLimitsForPicker: string[] = Array.from(
    new Set(
      [...(stateTimePeriods || []), stateLatestTimePeriod].filter(Boolean)
    )
  ) as string[];
  const rawTimePeriodParam = searchParams.get('time-period');
  const resolvedUrlTimePeriod = rawTimePeriodParam
    ? getLatestDate(rawTimePeriodParam?.split(',') || [])
    : null;
  const normalizedUrlTimePeriod = resolvedUrlTimePeriod
    ? `${resolvedUrlTimePeriod.split('-')[0]}_${resolvedUrlTimePeriod.split('-')[1]}`
    : null;
  const hasExplicitTimePeriodParam =
    timePeriodParam !== null && timePeriodParam !== '';

  const indicatorsByCategoryData = useQuery({
    queryKey: [`indicatorsByCategory_${currentSelectedState?.code}`],
    queryFn: () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        ANALYTICS_INDICATORS_BY_CATEGORY,
        {
          stateCode: currentSelectedState?.code,
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
      (item: IndicatorCategory) => item?.slug === 'risk-score'
    );
    const govtResponseNode = riskScoreRoot?.children?.find(
      (item: IndicatorCategory) => item?.slug === 'government-response'
    );
    const children = govtResponseNode?.children || [];
    const monthly = children
      .map((child: IndicatorCategory) => String(child?.slug || ''))
      .filter((slug: string) => slug && !slug.includes('fy-cumsum'));
    return new Set(monthly);
  }, [indicatorsByCategoryData?.data?.indicatorsByCategory]);

  const cumsumGovtResponseIndicators = React.useMemo(() => {
    const categories =
      indicatorsByCategoryData?.data?.indicatorsByCategory || [];
    const riskScoreRoot = categories.find(
      (item: IndicatorCategory) => item?.slug === 'risk-score'
    );
    const govtResponseNode = riskScoreRoot?.children?.find(
      (item: IndicatorCategory) => item?.slug === 'government-response'
    );
    const children = govtResponseNode?.children || [];
    const cumulative = children
      .map((child: IndicatorCategory) => String(child?.slug || ''))
      .filter((slug: string) => slug && slug.includes('fy-cumsum'));
    return new Set(cumulative);
  }, [indicatorsByCategoryData?.data?.indicatorsByCategory]);

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

  const timePeriodSelected =
    normalizedUrlTimePeriod ||
    (!hasExplicitTimePeriodParam
      ? (stateLatestTimePeriod ?? envDefaultTimePeriod)
      : null);

  const mapData = useQuery({
    queryKey: [
      `mapQuery_district_${currentSelectedState?.code}_${indicator}_${timePeriodSelected}`,
    ],
    queryFn: () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        ANALYTICS_DISTRICT_MAP_DATA,
        {
          indcFilter: { slug: indicator },
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
          indcFilter: { slug: indicator },
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
      currentSelectedState?.code && currentSelectedState?.child_type
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

    const initialTimePeriod = stateLatestTimePeriod || envDefaultTimePeriod;
    if (initialTimePeriod) {
      setTimePeriodParam(initialTimePeriod, {
        shallow: true,
      });
    }
  }, [
    statesListData.isFetching,
    statesListData.isError,
    stateLatestTimePeriod,
    envDefaultTimePeriod,
    timePeriodParam,
    setTimePeriodParam,
  ]);

  // For map view specifically: if the URL has an explicit empty time-period,
  // normalize it to the latest/default time period so that the data and URL match.
  useEffect(() => {
    if (!isMapView) return;
    if (timePeriodParam !== '') return;
    if (statesListData.isFetching || statesListData.isError) return;

    const initialTimePeriod = stateLatestTimePeriod || envDefaultTimePeriod;
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
    stateLatestTimePeriod,
    envDefaultTimePeriod,
    setTimePeriodParam,
  ]);
  // Data used for map legends and factor labels (must match currently selected `indicator`)
  const mapIndicatorsData = useQuery({
    queryKey: [`indicators_${indicator}_${currentSelectedState?.code}`],
    queryFn: () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        ANALYTICS_INDICATORS,
        {
          indcFilter: { slug: indicator },
          stateCode: currentSelectedState?.code,
        }
      ),
    enabled: Boolean(isMapView && currentSelectedState?.code),
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
  const mapDataReady = districtCode
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
    queryKey: [`indicators_risk-score_${currentSelectedState?.code}`],
    queryFn: () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        ANALYTICS_INDICATORS,
        {
          indcFilter: { slug: 'risk-score' },
          stateCode: currentSelectedState?.code,
        }
      ),
    // Avoid a duplicate request when the selected indicator is already risk-score.
    enabled: Boolean(
      isMapView && indicator !== 'risk-score' && currentSelectedState?.code
    ),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const uniqueAboutIndicators = React.useMemo(() => {
    const raw =
      indicator === 'risk-score'
        ? mapIndicatorsData?.data?.indicators || []
        : aboutIndicatorsData?.data?.indicators || [];
    const map = new Map<string, unknown>();
    for (const item of raw) {
      if (!item?.slug) continue;
      if (!map.has(item.slug)) map.set(item.slug, item);
    }
    return Array.from(map.values());
  }, [
    indicator,
    mapIndicatorsData?.data?.indicators,
    aboutIndicatorsData?.data?.indicators,
  ]);

  const tableData = useQuery({
    queryKey: [
      `table_data_${currentSelectedState?.code}_${indicator}_${districtCode}_${timePeriodSelected}`,
    ],
    queryFn: () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        ANALYTICS_TABLE_DATA,
        {
          indcFilter: { slug: indicator },
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
            circle: any
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
  const hasAnyRegion = (region && region.length > 0) || !!revenueCode;

  // Whenever indicator / district / revenue circle / time period changes in map view,
  // auto-open the right-hand pane if it was closed.
  useEffect(() => {
    if (!isMapView) return;
    setIsOutputPaneOpen(true);
  }, [isMapView, indicator, region, revenueCode, timePeriodSelected]);

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
          mapData={mapData}
          revenueMapData={revenueMapData}
          districtGeographiesData={districtGeographiesData}
          revenueGeographiesData={revenueGeographiesData}
          timePeriods={stateTimePeriods}
          mapIndicatorsData={mapIndicatorsData}
          aboutIndicatorsData={aboutIndicatorsData}
          tableData={tableData}
          currentSelectedState={currentSelectedState}
          statesList={statesListData.data?.getStates || []}
        />
      </MediaRendering>
      <MediaRendering minWidth="1024" maxWidth={null}>
        <React.Fragment>
          <Tabs
            onValueChange={(value: string) =>
              setView(value, { shallow: false })
            }
            defaultValue={view || 'map'}
          >
            <TabList fitted className="p-2 pb-0">
              <Tab theme="climate" value="map">
                {t('views.long.map')}
              </Tab>
              <div
                className={`h-14 border-l-1 border-solid border-baseGraySlateSolid8 ${view === 'map' || view === 'chart' ? 'hidden' : ''}`}
              />
              {features.chart && (
                <Tab theme="climate" value="chart">
                  {t('views.long.chart')}
                </Tab>
              )}
              <div
                className={`h-14 border-l-1 border-solid border-baseGraySlateSolid8 ${view === 'chart' || view === 'table' ? 'hidden' : ''}`}
              />
              <Tab theme="climate" value="table">
                {t('views.long.table')}
              </Tab>
            </TabList>
            <TabPanel value="map">
              <div className=" mt-2 h-[calc(100dvh_-_140px)]">
                <div>
                  <FilterDropdownOptions
                    currentSelectedState={currentSelectedState}
                    RevCircleDropdownOptions={RevCircleDropdownOptions}
                    DistrictDropDownOption={DistrictDropDownOption}
                    timeLimits={timeLimitsForPicker}
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
                      !revenueMapData?.data) && (
                      <div className="flex h-full flex-col place-content-center items-center">
                        <Spinner color="highlight" />
                        <Text>{tCommon('loading')}</Text>
                      </div>
                    )}

                    {revenueMapData?.data && mapData?.data && (
                      <div className="relative">
                        {(mapIndicatorsData?.isFetching ||
                          (districtCode
                            ? revenueMapData?.isFetching
                            : mapData?.isFetching)) && (
                          <div className="pointer-events-none absolute inset-x-0 top-4 z-[1000] flex justify-center">
                            <div className="flex items-center gap-2 rounded bg-surfaceDefault px-3 py-1 shadow-basicMd">
                              <Spinner color="highlight" />
                              <Text variant="bodySm">{tCommon('loading')}</Text>
                            </div>
                          </div>
                        )}
                        <MapComponent
                        indicator={renderedIndicator}
                        mapDataloading={mapData?.isLoading}
                        revenueMapDataLoading={revenueMapData?.isLoading}
                        indicatorsData={renderedIndicatorsData}
                        setRegion={setDistrictCode}
                        setRevenueRegion={setRevenueCode}
                        revenueMapData={revenueMapData?.data?.revCircleMapData}
                        mapData={mapData?.data?.districtMapData}
                        currentSelectedState={currentSelectedState}
                        isOutputPaneOpen={isOutputPaneOpen}
                        onToggleOutputPane={() =>
                          setIsOutputPaneOpen((prev) => !prev)
                        }
                      />
                      </div>
                    )}

                    {view === 'map' &&
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
            {features.chart && (
              <TabPanel value="chart">
                {/* <div className=" mt-2 h-[calc(100dvh_-_140px)]"> */}
                <div className="mt-2 h-full overflow-hidden">
                  <ChartView
                    currentSelectedState={currentSelectedState}
                    RevCircleDropdownOptions={RevCircleDropdownOptions}
                    DistrictDropDownOption={DistrictDropDownOption}
                    timeLimits={timeLimitsForPicker}
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
}: any) {
  const searchParams = useSearchParams();
  const indicator = searchParams.get('indicator');
  const region =
    searchParams.get('revenue-code') || searchParams.get('district-code');
  const boundary = searchParams.get('revenue-code')
    ? 'revenue-circle'
    : 'district';

  const sidePaneQuery: any = !searchParams.get('revenue-code')
    ? ANALYTICS_DISTRICT_DATA
    : ANALYTICS_REVENUE_TABLE_DATA;

  const sidePaneData: any = useQuery({
    queryKey: [
      `sidePaneData_${indicator}_${region}_${boundary}_${time_period}`,
    ],
    queryFn: () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        sidePaneQuery,
        {
          indcFilter: { slug: indicator },
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
    queryKey: [`indicators_${indicator}_${currentState?.code}`],
    queryFn: () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        ANALYTICS_INDICATORS,
        {
          indcFilter: { slug: indicator },
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
    useState<any>(indicatorDescriptions?.data?.indicators);
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
      {sidePaneData?.data && (
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
          indicator={renderedIndicator}
          boundary={boundary}
          currentState={currentState}
          onClose={onClose}
        />
      )}
    </>
  );
}
