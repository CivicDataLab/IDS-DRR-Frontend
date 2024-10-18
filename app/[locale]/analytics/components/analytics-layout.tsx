'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { parseDate } from '@internationalized/date';
import { useQuery } from '@tanstack/react-query';
import { parseAsString, useQueryState } from 'next-usequerystate';
import { MonthPicker, Select, Tab, TabList, TabPanel, Tabs } from 'opub-ui';
import { shallow } from 'zustand/shallow';

import {
  ANALYTICS_DISTRICT_MAP_DATA,
  ANALYTICS_GEOGRAPHY_DATA,
  ANALYTICS_INDICATORS,
  ANALYTICS_REVENUE_MAP_DATA,
  ANALYTICS_TABLE_DATA,
  ANALYTICS_TIME_PERIODS,
} from '@/config/graphql/analaytics-queries';
import { GraphQL } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { MapComponent } from './map-component';
import { TableComponent } from './table-component';

export function Content() {
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

  const mapData = useQuery(
    [`mapQuery_district_${indicator}_${timePeriodSelected}`],
    () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        ANALYTICS_DISTRICT_MAP_DATA,
        {
          indcFilter: { slug: indicator },
          dataFilter: { dataPeriod: timePeriodSelected },
        }
      ),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const revenueMapData = useQuery(
    [`mapQuery_revenue-circle_${indicator}_${timePeriodSelected}`],
    () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        ANALYTICS_REVENUE_MAP_DATA,
        {
          indcFilter: { slug: indicator },
          dataFilter: { dataPeriod: timePeriodSelected },
        }
      ),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const districtGeographiesData = useQuery(
    [`geographies_data_district`],
    () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        ANALYTICS_GEOGRAPHY_DATA,
        {
          geoFilter: { type: 'district' },
        }
      ),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const revenueGeographiesData = useQuery(
    [`geographies_data_revenue`],
    () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        ANALYTICS_GEOGRAPHY_DATA,
        {
          geoFilter: { type: 'revenue-circle' },
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
    [`table_data_${indicator}_${districtCode}`],
    () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        ANALYTICS_TABLE_DATA,
        {
          indcFilter: { slug: indicator },
          dataFilter: { dataPeriod: timePeriodSelected },
          ...(districtCode && { geoFilter: { code: [districtCode] } }),
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
    const datesArray = timePeriods?.data?.getDataTimePeriods.map((date) => {
      const [year, month] = date.value.split('_');
      return new Date(parseInt(year), parseInt(month));
    });
    const timestamps = datesArray.map((date) => date.getTime());
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
  }

  if (revenueGeographiesData.data && !revenueGeographiesData.isFetching) {
    let rawData = revenueGeographiesData?.data?.getDistrictRevCircle;
    if (rawData) {
      for (const revenueCircle in rawData) {
        const revenueCircles = rawData[revenueCircle];
        revenueCircles.forEach(
          (circle: {
            'revenue-circle': string;
            code: string;
            district_code: string;
          }) => {
            RevCircleDropdownOptions.push({
              label: circle['revenue-circle'],
              value: circle.code,
              districtCode: circle.district_code,
            });
          }
        );
      }
    }
  }

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const timePeriod = params.get('time-period');
    if (timePeriod) {
      setTimePeriod(timePeriod);
    }
  });

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

  console.log('filteredTableData', filteredTableData);

  return (
    <React.Fragment>
      <Tabs
        onValueChange={(value: string) => setView(value, { shallow: false })}
        defaultValue={view || 'map'}
      >
        <TabList fitted className="p-2 pb-0">
          <Tab theme="climate" value="map">
            Map View
          </Tab>
          <Tab
            theme="climate"
            title="coming soon"
            className=" cursor-not-allowed"
            disabled
            value="chart"
          >
            Chart View
          </Tab>
          <Tab theme="climate" value="table">
            Table View
          </Tab>
        </TabList>
        <TabPanel value="map">
          {revenueMapData?.data && mapData?.data && (
            <div className=" mt-2 h-[calc(100dvh_-_140px)]">
              <div className="mb-2 flex items-start justify-evenly gap-3 p-4 pb-0 pt-0">
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
                  label="Select Revenue Circle"
                  value={revenueCode || ''}
                  name="revenue-circle-select"
                  className=" flex-grow"
                  disabled={!districtCode}
                  onChange={(e) => {
                    setRevenueCode(e, { shallow: false });
                  }}
                  options={getRevenueCircleOptions()}
                />

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
              />
            </div>
          )}
        </TabPanel>
        <TabPanel value="table">
          <div className="mb-2 flex items-start justify-evenly gap-3 p-4 pb-0 pt-0">
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
              label="Select Revenue Circle"
              value={revenueCode || ''}
              name="revenue-circle-select"
              className=" flex-grow"
              disabled={!districtCode}
              onChange={(e) => {
                setRevenueCode(e, { shallow: false });
              }}
              options={getRevenueCircleOptions()}
            />
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
  );
}
