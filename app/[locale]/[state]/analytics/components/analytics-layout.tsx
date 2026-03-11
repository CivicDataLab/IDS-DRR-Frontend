'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { parseAsString, useQueryState } from 'next-usequerystate';
import { Spinner, Tab, TabList, TabPanel, Tabs, Text } from 'opub-ui';

import {
  ANALYTICS_DISTRICT_DATA,
  ANALYTICS_DISTRICT_MAP_DATA,
  ANALYTICS_GEOGRAPHY_DATA,
  ANALYTICS_INDICATORS,
  ANALYTICS_REVENUE_MAP_DATA,
  ANALYTICS_REVENUE_TABLE_DATA,
  ANALYTICS_TABLE_DATA,
  PLATFORM_STATES_LIST,
} from '@/config/graphql/analaytics-queries';
import { GraphQL } from '@/lib/api';
import { MediaRendering } from '@/components/media-rendering';
import { getLatestDate } from '../utils/utils';
import { AnalyticsMobileLayout } from './analytics-mobile-layout';
import { ChartView } from './chart-view';
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
  const searchParams = useSearchParams();
  const indicator = searchParams.get('indicator') || '';

  const [districtCode, setDistrictCode] = useQueryState(
    'district-code',
    parseAsString.withDefault('')
  );
  const [revenueCode, setRevenueCode] = useQueryState('revenue-code');
  const [view, setView] = useQueryState('view');
  const [timePeriodParam, setTimePeriodParam] = useQueryState('time-period');
  const routerParams = useParams();
  const isMapView = !view || view === 'map';

  const statesListData = useQuery({
    queryKey: [`states_list`],
    queryFn: () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        PLATFORM_STATES_LIST
      ),
  });

  const currentSelectedState = statesListData?.data?.getStates?.find(
    (item: any) => item.slug === routerParams.state
  );

  const stateLatestTimePeriod =
    currentSelectedState?.latest_time_period || null;
  const envDefaultTimePeriod = process.env.NEXT_PUBLIC_TIME_PERIOD || null;
  const stateTimePeriods: string[] = currentSelectedState?.time_periods || [];
  const timeLimitsForPicker: string[] = Array.from(
    new Set([...(stateTimePeriods || []), stateLatestTimePeriod].filter(Boolean))
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

  const timePeriodSelected =
    normalizedUrlTimePeriod ||
    (!hasExplicitTimePeriodParam
      ? stateLatestTimePeriod ?? envDefaultTimePeriod
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
            code: [currentSelectedState?.code],
          },
        }
      ),

    enabled: Boolean(isMapView && currentSelectedState?.code && timePeriodSelected),
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
            code: [currentSelectedState?.code],
          },
        }
      ),

    enabled: Boolean(isMapView && currentSelectedState?.code && timePeriodSelected),
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
            code: [currentSelectedState?.code],
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
            code: [currentSelectedState?.code],
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

  const indicatorsData = useQuery({
    queryKey: [`indicators_${indicator}`],
    queryFn: () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        ANALYTICS_INDICATORS,
        {
          indcFilter: { slug: indicator },
        }
      ),
    enabled: Boolean(isMapView),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

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
                ? currentSelectedState?.code
                : districtCode,
            ],
          },
        }
      ),
    enabled: Boolean(view === 'table' && currentSelectedState?.code && timePeriodSelected),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const [filteredTableData, setFilteredTableData] = useState(
    tableData.data?.tableData
  );

  let RevCircleDropdownOptions: Option[] = [];
  let DistrictDropDownOption: Option[] = [];

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
    let rawData = revenueGeographiesData?.data?.getDistrictRevCircle;

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
                circle[currentSelectedState?.child_type] ||
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

  if (!currentSelectedState) {
    return (
      <div className="flex h-[calc(100dvh_-_140px)] flex-col place-content-center items-center">
        <Spinner color="highlight" />
        <Text>Loading state data...</Text>
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
          indicatorsData={indicatorsData}
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
                Map View
              </Tab>
              <div
                className={`h-14 border-l-1 border-solid border-baseGraySlateSolid8 ${view === 'map' || view === 'chart' ? 'hidden' : ''}`}
              />
              <Tab theme="climate" value="chart">
                Chart View
              </Tab>
              <div
                className={`h-14 border-l-1 border-solid border-baseGraySlateSolid8 ${view === 'chart' || view === 'table' ? 'hidden' : ''}`}
              />
              <Tab theme="climate" value="table">
                Table View
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
                    <Text>Loading...</Text>
                  </div>
                ) : !timePeriodSelected && hasExplicitTimePeriodParam ? (
                  <div className="flex h-[calc(100dvh_-_400px)] flex-col place-content-center items-center">
                    <Text>Please select a time period</Text>
                  </div>
                ) : (
                  <>
                    {(statesListData?.isFetching ||
                      !timePeriodSelected ||
                      (mapData?.isFetching && revenueMapData?.isFetching)) && (
                      <div className="flex h-full flex-col place-content-center items-center">
                        <Spinner color="highlight" />
                        <Text>Loading...</Text>
                      </div>
                    )}

                    {revenueMapData?.data && mapData?.data && (
                      <MapComponent
                        indicator={indicator}
                        mapDataloading={mapData?.isFetching}
                        revenueMapDataLoading={revenueMapData?.isFetching}
                        indicatorsData={indicatorsData?.data?.indicators}
                        setRegion={setDistrictCode}
                        setRevenueRegion={setRevenueCode}
                        revenueMapData={revenueMapData?.data?.revCircleMapData}
                        mapData={mapData?.data?.districtMapData}
                        currentSelectedState={currentSelectedState}
                      />
                    )}

                    {region !== null && region.length > 0 && view === 'map' && (
                      <OutputWindowComponent
                        currentState={currentSelectedState}
                        time_period={timePeriodSelected}
                      />
                    )}
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
          </Tabs>
        </React.Fragment>
      </MediaRendering>
    </>
  );
}

export function OutputWindowComponent({ currentState, time_period }: any) {
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
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const indicatorDescriptions: any = useQuery({
    queryKey: [`indicators_${indicator}`],
    queryFn: () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        ANALYTICS_INDICATORS,
        {
          indcFilter: { slug: indicator },
        }
      ),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return (
    <>
      {sidePaneData?.isFetched && (
        <OutputWindow
          data={
            sidePaneData?.data
              ? sidePaneData?.data[
                  !searchParams?.get('revenue-code')
                    ? 'districtViewData'
                    : 'revCircleViewData'
                ]
              : []
          }
          indicatorDescriptions={indicatorDescriptions?.data?.indicators}
          indicator={indicator}
          boundary={boundary}
          currentState={currentState}
        />
      )}
    </>
  );
}
