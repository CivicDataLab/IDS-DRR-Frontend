import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { parseDate } from '@internationalized/date';
import ReactECharts from 'echarts-for-react';
import { parseAsString, useQueryState } from 'next-usequerystate';
import {
  MonthPicker,
  Spinner,
  Text,
} from 'opub-ui';

export const ChartView = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  const chartRef = useRef<ReactECharts>(null);

  useEffect(() => {
    setLoading(true);
    const body = {
      chart_type: 'GROUPED_BAR_VERTICAL',
      x_axis_column: 'timeperiod',
      x_axis_label: 'Time Period',
      y_axis_column_list: 'risk-score,exposure,vulnerability,flood-hazard,government-response',
      y_axis_label: 'Score',
      // aggregate_type: 'SUM',
      show_legend: true,
      filters: [
        {
          column: 'timeperiod',
          operator: 'in',
          value: '2022_06,2022_07',
        },
        {
          column: 'object-id',
          operator: '==',
          value: '18-305',
        },
      ],
    };

    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/generate-dynamic-chart/5d343516-2587-48e0-a92e-96d2a07eb6da`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setChartData(data);
        setLoading(false);
        console.log(data);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, []);

  const searchParams = useSearchParams();
  const timePeriod = searchParams.get('time-period') || '';
  const [timePeriodSelected, setTimePeriod] = useQueryState(
    'time-period',
    parseAsString.withDefault(timePeriod)
  );

  return (
    <div>
      <div className="">
        {loading && (
          <div className="flex h-full flex-col place-content-center items-center">
            <Spinner color="highlight" />
            <Text>Loading...</Text>
          </div>
        )}

        {chartData && (
          <div className=" mt-2 h-[calc(100dvh_-_140px)]">
            <div className="mb-2 flex items-start justify-evenly gap-3 p-4 pb-0 pt-0">
              {/* <SelectOptions /> */}
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
              <div className="h-full">
                <ReactECharts
                  option={chartData}
                  ref={chartRef}
                  style={{ height: '650px' }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
