import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { parseDate } from '@internationalized/date';
import ReactECharts from 'echarts-for-react';
import { parseAsString, useQueryState } from 'next-usequerystate';
import { MonthPicker, Spinner, Text } from 'opub-ui';

import FilterDropdownOptions, { Option } from './filter-dropdown-options';

export const ChartView = ({
  currentSelectedState,
  RevCircleDropdownOptions,
  DistrictDropDownOption,
}: {
  currentSelectedState: any;
  RevCircleDropdownOptions: Option[];
  DistrictDropDownOption: Option[];
}) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  const chartRef = useRef<ReactECharts>(null);

  const [districtCode] = useQueryState(
    'district-code',
    parseAsString.withDefault('')
  );
  const [revenueCode] = useQueryState('revenue-code');

  const stateResource = '5d343516-2587-48e0-a92e-96d2a07eb6da';

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

  const searchParams = useSearchParams();
  const indicator = searchParams.get('indicator') || '';
  const timePeriod = searchParams.get('time-period') || '';
  const [timePeriodSelected, setTimePeriod] = useQueryState(
    'time-period',
    parseAsString.withDefault(timePeriod)
  );

  useEffect(() => {
    setLoading(true);
    const body = {
      chart_type: 'GROUPED_BAR_VERTICAL',
      x_axis_column: 'timeperiod',
      x_axis_label: 'Time Period',
      y_axis_column: indicator === 'risk-score' ? riskscoreFields : indicator,
      y_axis_label: 'Score',
      // aggregate_type: 'SUM',
      show_legend: true,
      filters: [
        {
          column: 'timeperiod',
          operator: 'in',
          value: timePeriodSelected,
        },
        {
          column: 'object-id',
          operator: '==',
          value: revenueCode || districtCode,
        },
      ],
    };

    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/generate-dynamic-chart/${stateResource}`,
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
  }, [districtCode, revenueCode, timePeriodSelected]);

  return (
    <div>
      <div className=" mt-2 h-[calc(100dvh_-_140px)]">
        <div className="mb-2 flex items-start justify-evenly gap-3 p-4 pb-0 pt-0">
          <FilterDropdownOptions
            currentSelectedState={currentSelectedState}
            RevCircleDropdownOptions={RevCircleDropdownOptions}
            DistrictDropDownOption={DistrictDropDownOption}
          />
          <MonthPicker
            name="time-period-select"
            defaultValue={parseDate(
              `${timePeriodSelected.split('_')[0]}-${timePeriodSelected.split('_')[1]}-01` ||
                '23-08-01'
            )}
            label="Select Month"
            // minValue={parseDate(minDate || '2023-01-04')}
            // maxValue={parseDate(maxDate || '2023-01-04')}
            onChange={(date) => {
              setTimePeriod(
                `${date.year}_${date.month < 10 ? `0${date.month}` : `${date.month}`}`,
                { shallow: false }
              );
            }}
          />
        </div>
        <div className="w-full  bg-surfaceDefault p-6 text-center max-sm:p-2">
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
      </div>
    </div>
  );
};
