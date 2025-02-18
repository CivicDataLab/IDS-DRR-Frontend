import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { parseDate } from '@internationalized/date';
import { useQuery } from '@tanstack/react-query';
import ReactECharts from 'echarts-for-react';
import { parseAsString, useQueryState } from 'next-usequerystate';
import { MultiMonthPicker, Spinner, Text } from 'opub-ui';

import { ANALYTICS_INDICATORS_BY_CATEGORY } from '@/config/graphql/analaytics-queries';
import { GraphQL } from '@/lib/api';
import { toTitleCase } from '@/lib/utils';
import FilterDropdownOptions, { Option } from './filter-dropdown-options';

export const ChartView = ({
  currentSelectedState,
  RevCircleDropdownOptions,
  DistrictDropDownOption,
  timeLimits,
}: {
  currentSelectedState: any;
  RevCircleDropdownOptions: Option[];
  DistrictDropDownOption: Option[];
  timeLimits: any;
}) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  const chartRef = useRef<ReactECharts>(null);
  const searchParams = useSearchParams();
  const indicator = searchParams.get('indicator') || '';

  const timePeriod = searchParams.get('time-period') || '';

  const [districtCode] = useQueryState(
    'district-code',
    parseAsString.withDefault('')
  );
  const [revenueCode] = useQueryState('revenue-code');

  const riskscoreFields = [
    {
      field_name: 'risk-score',
      label: 'Risk Score',
      color: '#8B5E3C',
    },
    {
      field_name: 'exposure',
      label: 'Exposure',
      color: '#2E8B57',
    },
    {
      field_name: 'vulnerability',
      label: 'Vulnerability',
      color: '#9370DB',
    },
    {
      field_name: 'flood-hazard',
      label: 'Flood Hazard',
      color: '#FFB347',
    },
    {
      field_name: 'government-response',
      label: 'Government Response',
      color: '#808000',
    },
  ];

  const indicatorsQuery = useQuery(
    [`indicatorsByCategory_${currentSelectedState.code}`],
    () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        ANALYTICS_INDICATORS_BY_CATEGORY,
        {
          stateCode: currentSelectedState?.code,
        }
      ),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  useEffect(() => {
    setLoading(true);
    const body = {
      chart_type:
        indicator === 'risk-score' ? 'GROUPED_BAR_VERTICAL' : 'BAR_VERTICAL',
      x_axis_column: 'timeperiod',
      time_column: 'timeperiod',
      x_axis_label: 'Time Period',
      y_axis_column:
        indicator === 'risk-score'
          ? riskscoreFields
          : [
              {
                field_name: indicator,
                color: '#8B5E3C',
                label: indicator,
              },
            ],
      y_axis_label: 'Score',
      // aggregate_type: 'SUM',
      show_legend: true,
      filters: [
        {
          column: 'timeperiod',
          operator: 'in',
          value: timePeriod,
        },
        {
          column: 'object-id',
          operator: '==',
          value: revenueCode || districtCode,
        },
      ],
    };

    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/generate-dynamic-chart/${currentSelectedState.resource_id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        // chache the fetchcall
        // next: {
        //   tags: ['chart-data'],
        // }
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setChartData(data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setChartData(null);
        console.log(error);
      });
  }, [districtCode, revenueCode, indicator, timePeriod]);

  const findNameBySlug = (data: any, slug: string): string | undefined => {
    if (data.slug === slug) {
      return data.name;
    }

    if (data.children && Array.isArray(data.children)) {
      for (const child of data.children) {
        const foundName = findNameBySlug(child, slug);
        if (foundName) {
          return foundName;
        }
      }
    }

    return undefined;
  };

  return (
    <>
      <FilterDropdownOptions
        currentSelectedState={currentSelectedState}
        RevCircleDropdownOptions={RevCircleDropdownOptions}
        DistrictDropDownOption={DistrictDropDownOption}
        timeLimits={timeLimits}
        monthMulti={true}
      />

      {timePeriod.length === 0 ? (
        <div className="flex h-[calc(100dvh_-_400px)] flex-col place-content-center items-center">
          <Text>Please select a time period</Text>
        </div>
      ) : (
        <div className="mt-2 w-full bg-surfaceDefault p-4 pb-0 pt-8 max-sm:p-2">
          <Text variant="headingLg" fontWeight="semibold">
            {`${
              findNameBySlug(
                indicatorsQuery?.data?.indicatorsByCategory[0] || {},
                indicator
              ) || indicator
            } `}
            {(revenueCode || districtCode) && '- '}
            {revenueCode &&
              `${RevCircleDropdownOptions.find((option) => option.value === revenueCode)?.label} ${toTitleCase(currentSelectedState?.child_type)}, `}
            {districtCode &&
              `${DistrictDropDownOption.find((option) => option.value === districtCode)?.label} District`}
          </Text>

          {loading ? (
            <div className="flex h-[calc(100dvh_-_400px)] flex-col place-content-center items-center">
              <Spinner color="highlight" />
              <Text>Loading...</Text>
            </div>
          ) : districtCode || revenueCode ? (
            chartData == null || chartData['error'] ? (
              <div className="flex h-[calc(100dvh_-_400px)] flex-col place-content-center items-center">
                <Text>
                  Error:{' '}
                  {chartData == null
                    ? 'Failed to fetch the data'
                    : chartData['error']}
                </Text>
              </div>
            ) : (
              <div className="h-full">
                <ReactECharts
                  option={chartData}
                  ref={chartRef}
                  style={{ height: '650px' }}
                />
              </div>
            )
          ) : (
            <div className="flex h-[calc(100dvh_-_400px)] flex-col place-content-center items-center">
              <Text>Please select a district or revenue code</Text>
            </div>
          )}
        </div>
      )}
    </>
  );
};
