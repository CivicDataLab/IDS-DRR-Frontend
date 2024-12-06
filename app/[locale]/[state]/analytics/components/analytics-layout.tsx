'use client';

import React, { useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { parseDate } from '@internationalized/date';
import { useQuery } from '@tanstack/react-query';
import { parseAsString, useQueryState } from 'next-usequerystate';
import {
  MonthPicker,
  Select,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Text,
} from 'opub-ui';

import {
  ANALYTICS_DISTRICT_DATA,
  ANALYTICS_DISTRICT_MAP_DATA,
  ANALYTICS_GEOGRAPHY_DATA,
  ANALYTICS_INDICATORS,
  ANALYTICS_REVENUE_MAP_DATA,
  ANALYTICS_REVENUE_TABLE_DATA,
  ANALYTICS_TABLE_DATA,
  ANALYTICS_TIME_PERIODS,
  PLATFORM_STATES_LIST,
} from '@/config/graphql/analaytics-queries';
import { GraphQL } from '@/lib/api';
import { formatDate, toTitleCase } from '@/lib/utils';
import { MediaRendering } from '@/components/media-rendering';
import { AnalyticsMobileLayout } from './analytics-mobile-layout';
import { MapComponent } from './map-component';
import { OutputWindow } from './output-window';
import { TableComponent } from './table-component';

export function AnalyticsMainLayout() {
  const searchParams = useSearchParams();
  const indicator = searchParams.get('indicator') || '';
  const timePeriod = searchParams.get('time-period') || '';

  interface Option {
    disabled?: boolean;
    value: string;
    label: string;
    districtCode?: string;
  }

  const [timePeriodSelected, setTimePeriod] = useQueryState(
    'time-period',
    parseAsString.withDefault(timePeriod)
  );

  const [districtCode, setDistrictCode] = useQueryState(
    'district-code',
    parseAsString.withDefault('')
  );
  const [revenueCode, setRevenueCode] = useQueryState('revenue-code');
  const [view, setView] = useQueryState('view');
  const routerParams = useParams();

  const statesListData = useQuery([`states_list`], () =>
    GraphQL(
      `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
      PLATFORM_STATES_LIST
    )
  );

  const [currentSelectedState, setCurrentSelectedState] = useState(
    statesListData.data?.getStates.find(
      (item: any) => item.slug === routerParams.state
    )
  );

  React.useEffect(() => {
    if (!statesListData.isFetching && !statesListData.isError) {
      setCurrentSelectedState(
        statesListData?.data?.getStates?.find(
          (item: any) => item.slug === routerParams.state
        )
      );
    }
  }, [statesListData, routerParams.state]);

  // const stateCode = STATE_CODES[routerParams.state as keyof typeof STATE_CODES];

  const mapData = useQuery(
    [
      `mapQuery_district_${currentSelectedState.code}_${indicator}_${timePeriodSelected}`,
    ],
    () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        ANALYTICS_DISTRICT_MAP_DATA,
        {
          indcFilter: { slug: indicator },
          dataFilter: { dataPeriod: timePeriodSelected },
          geoFilter: {
            code: [currentSelectedState.code],
          },
        }
      ),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const revenueMapData = useQuery(
    [
      `mapQuery_revenue-circle_${currentSelectedState.code}_${indicator}_${timePeriodSelected}`,
    ],
    () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        ANALYTICS_REVENUE_MAP_DATA,
        {
          indcFilter: { slug: indicator },
          dataFilter: { dataPeriod: timePeriodSelected },
          geoFilter: {
            code: [currentSelectedState.code],
          },
        }
      ),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const districtGeographiesData = useQuery(
    [`geographies_data_district_${currentSelectedState.code}`],
    () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        ANALYTICS_GEOGRAPHY_DATA,
        {
          geoFilter: {
            type: 'district',
            code: [currentSelectedState.code],
          },
        }
      ),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const revenueGeographiesData = useQuery(
    [`geographies_data_revenue_${currentSelectedState.code}`],
    () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        ANALYTICS_GEOGRAPHY_DATA,
        {
          geoFilter: {
            type: currentSelectedState.child_type,
            code: [currentSelectedState.code],
          },
        }
      ),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const timePeriods = useQuery(
    [`timePeriods`],
    () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        ANALYTICS_TIME_PERIODS
      ),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const indicatorsData = useQuery(
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

  const tableData = useQuery(
    [`table_data_${currentSelectedState.code}_${indicator}_${districtCode}`],
    () =>
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
                ? currentSelectedState.code
                : districtCode,
            ],
          },
        }
      ),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const [filteredTableData, setFilteredTableData] = useState(
    tableData.data?.tableData
  );

  let minDate, maxDate;
  if (timePeriods.data) {
    const datesArray = timePeriods?.data?.getDataTimePeriods.map(
      (date: any) => {
        const [year, month] = date.value.split('_');
        return new Date(parseInt(year), parseInt(month));
      }
    );
    const timestamps = datesArray.map((date: any) => date.getTime());
    // Find the minimum and maximum timestamps
    const minTimestamp = Math.min(...timestamps);
    const maxTimestamp = Math.max(...timestamps);

    // Convert the timestamps back to dates
    minDate = formatDate(minTimestamp, true);
    maxDate = formatDate(maxTimestamp, true);
  }

  let RevCircleDropdownOptions: Option[] = [{ label: '', value: '' }];
  let DistrictDropDownOption: Option[] = [{ label: '', value: '' }];

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
                circle[currentSelectedState.child_type] ||
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
    if (revenueCode !== '') {
      const filteredTableData = tableData.data?.tableData.filter(
        (item: { [x: string]: string }) =>
          item['revenue-circle-code'] === revenueCode
      );
      setFilteredTableData(filteredTableData);
    }
  }, [revenueCode, tableData.data?.tableData]);

  const getRevenueCircleOptions = () => {
    const filterRevenueCircles = RevCircleDropdownOptions.filter(
      (option) => option.districtCode === districtCode
    );

    filterRevenueCircles.unshift({ label: '', value: '' });

    return filterRevenueCircles;
  };

  const handleDistrictChange = (districtCode: string) => {
    setDistrictCode(districtCode, { shallow: false });
  };

  function SelectOptions() {
    return (
      <React.Fragment>
        <Select
          label="Select District"
          value={districtCode || ''}
          name="district-select"
          className=" flex-grow"
          onChange={(e) => {
            handleDistrictChange(e);
          }}
          options={DistrictDropDownOption}
        />
        <Select
          label={`Select ${toTitleCase(currentSelectedState.child_type)}`}
          value={revenueCode || ''}
          placeholder={
            !districtCode
              ? 'Select a district to enable'
              : `Select a ${toTitleCase(currentSelectedState.child_type)}`
          }
          name="revenue-circle-select"
          className=" flex-grow"
          disabled={!districtCode}
          onChange={(e) => {
            setRevenueCode(e, { shallow: false });
          }}
          options={getRevenueCircleOptions()}
        />
      </React.Fragment>
    );
  }

  if (mapData?.isFetching && revenueMapData?.isFetching) {
    return (
      <div className="flex h-full flex-col place-content-center items-center">
        <Spinner color="highlight" />
        <Text>Loading...</Text>
      </div>
    );
  }

  const region = searchParams.get('district-code') || '';

  return (
    <>
      <MediaRendering minWidth={null} maxWidth="1023">
        <AnalyticsMobileLayout
          timePeriod={timePeriod}
          indicator={indicator}
          mapData={mapData}
          revenueMapData={revenueMapData}
          districtGeographiesData={districtGeographiesData}
          revenueGeographiesData={revenueGeographiesData}
          timePeriods={timePeriods}
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
                className={`ml-4 h-14 border-l-1 border-solid border-baseGraySlateSolid8 ${view === 'map' ? 'hidden' : ''}`}
              />
              <Tab
                theme="climate"
                title="coming soon"
                className=" cursor-not-allowed"
                disabled
                value="chart"
              >
                Chart View
              </Tab>
              <div
                className={`ml-4 h-14 border-l-1 border-solid border-baseGraySlateSolid8 ${view === 'table' ? 'hidden' : ''}`}
              />{' '}
              <Tab theme="climate" value="table">
                Table View
              </Tab>
            </TabList>
            <TabPanel value="map">
              {revenueMapData?.data && mapData?.data && (
                <div className=" mt-2 h-[calc(100dvh_-_140px)]">
                  <div className="mb-2 flex items-start justify-evenly gap-3 p-4 pb-0 pt-0">
                    <SelectOptions />
                    <MonthPicker
                      name="time-period-select"
                      defaultValue={parseDate(
                        `${timePeriodSelected.split('_')[0]}-${timePeriodSelected.split('_')[1]}-01` ||
                          '23-08-01'
                      )}
                      label="Select Month"
                      minValue={parseDate(minDate || '2023-01-04')}
                      maxValue={parseDate(maxDate || '2023-01-04')}
                      onChange={(date) => {
                        setTimePeriod(
                          `${date.year}_${date.month < 10 ? `0${date.month}` : `${date.month}`}`,
                          { shallow: false }
                        );
                      }}
                    />
                  </div>
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
                  {region !== null && region.length > 0 && view === 'map' && (
                    <OutputWindowComponent
                      currentState={currentSelectedState}
                    />
                  )}
                </div>
              )}
            </TabPanel>
            <TabPanel value="table">
              <div className="mb-2 mt-2 flex items-start justify-evenly gap-3 p-4 pb-0 pt-0">
                <SelectOptions />
              </div>
              <TableComponent
                data={
                  filteredTableData?.length > 0
                    ? filteredTableData
                    : tableData.data?.tableData
                }
                isLoading={tableData.isLoading}
              />
            </TabPanel>
          </Tabs>
        </React.Fragment>
      </MediaRendering>
    </>
  );
}

export function OutputWindowComponent({ currentState }: any) {
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
          geoFilter: {
            code:
              region === null || typeof region === 'undefined' || region === ''
                ? currentState.code
                : region,
          },
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
