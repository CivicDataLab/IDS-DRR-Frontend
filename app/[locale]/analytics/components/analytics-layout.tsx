'use client';

import React from 'react';
import { type TypedDocumentNode } from '@graphql-typed-document-node/core';
import { parseDate } from '@internationalized/date';
import { useQuery } from '@tanstack/react-query';
import {
  parseAsArrayOf,
  parseAsString,
  useQueryState,
} from 'next-usequerystate';
import { Combobox, MonthPicker, Select } from 'opub-ui';

import {
  ANALYTICS_DISTRICT_MAP_DATA,
  ANALYTICS_GEOGRAPHY_DATA,
  ANALYTICS_REVENUE_MAP_DATA,
  ANALYTICS_TIME_PERIODS,
} from '@/config/graphql/analaytics-queries';
import { GraphQL } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { MapComponent } from './map-component';

export function Content({
  timePeriod,
  indicator,
}: {
  timePeriod: string;
  indicator: string;
}) {
  interface Option {
    disabled?: boolean;
    value: string;
    label: string;
    type?: string;
  }

  const [boundary, setBoundary] = useQueryState(
    'boundary',
    parseAsString.withDefault('district')
  );

  const [timePeriodSelected, setTimePeriod] = useQueryState(
    'time-period',
    parseAsString.withDefault(timePeriod)
  );

  const [region, setRegion] = useQueryState(
    'region',
    parseAsArrayOf(parseAsString)
  );

  const [selectedGroup, setSelectedGroup] = React.useState<string[]>([]);

  const mapQuery: TypedDocumentNode<any, any> =
    boundary === 'district'
      ? ANALYTICS_DISTRICT_MAP_DATA
      : ANALYTICS_REVENUE_MAP_DATA;

  const mapData = useQuery(
    [`mapQuery_${boundary}_${indicator}_${timePeriodSelected}`],
    () =>
      GraphQL('analytics', mapQuery, {
        indcFilter: { slug: indicator },
        dataFilter: { dataPeriod: timePeriodSelected },
      }),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const geographiesData = useQuery(
    [`geographies_data_${boundary}`],
    () =>
      GraphQL('analytics', ANALYTICS_GEOGRAPHY_DATA, {
        geoFilter: { type: boundary },
      }),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const timePeriods = useQuery(
    [`timePeriods`],
    () => GraphQL('analytics', ANALYTICS_TIME_PERIODS),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
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

  let RevCircleDropdownOptions: Option[] = [];
  let DistrictDropDownOption: Option[] = [];

  if (geographiesData.data && !geographiesData.isFetching) {
    if (boundary === 'revenue-circle') {
      let rawData = geographiesData?.data?.getDistrictRevCircle;
      if (rawData) {
        for (const district in rawData) {
          const revenueCircles = rawData[district];
          revenueCircles.forEach(
            (circle: { 'revenue-circle': string; code: string }) => {
              RevCircleDropdownOptions.push({
                label: circle['revenue-circle'],
                value: circle.code,
                type: district,
              });
            }
          );
        }
      }
    } else {
      geographiesData.data?.getDistrictRevCircle?.forEach(
        (geography: { district: string; code: string }) => {
          DistrictDropDownOption.push({
            label: geography.district,
            value: geography.code ? geography.code : 'NA',
          });
        }
      );
    }
  }

  React.useEffect(() => {
    if (
      region &&
      region.length > 0 &&
      geographiesData.data &&
      boundary === 'revenue-circle'
    ) {
      const filteredItems = RevCircleDropdownOptions.filter((item) =>
        region.includes(item.value)
      );

      setSelectedGroup([filteredItems[0]?.type ?? '']);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geographiesData.data]);

  const filterOpt = (boundary: string) => {
    if (boundary === 'revenue-circle') {
      RevCircleDropdownOptions.forEach((item: any) => {
        if (
          !selectedGroup.includes(item?.type || '') &&
          selectedGroup.length > 0
        ) {
          item.disabled = true;
        }
      });

      const filteredOptions = RevCircleDropdownOptions.filter(
        (option: any) =>
          region?.includes(option.value) &&
          (selectedGroup.length === 0 ||
            selectedGroup.includes(option.type || ''))
      );
      return filteredOptions;
    } else {
      const filteredDistrictOptions = DistrictDropDownOption?.filter((option) =>
        region?.includes(option.value)
      );

      return filteredDistrictOptions;
    }
  };

  return (
    <React.Fragment>
      <div className="mb-2 flex items-start justify-evenly gap-3">
        <Select
          defaultValue="revenue-circle"
          label="Select Boundary"
          value={boundary || 'district'}
          className="min-w-36 grow"
          name="boundary-select"
          onChange={(e) => {
            setBoundary(e, { shallow: false });
            setRegion([]);
            setSelectedGroup([]);
          }}
          options={[
            {
              label: 'Revenue Circle',
              value: 'revenue-circle',
            },
            {
              label: 'District',
              value: 'district',
            },
          ]}
        />

        <div className="z-max grow-[3]">
          <Combobox
            key={JSON.stringify(filterOpt(boundary))}
            name="select region"
            group
            displaySelected
            placeholder={`Enter ${boundary === 'district' ? 'District' : 'Revenue Circle'} name...`}
            label="Select one or more region"
            list={
              boundary === 'revenue-circle'
                ? RevCircleDropdownOptions
                : DistrictDropDownOption
            }
            selectedValue={filterOpt(boundary)}
            onChange={(selectedOptions: any) => {
              const val = selectedOptions.map((option: any) => option.value);
              if (val.length > 4 && boundary === 'district') {
                DistrictDropDownOption.forEach((item: any) => {
                  if (!val.includes(item?.type)) {
                    item.disabled = true;
                  }
                });
                return;
              }
              const group = selectedOptions.map(
                (option: any) => option?.type ?? ''
              );

              setSelectedGroup(group);
              setRegion(val);
            }}
          />
          {boundary === 'district' && (
            <div style={{ fontSize: 'small', color: 'grey' }}>
              You can select upto 4 districts only
            </div>
          )}
        </div>

        <MonthPicker
          name="time-period-select"
          defaultValue={parseDate('2023-08-01')}
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
        regions={filterOpt(boundary)}
        mapDataloading={mapData?.isFetching}
        setRegion={setRegion}
        mapData={
          boundary === 'district'
            ? mapData?.data?.districtMapData
            : mapData?.data?.revCircleMapData
        }
      />
    </React.Fragment>
  );
}
