'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import ReactECharts from 'echarts-for-react';
import { parseAsString, useQueryState } from 'next-usequerystate';
import { useTranslations } from 'next-intl';
import { Spinner, Text } from 'opub-ui';

import { ANALYTICS_INDICATORS_BY_CATEGORY } from '@/config/graphql/analaytics-queries';
import { Factors } from '@/lib/analytics';
import { GraphQL } from '@/lib/api';
import { toTitleCase } from '@/lib/utils';
import { MediaRendering } from '@/components/media-rendering';
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
  timeLimits: string[];
}) => {
  const t = useTranslations('analytics');
  const tCommon = useTranslations('common');
  const tFactors = useTranslations('factors');
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

  const value_mapping_list = useMemo(
    () => [
      { key: '0.0', value: '' },
      { key: '1.0', value: t('risk.1') },
      { key: '2.0', value: t('risk.2') },
      { key: '3.0', value: t('risk.3') },
      { key: '4.0', value: t('risk.4') },
      { key: '5.0', value: t('risk.5') },
    ],
    [t]
  );

  const riskscoreFields = useMemo(
    () => [
      {
        field_name: 'risk-score',
        label: tFactors('riskScore.name'),
        color: '#7B4DD9',
        value_mapping: value_mapping_list,
      },
      {
        field_name: 'exposure',
        label: tFactors('exposure.name'),
        color: '#89672A',
        value_mapping: value_mapping_list,
      },
      {
        field_name: 'vulnerability',
        label: tFactors('vulnerability.name'),
        color: '#3B8F44',
        value_mapping: value_mapping_list,
      },
      {
        field_name: 'flood-hazard',
        label: tFactors('hazard.name'),
        color: '#C41C8D',
        value_mapping: value_mapping_list,
      },
      {
        field_name: 'government-response',
        label: tFactors('governmentResponse.name'),
        color: '#FB4E93',
        value_mapping: value_mapping_list,
      },
    ],
    [value_mapping_list, tFactors]
  );

  const indicatorsQuery = useQuery({
    queryKey: [`indicatorsByCategory_${currentSelectedState.code}`],
    queryFn: () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        ANALYTICS_INDICATORS_BY_CATEGORY,
        {
          stateCode:
            currentSelectedState?.code != null
              ? String(currentSelectedState.code)
              : undefined,
        }
      ),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    // If no time period is selected, avoid making a chart API call.
    // The UI already shows a "Please select a time period" message in this state.
    if (!timePeriod || timePeriod.length === 0) {
      setLoading(false);
      setChartData(null);
      return;
    }

    setLoading(true);
    const body = {
      chart_type:
        indicator === 'risk-score' ? 'GROUPED_BAR_VERTICAL' : 'BAR_VERTICAL',
      x_axis_column: 'timeperiod',
      // time_column: 'timeperiod',
      x_axis_label: t('chart.axes.timePeriod'),
      y_axis_column:
        indicator === 'risk-score'
          ? riskscoreFields
          : [
              {
                field_name: indicator,
                color: '#222136',
                label: toTitleCase(indicator).replaceAll('-', ' '),
                ...(Factors.includes(indicator)
                  ? {
                      value_mapping: value_mapping_list,
                    }
                  : {}),
              },
            ],
      y_axis_label: Factors.includes(indicator) ? t('chart.axes.score') : t('chart.axes.units'),
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
        // -----------

        // cache: 'no-store', // Prevent caching for dynamic data
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
        console.error('Failed to load chart data:', error);
      });
  }, [
    districtCode,
    revenueCode,
    indicator,
    timePeriod,
    currentSelectedState.resource_id,
    riskscoreFields,
    value_mapping_list,
    t,
  ]);

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
      {/* desktop  */}
      <MediaRendering minWidth="1024" maxWidth={null}>
        <FilterDropdownOptions
          currentSelectedState={currentSelectedState}
          RevCircleDropdownOptions={RevCircleDropdownOptions}
          DistrictDropDownOption={DistrictDropDownOption}
          timeLimits={timeLimits}
          monthMulti={true}
        />
      </MediaRendering>

      {timePeriod.length === 0 ? (
        <div className="flex h-[calc(100dvh_-_400px)] flex-col place-content-center items-center">
          <Text>{t('chart.emptyPrompt.timePeriod')}</Text>
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
              `${t('subdivisionHeading', {
                name:
                  RevCircleDropdownOptions.find(
                    (option) => option.value === revenueCode
                  )?.label || '',
                type: toTitleCase(currentSelectedState?.child_type),
              })}, `}
            {districtCode &&
              t('divisionHeading', {
                name:
                  DistrictDropDownOption.find(
                    (option) => option.value === districtCode
                  )?.label || '',
              })}
          </Text>

          {loading ? (
            <div className="flex h-[calc(100dvh_-_400px)] flex-col place-content-center items-center">
              <Spinner color="highlight" />
              <Text>{tCommon('loading')}</Text>
            </div>
          ) : districtCode || revenueCode ? (
            chartData == null || chartData['error'] ? (
              <div className="flex h-[calc(100dvh_-_400px)] flex-col place-content-center items-center">
                <Text>
                  {t('chart.error', {
                    message:
                      chartData == null
                        ? t('chart.fetchError')
                        : chartData['error'],
                  })}
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
              <Text>{t('chart.emptyPrompt.region')}</Text>
            </div>
          )}
        </div>
      )}
    </>
  );
};
